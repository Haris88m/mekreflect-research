import {readFileSync} from 'node:fs';
import {catalog} from './catalog.mjs';
import {allowlist} from './public-allowlist.mjs';
import {compileRelease,canonical} from './release.mjs';
import {schemas} from './schemas.mjs';

// Static integration only. No Worker dispatch, binding, D1 or endpoint change.
export async function installPublicContent(files){
 const release=await compileRelease(catalog,allowlist);
 const approved={
  'public-content.json':{schemaVersion:'1.0.0',releaseId:release.manifest.releaseId,items:release.records},
  'manifest.json':release.manifest,
  'schemas.json':{schemaVersion:'1.0.0',schemas}
 };
 const routes={'public-content.json':'public-content-v1.json','manifest.json':'public-content-manifest-v1.json','schemas.json':'public-content-schemas-v1.json'};
 for(const [name,expected] of Object.entries(approved)){
  const bytes=readFileSync(new URL('../research-content/public-foundation-v1/'+name,import.meta.url));
  if(canonical(JSON.parse(bytes))!==canonical(expected))throw new Error('Approved public foundation artifact mismatch: '+name);
  files.set('data/'+routes[name],bytes);
 }
}
