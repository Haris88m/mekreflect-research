// Only published origins use the live service. Previews and forks stay local.
const API=['https://mekreflect.com','https://mekreflect.pages.dev'].includes(location.origin)
  ? 'https://mekreflect-research-api.haris-mekic66.workers.dev'
  : 'http://127.0.0.1:8787';
const groups=[...document.querySelectorAll('.nav-group')];
groups.forEach(group=>group.addEventListener('toggle',()=>{if(group.open)groups.forEach(other=>{if(other!==group)other.open=false;});}));
document.addEventListener('keydown',event=>{if(event.key==='Escape')groups.forEach(group=>{if(group.open){group.open=false;group.querySelector('summary')?.focus();}});});
document.addEventListener('click',event=>{if(!event.target.closest('.research-header'))groups.forEach(group=>{group.open=false;});});
const modelSearch=document.querySelector('#model-search');
modelSearch?.addEventListener('input',()=>{let count=0;const query=modelSearch.value.trim().toLowerCase();document.querySelectorAll('[data-model-search]').forEach(row=>{row.hidden=!row.dataset.modelSearch.includes(query);if(!row.hidden)count++;});document.querySelector('#model-count').textContent=`${count} records`;document.querySelector('#model-empty').hidden=count!==0;});
document.querySelectorAll('[data-api-form]').forEach(form=>form.addEventListener('submit',async event=>{
  event.preventDefault();if(!form.reportValidity())return;
  const result=form.querySelector('.form-result'),button=form.querySelector('button[type=submit], button:not([type])');
  if(button.disabled)return;
  const payload=Object.fromEntries(new FormData(form));if('consent' in payload)payload.consent=payload.consent==='on';if(form.dataset.apiForm==='withdraw')payload.token=payload.token.trim().toLowerCase();
  button.disabled=true;result.classList.remove('error');result.textContent='Sending your request…';
  try{
    const response=await fetch(`${API}/api/${form.dataset.apiForm}`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload),signal:AbortSignal.timeout(20000)});
    const data=await response.json();if(!response.ok||!data.ok)throw new Error(data.message??data.error??'The request could not be accepted. Please try again.');
    let message=data.message??'Your request was received.';
    if(data.reference)message+=`\nReference: ${data.reference}`;
    if(data.withdrawal?.token)message+=`\nKeep this private withdrawal code to remove your submission: ${data.withdrawal.token}\nYou can use it on the Subscribe page. No confirmation email has been sent.`;
    result.textContent=message;form.reset();
  }catch(error){result.classList.add('error');result.textContent=error.name==='TimeoutError'?'The connection timed out. Receipt is uncertain. Please contact info@mekreflect.com before sending the same request again.':`${error.message} You can also contact info@mekreflect.com.`;}
  finally{button.disabled=false;}
}));
const freshness=document.querySelector('[data-freshness]');
if(freshness){(async()=>{try{const r=await fetch(`${API}/api/research`,{signal:AbortSignal.timeout(12000)});if(!r.ok)throw new Error('unavailable');const data=await r.json();freshness.textContent='The daily monitor retrieves arXiv metadata. Epoch model and benchmark records are a separately reviewed build snapshot.';const target=document.querySelector('#source-status');for(const source of data.sources??[]){const row=document.createElement('div');row.className='source-state';const name=document.createElement('strong');name.textContent=source.source_id;const description=document.createElement('p');description.textContent=`Last success ${source.fetched_at??'not yet available'}. Last check ${source.checked_at??'unknown'}. ${source.stale?'Stale snapshot':'Snapshot available'}. ${source.items?.length??0} records.`;row.append(name,description);target.append(row);}}catch{freshness.textContent='The live source monitor is currently unavailable. The dated build snapshot below remains available; no fresh retrieval is implied.';}})();}
const livePapersStatus=document.querySelector('[data-live-papers-status]');
if(livePapersStatus){(async()=>{try{const response=await fetch(`${API}/api/research`,{signal:AbortSignal.timeout(12000)});if(!response.ok)throw new Error('unavailable');const data=await response.json();const target=document.querySelector('#live-papers');let count=0;for(const source of data.sources??[]){for(const paper of source.items??[]){if(!/^https:\/\/arxiv\.org\/abs\/[\w.\/-]+$/.test(paper.url))continue;const article=document.createElement('article');const title=document.createElement('h3');const link=document.createElement('a');link.href=paper.url;link.textContent=paper.title;title.append(link);const meta=document.createElement('p');meta.className='meta';meta.textContent=`Published ${paper.publishedAt??'unknown'}. Retrieved ${source.fetched_at??'unknown'}. ${source.stale?'Stale source snapshot. ':''}Preprint metadata.`;article.append(title,meta);target.append(article);count++;}}livePapersStatus.textContent=`${count} automatically retrieved records. Source timestamps are shown below.`;}catch{livePapersStatus.textContent='The live metadata service is unavailable. The reviewed source snapshot above remains readable.';}})();}
