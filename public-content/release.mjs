import { validateRecord } from './validation.mjs';

export function canonical(value) {
  if (Array.isArray(value)) return `[${value.map(canonical).join(',')}]`;
  if (value !== null && typeof value === 'object') return `{${Object.keys(value).sort().map(key => `${JSON.stringify(key)}:${canonical(value[key])}`).join(',')}}`;
  return JSON.stringify(value);
}
export async function sha256(value) {
  const bytes = new TextEncoder().encode(typeof value === 'string' ? value : canonical(value));
  return [...new Uint8Array(await crypto.subtle.digest('SHA-256', bytes))].map(v => v.toString(16).padStart(2, '0')).join('');
}

// Fail closed on any allowlisted record mismatch. Catalog additions never become public automatically.
export async function compileRelease(catalog, allowlist) {
  const keys = new Set();
  for (const r of catalog) {
    const key = `${r.kind}:${r.id}`;
    if (keys.has(key)) throw new Error('Duplicate catalog key');
    keys.add(key);
  }
  const selected = [];
  const seen = new Set();
  for (const entry of allowlist.records) {
    const key = `${entry.kind}:${entry.id}`;
    if (seen.has(key)) throw new Error('Duplicate allowlist key');
    seen.add(key);
    const record = catalog.find(r => r.kind === entry.kind && r.id === entry.id);
    if (!record || validateRecord(record).length) throw new Error('Invalid allowlisted record');
    if (record.status !== 'published' || !['public_approved', 'synthetic'].includes(record.contentClass) || record.approval.decision !== 'approved' || record.approval.basis === 'pending_review') throw new Error('Record not approved for public release');
    if (record.revision !== entry.revision || await sha256(record) !== entry.sha256) throw new Error('Release pin mismatch');
    for (const source of record.provenance) if (!allowlist.sourceUrls.includes(source.url)) throw new Error('Source URL not allowlisted');
    if (!allowlist.sourceUrls.includes(record.approval.reviewRef)) throw new Error('Review URL not allowlisted');
    // Serialize now so mutation of inputs cannot change published output after admission.
    selected.push(JSON.parse(canonical(record)));
  }
  const byKey = (kind, id) => selected.find(r => r.kind === kind && r.id === id);
  for (const r of selected) {
    if (r.kind === 'case') {
      for (const [kind, ids] of [['evidence-card', r.evidenceCardIds], ['protocol', r.protocolIds], ['policy-mapping', r.policyMappingIds]]) {
        for (const id of ids) if (byKey(kind, id)?.caseId !== r.id) throw new Error('Unresolved case reference');
      }
    } else {
      if (!byKey('case', r.caseId)) throw new Error('Unresolved parent case');
      if (r.kind === 'policy-mapping') {
        const caseRecords = selected.filter(x => x.id === r.caseId || x.caseId === r.caseId);
        const claims = new Set(caseRecords.flatMap(x => x.claims.map(c => c.id)));
        if (!r.evidenceClaimIds.every(id => claims.has(id))) throw new Error('Unresolved policy evidence claim');
      }
    }
  }
  return { records: selected, manifest: { schemaVersion: '1.0.0', releaseId: allowlist.releaseId, releaseDate: allowlist.releaseDate, records: allowlist.records.map(e => ({...e})), scope: 'Public approved editorial content. No model performance results.' } };
}
