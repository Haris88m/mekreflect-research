# MEKreflect research platform

MEKreflect aims to make AI evaluations more useful for real decisions. We are developing methods to assess benchmark evidence and help teams turn it into testable operational policies. The three pillars are benchmark evidence assessment, evaluation design and reproducibility, and evidence-to-policy translation. Becoming a benchmark for benchmarks is an ambition, not an established ranking or certification capability.

[MEKreflect](https://mekreflect.com/) · [Research programme](https://mekreflect.com/research/) · [Company direction](MEKREFLECT-DIRECTION.md)

## What is here

The homepage, About and Research explain the company programme and current stage. A documentary benchmark-evidence review is separate from the one continuing incident-led case. The authored helper-authorization protocol has local scripted checks and bounded code review, with zero model trials. Personal-project records are retained as an unobtrusive, noindex historical archive; they are excluded from the current research feed and company evidence claims.

`company-edition.mjs` runs after the preserved research platform installers, replacing the company entry pages and shared navigation while retaining existing evidence routes and artifacts. `company-edition.css` supplies the original company layout. Inspect is reviewed as a candidate evaluation framework and has not been used. No SDK runtime experiments or independent reproductions have been performed.

- A dependency-free Node renderer builds 46 editorial pages and explicitly allowlisted public data.
- The homepage introduces the documentary benchmark review and one continuing incident case. Personal-project research is not part of this company positioning.
- Six earlier preparation notes remain at their original URLs as archived supporting records, outside the journal feed and sitemap. The broader 15-task protocol and exact artifacts remain accessible; unrelated SDK/vendor examples are not incident evidence or repairs. No incident-related test or independent reproduction has run.
- Six earlier implementation case studies remain intact in the historical archive, outside the current research programme and feed.
- Historical observations retain their denominators and source links in the project and evaluation areas. The homepage uses a labelled conceptual development diagram rather than performance metrics. The contact backend keeps withdrawal available under its own allowance when intake is exhausted.
- An explicit release allowlist and content hashes keep private work outside the release.
- An Epoch AI data importer validates the archive and preserves attribution, source dates, missing values and confidence bounds.
- OBSERVER8 records describe 23 hosted AI tasks across ten fictional operational cases. Disputed readiness is distinguished from demonstrated false blocking. The raw private research archive is not included.
- A Cloudflare Worker and D1 schema support consultation requests, pending email interest, withdrawal tokens, retention and daily arXiv metadata retrieval.
- The backend tests use real in-memory SQLite and synthetic records. They do not call production services or models.

The implementation is AI-assisted and founder-led. Software checks, documentary analysis and model evaluations remain distinct evidence states. No enterprise adoption, validated policy or general model-safety claim follows from publication.

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
| `incident-journal.mjs`, `journal-case-content.md` | Current single-case journal, incident/investigation/test/follow-up navigation, homepage feature and case feed |
| `research-journal.mjs`, `research-journal.css` | Preserved earlier supporting records and shared editorial styles |
| `evidence-graph-g2.md` | Public conceptual representation and future measurement dictionary; no runtime validation |
| `research-artifacts.mjs`, `research-artifacts/2026-10-18/` | Explicit public artifact desk: nine archived files plus the reviewed A-1 admission summary, hashes and current/historical packets |
| `research-admission.mjs` | Current bounded SDK admission status and visible methods dependencies; no runtime result |
| `research-packet-test.mjs` | Document parity and byte-identity QA; no SDK or solver execution |
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
