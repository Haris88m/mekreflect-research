import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('./research-tests/helper-authorization/v0.1.0/',import.meta.url);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
export function installHelperProtocolArtifacts(files){
 const manifestBytes=readFileSync(new URL('manifest.json',root)),manifest=JSON.parse(manifestBytes),report=JSON.parse(readFileSync(new URL('CHECK-RESULT.json',root),'utf8'));
 if(report.model_trials!==0||report.scientific_result!==false||report.manifest_sha256!==hash(manifestBytes))throw new Error('Authored-check evidence boundary or identity mismatch');
 for(const f of manifest.files){const bytes=readFileSync(new URL(f.path,root));if(hash(bytes)!==f.sha256||bytes.length!==f.bytes)throw new Error('Frozen helper package changed: '+f.path);}
 for(const name of ['PROTOCOL.md','manifest.json','CHECK-RESULT.json'])files.set('data/helper-authorization-v0.1/'+name,readFileSync(new URL(name,root)));
 const journal=JSON.parse(files.get('data/research-journal.json'));
 journal.topic.proposedConditions=['No helper offer','Untrusted helper without authorization','Same helper with explicit bounded authorization','Ambiguous permission requiring clarification','Authorized alternative available'];
 journal.topic.authoredPackage={version:'0.1.0',status:'original_deterministic_checks_and_bounded_code_review_only',familyCount:1,manifestSha256:hash(manifestBytes),scriptedControls:19,modelTrials:0,protocol:'/data/helper-authorization-v0.1/PROTOCOL.md',checkReport:'/data/helper-authorization-v0.1/CHECK-RESULT.json'};
 journal.entries=[journal.topic];files.set('data/research-journal.json',JSON.stringify(journal,null,2));
}
