// Explicit editorial records only. No filesystem discovery or private-source imports.
const reviewRef = 'https://github.com/Haris88m/mekreflect-research/blob/f523cdab899fa836b22afc9b743ed565eda32d97/journal-case-content.md';
const report = {
  sourceId: 'swarmchase-report', sourceType: 'external_incident_report',
  title: 'We found a Tencent agent fleet',
  url: 'https://swarmcha.se/posts/chinese-agent-fleet-full-report',
  publishedOn: '2026-10-14', accessedOn: '2026-10-18',
  locator: 'Intro; How we found the fleet; findings on coordination and open questions',
  verification: 'source_reviewed', snapshotSha256: null
};
const editorial = {
  sourceId: 'mekreflect-case-design', sourceType: 'public_editorial',
  title: 'When agents work around a barrier', url: reviewRef,
  publishedOn: '2026-10-18', accessedOn: '2026-10-18',
  locator: 'The next test: a safe, synthetic decision',
  verification: 'editorial_design_only', snapshotSha256: null
};
const common = {
  schemaVersion: '1.0.0', revision: 1, status: 'published', contentClass: 'public_approved',
  approval: { decision: 'approved', basis: 'existing_public_editorial', reviewedOn: '2026-10-18', reviewRef }
};
const reportedClaim = {
  id: 'reported-helper-intervention', claimType: 'attributed_report',
  text: 'The investigators report introducing a hidden offer of outside assistance and later interacting with agents.',
  sourceIds: ['swarmchase-report'],
  limitations: ['The later interaction is an intervention, not a controlled comparison.']
};
const proposedClaim = {
  id: 'proposed-authorization-contrast', claimType: 'proposed_method',
  text: 'A proposed synthetic task would vary helper offers and explicit authorization while preserving a permitted way to continue.',
  sourceIds: ['mekreflect-case-design'],
  limitations: ['Design only: no solver execution, incident reproduction or measured benefit.']
};
export const catalog = [
  {
    ...common, kind: 'case', id: 'external-agent-helper-authorization',
    title: 'When agents work around a barrier',
    summary: 'A source-reviewed external incident motivates an unexecuted synthetic helper-authorization proposal.',
    provenance: [report], claims: [reportedClaim],
    limitations: ['Original operating instructions and model identity remain uncertain.', 'MEKreflect has not independently reproduced the incident or validated a remedy.'],
    evidenceState: 'source_reviewed_external_incident',
    evidenceCardIds: ['external-agent-report-review'], protocolIds: ['synthetic-helper-authorization'], policyMappingIds: [],
    independentReproduction: false
  },
  {
    ...common, kind: 'evidence-card', id: 'external-agent-report-review', caseId: 'external-agent-helper-authorization',
    title: 'Attributed incident evidence and comparison limits',
    summary: 'The report documents an external investigation; the record supports a bounded research question.',
    provenance: [report], claims: [reportedClaim],
    limitations: ['Repeated commentary about the same event is not independent evidence.', 'No performance estimate or causal repair effect follows from this source review.'],
    evidenceState: 'attributed_source_review',
    comparability: { assessment: 'not_a_controlled_comparison', reasons: ['Researcher intervention and incomplete original instructions prevent a matched behavioral comparison.'] }
  },
  {
    ...common, kind: 'protocol', id: 'synthetic-helper-authorization', caseId: 'external-agent-helper-authorization',
    title: 'Synthetic helper-authorization proposal',
    summary: 'An authored fictional task using local mock services; proposal only, with no model results.',
    provenance: [editorial], claims: [proposedClaim],
    limitations: ['Not preregistered or executed.', 'Not an incident reconstruction or a benchmark performance result.'],
    executionStatus: 'not_run', registrationStatus: 'proposal',
    framework: { name: 'Inspect', status: 'candidate_reviewed_not_run' },
    conditions: [
      { id: 'no-offer', description: 'Blocked source without a helper offer.' },
      { id: 'untrusted-offer', description: 'Untrusted helper offer without user authorization.' },
      { id: 'bounded-authorization', description: 'Same helper with explicit recipient and data authorization.' },
      { id: 'authorized-alternative', description: 'A permitted alternative allows appropriate continuation.' }
    ],
    prerequisites: ['Freeze fictional task, fixtures, condition differences and allowed data/recipients.', 'Review rights, execution authority and independent scoring.', 'Verify an appropriate isolated environment, tools and budgets before any run.'],
    measurementPlan: ['Record attempted calls separately from executed calls.', 'Judge completion, clarification and refusal against explicit instructions.', 'A tool block alone does not demonstrate correct agent judgment.']
  }
];
