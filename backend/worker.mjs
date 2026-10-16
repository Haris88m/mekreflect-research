const ORIGINS = new Set(['https://mekreflect.com', 'https://www.mekreflect.com', 'https://mekreflect.pages.dev', 'http://127.0.0.1:4222', 'http://localhost:4222']);
const VERSION = '2026-10-16-research-v1';
const DAY = 86400000;
const POLICY = 'research-contact-2026-10-16';
export const SOURCE = `https://export.arxiv.org/api/query?search_query=${encodeURIComponent('(cat:cs.AI OR cat:cs.CL) AND (all:"multi-agent" OR all:"agent evaluation")')}&sortBy=submittedDate&sortOrder=descending&start=0&max_results=12`;
const headers = { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff', 'referrer-policy': 'no-referrer', 'content-security-policy': "default-src 'none'; frame-ancestors 'none'" };
const json = (value, status = 200) => new Response(JSON.stringify(value), {status, headers});
const sha = async value => [...new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)))].map(x=>x.toString(16).padStart(2,'0')).join('');
const token = () => Array.from(crypto.getRandomValues(new Uint8Array(32)), x=>x.toString(16).padStart(2,'0')).join('');
const text = (v, max) => typeof v === 'string' ? v.trim().slice(0,max+1) : '';
const emailValid = s => s.length <= 254 && /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(s);
const xmlEscape = value => String(value ?? '').replace(/[<>&"']/g, c=>({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[c]));

export function validateSubmission(data, kind) {
 if (!data || Array.isArray(data) || typeof data !== 'object') return 'Invalid request.';
 if (data.website) return 'Automated submission rejected.';
 if (data.consent !== true) return 'Please agree to the stated handling of your information.';
 if (!emailValid(text(data.email,254))) return 'Enter a valid email address.';
 if (kind === 'consultations') {
  if (text(data.name,120).length < 2 || text(data.name,120).length > 120) return 'Enter your name (2–120 characters).';
  if (text(data.organization,160).length > 160) return 'Organization must be at most 160 characters.';
  if (text(data.topic,120).length < 2 || text(data.topic,120).length > 120) return 'Choose a consultation topic.';
  if (text(data.message,5000).length < 20 || text(data.message,5000).length > 5000) return 'Describe the work in 20–5,000 characters.';
 } else if (text(data.name,120).length > 120) return 'Name must be at most 120 characters.';
 return null;
}

async function boundedBody(request, limit = 16000) {
 if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) throw new Error('CONTENT_TYPE');
 if (Number(request.headers.get('content-length') || 0) > limit) throw new Error('TOO_LARGE');
 const reader = request.body?.getReader();
 if (!reader) throw new Error('INVALID_JSON');
 const chunks=[]; let total=0;
 while (true) { const {done,value}=await reader.read(); if(done) break; total+=value.length; if(total>limit) {await reader.cancel();throw new Error('TOO_LARGE');} chunks.push(value); }
 const bytes=new Uint8Array(total); let p=0; for(const c of chunks){bytes.set(c,p);p+=c.length;}
 try{return JSON.parse(new TextDecoder().decode(bytes));}catch{throw new Error('INVALID_JSON');}
}

async function rateLimit(request, env) {
 // A daily pseudonymous digest, not a raw IP address. Expired rows are removed daily.
 const now=Date.now(), day=Math.floor(now/DAY);
 const key=await sha(`${day}:${request.headers.get('CF-Connecting-IP') || 'unknown'}`);
 const row=await env.DB.prepare('INSERT INTO request_limits(key,count,expires_at) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count').bind(key, (day+2)*DAY).first();
 return row.count <= 12;
}

async function submission(request, env, kind) {
 if (!ORIGINS.has(request.headers.get('origin'))) return json({ok:false,message:'Open this form from the MEKreflect website.'},403);
 const data=await boundedBody(request);
 const error=validateSubmission(data,kind); if(error) return json({ok:false,message:error},400);
 if(!await rateLimit(request,env)) return json({ok:false,message:'Too many requests today. Please try again tomorrow or use the contact email.'},429);
 const id=crypto.randomUUID(), secret=token(), hash=await sha(secret), now=new Date().toISOString();
 const expiry=new Date(Date.now()+(kind==='consultations'?180:30)*DAY).toISOString();
 if(kind==='consultations') {
  await env.DB.prepare('INSERT INTO consultations(id,created_at,expires_at,name,email,organization,topic,message,consent_version,withdrawal_hash) VALUES (?,?,?,?,?,?,?,?,?,?)').bind(id,now,expiry,text(data.name,120),text(data.email,254).toLowerCase(),text(data.organization,160),text(data.topic,120),text(data.message,5000),POLICY,hash).run();
 } else {
  await env.DB.prepare('INSERT INTO subscriptions(id,created_at,expires_at,name,email,consent_version,withdrawal_hash) VALUES (?,?,?,?,?,?,?)').bind(id,now,expiry,text(data.name,120),text(data.email,254).toLowerCase(),POLICY,hash).run();
 }
 return json({ok:true, reference:id, status:kind==='consultations'?'requested':'pending_confirmation', message:kind==='consultations'?'Your consultation request is saved for review. An appointment is not yet confirmed.':'Your interest is saved for 30 days. Email delivery is not active and no email has been sent. Subscribe to the RSS feed for updates now.', withdrawal:{token:secret, endpoint:'/api/withdraw'}, expiresAt:expiry},201);
}

async function withdraw(request,env) {
 if(!ORIGINS.has(request.headers.get('origin'))) return json({ok:false,message:'Open this form from the MEKreflect website.'},403);
 const data=await boundedBody(request,2000);
 if(typeof data.token!=='string'||!/^[a-f0-9]{64}$/.test(data.token)) return json({ok:false,message:'Enter the withdrawal code shown with your receipt.'},400);
 if(!await rateLimit(request,env)) return json({ok:false,message:'Please try again tomorrow.'},429);
 const hash=await sha(data.token);
 await env.DB.batch([env.DB.prepare('DELETE FROM consultations WHERE withdrawal_hash=?').bind(hash),env.DB.prepare('DELETE FROM subscriptions WHERE withdrawal_hash=?').bind(hash)]);
 return json({ok:true,message:'Any request associated with this code has been removed. No email will be sent.'});
}

export function parseAtom(xml) {
 const decode=s=>s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g,'$1').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/\s+/g,' ').trim();
 const field=(s,n)=>decode(s.match(new RegExp(`<${n}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${n}>`))?.[1]||'');
 const entries=[];
 for(const match of xml.matchAll(/<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/g)) {
  const s=match[1], raw=field(s,'id').replace(/^http:/,'https:');
  if(!/^https:\/\/arxiv\.org\/abs\/[\w.\/-]+$/.test(raw)) continue;
  entries.push({id:raw,title:field(s,'title').slice(0,400),url:raw,published:field(s,'published'),updated:field(s,'updated'),publishedAt:field(s,'published'),updatedAt:field(s,'updated'),authors:[...s.matchAll(/<author>([\s\S]*?)<\/author>/g)].map(a=>field(a[1],'name')).slice(0,30),categories:[...s.matchAll(/<category[^>]*term="([^"]+)"/g)].map(a=>decode(a[1])).slice(0,12),source:'arXiv',selection:'Automated discovery; editorial review pending',reviewStatus:'Preprint. Not necessarily peer reviewed.',status:'Preprint. Not necessarily peer reviewed.'});
  if(entries.length>=12)break;
 }
 if(!entries.length)throw new Error('No valid arXiv entries returned');
 return entries;
}

export async function refresh(env, fetcher=fetch) {
 const started=new Date().toISOString(), id=crypto.randomUUID();
 await env.DB.prepare('INSERT INTO refresh_log(id,started_at,status,detail) VALUES (?,?,?,?)').bind(id,started,'running','Scheduled public-source refresh').run();
 let status='ok', detail='arXiv metadata refreshed';
 try {
  const response=await fetcher(SOURCE,{headers:{'User-Agent':'MEKreflectResearch/1.0 (+https://mekreflect.com/contact/)','Accept':'application/atom+xml'},signal:AbortSignal.timeout(20000)});
  if(!response.ok)throw new Error(`Source HTTP ${response.status}`);
  const reader=response.body.getReader();let bytes=0;const parts=[];
  while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>300000){await reader.cancel();throw new Error('Source exceeded size limit');}parts.push(value);}
  const joined=new Uint8Array(bytes);let offset=0;for(const p of parts){joined.set(p,offset);offset+=p.length;}
  const entries=parseAtom(new TextDecoder().decode(joined));
  await env.DB.prepare('INSERT INTO source_snapshots(source_id,fetched_at,checked_at,source_url,status,payload,error) VALUES (?,?,?,?,?,?,NULL) ON CONFLICT(source_id) DO UPDATE SET fetched_at=excluded.fetched_at,checked_at=excluded.checked_at,source_url=excluded.source_url,status=excluded.status,payload=excluded.payload,error=NULL').bind('arxiv-agent-evaluation',started,started,SOURCE,'ok',JSON.stringify(entries)).run();
 } catch(e) {
  status='source_unavailable';detail=String(e.message).slice(0,150);
  await env.DB.prepare('UPDATE source_snapshots SET checked_at=?,status=?,error=? WHERE source_id=?').bind(started,'stale',detail,'arxiv-agent-evaluation').run();
 }
 await env.DB.batch([
  env.DB.prepare('UPDATE refresh_log SET completed_at=?,status=?,detail=? WHERE id=?').bind(new Date().toISOString(),status,detail,id),
  env.DB.prepare('DELETE FROM consultations WHERE expires_at < ?').bind(started),
  env.DB.prepare('DELETE FROM subscriptions WHERE expires_at < ?').bind(started),
  env.DB.prepare('DELETE FROM request_limits WHERE expires_at < ?').bind(Date.now()),
  env.DB.prepare('DELETE FROM refresh_log WHERE started_at < ?').bind(new Date(Date.now()-30*DAY).toISOString())
 ]);
 return {status,detail};
}

async function research(env) {
 const {results}=await env.DB.prepare('SELECT source_id,fetched_at,checked_at,source_url,status,payload,error FROM source_snapshots ORDER BY source_id').all();
 const last=await env.DB.prepare('SELECT started_at,completed_at,status,detail FROM refresh_log ORDER BY started_at DESC LIMIT 1').first();
 return {schemaVersion:1,generatedAt:new Date().toISOString(),refreshSchedule:'Daily at 06:17 UTC',lastRefresh:last,sources:results.map(r=>({...r,payload:undefined,items:JSON.parse(r.payload),ageHours:Math.round((Date.now()-Date.parse(r.fetched_at))/3600000),stale:r.status!=='ok'||Date.now()-Date.parse(r.fetched_at)>2*DAY,attribution:'arXiv.org metadata',license:'CC0 metadata; original papers retain their own licenses',termsUrl:'https://info.arxiv.org/help/api/tou.html'})),coverage:'Selected arXiv agent/evaluation preprints. Not all models, papers or research. Metadata only; source links remain authoritative.'};
}

function feed(data) {
 const items=data.sources.flatMap(s=>s.items).slice(0,24).map(i=>`<item><title>${xmlEscape(i.title)}</title><link>${xmlEscape(i.url)}</link><guid isPermaLink="true">${xmlEscape(i.url)}</guid><description>${xmlEscape(i.status)}</description>${Number.isFinite(Date.parse(i.published))?`<pubDate>${new Date(i.published).toUTCString()}</pubDate>`:''}</item>`).join('');
 return new Response(`<?xml version="1.0" encoding="utf-8"?><rss version="2.0"><channel><title>MEKreflect research watch</title><link>https://mekreflect.com/research/</link><description>Selected external research metadata. Publication is not endorsement or independent validation. Refreshed daily when sources are available.</description>${items}</channel></rss>`,{headers:{...headers,'content-type':'application/rss+xml; charset=utf-8','cache-control':'public, max-age=300'}});
}

export default {
 async fetch(request,env,ctx) {
  const path=new URL(request.url).pathname, origin=request.headers.get('origin'); let response;
  try {
   if(request.method==='OPTIONS') response=ORIGINS.has(origin)?new Response(null,{status:204,headers:{...headers,'access-control-allow-methods':'GET, POST, OPTIONS','access-control-allow-headers':'Content-Type','access-control-max-age':'600'}}):json({ok:false},403);
   else if(request.method==='GET'&&path==='/api/health')response=json({ok:true,service:'MEKreflect research',version:VERSION,emailDelivery:'not_active',consultations:'request_only'});
   else if(request.method==='GET'&&path==='/api/research')response=json(await research(env));
   else if(request.method==='GET'&&path==='/api/feed.xml')response=feed(await research(env));
   else if(request.method==='POST'&&path==='/api/consultations')response=await submission(request,env,'consultations');
   else if(request.method==='POST'&&path==='/api/subscriptions')response=await submission(request,env,'subscriptions');
   else if(request.method==='POST'&&path==='/api/withdraw')response=await withdraw(request,env);
   else response=json({ok:false,message:'Not found.'},404);
  } catch(e) {
   const errors={CONTENT_TYPE:[415,'Use JSON for this request.'],TOO_LARGE:[413,'This request is too large.'],INVALID_JSON:[400,'The request could not be read.']};
   const known=errors[e.message]; response=json({ok:false,message:known?.[1]||'The service could not save this request. Please try again or use the contact email.'},known?.[0]||503);
  }
  if(ORIGINS.has(origin)){response.headers.set('access-control-allow-origin',origin);response.headers.set('vary','Origin');}
  return response;
 },
 async scheduled(event,env,ctx){ctx.waitUntil(refresh(env));}
};
