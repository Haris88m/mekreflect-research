import { schemas } from './schemas.mjs';

// Deliberately small, closed validator: no package loading, code generation, coercion or refs.
export function validateSchema(schema, value, path = '$') {
  const errors = [];
  const fail = message => errors.push(`${path}: ${message}`);
  if (schema.anyOf) {
    if (!schema.anyOf.some(candidate => validateSchema(candidate, value, path).length === 0)) fail('no allowed type matches');
    return errors;
  }
  if ('const' in schema && value !== schema.const) fail('unexpected constant');
  if (schema.enum && !schema.enum.includes(value)) fail('unexpected enum');
  const type = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
  if (schema.type && (schema.type === 'integer' ? !Number.isSafeInteger(value) : schema.type !== type)) {
    fail(`expected ${schema.type}`); return errors;
  }
  if (type === 'string') {
    if (value.length < (schema.minLength ?? 0) || value.length > (schema.maxLength ?? Infinity)) fail('invalid string length');
    if (schema.pattern && !new RegExp(schema.pattern).test(value)) fail('pattern mismatch');
    if (schema.format === 'date' && (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value)) || new Date(value).toISOString().slice(0, 10) !== value)) fail('invalid date');
    if (schema.format === 'uri') {
      try {
        const u = new URL(value);
        if (u.protocol !== 'https:' || u.username || u.password || u.port || u.hash || u.search) fail('expected public HTTPS URL without credentials, query or fragment');
      } catch { fail('invalid URL'); }
    }
  }
  if (type === 'number' && schema.minimum !== undefined && value < schema.minimum) fail('below minimum');
  if (type === 'array') {
    if (value.length < (schema.minItems ?? 0) || value.length > (schema.maxItems ?? Infinity)) fail('invalid array length');
    value.forEach((item, index) => errors.push(...validateSchema(schema.items, item, `${path}[${index}]`)));
  }
  if (type === 'object') {
    const properties = schema.properties ?? {};
    for (const key of schema.required ?? []) if (!Object.hasOwn(value, key)) fail(`missing ${key}`);
    for (const key of Object.keys(value)) {
      if (!Object.hasOwn(properties, key)) { if (schema.additionalProperties === false) fail('unknown field'); }
      else errors.push(...validateSchema(properties[key], value[key], `${path}.${key}`));
    }
  }
  return errors;
}

export function validateRecord(record) {
  const schema = Object.hasOwn(schemas, record?.kind ?? '') ? schemas[record.kind] : null;
  if (!schema) return ['unknown record kind'];
  const errors = validateSchema(schema, record);
  if (errors.length) return errors;
  const sourceIds = new Set(record.provenance.map(s => s.sourceId));
  if (sourceIds.size !== record.provenance.length) errors.push('duplicate source ID');
  const claimIds = new Set(record.claims.map(c => c.id));
  if (claimIds.size !== record.claims.length) errors.push('duplicate claim ID');
  for (const claim of record.claims) for (const ref of claim.sourceIds) if (!sourceIds.has(ref)) errors.push('unresolved claim source');
  if (record.kind === 'policy-mapping') {
    if (!record.provenance.some(s => s.sourceId === record.frameworkSourceId && s.sourceType === 'framework_document')) errors.push('missing framework document');
  }
  if (record.kind === 'protocol' && new Set(record.conditions.map(c => c.id)).size !== record.conditions.length) errors.push('duplicate condition ID');
  if (record.provenance.some(s => s.publishedOn > s.accessedOn)) errors.push('source date follows access date');
  if (new TextEncoder().encode(JSON.stringify(record)).length > 64000) errors.push('record exceeds 64 KB');
  return errors;
}
