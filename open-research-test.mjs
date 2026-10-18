import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {openStudies} from './open-research.mjs';
let checks=0;
const test=(condition, message)=>{assert.ok(condition,message);checks++;};
const catalogue=JSON.parse(await readFile('dist-company/data/open-research.json','utf8'));
test(catalogue.studies.length===6,'Six reviewed source-derived cases');
test(new Set(openStudies.map(s=>s.id)).size===6,'Distinct case URLs');
for(const s of openStudies){
  const html=await readFile(`dist-company/case-studies/${s.id}/index.html`,'utf8');
  for(const value of [s.title,s.question,s.evidence,s.limits])test(html.includes(value.replaceAll('&','&amp;')),'Case preserves its evidence boundary');
  test(html.includes('href="/projects/"')&&html.includes('Open research and code'),'Shared company and code navigation');
  test(html.includes(s.code),'Source connected to the case');
  test(html.includes('<ol>')&&s.workflow.length===4,'Four-step workflow');
}
for(const name of ['index.html','case-studies/index.html','research/index.html','latest/index.html','open-research/index.html']){
  const html=await readFile(`dist-company/${name}`,'utf8');
  test(html.includes('href="/open-research/"'),'Source catalogue discoverable');
  test(!html.includes('Servari'),'Company site does not add excluded product showcase');
}
test((await readFile('dist-company/llms.txt','utf8')).includes('/data/open-research.json'),'Machine-readable discovery');
test((await readFile('dist-company/feed.xml','utf8')).includes('/open-research/'),'Research RSS discovery');
console.log(`PASS ${checks} open-research checks`);
