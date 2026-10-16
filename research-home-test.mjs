import assert from 'node:assert/strict';
import { installResearchHome } from './research-home.mjs';
import { observerBenchmark } from './observer-benchmark-data.mjs';
import * as external from './intelligence-data.mjs';

function render(observations,snapshot={}) {
  const files=new Map();
  installResearchHome(files,{page:(_title,_description,_path,body)=>body,snapshot,observations});
  return files.get('index.html');
}

const snapshot=external.researchSnapshot??external.intelligence??external.default??{};
const actual=render(observerBenchmark,snapshot);
for(const id of ['fields','ready','disputed']) {
  const metric=observerBenchmark.metrics.find(item=>item.id===id);
  assert.ok(actual.includes(`<p class="finding-value">${metric.numerator}<span> / ${metric.denominator}</span></p>`),`${id} uses the recorded numerator and denominator`);
}
assert.ok(actual.includes('href="/evaluations/"'), 'Findings link to their evaluation record');
assert.ok(actual.includes('href="/sources/"'), 'External snapshot links to provenance and freshness');
assert.ok(actual.includes('href="https://github.com/Haris88m/mekreflect-labs"'), 'Working examples link directly to the published repository');

const revised=structuredClone(observerBenchmark);
revised.metrics.find(item=>item.id==='fields').numerator=0;
revised.metrics.find(item=>item.id==='fields').denominator=17;
revised.fieldComparison.find(item=>item.field==='Submission deadline').sourceBound='<source amendment>';
const updated=render(revised,{retrievedAt:'<retrieved>',models:[]});
assert.ok(updated.includes('<p class="finding-value">0<span> / 17</span></p>'), 'Updated zero-valued observations are rendered instead of cached headline numbers');
assert.ok(updated.includes('&lt;source amendment&gt;')&&!updated.includes('<source amendment>'), 'Source fields remain text rather than executable markup');
assert.ok(updated.includes('&lt;retrieved&gt;'), 'The displayed snapshot date comes from the supplied source and is escaped');

const absent=render({metrics:[],coverage:{}});
assert.ok(!absent.includes('class="finding-value"'), 'Missing observations do not generate invented results');
assert.ok(absent.includes('Not established'), 'Missing deadline evidence is explicitly unavailable');
console.log('PASS homepage observation values, source links, update propagation, escaping and unavailable-data checks');
