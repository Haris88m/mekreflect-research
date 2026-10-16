import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import worker,{validateSubmission,parseAtom,refresh} from './worker.mjs';

function database(){
 const sql=new DatabaseSync(':memory:');sql.exec(readFileSync(new URL('./schema.sql',import.meta.url),'utf8'));
 const DB={prepare(query){let args=[];const api={bind(...values){args=values;return api;},async first(){return sql.prepare(query).get(...args)||null;},async all(){return {results:sql.prepare(query).all(...args)};},async run(){return {meta:sql.prepare(query).run(...args)};}};return api;},async batch(statements){sql.exec('BEGIN');try{const out=[];for(const s of statements)out.push(await s.run());sql.exec('COMMIT');return out;}catch(e){sql.exec('ROLLBACK');throw e;}}};
 return {DB,sql};
}
const good={name:'Test Person',email:'qa@example.invalid',organization:'Synthetic test',topic:'Context review',message:'An explicitly synthetic request for a controlled test.',consent:true,website:''};
const post=(path,data,origin='https://mekreflect.com',extra={})=>new Request(`https://mekreflect.com/api/${path}`,{method:'POST',headers:{'Content-Type':'application/json','Origin':origin,'CF-Connecting-IP':'192.0.2.8',...extra},body:JSON.stringify(data)});
const atom='<feed><entry><id>http://arxiv.org/abs/2601.00001v1</id><title>A &amp; B</title><published>2026-01-01T00:00:00Z</published><updated>2026-01-02T00:00:00Z</updated></entry></feed>';

test('consultation persists exact user fields, private hash, consent and request-only receipt',async()=>{
 const env=database(),response=await worker.fetch(post('consultations',good),env,{});assert.equal(response.status,201);
 const receipt=await response.json();assert.equal(receipt.status,'requested');assert.match(receipt.withdrawal.token,/^[a-f0-9]{64}$/);
 const row=env.sql.prepare('SELECT * FROM consultations').get();assert.equal(row.email,good.email);assert.equal(row.message,good.message);assert.equal(row.status,'requested');assert.notEqual(row.withdrawal_hash,receipt.withdrawal.token);assert.equal(row.consent_version,'research-contact-2026-10-16');
 assert.equal(response.headers.get('access-control-allow-origin'),'https://mekreflect.com');
 const removed=await worker.fetch(post('withdraw',{token:receipt.withdrawal.token}),env,{});assert.equal(removed.status,200);assert.equal(env.sql.prepare('SELECT COUNT(*) n FROM consultations').get().n,0);
});
test('email interest is pending, not confirmed, and expires in 30 days',async()=>{
 const env=database(),res=await worker.fetch(post('subscriptions',{email:good.email,consent:true}),env,{});assert.equal(res.status,201);const data=await res.json();assert.equal(data.status,'pending_confirmation');assert.match(data.message,/no email has been sent/);const row=env.sql.prepare('SELECT * FROM subscriptions').get();assert.ok(Date.parse(row.expires_at)-Date.parse(row.created_at)<=30*86400000+1000);
});
test('invalid input, consent, bot field and foreign origins do not persist',async()=>{
 const env=database();for(const [delta,status] of [[{consent:false},400],[{email:'bad'},400],[{message:'short'},400],[{name:'x'},400],[{organization:'a'.repeat(161)},400],[{website:'bot'},400]])assert.equal((await worker.fetch(post('consultations',{...good,...delta}),env,{})).status,status);
 assert.equal((await worker.fetch(post('consultations',good,'https://evil.example'),env,{})).status,403);assert.equal(env.sql.prepare('SELECT COUNT(*) n FROM consultations').get().n,0);
});
test('actual SQLite atomic limit stops the thirteenth valid request',async()=>{
 const env=database();for(let n=0;n<12;n++)assert.equal((await worker.fetch(post('subscriptions',good),env,{})).status,201);assert.equal((await worker.fetch(post('subscriptions',good),env,{})).status,429);assert.equal(env.sql.prepare('SELECT COUNT(*) n FROM subscriptions').get().n,12);
});
test('exhausting intake does not prevent a valid withdrawal on the same network',async()=>{
 const env=database();let receipt;
 for(let n=0;n<12;n++){
  const response=await worker.fetch(post('subscriptions',good),env,{});
  assert.equal(response.status,201);receipt=await response.json();
 }
 assert.equal((await worker.fetch(post('subscriptions',good),env,{})).status,429);
 const removed=await worker.fetch(post('withdraw',{token:receipt.withdrawal.token}),env,{});
 assert.equal(removed.status,200);
 assert.equal(env.sql.prepare('SELECT COUNT(*) n FROM subscriptions').get().n,11);
});
test('withdrawal has its own bounded allowance without consuming intake allowance',async()=>{
 const env=database(),missing='0'.repeat(64);
 for(let n=0;n<60;n++)assert.equal((await worker.fetch(post('withdraw',{token:missing}),env,{})).status,200);
 assert.equal((await worker.fetch(post('withdraw',{token:missing}),env,{})).status,429);
 assert.equal((await worker.fetch(post('subscriptions',good),env,{})).status,201);
});
test('body stream size, JSON content type and malformed JSON are bounded',async()=>{
 const env=database();assert.equal((await worker.fetch(post('consultations',{...good,message:'x'.repeat(17000)}),env,{})).status,413);
 assert.equal((await worker.fetch(post('consultations',good,'https://mekreflect.com',{'Content-Type':'text/plain'}),env,{})).status,415);
 const bad=new Request('https://mekreflect.com/api/consultations',{method:'POST',headers:{Origin:'https://mekreflect.com','Content-Type':'application/json'},body:'{'});assert.equal((await worker.fetch(bad,env,{})).status,400);
});
test('no admin or arbitrary HTTP fetch endpoint is exposed',async()=>{
 const env=database();for(const path of ['admin','consultations','subscriptions','refresh','proxy?url=https://example.com'])assert.equal((await worker.fetch(new Request(`https://mekreflect.com/api/${path}`),env,{})).status,404);
 const res=await worker.fetch(new Request('https://mekreflect.com/api/health'),env,{});assert.equal((await res.json()).emailDelivery,'not_active');
});
test('arXiv metadata parsing rejects unexpected external URLs and escapes text in RSS',async()=>{
 assert.equal(parseAtom(atom)[0].title,'A & B');assert.throws(()=>parseAtom(atom.replace('http://arxiv.org/abs/2601.00001v1','https://evil.example/paper')));
 const env=database();await refresh(env,async()=>new Response(atom));const res=await worker.fetch(new Request('https://mekreflect.com/api/feed.xml'),env,{});assert.match(await res.text(),/A &amp; B/);
});
test('source failure retains last good records and reports stale status without changing fetchedAt',async()=>{
 const env=database();await refresh(env,async()=>new Response(atom));const before=env.sql.prepare('SELECT * FROM source_snapshots').get();await refresh(env,async()=>new Response('unavailable',{status:503}));const after=env.sql.prepare('SELECT * FROM source_snapshots').get();assert.equal(after.payload,before.payload);assert.equal(after.fetched_at,before.fetched_at);assert.equal(after.status,'stale');const res=await worker.fetch(new Request('https://mekreflect.com/api/research'),env,{});const data=await res.json();assert.equal(data.sources[0].stale,true);assert.equal(data.lastRefresh.status,'source_unavailable');
});
test('scheduled cleanup removes expired contacts, interest, limits and logs only',async()=>{
 const env=database();await worker.fetch(post('consultations',good),env,{});await worker.fetch(post('subscriptions',good),env,{});env.sql.exec("UPDATE subscriptions SET expires_at='2000-01-01T00:00:00Z'; UPDATE request_limits SET expires_at=0");await refresh(env,async()=>new Response(atom));assert.equal(env.sql.prepare('SELECT COUNT(*) n FROM subscriptions').get().n,0);assert.equal(env.sql.prepare('SELECT COUNT(*) n FROM consultations').get().n,1);assert.equal(env.sql.prepare('SELECT COUNT(*) n FROM request_limits').get().n,0);
});
test('no database failure returns a false success receipt',async()=>{
 const response=await worker.fetch(post('consultations',good),{DB:{prepare(){throw new Error('private database detail');}}},{});assert.equal(response.status,503);assert.doesNotMatch(await response.text(),/private database detail/);
});
