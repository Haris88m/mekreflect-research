import { readFileSync } from 'node:fs';

export const casePath = '/research/agent-support-first-case/';
const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug = value => value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Deliberately small, escaped Markdown subset for this reviewed public document.
// Raw HTML and executable URL schemes are never interpreted.
export function inline(value) {
  const tokens = [];
  const token = html => `\u0000${tokens.push(html)-1}\u0000`;
  let text = String(value).replace(/`([^`]+)`/g, (_, code) => token(`<code>${esc(code)}</code>`));
  text = text.replace(/\[([^\]]+)\]\((https:\/\/[^\s)]+|\/(?!\/)[^\s)]*)\)/g, (_, label, url) => token(`<a href="${esc(url)}">${esc(label)}</a>`));
  text = esc(text).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>');
  return text.replace(/\u0000(\d+)\u0000/g, (_, n) => tokens[Number(n)]);
}
export function renderCaseMarkdown(markdown) {
  const lines = markdown.replace(/\r/g, '').split('\n');
  const html = [], headings = [];
  let paragraph = [], list = null, section = false;
  const flush = () => { if (paragraph.length) { html.push(`<p>${inline(paragraph.join(' '))}</p>`); paragraph=[]; } };
  const closeList = () => { if (list) { html.push(`</${list}>`); list=null; } };
  for (let i=0; i<lines.length; i++) {
    const line=lines[i].trim();
    if (!line) { flush(); closeList(); continue; }
    if (/^# /.test(line)) continue; // The page shell supplies the single h1.
    const heading=line.match(/^(#{2,4}) (.+)$/);
    if (heading) {
      flush(); closeList();
      const level=heading[1].length, title=heading[2], id=slug(title);
      if (level===2) { if(section)html.push('</section>'); html.push('<section class="note-section">'); section=true; headings.push({title,id}); }
      html.push(`<h${level} id="${id}">${inline(title)}</h${level}>`); continue;
    }
    if (/^\|/.test(line) && /^\|[\s:|-]+\|$/.test((lines[i+1]??'').trim())) {
      flush(); closeList();
      const cells=row=>row.trim().replace(/^\||\|$/g,'').split('|').map(v=>v.trim());
      const headers=cells(line); i+=1;
      html.push('<div class="table-wrap" role="region" aria-label="Research case table" tabindex="0"><table><thead><tr>'+headers.map(v=>`<th scope="col">${inline(v)}</th>`).join('')+'</tr></thead><tbody>');
      while (/^\|/.test((lines[i+1]??'').trim())) { i++; html.push('<tr>'+cells(lines[i]).map(v=>`<td>${inline(v)}</td>`).join('')+'</tr>'); }
      html.push('</tbody></table></div>'); continue;
    }
    const item=line.match(/^([-*]|\d+\.) (.+)$/);
    if(item) { flush(); const kind=/\d/.test(item[1])?'ol':'ul'; if(list!==kind){closeList();html.push(`<${kind}>`);list=kind;} html.push(`<li>${inline(item[2])}</li>`);continue; }
    if (line.startsWith('> ')) { flush(); closeList(); html.push(`<blockquote><p>${inline(line.slice(2))}</p></blockquote>`); continue; }
    if (/^---+$/.test(line)) {flush();closeList();continue;}
    paragraph.push(line);
  }
  flush();closeList();if(section)html.push('</section>');
  return {html:html.join('\n'),headings};
}
export function installResearchCase(files,{page,head}) {
  const markdown=readFileSync(new URL('research-case-content.md',import.meta.url),'utf8');
  const {html,headings}=renderCaseMarkdown(markdown);
  const title='Shared-evidence study protocol and evidence archive';
  files.set(casePath.slice(1)+'index.html',page(title,'The purpose, 15-task execution plan and evidence limits of MEKreflect’s first public agent-support research case.',casePath,`${head('Supporting study protocol · Evidence review', 'Can shared evidence<br>improve <em>agent support?</em>', 'A provider-neutral research programme investigating how people and authorized agents can find, test and improve approaches to problems, with sources, versions and outcomes kept in view.')}<div class="article-layout shell"><aside class="article-aside"><p class="eyebrow">Research in progress</p><nav aria-label="On this page"><ul>${headings.map(({title,id})=>`<li><a href="#${id}">${esc(title)}</a></li>`).join('')}</ul></nav><a class="text-link" href="/data/agent-support-first-case.md">Download the public plan</a><a class="text-link" href="/data/agent-support-first-case.json">Read the status record</a><a class="text-link" href="/open-research/">Research and code</a></aside><article class="prose">${html}</article></div>`));
  files.set('data/agent-support-first-case.md',markdown);
  files.set('data/agent-support-first-case.json',JSON.stringify({title,updated:'2026-10-17',url:'https://mekreflect.com'+casePath,status:'Protocol and source review; controlled evaluation not run',sourceRecords:3,independentReproductions:0,admittedExecutableCases:0,benchmarkScores:0,taskCount:15,scope:'These are evidence-state counts, not performance measures. Source reports, maintainer evidence and prescribed guidance remain distinct.',plan:'/data/agent-support-first-case.md'},null,2));
  const discovery=`<section class="section shell"><div class="section-head compact-head"><p class="eyebrow">Supporting study protocol · In progress</p><h2>Can shared evidence improve <em>agent support?</em></h2><p>Read the research purpose, 15-task execution plan and first source review. Three source records; no independent reproductions or benchmark scores.</p><a class="text-link" href="${casePath}">Read the supporting study protocol <span aria-hidden="true">↗</span></a></div></section>`;
  for (const name of ['research/index.html','open-research/index.html']) {
    if(!files.has(name))throw new Error(`Missing discovery page ${name}`);
    files.set(name,files.get(name).replace('</main>',discovery+'</main>'));
  }
  files.set('llms.txt',files.get('llms.txt')+`\n## First public agent-support research case\n- https://mekreflect.com${casePath} Purpose, execution plan, evidence and limitations\n- https://mekreflect.com/data/agent-support-first-case.json Evidence status\nThree source records, zero independent reproductions, zero benchmark scores. This protocol does not establish comparative benefit.\n`);
}
