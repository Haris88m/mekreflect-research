import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync('dist-company/'+path,'utf8');
const home=read('index.html'),research=read('research/index.html');
for(const label of ['Benchmark evidence assessment','Evaluation design and reproducibility','Evidence-to-policy translation'])assert.ok(home.includes(label));
assert.ok(home.indexOf('Our purpose')<home.indexOf('data-journal-case="case-01"'));
assert.equal((home.match(/data-journal-case=/g)||[]).length,1);
assert.ok(home.includes('Conceptual diagram')&&home.includes('No performance data'));
assert.ok(home.includes('Our ambition is to become a benchmark'));
assert.ok(research.includes('documentary analysis, with no benchmark rerun'));
assert.ok(home.includes('href="/research/benchmark-evidence/"'));
assert.ok(research.includes('It has not been used.'));
assert.ok(research.includes('is not an incident repair'));
assert.ok(research.includes('No model result is available.'));
assert.ok(research.includes('privileged investigation access is not available to us'));
for(const file of ['index.html','about/index.html','research/index.html']){
 const html=read(file),main=html.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
 assert.ok(!/href="\/(?:projects|open-research|evaluations|case-studies)\//.test(main),'Current research does not promote personal-project evidence');
 assert.ok(!main.includes('OBSERVER8')&&!main.includes('finding-value'));
}
for(const file of ['index.html','research/index.html','about/index.html','projects/index.html','journal/agent-support/index.html']){
 const html=read(file),nav=html.match(/<nav class="site-nav"[\s\S]*?<\/nav>/)[0];
 assert.ok(nav.includes('href="/about/"')&&nav.includes('href="/research/"'));
 assert.ok(!nav.includes('/projects/')&&!nav.includes('/open-research/'));
 assert.ok(html.includes('Project archive')&&html.includes('/assets/company-edition.css'));
}
for(const file of ['projects/index.html','open-research/index.html','evaluations/index.html','case-studies/index.html'])assert.ok(read(file).includes('content="noindex,follow"')&&read(file).includes('Outside the current research programme'));
assert.ok(!read('sitemap.xml').includes('<loc>https://mekreflect.com/open-research/</loc>'));
assert.equal((read('feed.xml').match(/<item>/g)||[]).length,1);
assert.ok(!read('feed.xml').includes('/open-research/'));
assert.ok(!read('llms.txt').includes('digital office'));
console.log('PASS three-pillar company alignment, ambition limits, archive separation, feed and execution boundaries');
