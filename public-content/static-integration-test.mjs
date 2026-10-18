import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {catalog} from './catalog.mjs';
import {allowlist} from './public-allowlist.mjs';
import {compileRelease,canonical} from './release.mjs';
import {installPublicContent} from './static-integration.mjs';
const files=new Map();await installPublicContent(files);
assert.equal(files.size,3);
for(const [path,bytes] of files)assert.equal(Buffer.compare(bytes,readFileSync('dist-company/'+path)),0);
const data=JSON.parse(files.get('data/public-content-v1.json'));
assert.equal(data.items.length,3);assert.equal(data.items.filter(r=>r.kind==='policy-mapping').length,0);
assert.equal(data.items.find(r=>r.kind==='protocol').executionStatus,'not_run');
assert.ok(data.items.every(r=>r.status==='published'&&r.contentClass==='public_approved'));
for(const mutate of [r=>r.status='draft',r=>r.extraPrivateField='synthetic-private-sentinel',r=>r.provenance[0].url='https://unapproved.invalid/source']){
 const changed=structuredClone(catalog);mutate(changed[0]);await assert.rejects(compileRelease(changed,allowlist));
}
const added=structuredClone(catalog);added.push({...structuredClone(catalog[0]),id:'unlisted-draft',status:'draft'});
assert.equal(canonical((await compileRelease(added,allowlist)).records),canonical((await compileRelease(catalog,allowlist)).records));
console.log('PASS static approved-public foundation parity, exact allowlist, private/draft exclusion and unexecuted proposal state');
