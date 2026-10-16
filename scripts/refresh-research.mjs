// Public-data import only. No models are called and no private workspace data is read.
// Run: node scripts/refresh-research.mjs --write
import { inflateRawSync } from 'node:zlib';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

const EPOCH_URL = 'https://epoch.ai/data/benchmark_data.zip';
const ARXIV_IDS = ['2503.13657', '2406.12045', '2602.19843', '2406.13352', '2609.04611'];
const recentQuery = '(cat:cs.AI OR cat:cs.CL) AND (all:"multi-agent" OR all:"agent evaluation")';
export const sources = {
  epoch: { url: EPOCH_URL, documentation: 'https://epoch.ai/benchmarks/use-this-data', license: 'CC BY 4.0', licenseUrl: 'https://creativecommons.org/licenses/by/4.0/', attribution: 'Epoch AI, Capabilities & benchmarking. Retrieved from epoch.ai. MEKreflect has selected fields and reformatted the data; no affiliation or endorsement is implied.' },
  arxiv: { url: `https://export.arxiv.org/api/query?search_query=${encodeURIComponent(recentQuery)}&sortBy=submittedDate&sortOrder=descending&start=0&max_results=12`, documentation: 'https://info.arxiv.org/help/api/tou.html', license: 'CC0 1.0 descriptive metadata', licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/', attribution: 'arXiv metadata supplied by the authors and arXiv. Papers remain their authors’ work. Inclusion is discovery, not peer review or endorsement.' }
};

export function parseCSV(text) {
  const rows = []; let row = [], field = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i + 1] === '"') { field += '"'; i++; } else quoted = !quoted; }
    else if (c === ',' && !quoted) { row.push(field); field = ''; }
    else if ((c === '\n' || c === '\r') && !quoted) { if (c === '\r' && text[i + 1] === '\n') i++; row.push(field); if (row.some(Boolean)) rows.push(row); row = []; field = ''; }
    else field += c;
  }
  if (quoted) throw new Error('Malformed CSV: unterminated quoted value');
  if (field || row.length) { row.push(field); rows.push(row); }
  const header = rows.shift(); if (!header?.length) throw new Error('CSV missing header');
  return rows.map(values => Object.fromEntries(header.map((key, i) => [key, values[i] ?? ''])));
}

function unzipSelected(buffer) {
  // Read only selected central-directory entries into memory. Never extract paths to disk.
  let end = buffer.length - 22;
  while (end >= Math.max(0, buffer.length - 65557) && buffer.readUInt32LE(end) !== 0x06054b50) end--;
  if (end < 0) throw new Error('Invalid ZIP directory');
  const count = buffer.readUInt16LE(end + 10); let offset = buffer.readUInt32LE(end + 16);
  if (count > 300) throw new Error('Unexpected archive entry count');
  const entries = new Map();
  for (let i = 0; i < count; i++) {
    if (buffer.readUInt32LE(offset) !== 0x02014b50) throw new Error('Invalid ZIP entry');
    const method = buffer.readUInt16LE(offset + 10), compressed = buffer.readUInt32LE(offset + 20), size = buffer.readUInt32LE(offset + 24);
    const nameLength = buffer.readUInt16LE(offset + 28), extraLength = buffer.readUInt16LE(offset + 30), commentLength = buffer.readUInt16LE(offset + 32), local = buffer.readUInt32LE(offset + 42);
    const name = buffer.subarray(offset + 46, offset + 46 + nameLength).toString('utf8');
    if ((name.endsWith('.csv') && !name.includes('_external') && !name.includes('processed_data') && !name.includes('edi_scores')) || name === 'README.md') {
      if (size > 5_000_000 || compressed > 5_000_000) throw new Error('Oversize archive entry');
      if (buffer.readUInt32LE(local) !== 0x04034b50) throw new Error('Invalid local ZIP entry');
      const start = local + 30 + buffer.readUInt16LE(local + 26) + buffer.readUInt16LE(local + 28);
      const raw = buffer.subarray(start, start + compressed);
      const bytes = method === 0 ? raw : method === 8 ? inflateRawSync(raw, { maxOutputLength: 5_000_000 }) : null;
      if (!bytes || bytes.length !== size) throw new Error('Unsupported or invalid compressed entry');
      entries.set(name, bytes.toString('utf8'));
    }
    offset += 46 + nameLength + extraLength + commentLength;
  }
  return entries;
}
const number = value => value === '' || value == null ? null : Number.isFinite(Number(value)) ? Number(value) : null;
const text = value => String(value ?? '').trim() || null;
const entity = value => value.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).replace(/\s+/g, ' ').trim();
const tag = (body, name) => entity(body.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`))?.[1] ?? '');
export function parseAtom(xml) {
  if (!xml.includes('<feed')) throw new Error('Invalid arXiv Atom response');
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].map(([, body]) => {
    const rawId = tag(body, 'id'); const id = rawId.match(/\/abs\/([\w.\/-]+)$/)?.[1];
    if (!id) throw new Error('Invalid arXiv identifier');
    return { id, title: tag(body, 'title'), authors: [...body.matchAll(/<author>([\s\S]*?)<\/author>/g)].map(([, author]) => tag(author, 'name')), publishedAt: tag(body, 'published'), updatedAt: tag(body, 'updated'), categories: [...body.matchAll(/<category[^>]*term="([^"]+)"/g)].map(([, name]) => entity(name)), url: `https://arxiv.org/abs/${id}`, reviewStatus: 'Preprint metadata; publication status has not been independently reviewed' };
  });
}
async function get(url, maxBytes = 10_000_000) {
  const response = await fetch(url, { signal: AbortSignal.timeout(45_000), headers: { 'User-Agent': 'MEKreflectResearch/1.0 (+https://mekreflect.com/contact/)' } });
  if (!response.ok) throw new Error(`Source returned HTTP ${response.status}: ${new URL(url).hostname}`);
  const length = Number(response.headers.get('content-length')); if (length > maxBytes) throw new Error('Source exceeds size bound');
  const body = new Uint8Array(await response.arrayBuffer()); if (body.length > maxBytes) throw new Error('Source exceeds size bound');
  return { body, retrievedAt: new Date().toISOString(), lastModified: response.headers.get('last-modified') };
}
export async function refreshEpoch() {
  const result = await get(EPOCH_URL); const entries = unzipSelected(Buffer.from(result.body));
  if (!entries.get('README.md')?.includes('creativecommons.org/licenses/by/4.0')) throw new Error('Source attribution terms changed; human review required');
  for (const name of ['epoch_capabilities_index/eci_scores.csv', 'benchmark_metadata.csv', 'model_metadata.csv']) if (!entries.has(name)) throw new Error(`Source schema missing ${name}`);
  const modelMetadata = parseCSV(entries.get('model_metadata.csv')).filter(row => row.model_version);
  const models = parseCSV(entries.get('epoch_capabilities_index/eci_scores.csv')).map(row => ({ name: row['Display name'] || row.Model, modelGroup: row.Model, score: number(row.eci), confidenceLow: number(row.eci_ci_low), confidenceHigh: number(row.eci_ci_high), releaseDate: text(row.date), organization: text(row.Organization), country: text(row['Country (of organization)']), accessibility: text(row['Model accessibility']), accessGroup: text(row['Accessibility group']), sourceUrl: 'https://epoch.ai/eci' })).filter(row => row.name && row.score !== null);
  if (models.length < 50 || models.length > 2000) throw new Error('Unexpected ECI model count; review required');
  const benchmarks = parseCSV(entries.get('benchmark_metadata.csv')).filter(row => !row.source_file.includes('_external') && entries.has(row.source_file)).map(row => ({ name: row.benchmark, sourceFile: row.source_file, scale: number(row.scale), randomBaseline: number(row.random_baseline), scoreCeiling: number(row.score_ceiling), releaseDate: text(row.release_date), supersededBy: text(row.superseded_by), inECI: row.in_eci === 'True' }));
  const runs = benchmarks.flatMap(benchmark => parseCSV(entries.get(benchmark.sourceFile)).map(row => ({ benchmark: benchmark.name, model: row['Model version'], score: number(row.mean_score), bestScore: number(row['Best score (across scorers)']), standardError: number(row.stderr), startedAt: text(row['Started at']), releaseDate: text(row['Release date']), organization: text(row.Organization), country: text(row.Country), logViewer: text(row['Log viewer']), sourceId: text(row.id), sourceFile: benchmark.sourceFile })).filter(row => row.model && row.score !== null));
  return { ...sources.epoch, retrievedAt: result.retrievedAt, sourceLastModified: result.lastModified, archiveSHA256: createHash('sha256').update(result.body).digest('hex'), models, benchmarks, runs, coverage: { eciModelGroups: models.length, sourceModelVersions: modelMetadata.length, importedInternalBenchmarks: benchmarks.length, importedRunRows: runs.length, includesAllModels: false, selection: 'Every valid model group in the downloaded Epoch Capabilities Index; internal benchmark tables listed in the archive metadata. Externally administered benchmark tables are excluded from this local import.' }, interpretation: 'ECI is Epoch’s fitted capability scale, not a percentage or an operational success rate. Scores depend on source coverage and evaluation settings. Confidence bounds are supplied by Epoch. Empty fields remain null. MEKreflect has not rerun these evaluations.' };
}
export async function refreshPapers() {
  const selectedURL = `https://export.arxiv.org/api/query?id_list=${ARXIV_IDS.join(',')}&max_results=${ARXIV_IDS.length}`;
  const selected = await get(selectedURL, 1_000_000);
  // arXiv asks for one connection and at least three seconds between requests.
  await new Promise(resolve => setTimeout(resolve, 3100));
  const recent = await get(sources.arxiv.url, 1_000_000);
  const chosen = parseAtom(new TextDecoder().decode(selected.body)).map(row => ({ ...row, selection: 'Selected methodological reference' }));
  const latest = parseAtom(new TextDecoder().decode(recent.body)).map(row => ({ ...row, selection: 'Automated discovery; editorial review pending' }));
  const unique = new Map([...chosen, ...latest].map(row => [row.id.replace(/v\d+$/, ''), row]));
  return { ...sources.arxiv, retrievedAt: recent.retrievedAt, selectedQuery: selectedURL, query: recentQuery, items: [...unique.values()], selection: 'Five selected references plus the twelve most recently submitted records matching a bounded agent-evaluation query. This is a discovery feed, not a complete literature review.' };
}

export const policySignals = [
  { id: 'eu-ai-adoption', title: 'One in five EU enterprises reported using AI in 2025', publisher: 'Eurostat', publishedAt: '2025-12-11', checkedAt: '2026-10-16', url: 'https://ec.europa.eu/eurostat/web/products-eurostat-news/w/ddn-20251211-2', topic: 'Adoption and use', countries: ['European Union'], metric: { value: 20, unit: '% of surveyed enterprises', year: 2025, previousValue: 13.5, previousYear: 2024 }, summary: 'The official enterprise survey records wider adoption. It does not tell us whether an AI workflow is reliable or how much useful work it completes.', scope: 'EU enterprises with ten or more employees in the survey scope. This figure is not a Western Balkans adoption estimate.', researchQuestion: 'What changes after adoption: accepted output, review effort, error rates and staff capability?' },
  { id: 'balkans-antennas', title: 'North Macedonia and Serbia connect to the AI Factory network', publisher: 'European Commission', publishedAt: '2025-10-13', checkedAt: '2026-10-16', url: 'https://digital-strategy.ec.europa.eu/en/news/eu-announces-ai-factories-antennas-across-member-states-and-partner-countries', topic: 'Balkans and infrastructure', countries: ['North Macedonia', 'Serbia'], summary: 'The Commission announced AI Factory Antennas in both countries. This creates a concrete regional research agenda around access, skills and the ability of local organisations to use shared infrastructure.', scope: 'An infrastructure announcement does not establish that a particular company has received access or achieved operational gains.', researchQuestion: 'Which local organisations can turn access to compute into a useful, evaluated workflow?' },
  { id: 'antenna-directory', title: 'VEZILKA and SAIFA are listed in Europe’s AI Factory ecosystem', publisher: 'European Commission', publishedAt: null, checkedAt: '2026-10-16', url: 'https://digital-strategy.ec.europa.eu/en/policies/ai-factories', topic: 'Balkans and infrastructure', countries: ['North Macedonia', 'Serbia'], summary: 'The official directory names VEZILKA in North Macedonia and SAIFA in Serbia. The directory provides a starting point for tracking regional institutions and access routes.', scope: 'Directory inclusion is not a measure of compute use, project success or economic impact.', researchQuestion: 'How do access requirements, training provision and institutional capacity affect smaller organisations?' },
  { id: 'digital-europe-access', title: 'Digital Europe creates a regional route to participation', publisher: 'European Commission', publishedAt: '2023-06-30', checkedAt: '2026-10-16', url: 'https://digital-strategy.ec.europa.eu/en/news/digital-europe-programme-opens-candidate-countries-montenegro-north-macedonia-albania-and-serbia', topic: 'Balkans and institutions', countries: ['Montenegro', 'North Macedonia', 'Albania', 'Serbia'], summary: 'Association agreements connected four Western Balkan countries to Digital Europe funding opportunities. Eligibility must still be checked against each current call.', scope: 'This is a historical policy milestone, not an open funding call or a claim that MEKreflect has funding.', researchQuestion: 'What prevents operational teams from converting available programmes into well-scoped, sustainable projects?' },
  { id: 'eu-strategic-adoption', title: 'AI uptake is spreading across Europe’s strategic sectors', publisher: 'European Commission Joint Research Centre', publishedAt: '2026-10-14', checkedAt: '2026-10-16', url: 'https://joint-research-centre.ec.europa.eu/jrc-news-and-updates/ai-adoption-more-doubles-almost-every-eu-strategic-sector-2026-10-14_en', topic: 'Industry and adoption', countries: ['European Union'], summary: 'A new JRC analysis follows adoption across sectors using Eurostat enterprise data. Sector differences make a single generic adoption story inadequate.', scope: 'Survey adoption and demonstrated effectiveness answer different questions. The source does not provide a MEKreflect effectiveness estimate.', researchQuestion: 'Which sector-specific controls and skills are needed after a team introduces AI?' }
];

async function main() {
  const epoch = await refreshEpoch(); const papers = await refreshPapers();
  const intelligence = { schemaVersion: 1, generatedAt: new Date().toISOString(), epoch, papers, policySignals, freshness: { epoch: 'Timestamped imported snapshot. Refresh requires a successful source download and validation.', papers: 'Timestamped discovery metadata. A scheduled backend may refresh this independently.', policy: 'Editorially checked official sources; dates identify the original announcement.' }, affiliation: 'MEKreflect is independent. External data and citations do not imply partnership, endorsement or replication.' };
  if (process.argv.includes('--write')) {
    await writeFile(new URL('../intelligence-data.mjs', import.meta.url), `// Generated from attributed public sources by scripts/refresh-research.mjs.\nexport const intelligence = ${JSON.stringify(intelligence, null, 2)};\nexport const epochData = intelligence.epoch;\nexport const papers = intelligence.papers;\nexport const policySignals = intelligence.policySignals;\nexport const researchSnapshot = {\n  retrievedAt: intelligence.generatedAt,\n  models: epochData.models.map(row => ({ ...row, eci: row.score })),\n  benchmarks: epochData.benchmarks.map(row => ({ ...row, url: epochData.documentation, description: 'Epoch-administered evaluation. See source method and run settings; scores are not interchangeable across tasks.' })),\n  papers: papers.items.map(row => ({ ...row, published: row.publishedAt, summary: row.selection })),\n  sources: [{ name: 'Epoch AI', ...epochData, models: undefined, benchmarks: undefined, runs: undefined }, { name: 'arXiv', ...papers, items: undefined }],\n  regional: policySignals\n};\n`);
  }
  console.log(JSON.stringify({ generatedAt: intelligence.generatedAt, ...epoch.coverage, papers: papers.items.length, policySignals: policySignals.length, written: process.argv.includes('--write') }));
}
if (process.argv[1] && fileURLToPath(import.meta.url).replace(/\\/g, '/').toLowerCase() === process.argv[1].replace(/\\/g, '/').toLowerCase()) await main();
