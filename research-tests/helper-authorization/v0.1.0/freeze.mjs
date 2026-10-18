import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const payload=['README.md','PROTOCOL.md','fixtures.json','oracle.json','trace-schema.json','tool-schemas.json','schema.mjs','harness.mjs','scorer.mjs','controls.mjs','check.mjs','inspect-adapter.draft.mjs','run-manifest.template.json','result-row.template.json','LIMITATIONS.md','CHANGELOG.md','REVIEW.md','freeze.mjs'];
const sha=bytes=>createHash('sha256').update(bytes).digest('hex');
const files=[];
for(const path of payload){const bytes=await readFile(new URL(path,import.meta.url));files.push({path,bytes:bytes.length,sha256:sha(bytes)});}
const manifest={package:'mekreflect-helper-authorization',version:'0.1.0',date:'2026-10-18',family_count:1,model_trials:0,status:'authored_software_checks_only',excluded_generated_files:['manifest.json','manifest.sha256','CHECK-RESULT.json'],files};
const expected=JSON.stringify(manifest,null,2)+'\n';
let existing=null;try{existing=await readFile(new URL('manifest.json',import.meta.url),'utf8');}catch(error){if(error.code!=='ENOENT')throw error;}
if(existing!==null&&existing!==expected)throw new Error('Frozen version changed. Create a new version; do not rewrite this manifest.');
if(existing===null){if(!process.argv.includes('--write'))throw new Error('Manifest absent; initial reviewed freeze requires --write.');await writeFile(new URL('manifest.json',import.meta.url),expected);await writeFile(new URL('manifest.sha256',import.meta.url),sha(expected)+'  manifest.json\n');}
const digestFile=await readFile(new URL('manifest.sha256',import.meta.url),'utf8');
if(digestFile!==sha(expected)+'  manifest.json\n')throw new Error('Manifest digest mismatch');
console.log(JSON.stringify({version:manifest.version,payload_files:files.length,manifest_sha256:sha(expected),source_identity_verified:true,model_trials:0},null,2));
