import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {renderDecorativeArrows} from './decorative-arrows.mjs';
const raw='<p>Source history → repair</p><a href="/subscribe/">Subscribe <span aria-hidden="true">↗</span></a><a href="/journal/#methods-and-making">Methods and making ↗</a>';
const result=renderDecorativeArrows(raw);
assert.ok(result.includes('<p>Source history → repair</p>'),'Non-link content is preserved');
assert.ok(result.includes('href="/subscribe/">Subscribe '));
assert.ok(result.includes('href="/journal/#methods-and-making">Methods and making '));
assert.equal((result.match(/class="decorative-arrow" aria-hidden="true"/g)||[]).length,2);
assert.equal((result.match(/focusable="false"/g)||[]).length,2);
assert.ok(!result.includes('↗'));
assert.equal(renderDecorativeArrows(result),result,'Rendering is idempotent');
const manifest=JSON.parse(readFileSync('private/COMPANY-BUILD-MANIFEST.json','utf8'));
for(const file of manifest.files.filter(f=>f.name.endsWith('.html'))){const html=readFileSync('dist-company/'+file.name,'utf8');assert.ok(!/<a\b[^>]*>[\s\S]*?↗[\s\S]*?<\/a>/.test(html),'Published links use no arrow glyph');}
const journal=readFileSync('dist-company/journal/index.html','utf8');
for(const [href,label] of [['/subscribe/','Subscribe'],['/consultations/','Book a consultation'],['/journal/#evidence-foundations','Evidence foundations']])assert.ok(journal.includes(`href="${href}">${label} <span class="decorative-arrow" aria-hidden="true"><svg`),'Visible label, destination and hidden SVG retained');
console.log('PASS font-independent decorative link arrows, unchanged labels/destinations and accessibility semantics');
