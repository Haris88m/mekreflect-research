// JSON Schema 2020-12. The runtime validator implements only the keywords used here.
export const SCHEMA_VERSION = '1.0.0';
const text = (maxLength = 2000) => ({ type: 'string', minLength: 1, maxLength });
const enumeration = (...values) => ({ type: 'string', enum: values });
const list = (items, minItems = 0, maxItems = 30) => ({ type: 'array', items, minItems, maxItems });
const object = properties => ({ type: 'object', properties, required: Object.keys(properties), additionalProperties: false });
const id = { ...text(80), pattern: '^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$' };
const date = { ...text(10), format: 'date' };
const url = { ...text(1000), format: 'uri', pattern: '^https://' };
const source = object({
  sourceId: id,
  sourceType: enumeration('external_incident_report', 'public_editorial', 'synthetic_fixture', 'framework_document'),
  title: text(200), url, publishedOn: date, accessedOn: date, locator: text(300),
  verification: enumeration('source_reviewed', 'editorial_design_only', 'synthetic_not_run'),
  snapshotSha256: { anyOf: [{ type: 'null' }, { ...text(64), pattern: '^[a-f0-9]{64}$' }] }
});
const claim = object({
  id, text: text(),
  claimType: enumeration('attributed_report', 'editorial_interpretation', 'proposed_method', 'policy_hypothesis', 'synthetic_example'),
  sourceIds: list(id, 1), limitations: list(text(), 1)
});
const common = {
  schemaVersion: { const: SCHEMA_VERSION }, id,
  revision: { type: 'integer', minimum: 1 },
  status: enumeration('draft', 'published'),
  contentClass: enumeration('public_approved', 'synthetic', 'private'),
  approval: object({ decision: enumeration('approved', 'pending'), basis: enumeration('existing_public_editorial', 'synthetic_fixture_only', 'pending_review'), reviewedOn: date, reviewRef: url }),
  title: text(200), summary: text(),
  provenance: list(source, 1), claims: list(claim, 1), limitations: list(text(), 1)
};
const kinds = {
  case: {
    evidenceState: enumeration('source_reviewed_external_incident'),
    evidenceCardIds: list(id, 1), protocolIds: list(id, 1), policyMappingIds: list(id),
    independentReproduction: { const: false }
  },
  'evidence-card': {
    caseId: id,
    evidenceState: enumeration('attributed_source_review', 'synthetic_design_only'),
    comparability: object({ assessment: enumeration('not_a_controlled_comparison', 'not_applicable'), reasons: list(text(), 1) })
  },
  protocol: {
    caseId: id,
    executionStatus: { const: 'not_run' }, registrationStatus: { const: 'proposal' },
    framework: object({ name: enumeration('Inspect'), status: { const: 'candidate_reviewed_not_run' } }),
    conditions: list(object({ id, description: text() }), 2),
    prerequisites: list(text(), 1), measurementPlan: list(text(), 1)
  },
  'policy-mapping': {
    caseId: id, mappingStatus: { const: 'proposed_not_validated' },
    frameworkSourceId: id, controlReference: text(300), proposedImplication: text(),
    evidenceClaimIds: list(id, 1), validationNeeded: list(text(), 1),
    complianceDetermination: { const: false }
  }
};
export const schemas = Object.fromEntries(Object.entries(kinds).map(([kind, fields]) => [kind, {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: `https://mekreflect.com/schemas/${SCHEMA_VERSION}/${kind}.schema.json`,
  title: `MEKreflect ${kind} ${SCHEMA_VERSION}`,
  ...object({ ...common, kind: { const: kind }, ...fields })
}]));
