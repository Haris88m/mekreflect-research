import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('./research-artifacts/2026-10-18/',import.meta.url);
const read=name=>readFileSync(new URL(name,root),'utf8');
const hash=name=>createHash('sha256').update(readFileSync(new URL(name,root))).digest('hex');
const report=JSON.parse(read('mekreflect-group-c-parity-check-v2.json'));
const originals=['mekreflect-group-c-d-plus-packet.md','mekreflect-group-c-s-plus-packet.md'];
const current=['mekreflect-group-c-d-plus-packet-v2.md','mekreflect-group-c-s-plus-packet-v2.md'];
for(const name of originals)assert.equal(hash(name),report.original_sha256[name],`Historical packet identity ${name}`);
for(const name of current)assert.equal(hash(name),report.packet_sha256[name],`Current packet identity ${name}`);
const parse=text=>{const [preamble,...parts]=text.replace(/\r/g,'').split(/^## /m);return {preamble:preamble.replace(/^# [^\n]+\n/,'').trim(),sections:parts.map(section=>{const [heading,...lines]=section.split('\n');return {heading,id:heading.match(/^C-\d\d/)[0],body:lines.join('\n').replace(/^- Claim: /m,'').replace(/^- (?=(?:Evidence status|Context|Source|Use status): )/gm,'').replace(/\s+/g,' ').trim()};})};};
const d=parse(read(current[0])),s=parse(read(current[1]));
assert.equal(d.preamble,s.preamble);
assert.deepEqual(d.sections.map(c=>c.id),['C-01','C-02','C-03','C-04','C-05','C-06']);
assert.deepEqual(d.sections,s.sections,'Same headings, order, substantive text and source locators after explicit presentation-only normalization');
const oldD=parse(read(originals[0])),oldS=parse(read(originals[1]));assert.deepEqual(oldD.sections,oldS.sections);
for(const c of d.sections)if(c.id!=='C-04')assert.equal(c.body,oldD.sections.find(x=>x.id===c.id).body,'Only C-04 substantively changes');
assert.ok(!oldD.sections[3].body.includes('first stable release'));
assert.ok(d.sections[3].body.includes('first stable release'));
assert.equal(hash('mekreflect-evidence-graph-spec.md'),'56c8049a3cfe1dba8e792ce408f46aa42df8b8edceb7c5adbf307c9450ee11f7');
const files=[...originals,...current,'mekreflect-group-c-parity-manifest-v2.md','mekreflect-group-c-parity-check-v2.json','mekreflect-group-c-amendment-v2.md','mekreflect-evidence-graph-spec.md','mekreflect-sdk-admission-prerequisites.md','mekreflect-sdk-admission-status.md'];
for(const name of files){const text=read(name);assert.ok(!/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text),'No unexpected control characters');assert.ok(!/\/mnt\/data|\/workspace\/|[A-Z]:\\Users\\|(?:ghp_|gho_)[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}|BEGIN (?:RSA |OPENSSH )?PRIVATE KEY/.test(text),'No private workspace references or credential patterns');}
const catalog=JSON.parse(readFileSync('dist-company/data/research-artifacts.json','utf8'));
assert.equal(catalog.artifacts.length,10);assert.equal(catalog.artifacts.filter(a=>a.sourceArchiveMember).length,9);assert.equal(catalog.publicationCheck.solverTrials,0);
for(const artifact of catalog.artifacts){assert.ok(files.includes(artifact.name));assert.equal(artifact.sha256,hash(artifact.name));assert.equal(createHash('sha256').update(readFileSync('dist-company'+artifact.path)).digest('hex'),artifact.sha256,'Public artifact bytes preserve source identity');}
console.log('PASS document QA: six revised assertion bodies match; five unchanged; two historical packet hashes retained; G-2 identity exact. No solver or SDK execution.');
