const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=(url,label,cls='text-link')=>`<a class="${cls}" href="${esc(url)}">${esc(label)} <span aria-hidden="true">↗</span></a>`;

// Present recorded observations; this renderer never calls or simulates an AI model.
export function installResearchHome(files,{page,snapshot,observations}) {
  const coverage=observations.coverage??{};
  const metrics=observations.metrics??[];
  const finding=(id,title,description)=>{
    const metric=metrics.find(item=>item.id===id);
    if(!metric)return '';
    return `<article class="finding"><p class="finding-label">${esc(title)}</p><p class="finding-value">${esc(metric.numerator)}<span> / ${esc(metric.denominator)}</span></p><p>${esc(description)}</p><details><summary>Read the measurement</summary><p>${esc(metric.interpretation)}</p></details>${link('/evaluations/','Inspect the record')}</article>`;
  };
  const field=observations.fieldComparison?.find(item=>item.field==='Submission deadline');
  const sourceDate=snapshot.retrievedAt??snapshot.updatedAt??'Not supplied';
  files.set('index.html',page('Research grounded in the work','MEKreflect investigates how people and AI workers turn shared context into decisions. Explore recorded experiments, source data and working research code.','/',`
<section class="home-introduction shell">
  <p class="home-discipline">Independent applied AI research · Haris Mekic</p>
  <h1>Understanding how AI<br>becomes <em>useful work.</em></h1>
  <div class="home-intro-bottom"><p>I build digital working environments where people and AI workers share context, responsibilities and a way to check the result. MEKreflect is where I investigate how that work holds together, where it fails and how to make it better.</p><div class="home-primary-actions">${link('/open-research/','Explore the research','button')}${link('/about/','Meet Haris and MEKreflect')}</div></div>
</section>
<section class="home-evidence shell" aria-labelledby="home-findings">
  <div class="home-section-line"><h2 id="home-findings">What the experiments show</h2><p>OBSERVER8 · Recorded development experiments</p></div>
  <div class="home-findings">
    ${finding('fields','Current facts after source recovery','Five checked fields across six bidding cases matched their fixture sources after retrieval.')}
    ${finding('ready','Ready control completed','One unequivocally ready case completed in every recorded decision pass.')}
    ${finding('disputed','Readiness still disputed','Recovering the facts did not settle whether the finished documents were ready to send.')}
  </div>
  <div class="home-evidence-foot"><p>${esc(coverage.hostedTasks??'Unspecified')} hosted AI tasks across ${esc(coverage.authoredAICases??'unspecified')} authored cases. Synthetic operational data, repeated observations and local mock actions.</p>${link('/evaluations/','All observations and scope')}</div>
</section>
<section class="home-feature-band"><div class="shell home-feature">
  <div class="home-feature-copy"><p class="eyebrow">Inside the work · Context engineering</p><h2>A warning is not enough<br>if the next worker<br>gets the <em>wrong field.</em></h2><p>In a Salience-inspired bidding case, the receiving worker warned about missing context but still returned an obsolete deadline. I followed the field through the handoff, a deterministic check and a source-bound rerun.</p>${link('/case-studies/current-fields-at-a-handoff/','Follow the recorded handoff','button')}</div>
  <figure class="home-field-record"><figcaption>Submission deadline <span>Recorded field comparison</span></figcaption><ol><li><span>Incomplete receiving context</span><strong>${esc(field?.incomplete??'Not established')}</strong><small>Superseded terms remained in the current field.</small></li><li><span>After the field check</span><strong>${esc(field?.guarded??'Not established')}</strong><small>The unsupported current value was cleared.</small></li><li><span>With the governing source</span><strong>${esc(field?.sourceBound??'Not established')}</strong><small>The amended deadline was recovered.</small></li></ol><p>This is one authored case with different context conditions. The final commitment also depends on eligibility, approvals and completed documents.</p></figure>
</div></section>
<section class="section shell home-research-directory"><div class="home-section-line"><h2>Three connected questions</h2>${link('/research/','The research agenda')}</div><div class="home-research-rows">
  <article><p>Operational AI</p><div><h3>${link('/open-research/','Can the whole workflow be inspected?','home-title-link')}</h3><p>Context contracts, specialist handoffs, action boundaries and reproducible working examples. Read the case studies alongside the code.</p></div>${link('https://github.com/Haris88m/mekreflect-labs','Open the code')}</article>
  <article><p>Capabilities and evidence</p><div><h3>${link('/benchmarks/','What do published measurements tell us?','home-title-link')}</h3><p>Explore ${esc(snapshot.models?.length??0)} imported model records and their original sources. External capability scores remain separate from our operational results.</p></div>${link('/sources/','Sources and freshness')}</article>
  <article><p>People and institutions</p><div><h3>${link('/topics/balkans/','What changes in the local context?','home-title-link')}</h3><p>A Western Balkans research agenda connecting institutional delivery, local languages, procurement and the ability of teams to direct AI.</p></div>${link('/topics/geopolitics/','Global context')}</article>
</div><p class="home-source-date">External source snapshot ${esc(sourceDate)}. Retrieval dates and reuse terms are available with each source.</p></section>
<section class="home-founder shell"><div><p class="eyebrow">Why I am building MEKreflect</p><h2>The work starts<br>with a person<br>and a <em>real problem.</em></h2></div><div><p class="lead">My background is in projects, institutions, budgets and expert coordination. I use that experience to ask better questions of AI and turn ideas into systems I can open, test and improve.</p><p>My ambition is a digital office where people and specialist AI workers can carry work forward together. That requires context people understand, outputs they can inspect and the skills to keep improving the system.</p><div class="actions">${link('/method/','How I work with SOAP')}${link('/consultations/','Book a consultation')}</div></div></section>`));
}
