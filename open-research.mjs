const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const repository = 'https://github.com/Haris88m/mekreflect-labs';

export const openStudies = [
  {
    id: 'observer8-context-handoffs', title: 'When context moves between AI workers', label: 'OBSERVER8',
    question: 'Can a workflow distinguish a missing source, conflicting instructions and a genuinely unfinished submission?',
    origin: 'I developed bidding workflows around the decisions a bid manager has to make. An answer can sound careful while carrying an old deadline or budget into the next step. I wanted to inspect that gap, not just improve the wording of the answer.',
    method: 'I separated the source pack, the receiving context, the worker response and the checks applied afterwards. Fictional bidding cases make it possible to change an amendment, authority rule or evidence requirement without exposing a company’s tender material.',
    workflow: ['Define the source pack and its versions', 'Give each worker a role and receiving context', 'Inspect the fields passed to the next role', 'Recover missing context and reassess readiness'],
    implementation: 'The public laboratory contains source-derived Python evaluators, fictional cases and offline checks. Its provenance records identify the original implementation and the changes made for publication.',
    evidence: 'The separately published historical readout summarizes 23 hosted AI tasks across three experiments. The offline test suite checks the evaluator and its fixtures; it does not repeat those hosted model calls or establish a general model ranking.',
    limits: 'Some readiness cases remain disputed. Source availability, current fields and reconciliation of finished documents are separate questions. A replay is not a new live-agent experiment.',
    next: 'Have independent reviewers define readiness, then compare context strategies on held-out cases, including cases that should pass without unnecessary blocking.',
    code: repository + '/tree/main/observer8', related: '/evaluations/'
  },
  {
    id: 'operational-completion-controls', title: 'An attempted action is not a completed result', label: 'Career operations research',
    question: 'What should a digital worker have to show before work can be marked complete?',
    origin: 'I built a career operations system because finding work itself involves research, source evidence, preparation, approvals and follow-through. Using it made the difference between a submitted form and a confirmed result very concrete.',
    method: 'I treated claims, duplicate checks and completion receipts as operational records. The public example uses synthetic cases so the state transitions can be tested without publishing anyone’s CV, correspondence or application history.',
    workflow: ['Connect a claim to its evidence', 'Check whether the case already exists', 'Keep approval separate from execution', 'Verify the receipt before recording completion'],
    implementation: 'Claim-wording and receipt checks are adapted from the existing Python implementation. A newly written in-memory SQLite harness makes the duplicate and state-transition gates inspectable. It is not the original database or complete submission engine.',
    evidence: 'Offline regression tests exercise synthetic records. They demonstrate the published control logic, not that an external application was submitted or accepted.',
    limits: 'Receipt text matching is a heuristic. A stored digest identifies the exact text but does not authenticate its sender or establish its truth. Separate provenance and outcome confirmations remain mandatory.',
    next: 'Connect these checks to independently verifiable external receipts and evaluate false rejections as carefully as false completion.',
    code: repository + '/tree/main/operations', related: '/research/evidence-decisions/'
  },
  {
    id: 'paid-ai-admission-control', title: 'Do not spend when the permission check fails', label: 'Operational reliability',
    question: 'Should a paid model request proceed when its usage-limit check is unavailable?',
    origin: 'My research includes the ordinary controls that keep an AI workflow usable. A helpful draft is not a good result if the system ignores the rule that was meant to control its cost.',
    method: 'I examined the draft-generation boundary and tested the actual failure paths. The public example isolates the admission decision from the provider and database, using controlled responses instead of live credentials.',
    workflow: ['The original service verifies identity before admission', 'Ask the usage limiter for a decision', 'Require an explicit valid allow', 'Call the model only after admission'],
    implementation: 'A JavaScript admission function extracted from the TypeScript handler uses injected callbacks to distinguish an explicit denial from a failed or malformed limiter response. The local example omits production authentication and networking. Its offline tests include malformed adapters, retry bounds and checks that generation is not called after rejection.',
    evidence: 'The original focused handler regression produced eight failures and two passes. The repaired private handler passed all ten cases. The public adaptation has its own reproducible tests and provenance rather than borrowing a whole-application security claim.',
    limits: 'This is one spending-control boundary. It does not establish production authentication, tenant isolation, provider uptime or a complete application security audit.',
    next: 'Measure rejected requests, recovery behaviour and spend within a properly authenticated integration test environment.',
    code: repository + '/tree/main/operations', related: '/research/operational-integrity/'
  },
  {
    id: 'reproducible-visual-production', title: 'Turn an idea into a repeatable visual output', label: 'Creative tooling research',
    question: 'How can a small visual-production pipeline produce an inspectable result without depending on a live model service?',
    origin: 'I explore ideas by making something I can see and test. One part of that work was a Python rendering tool that turns prepared images into a short moving sequence.',
    method: 'I separated the rendering mechanism from the private creative material. The public demonstration uses generated geometric images, so another person can reproduce the workflow without needing the original artwork or a family story.',
    workflow: ['Prepare synthetic image inputs', 'Configure the sequence and movement', 'Render through the local media pipeline', 'Inspect the output and failure cases'],
    implementation: 'The published Python renderer is derived from the existing Pillow and FFmpeg-based tool. Publication work adds explicit input validation, safer temporary-file handling and tests.',
    evidence: 'The repository documents the commands and local render checks. Rendering is a media-processing operation, not image-model training or evidence of audience impact.',
    limits: 'Original artwork, personal stories and binary releases are not included. Users must have rights to their own inputs and review the third-party dependency licenses.',
    next: 'Evaluate repeatability, rendering time and accessibility of visual explanations across different input formats.',
    code: repository + '/tree/main/creative-tools', related: '/method/'
  }
];

export function installOpenResearch(files, {page, head}) {
  const link = (url, label, cls='text-link') => `<a class="${cls}" href="${esc(url)}">${esc(label)} <span aria-hidden="true">↗</span></a>`;
  const put = (path, title, description, body) => files.set(`${path.slice(1)}index.html`, page(title, description, path, body));
  const rows = openStudies.map((s,i) => `<article class="research-row"><span class="index">0${i+1}</span><div class="row-body"><p class="eyebrow">${esc(s.label)}</p><h2><a href="/case-studies/${s.id}/">${esc(s.title)}</a></h2><p>${esc(s.question)}</p><p>${esc(s.origin)}</p><div class="actions">${link(`/case-studies/${s.id}/`,'Read the case study')}${link(s.code,'Inspect the source')}</div></div></article>`).join('');
  put('/open-research/','Open research and source','Inspect MEKreflect research implementations, case studies, source provenance and reproducible tests.',`${head('Open research','The work behind<br><em>the idea.</em>','I want people to be able to inspect how I approach a problem, what I built with AI and what happened when I tested it. These releases bring the source and the explanation together.')}<section class="section shell"><div class="split"><h2>Start with the question.<br><em>Follow it into code.</em></h2><div><p class="lead">My role is to connect real operational needs with systems that can be examined and improved.</p><p>I shape the context, responsibilities and acceptance criteria, direct AI-assisted implementation and review the result. Each case below identifies the existing mechanism, the publication changes and the evidence available to a reader.</p><div class="actions">${link(repository,'Open the research repository','button')}${link('/data/open-research.json','Machine-readable catalogue')}</div></div></div></section><section class="section shell"><div class="research-list">${rows}</div></section><section class="section shell split"><h2>More source.<br><em>Different questions.</em></h2><div><h3>ParrotCore</h3><p>A Python semantic behaviour runtime and modeled hardware constraints for expressive robotic creatures. The source includes packaged profiles and installed-wheel tests. These are software simulations, not measured physical-prototype results.</p>${link('https://github.com/Haris88m/parrotcore-research','Inspect ParrotCore')}<h3>The research platform</h3><p>The website’s static publishing pipeline, attributed data import and Cloudflare backend are also inspectable. Public configuration is separated from the company’s production settings.</p>${link('https://github.com/Haris88m/mekreflect-research','Inspect the research platform')}<h3>AI enablement workbench</h3><p>An earlier public notebook of source-derived mechanisms, synthetic examples and implementation notes. Its application-specific history remains clearly identified.</p>${link('https://github.com/Haris88m/ai-enablement-workbench','Inspect the workbench')}</div></section><section class="dark-section"><div class="shell split"><h2>Open methods.<br><em>Responsible boundaries.</em></h2><div><p>Public source does not require publishing someone’s business records, private conversations or credentials. These packages use reviewed source and synthetic fixtures. Source maps describe the extraction instead of pretending that a cleaned example is an entire deployed system.</p><p>Read each package’s provenance, reuse notice and verification instructions. A passing local test is evidence about that test and implementation, not proof of organisational adoption.</p>${link('/transparency/','Publication and evidence policy')}</div></div></section>`);
  for (const s of openStudies) {
    const sections = [['The problem I started with',s.origin],['How I approached it',s.method],['What is implemented',s.implementation],['What the evidence shows',s.evidence],['What remains open',s.limits],['The next research step',s.next]];
    put(`/case-studies/${s.id}/`,s.title,s.question,`${head(esc(s.label),esc(s.title),esc(s.question))}<div class="shell article-layout"><aside class="article-aside"><p>Source-derived case study<br>Published 16 October 2026</p>${link(s.code,'Source and tests')}${link('/open-research/','All open research')}${link(s.related,'Related research')}</aside><article class="prose">${sections.map(([title,text],i)=>`<section class="note-section"><h2>${title}</h2><p>${esc(text)}</p>${i===1?`<ol>${s.workflow.map(step=>`<li>${esc(step)}</li>`).join('')}</ol>`:''}</section>`).join('')}<section class="note-section"><h2>Inspect and reproduce</h2><p>The linked package contains its source map, setup instructions and tests. Public examples are designed for local inspection. No production account, paid model call or private dataset is required for their documented offline checks.</p>${link(s.code,'Open the implementation','button')}</section></article></div>`);
  }
  files.set('data/open-research.json',JSON.stringify({publisher:'MEKreflect',author:'Haris Mekic',published:'2026-10-16',repository,scope:'Source-derived research packages and synthetic tests. Historical hosted observations are separate from offline verification.',studies:openStudies},null,2));
  const promotion=`<section class="section shell"><div class="split"><div><p class="eyebrow">Open research</p><h2>Read the case.<br><em>Inspect the code.</em></h2></div><div><p class="lead">Context handoffs, evidence-backed completion, paid AI controls and visual-production tools.</p><p>I am publishing the mechanisms behind my research, with source maps and reproducible tests. Start with the question, then follow how it became a working implementation.</p>${link('/open-research/','Explore the source and case studies','button')}</div></div></section>`;
  for (const name of ['index.html','case-studies/index.html','research/index.html','latest/index.html']) {
    const html=files.get(name);
    if(!html?.includes('</main>')) throw new Error(`Missing research entry point ${name}`);
    files.set(name,html.replace('</main>',promotion+'</main>'));
  }
  files.set('llms.txt',files.get('llms.txt')+'\n## Open implementations\n- https://mekreflect.com/open-research/ Source catalogue and case studies\n- https://mekreflect.com/data/open-research.json Structured source catalogue\n- '+repository+' Reviewed research packages, provenance and local tests\n\nRead package-specific reuse notices. Synthetic tests and historical hosted observations are distinct evidence types.\n');
  files.set('feed.xml',files.get('feed.xml').replace('</channel>','<item><title>Open research and reproducible source</title><link>https://mekreflect.com/open-research/</link><guid>https://mekreflect.com/open-research/</guid><description>Source-derived research packages, case studies and local verification instructions.</description></item></channel>'));
}
