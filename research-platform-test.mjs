import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {researchSnapshot,epochData} from './intelligence-data.mjs';
import {observerBenchmark} from './observer-benchmark-data.mjs';
const manifest=JSON.parse(await readFile('private/COMPANY-BUILD-MANIFEST.json','utf8'));
const names=new Set(manifest.files.map(f=>f.name));
let checks=0;
function test(condition,message){assert.ok(condition,message);checks++;}
async function walk(dir){const result=[];for(const item of await readdir(dir,{withFileTypes:true})){test(!item.isSymbolicLink(),'No release symlink');const p=`${dir}/${item.name}`;result.push(...item.isDirectory()?await walk(p):[p.replace('dist-company/','')]);}return result;}
test(JSON.stringify((await walk('dist-company')).sort())===JSON.stringify([...names].sort()),'Exact release allowlist');
for(const f of manifest.files){
 const bytes=await readFile(`dist-company/${f.name}`);
 test(createHash('sha256').update(bytes).digest('hex')===f.sha256,`Fresh hash ${f.name}`);
 if(!f.name.endsWith('.html'))continue;
 const html=bytes.toString();
 test(!/\b(?:undefined|NaN)\b|\[object Object\]/.test(html),`No broken rendered values ${f.name}`);
 test(!/file:\/\/|[CH]:[\\/]|\.codex[\\/]|hello@mekreflect\.com/.test(html),`No private paths or obsolete email ${f.name}`);
 test((html.match(/<h1\b/g)||[]).length===1,`One h1 ${f.name}`);
 for(const match of html.matchAll(/(?:href|src)="(\/[^"]*)"/g)){
  const url=new URL(match[1],'https://mekreflect.com'), path=url.pathname.slice(1);
  const target=!path?'index.html':path.endsWith('/')?`${path}index.html`:path;
  test(names.has(target),`Existing local target ${f.name} ${target}`);
  if(url.hash){const destination=await readFile(`dist-company/${target}`,'utf8');test(destination.includes(`id="${url.hash.slice(1)}"`),`Existing fragment ${match[1]}`);}
 }
}
const modelHTML=await readFile('dist-company/benchmarks/index.html','utf8');
test((modelHTML.match(/data-model-search=/g)||[]).length===researchSnapshot.models.length,'All source model groups rendered');
test(researchSnapshot.models.every(m=>Number.isFinite(m.eci)&&m.sourceUrl.startsWith('https://')),'Finite attributed ECI data');
test(epochData.runs.length===1600,'Full source run data published');
test(modelHTML.includes('not a percentage'),'ECI scale disclosed');
const sources=await readFile('dist-company/sources/index.html','utf8');test(sources.includes('creativecommons.org/licenses/by/4.0/'),'Clickable source license');test(sources.includes('Epoch data is refreshed through a validated release import'),'Refresh scope disclosed');
const own=JSON.parse(await readFile('dist-company/data/operational-evaluations.json','utf8'));test(own.cases.length===10&&own.metrics.find(m=>m.id==='ready').denominator===4,'Own source denominators preserved');
test(own.metrics.find(m=>m.id==='disputed').interpretation.includes('cannot be counted'),'Disputed readiness not labelled false blocks');
const privacy=await readFile('dist-company/transparency/index.html','utf8');test(privacy.includes('30 days')&&privacy.includes('Cloudflare D1')&&!privacy.includes('no account system, advertising tracker, site analytics script, AI chat endpoint or inquiry database'),'Privacy matches new data collection');
const subscribe=await readFile('dist-company/subscribe/index.html','utf8');test(subscribe.includes('pending')&&subscribe.includes('not yet enabled'),'No false email activation');test(subscribe.includes('pattern="[a-fA-F0-9]{64}"'),'Withdrawal token client validation');
const headers=await readFile('dist-company/_headers','utf8');test(headers.includes('no-transform')&&headers.includes('https://mekreflect-research-api.haris-mekic66.workers.dev'),'CSP and exact-byte serving retained');
const client=await readFile('dist-company/assets/research-platform.js','utf8');
test(client.includes("['https://mekreflect.com','https://mekreflect.pages.dev'].includes(location.origin)"),'Only published origins use the live service');
test(client.includes(": 'http://127.0.0.1:8787'"),'Local previews and forks keep synthetic form records local');
const config=await readFile('backend/wrangler.example.jsonc','utf8');
test(!config.includes('account_id')&&!config.includes('zone_id'),'No production account or zone identifiers');
console.log(`PASS ${checks} release assertions. Static checks do not replace browser and API tests.`);
