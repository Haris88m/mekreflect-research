# Helper authorization: first authored test package

Version 0.1.0 · 18 October 2026 · One fictional case family

This is MEKreflect's first authored package for a bounded policy question, within evaluation design and evidence-to-policy work. It is not an incident reproduction, a representative dataset, a meta-benchmark or an AI safety result. All recipients, records and effects are fictional and local. No SDK or Inspect code is imported or executed. No model or provider is called.

Read [PROTOCOL.md](PROTOCOL.md) before using the fixtures. [fixtures.json](fixtures.json) defines the scenarios and authenticated authority; [oracle.json](oracle.json) separately defines the fictional correct answer. [controls.mjs](controls.mjs) contains scripted positive and negative traces and their expected labels. The scorer does not read those labels or infer authority from condition names.

## Reproduce the software checks

From the repository root, using the existing Node.js runtime:

```sh
node research-tests/helper-authorization/v0.1.0/freeze.mjs
node research-tests/helper-authorization/v0.1.0/check.mjs --write-report
node --check research-tests/helper-authorization/v0.1.0/inspect-adapter.draft.mjs
```

No install is required. Only original local code and Node standard-library modules run. The manifest check is read-only. `--write-report` writes the synthetic software-check report inside this package. It does not start an AI evaluation. The adapter is an unexecuted mapping draft, not an implemented Inspect integration.

## Files and evidence boundaries

| File | Role |
| --- | --- |
| PROTOCOL.md | Question, contrasts, acceptance criteria, authority and reporting rules |
| fixtures.json | Five conditions within one original fictional family |
| tool-schemas.json, trace-schema.json | Exact mock tool and trace contracts |
| oracle.json | Separate authored reference facts; not externally validated |
| schema.mjs, harness.mjs | Original validation, gate, simulator and started-trial register |
| scorer.mjs | Separate proposal/effect and outcome scoring path, without importing the gate |
| controls.mjs, check.mjs | Scripted controls and mutations; never model inputs |
| inspect-adapter.draft.mjs | Candidate mapping contract, syntax checked only |
| run-manifest.template.json, result-row.template.json | Unapproved future model-run registration and complete outcome fields |
| LIMITATIONS.md, CHANGELOG.md | Scope and version record |
| REVIEW.md | Separate read-only code review, findings and pre-freeze fixes |
| manifest.json, manifest.sha256 | Frozen source-file identities and manifest digest |
| CHECK-RESULT.json | Actual local deterministic check accounting, outside the frozen source payload |

Current stage: authored software checked locally and separately reviewed for bounded code defects. External scientific review and a specifically authorized model pilot remain pending. Software readiness is not a model performance claim.

This directory is not copied into the website release. A future public method update requires an explicit release entry and review; adding a file here does not publish it on the website. Original company research intent is in [MEKREFLECT-DIRECTION.md](../../../MEKREFLECT-DIRECTION.md).
