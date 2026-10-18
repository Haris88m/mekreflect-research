import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import vm from 'node:vm';
const read=p=>readFileSync('dist-company/'+p,'utf8');
const data=JSON.parse(read('data/research-journal.json'));
assert.equal(data.entries.length,1);
assert.deepEqual(data.entries.map(e=>e.number),['01']);
assert.equal(data.supportingRecords.length,6);
assert.equal(data.topic.incidentRuntimeTests,0);
assert.equal(data.topic.proposedConditions.length,4);
assert.ok(!('sdkAdmission' in data.topic),'Unrelated SDK status stays out of the incident evidence chain');
assert.equal(data.topic.taskCount,15);
assert.equal(data.topic.independentReproductions,0);
assert.equal(data.topic.benchmarkScores,0);
const home=read('index.html');
assert.ok(home.includes('journal-home')&&home.includes('data-journal-case="case-01"'),'Company homepage introduces the continuing case');
assert.ok(home.indexOf('Our purpose')<home.indexOf('data-journal-case="case-01"'),'Company purpose precedes the current research case');
for(const e of data.entries){const html=read(e.url.slice(1)+'index.html');assert.ok(html.includes('When agents work'));assert.ok(html.includes('untrusted page offering outside assistance'));assert.ok(read('feed.xml').includes('https://mekreflect.com'+e.url));assert.ok(read('sitemap.xml').includes(e.url));}
for(const e of data.supportingRecords){const html=read(e.url.slice(1)+'index.html');assert.ok(html.includes(e.title));assert.ok(html.includes('content="noindex,follow"'));assert.ok(!read('feed.xml').includes('https://mekreflect.com'+e.url));assert.ok(!read('sitemap.xml').includes(e.url));}
assert.equal((read('journal/index.html').match(/data-journal-case=/g)||[]).length,1);
assert.equal((read('journal/feed.xml').match(/<item>/g)||[]).length,1);
for(const name of ['journal/index.html','journal/agent-support/index.html']){assert.ok(read(name).includes('/assets/research-journal.css'));assert.ok(read(name).includes('href="/journal/feed.xml"'));}
assert.equal(read('data/journal-case-01.md'),readFileSync('journal-case-content.md','utf8'));
const caseText=read('data/journal-case-01.md');assert.ok(!caseText.includes('OpenAI Agents Python'));assert.ok(!caseText.includes('SharePoint'));assert.ok(caseText.includes('Attempted calls and executed calls must be logged separately'));
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
const admission=JSON.parse(read('data/sdk-admission-status.json'));
assert.equal(admission.status,'blocked_inconclusive_at_environment_admission');
for(const key of ['sdkImports','runtimeRuns','independentReproductions','admittedExecutableCases','benchmarkScores'])assert.equal(admission[key],0);
assert.equal(admission.baselineResult,null);assert.equal(admission.repairResult,null);
assert.deepEqual(status.sdkAdmission,admission);assert.deepEqual(data.methodology.separateTechnicalExamples.sdkAdmission,admission);
assert.ok(read('journal/methods/evidence-graph/index.html').includes('Runtime admission remains closed.'));
const publicBrief=read('data/research-artifacts/mekreflect-sdk-admission-status.md');
assert.ok(publicBrief.includes('not every possible installation or Windows computer'));
assert.ok(!/C:\\|\/Users\/|\/workspace\/|AppData|libfile_|BEGIN.*PRIVATE KEY/.test(publicBrief),'Public brief excludes machine paths, Library identity and secrets');
// Exercise the origin decision without making any real API request.
const client=read('assets/research-platform.js');const apiDeclaration=client.slice(0,client.indexOf('const groups='));
for(const [origin,expected] of [['https://mekreflect.com','https://mekreflect-research-api.haris-mekic66.workers.dev'],['https://mekreflect.pages.dev','https://mekreflect-research-api.haris-mekic66.workers.dev'],['http://127.0.0.1:4222','http://127.0.0.1:8787'],['https://example.org','http://127.0.0.1:8787']])assert.equal(vm.runInNewContext(apiDeclaration+'API',{location:{origin}}),expected);
console.log('PASS journal task references, historical correction, feeds, graph identity, evidence limits and production/local API boundary');
