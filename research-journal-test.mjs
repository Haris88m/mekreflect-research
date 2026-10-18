import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const read=p=>readFileSync('dist-company/'+p,'utf8');
const data=JSON.parse(read('data/research-journal.json'));
assert.equal(data.entries.length,4);
assert.deepEqual(data.entries.map(e=>e.number),['01','02','03','04']);
assert.equal(data.topic.taskCount,15);
assert.equal(data.topic.independentReproductions,0);
assert.equal(data.topic.benchmarkScores,0);
const home=read('index.html');
assert.ok(home.indexOf('journal-home')<home.indexOf('home-evidence shell'),'Homepage prominently introduces the journal');
for(const e of data.entries){const html=read(e.url.slice(1)+'index.html');assert.ok(html.includes(e.title));assert.ok(html.includes('Tasks '+e.tasks.join(', ')));assert.ok(read('feed.xml').includes('https://mekreflect.com'+e.url));assert.ok(read('sitemap.xml').includes(e.url));}
const graph=read('data/evidence-graph-g2.md');
assert.equal(graph,readFileSync('evidence-graph-g2.md','utf8'));
const graphData=JSON.parse(read('data/evidence-graph-g2.json'));
assert.equal(graphData.publicTranscriptionSha256,createHash('sha256').update(graph).digest('hex'));
assert.equal(graphData.independentStudyExecutions,0);
assert.equal(graphData.metrics,'undefined / not evaluated');
for(const id of ['C-01','C-02','C-03','C-04','C-05','C-06'])assert.ok(graph.includes(id));
assert.ok(graph.includes('two input checks and one output check'));
assert.ok(read('journal/methods/evidence-graph/index.html').includes('dashed nodes have no admitted study instance'));
const status=JSON.parse(read('data/agent-support-first-case.json'));
assert.equal(status.releaseProvenance.firstStableRelease,'v0.22.1');assert.equal(status.releaseProvenance.runtimeValidated,false);
// Exercise the origin decision without making any real API request.
const client=read('assets/research-platform.js');const apiDeclaration=client.slice(0,client.indexOf('const groups='));
for(const [origin,expected] of [['https://mekreflect.com','https://mekreflect-research-api.haris-mekic66.workers.dev'],['https://mekreflect.pages.dev','https://mekreflect-research-api.haris-mekic66.workers.dev'],['http://127.0.0.1:4222','http://127.0.0.1:8787'],['https://example.org','http://127.0.0.1:8787']])assert.equal(vm.runInNewContext(apiDeclaration+'API',{location:{origin}}),expected);
console.log('PASS journal task references, historical correction, feeds, graph identity, evidence limits and production/local API boundary');
