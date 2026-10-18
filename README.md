# MEKreflect research platform

I am Haris Mekic. I work on how people turn operational knowledge into AI systems they can inspect, question and improve. This repository publishes the source of the MEKreflect research website, its public-data importer, and its Cloudflare research and consultation backend.

[MEKreflect](https://mekreflect.com/) · [Cloudflare mirror](https://mekreflect.pages.dev/) · [Research method](https://mekreflect.pages.dev/method/) · [Observed handoffs](https://mekreflect.pages.dev/evaluations/)

## What is here

The site connects three distinct kinds of work. The first is my applied research on context, procedures and AI-worker handoffs. The second is a dated, attributed import of external AI evaluation data. The third is a reading queue of public arXiv metadata. They are not interchangeable measures of performance.

- A dependency-free Node renderer builds 41 editorial pages and machine-readable public data.
- A prominent homepage journal links dated evidence, methods and code notes, a first-topic directory, and the downloadable G-2 conceptual evidence specification. Research progress remains separate from scientific execution and measured benefit.
- The first public agent-support research case publishes its 15-task protocol, three source records and evidence limits; no independent reproductions or benchmark scores are claimed.
- Six source-linked case studies connect the site to [MEKreflect research labs](https://github.com/Haris88m/mekreflect-labs), covering context handoffs, receipt controls, paid AI admission, visual production, telemetry parsing and current evidence gates.
- The homepage presents actual recorded observations with their denominators and links to source records. The contact backend keeps withdrawal available under its own allowance when intake is exhausted.
- An explicit release allowlist and content hashes keep private work outside the release.
- An Epoch AI data importer validates the archive and preserves attribution, source dates, missing values and confidence bounds.
- OBSERVER8 records describe 23 hosted AI tasks across ten fictional operational cases. Disputed readiness is distinguished from demonstrated false blocking. The raw private research archive is not included.
- A Cloudflare Worker and D1 schema support consultation requests, pending email interest, withdrawal tokens, retention and daily arXiv metadata retrieval.
- The backend tests use real in-memory SQLite and synthetic records. They do not call production services or models.

The implementation is AI-assisted. I define the operational questions, provide context, direct development and review the results. This is an inspectable working implementation, not a claim of enterprise adoption or general model safety.

## Run it locally

Use Node.js 22.13 or newer. No npm install is needed for the build or tests.

```sh
npm run build
npm test
npm run preview
```

Open http://127.0.0.1:4222. Local previews and forks direct form and live-metadata API calls to http://127.0.0.1:8787, never to the production consultation inbox. Only the exact published origins mekreflect.com and mekreflect.pages.dev use the existing production API. Without a local backend, the dated research pages remain usable and forms explain that their service is unavailable.

`ci/check.yml` is an inactive GitHub Actions example. The publishing connection does not have workflow-write permission, so this repository does not claim a running CI workflow. The local build and test commands above are the verified checks. An authorized maintainer can review and install the example separately.

To run the optional backend, install the official Cloudflare Wrangler CLI, copy `backend/wrangler.example.jsonc` to `backend/wrangler.jsonc`, and configure your own D1 database. Then, from `backend/`:

```sh
wrangler d1 execute mekreflect-research-local --local --file schema.sql
wrangler dev --local --port 8787
```

Use synthetic contact details while testing. Deploying a fork requires your own account, database, allowed origins, contact identity, privacy policy and frontend API origin. No deployment command or production account identifiers are included here.

## Data freshness and research scope

`intelligence-data.mjs` contains a dated snapshot, not a live leaderboard. The reviewed release imported 277 ECI model groups, 15 Epoch-administered benchmark tables and 1,600 run records. Scope and retrieval dates live with the data. External model scores are not percentages and do not measure the success of my operational workflows.

`npm run refresh:check` fetches and validates public source updates without replacing the saved module. `npm run refresh:write` replaces it after successful validation. Review the resulting data and tests before publishing. This operation uses the network; ordinary builds and tests do not.

The Worker refreshes selected arXiv metadata daily when deployed with its cron configuration. It retains the last successful snapshot on source failure. Paper metadata is not a peer-review guarantee. Email delivery is not implemented; subscription records remain pending and consultation receipts are not confirmed appointments.

## Project map

| Source | Responsibility |
| --- | --- |
| `company-build.mjs` | Static build, routing, headers and release manifest |
| `research-platform.mjs` | Research navigation, pages and evidence presentation |
| `open-research.mjs` | Source catalogue and six implementation case studies |
| `research-case.mjs`, `research-case-content.md` | First public research case, public plan and evidence-state record |
| `research-home.mjs` | Mission, recorded findings and the inspected context handoff |
| `research-journal.mjs`, `research-journal.css` | Dated entries, category and topic navigation, evidence graphics, homepage journal feature and feed discovery |
| `evidence-graph-g2.md` | Public conceptual representation and future measurement dictionary; no runtime validation |
| `research-platform.js` | Search, accessible menus, form handling and source status |
| `intelligence-data.mjs` | Attributed public-source snapshot |
| `observer-benchmark-data.mjs` | Bounded original experiment observations |
| `scripts/refresh-research.mjs` | Validated public-data import |
| `backend/worker.mjs` | Request validation, storage, withdrawal and scheduled retrieval |
| `backend/schema.sql` | D1 schema and retention indexes |
| `research-platform-test.mjs`, `open-research-test.mjs`, `backend/test.mjs` | Release checks, source-linked case studies and backend regressions |

## Privacy and publication boundary

This is a clean source export with its own history. It excludes private conversations, employer files, client databases, receipts, contact submissions, credentials, production configuration and internal audit reports. The old repositories and their history were not overwritten. Publishing source does not authorize access to the live service or its private records.

See [DATA-SOURCES.md](DATA-SOURCES.md) for external rights and [SECURITY.md](SECURITY.md) for reporting concerns. Original MEKreflect code and editorial content remain copyright Haris Mekic. This release is public for inspection; no blanket open-source license is granted for the original material. Third-party datasets retain their stated licenses.
