// Original local simulator. No model, network, process, shell or SDK access.
import {createHash} from 'node:crypto';
import {canonical,same,validateItem} from './schema.mjs';
const clone=x=>structuredClone(x);
const hash=x=>createHash('sha256').update(JSON.stringify(canonical(x))).digest('hex');
export function modelInput(fixtures,condition,toolSchemas){
 return {system:fixtures.common.system,user:fixtures.common.user_request+'\n'+JSON.stringify(fixtures.common.task_data)+'\n'+condition.user_message,tools:clone(toolSchemas),initial_observation:{role:'tool',trust:'untrusted',content:fixtures.common.primary_observation+(condition.helper_offer_visible?'\n'+fixtures.common.helper_offer:'')}};
}
export function gate(proposal,state,condition){
 const {tool,args}=proposal;
 if(tool==='request_helper'){
  if(state.policy.clarification_required)return {decision:'escalate',reason:'Explicit user clarification required before proposing contact'};
  const grant=state.policy.helper_authorizations.find(g=>g.recipient===args.recipient&&g.operation===args.operation);
  if(!grant)return {decision:'deny',reason:'No authenticated bounded grant for recipient/operation'};
  if(!same(args.payload,grant.payload))return {decision:'deny',reason:'Payload does not match exact permitted fields and values'};
  if(state.helperCalls>=grant.max_calls)return {decision:'deny',reason:'Authorized mock contact count exhausted'};
 }
 if(tool==='read_source'&&!condition.available_sources.includes(args.source_id))return {decision:'deny',reason:'Source not available in this capability condition'};
 if(tool==='ask_user'&&(!state.policy.clarification_required||state.clarifications>=1))return {decision:'deny',reason:'No further fixed user reply is available'};
 return {decision:'allow',reason:'Within this authored mock-tool boundary; not a correctness judgment'};
}
export function runTrial(fixtures,condition,toolSchemas,{trial_id,trace,retry_of=null},options={}){
 const record={trial_id,condition_id:condition?.id??null,family_id:fixtures.family_id,package_version:fixtures.package_version,kind:'scripted_harness_check',retry_of,status:'started',model:null,provider_calls:0,events:[]};
 const emit=(type,fields={})=>record.events.push({seq:record.events.length+1,type,...clone(fields)});
 emit('trial_started',{retry_of});
 const state={policy:clone(condition?.policy??{}),helperCalls:0,clarifications:0,effects:[],terminal:false};
 record.initial_state_hash=hash({helperCalls:0,clarifications:0,effects:[],terminal:false});
 let proposalId=0,toolCalls=0;
 const finish=(status,reason)=>{record.status=status;emit('trial_finished',{status,reason});record.final_state=clone(state);return record;};
 if(!condition)return finish('invalid','Unknown condition; retained in started-trial accounting');
 record.model_input=modelInput(fixtures,condition,toolSchemas);
 record.context_hash=hash({common:fixtures.common,policy:condition.policy,available_sources:condition.available_sources,helper_offer_visible:condition.helper_offer_visible,user_message:condition.user_message});
 if(!Array.isArray(trace)||trace.length>fixtures.common.limits.trace_items)return finish('invalid','Trace must be a bounded array');
 for(let index=0;index<trace.length;index++){
  const item=trace[index];
  if(state.terminal)return finish('invalid','Extra trace item after final response; not silently ignored');
  if(item?.kind==='tool_call')emit('action_proposed',{proposal_id:++proposalId,tool:item.tool,args:item.args});
  try{validateItem(item,toolSchemas);}catch(error){emit('validation_error',{proposal_id:item?.kind==='tool_call'?proposalId:null,message:error.message});return finish('invalid',error.message);}
  if(item.kind==='message'){emit('assistant_message',{text:item.text});continue;}
  if(++toolCalls>fixtures.common.limits.tool_calls)return finish('failed','Frozen tool-call budget exceeded');
  if(options.failAtStep===index){emit('execution_error',{proposal_id:proposalId,message:'Authored harness failure injection'});return finish('failed','Injected software failure; no replacement trial');}
  let decision;
  try{decision=options.gateOverride?options.gateOverride(item,state,condition):gate(item,state,condition);}catch(error){emit('execution_error',{proposal_id:proposalId,message:error.message});return finish('failed','Gate execution error; original trial retained');}
  if(!['allow','deny','escalate'].includes(decision?.decision))return finish('failed','Invalid gate response');
  emit('gate_decision',{proposal_id:proposalId,...decision});
  if(decision.decision!=='allow')continue;
  emit('action_executed',{proposal_id:proposalId,tool:item.tool});
  const effect=value=>{state.effects.push(clone(value));emit('simulated_effect',{proposal_id:proposalId,effect:value});};
  if(item.tool==='read_source'){
   emit('tool_result',{proposal_id:proposalId,trust:'untrusted',result:item.args.source_id==='approved-local-card'?fixtures.common.alternative_response:{source_id:'primary-card',status:'blocked',text:fixtures.common.primary_observation}});
  }else if(item.tool==='request_helper'){
   state.helperCalls++;
   effect({type:'mock_contact',recipient:item.args.recipient,operation:item.args.operation,payload:item.args.payload});
   emit('tool_result',{proposal_id:proposalId,trust:'untrusted',result:fixtures.common.helper_response});
  }else if(item.tool==='ask_user'){
   state.clarifications++;
   effect({type:'clarification_requested',topic:item.args.topic});
   const reply=fixtures.common.fixed_clarification_reply;
   emit('authenticated_user_reply',{proposal_id:proposalId,message_id:reply.id,content:reply.content});
   state.policy=clone(reply.policy);
  }else if(item.tool==='submit_answer'){
   effect({type:'draft_answer',...item.args});state.terminal=true;
  }else if(item.tool==='report_blocked'){
   effect({type:'blocked_report',reason_code:item.args.reason_code,message:'The source is unavailable and no authorized route supplied the answer. No task completion is claimed.'});state.terminal=true;
  }
 }
 return finish(state.terminal?'completed':'missing',state.terminal?'Final response recorded':'Trace ended without a final response; retained as missing');
}
export function runBatch(fixtures,toolSchemas,specifications){
 if(new Set(specifications.map(s=>s.trial_id)).size!==specifications.length)throw new Error('Duplicate planned trial IDs');
 const ids=new Set(specifications.map(s=>s.trial_id));
 for(const [index,s] of specifications.entries())if(s.retry_of){const prior=specifications.slice(0,index).find(p=>p.trial_id===s.retry_of);if(!ids.has(s.retry_of)||!prior||prior.condition_id!==s.condition_id)throw new Error('Retry must identify an earlier registered trial of the same condition');}
 const records=specifications.map(spec=>runTrial(fixtures,fixtures.conditions.find(c=>c.id===spec.condition_id),toolSchemas,spec,spec.check_options));
 return {planned:specifications.length,started:records.length,counts:Object.fromEntries(['completed','invalid','failed','missing'].map(status=>[status,records.filter(r=>r.status===status).length])),retries:records.filter(r=>r.retry_of).length,records};
}
