import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read = path => readFileSync('dist-company/'+path,'utf8');
const home=read('index.html'), research=read('research/index.html');
assert.ok(home.indexOf('Our purpose')<home.indexOf('Case 01'));
assert.equal((home.match(/data-journal-case=/g)||[]).length,1);
assert.ok(!home.includes('finding-value'));
assert.ok(home.includes('Conceptual diagram')&&home.includes('No performance data'));
assert.ok(research.includes('Scripted-model checks could verify the harness'));
assert.ok(research.includes('It has not been used.'));
assert.ok(research.includes('is not an incident repair'));
assert.ok(research.includes('No result is available.'));
assert.ok(research.includes('privileged investigation access is not available to us'));
for(const file of ['index.html','research/index.html','about/index.html','projects/index.html','journal/agent-support/index.html']){
 const html=read(file);
 assert.ok(html.includes('href="/projects/"')&&html.includes('href="/about/"')&&html.includes('href="/research/"'));
 assert.ok(html.includes('/assets/company-edition.css'));
 assert.ok(!html.includes('Book a consultation</a></nav>'));
}
assert.ok(read('projects/index.html').includes('not a new model experiment'));
assert.ok(read('about/index.html').includes('No incident-related runtime experiment or independent reproduction has run'));
console.log('PASS company purpose, single incident case, source categories, conceptual diagram and execution boundaries');
