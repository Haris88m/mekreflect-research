# MEKreflect conceptual evidence graph

Task 7 · representation preparation · revision G-2 · 18 October 2026

## Decision and boundary

Use a small, version-aware evidence graph to preserve distinctions already present in the reviewed documents. This specification is a conceptual representation of three seed families and six substantive assertions, not a database, deployed service, empirical benchmark, simulation or efficacy result. It adds no evidence unavailable to the ordinary-document condition. A graph's organization is not evidence that its claims are true.

The six assertion IDs below are the existing packet IDs C-01 through C-06. They are distinct from the variable C, which denotes evidence assessments. Two document presentations do not create twelve independent assertions. No new external source review, installation or runtime evaluation was performed by the graph author. Revision G-2 incorporates the separate 18 October release-provenance review; the historical packet remains C-paper-1.

## 1. Typed structure

The conceptual reading path is:

Source snapshot → attributed claim → approach revision → authorized attempt → observed or reported outcome → separate evidence assessments.

This is a provenance path, not a causal claim or permission to execute. Every arrow has a named meaning. Not every record has every node. Missing attempts or outcomes stay missing; the path must never be completed with invented nodes.

Supporting nodes hold the problem and acceptance criteria (X), context and version conditions (Y), authority scope, rights/use restrictions, and contradictions. Each claim, approach, attempt, outcome and assessment has a stable ID plus an immutable revision. A later change creates a revision linked by `supersedes`; it does not silently rewrite the old record.

### Node dictionary

- **Source S:** Exact locator, author/publisher, source type, source/event/access dates where known, content identity where available, access method, attribution, permitted-use status and dependency family. A moving URL is not an immutable snapshot. Unknown identity or dates remain explicitly unknown.
- **Claim H:** An attributed, bounded assertion; exact source section; assertion revision; source links; scope and exceptions; status such as reported behavior, inspected patch, conditional guidance, or unresolved release mapping. Claim text must preserve its reporter and uncertainty.
- **Problem X:** Desired outcome plus explicit acceptance and rejection/abort criteria. Distinguish a source author's reported problem from this study's proposed task and normative safety requirements. No original authorization or acceptance criterion may be reconstructed as fact from a successful-looking result.
- **Context Y:** Applicability conditions, software/source/distribution identity, environment, dependency/fixture identity, configuration, permissions, date and observation window. Each field has known/unknown/not-applicable status and provenance. A product version, repository commit and file blob are different identifier types.
- **Approach Z:** Proposed or source-described intervention at a specific revision; prerequisites; expected mechanism as a hypothesis; risks; applicability conditions; rights restrictions. A merged patch or prescribed remedy can be represented here without a study attempt.
- **Attempt A:** A specific actual execution, with attempt ID, X/Y/Z revisions, executor, start/end, authority reference and scope, actual actions, deviations and safety/abort events. An intended test is a proposal, not an A node. Authority for this conceptual design is not authority for runtime work.
- **Outcome B:** What happened in an actual attempt, or a source-attributed outcome report. Fields include reporter, observation method, raw-artifact reference if safe and authorized, timing/window, acceptance status (success/failure/partial/inconclusive), side effects and missing fields. Mark `study-observed`, `source-reported`, or `not-observed`; absence is not success. A source-reported outcome can exist without a reconstructable authorized A; link it directly to its source claim and leave authority unknown.
- **Evidence assessments C:** Separate records for provenance inspection, source-reading agreement, upstream verification report, test inspection, runtime verification, applicability review, rights review and content-equivalence review. Each records assessor/role, method, date, exact assessed revision, evidence, limits and conclusion. One category never automatically upgrades another. No combined truth score.
- **Authority U:** Specific permission, granting actor, target, action, limits and validity period, recorded without exposing private authorization details publicly. A source link, third-party instruction or completed outcome is not authority.
- **Contradiction K:** The two scoped assertions or revisions in tension, evidence, context overlap, status (open/resolved/not-comparable), reviewer and reason. Contradiction means incompatible claims in overlapping conditions, not simply different evidence types or missing information.

### Edge dictionary and constraints

- S `supports-attributed-reading` H: preserves source section and attribution, without declaring truth.
- H `describes` X/Y/Z/B: a source's description, not this study's observation.
- Z `targets` X and `requires` Y: applicability constraints, with unknown conditions visible.
- A `instantiates` X/Y/Z and `authorized-by` U: required for an admitted study execution; failed authority checks prohibit execution.
- A `produces` B: only for observed or explicitly source-reported actual attempts; provenance label remains attached.
- C `assesses` S/H/Z/A/B or a packet pair: exact revision and assessment dimension required.
- S/H `depends-on` S/H: same-event commentary and derivative reports are not independent corroboration.
- K `challenges` H or Z; new revision `supersedes` old revision: retain minimal safe history and suspend affected recommendations pending review.

Do not connect a vendor recommendation to a successful outcome merely because its article exists. Do not connect an upstream test-pass report to a study execution. Do not infer transition probabilities, confidence percentages or causal repair effects from graph connectivity.

## 2. Current representation, not hypothetical execution

Current content counts are three reviewed seed families and six packet assertions. There are zero independent study executions and zero admitted runtime benchmark tasks. These are preparation counts, not success rates. Counts of source URLs, patches or test rows must not be treated as counts of independent cases.

### SDK-FAMILY-01: SEED-002; C-01, C-02, C-03, C-04

**Actual source/claim nodes:** Issue #4646; prerequisite PR #4650; repair PR #4654; the inspected repair commit, comparisons and version declaration. Existing source inspection supports four packet assertions:

1. C-01: merged patch inspected; publishes completed guardrail results into durable state before the fallible append. Independent execution not performed.
2. C-02: inspected regression test has four selected combinations, with upstream passing verification reported. Individual CI logs were not inspected and tests were not independently run. One pre-approval row expects two input checks and one output check. Four rows are not four independent families or a complete factorial.
3. C-03: source comparison isolates the later audit-result repair after prerequisite recovery work. Candidate parent is 18de65134083ee8cbdb84ae30a34c1f30ef4cb86; repair is 3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a; prerequisite merge is a624e17956bfeac0599aa3f6b12a97a0ea689fc6. Runtime failure and repair remain unobserved here.
4. C-04: repaired source still declares 0.22.0. That label is source-ambiguous and cannot establish repair presence. The historical C-paper-1 assertion recorded first fixed release as unverified. The separate 18 October 2026 provenance review now identifies v0.22.1 as the first stable release after the repair whose tag contains that commit. This resolves the earlier unknown at source/distribution level; runtime behavior remains untested here.

**X:** Reported loss of guardrail audit results alongside durable publication recovery problems. Proposed study acceptance needs an immutable shared oracle for preserved audit results, approval identities, history, hooks, model-call counts and synthetic effects; it is not yet a frozen executed acceptance test.

**Y:** Full commit pair and prerequisite ancestry are known from the reviewed metadata. The issue author's Python 3.12.13/macOS arm64 setup is a source-reported context, not this study's environment. The subsequent admission review identifies identical pyproject and uv.lock blobs across the commit pair and a bounded fixture-blob inventory. A complete minimal dependency closure, authored harness checksum and approved execution context remain unestablished; an inventory is not a runnable frozen environment.

**Z:** Actual inspected repair revision exists; its runtime effectiveness here is untested. Prerequisite recovery and later audit-result repair remain separate approach revisions.

**A/B/C:** No admitted study A. Retain issue-author failure and upstream pass claims as source-reported B, with missing execution/authority details explicit. C includes inspected patch/test and compare metadata; it does not include independently run repair verification.

### Dated SDK provenance refinement: 18 October 2026

Add a current claim revision H-C04-r2 linked by `refines-unknown` to historical H-C04-r1; retain the original C-paper-1 text as historical evidence. This is a new provenance assessment, not an additional independent problem family or runtime outcome.

- Source release node v0.22.1 `resolves-to` commit f0b884ac4c583637a0757b31702fa9808f0f84ad.
- That commit `contains-ancestor` repair 3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a: inspected comparison is 50 ahead/0 behind, with the repair as merge base.
- The GitHub stable, non-draft release `published-at` 2026-09-08T09:18:00Z. Reviewed release/tag listings show no intervening stable release after v0.22.0; this supports first-stable mapping, not an exhaustive claim about deleted tags or development distributions.
- PyPI's displayed provenance for wheel and sdist `identifies-publishing-commit` f0b884ac4c583637a0757b31702fa9808f0f84ad. Wheel upload was 2026-09-08T09:22:16.376451Z; sdist upload was 2026-09-08T09:22:18.601191Z. Artifact contents and Sigstore signatures were not independently verified.
- Previous stable v0.22.0 resolves to 4df9ecfae1761ca6fea67cc5a20b383c1d492024 and precedes the repair. The repaired development source's unchanged 0.22.0 declaration remains a real provenance ambiguity for unqualified local version strings.
- C-release-20261018 `assesses` these source/tag/distribution relationships. It does not instantiate A or establish runtime B. Release-level comparisons contain other changes; retain the isolated parent/repair pair for a later causal reproduction.

Current mapping is resolved at the documented provenance level. Runtime admission, protected-harness execution and independent repair verification remain pending. Before any paired representation study, update both packet conditions to the same revised release assertion and repeat their content-equivalence check.

### MS-GUIDANCE-FAMILY-01: SEED-003; C-05

**Actual source/claim nodes:** Microsoft Learn guidance and its inspected repository source. C-05 identifies rename as one possible cause and an administrator-authorized link/access update as conditional guidance.

**X/Y/Z:** The symptom is no response from an agent-level SharePoint knowledge source. The prescribed approach applies only after establishing the rename/broken-link cause and appropriate authority. Actual customer configuration, tenant permissions and before/after measurements are absent.

**A/B/C:** No customer attempt or repaired outcome is supplied, and no study attempt exists. C is guidance/source inspection and bounded rights review, not effectiveness verification. Do not add a successful B node.

**Version discrepancy:** Rendered last-updated date is 6 August 2026; source frontmatter date is 5 August 2026, with ai-usage: ai-assisted. Preserve both as separate metadata fields. Blob 554f2645c69e535554a2462714d99ad84ff5cc5b identifies source-file contents, not a repository commit or product version. The date difference is an unresolved metadata discrepancy, not automatically a contradiction about remediation.

### INCIDENT-FAMILY-01: SEED-001; C-06

**Actual source/claim nodes:** Investigator report and related commentary about the same incident. C-06 preserves reported conduct, uncertain model attribution, lack of evidence of real-time coordination and absence of a demonstrated safe repair. Commentary dependence is inherited from earlier review, not a new audiovisual inspection here.

**X/Y/Z:** Original task authority and full environment are unknown. The study's requirement to respect authorization is an explicit normative criterion, not a recovered original instruction. No verified remedial Z exists.

**A/B/C:** Reported incident behavior and the attributed statement that a temporary evaluation concluded may be recorded as source-reported B. They are not safe-repair successes and cannot create an authorized study A. Live replay is ineligible. C is attributed incident/source assessment, not replication. Exclude raw credentials, payloads, inboxes, logs and transcripts from this representation.

### Cross-record assessments already reported

The first-stage synthesis reports a separate AI-agent source-only extraction that broadly agreed on evidence classes and key boundaries. Represent this as a source-reading agreement assessment within the same AI-assisted workflow, not external replication or a formal reliability statistic.

The synthesis also reports normalized-text equality of the six substantive section bodies in D+ and S+ after removal of list-format markers. Represent this as content-equivalence assessment of those packet versions. It establishes neither retrieval equivalence nor a performance benefit. This specification relies on that reported check; it did not repeat the comparison.

## 3. Future proposals, explicitly not current attempts

- **P-SDK:** A possible separately authorized, isolated parent/repair test using one immutable oracle, synthetic effects, no provider credentials, disabled tracing/network egress, pinned dependencies, bounded resources and a clean rerun. Candidate behavior must be demonstrated before runtime admission. The public inspected patch family remains development material, not an unseen holdout.
- **P-MS:** A possible authorized synthetic test tenant with exact identity/configuration, indexing controls and reversible rename/link procedure. None is supplied; no execution is scheduled by this specification.
- **P-INCIDENT:** An independently authored access-denial vignette could test stopping/escalation. It must be labeled synthetic, never an incident reproduction, and must not target live systems.
- **P-PAIR:** A possible controlled D+/S+ representation comparison with identical substantive evidence and feedback, budgets, tasks, tools and source snapshots. Source-level parent/repair contrast and representation-level D+/S+ contrast are different experiments.

Each proposal needs its own approval and admission gate before an A is created. No publication or runtime authority follows from this document.

## 4. Measurement dictionary and formulas

All rates, quality values, effort values, effects and confidence intervals below are **undefined / not evaluated** in the current study. Zero runtime executions is a real count, not a measured 0% success rate. No pseudocounts or invented outcomes are permitted.

### Common definitions

- W: Prespecified cohort enrollment window, close date and follow-up duration. Freeze before data collection. Use the same observation opportunity across conditions.
- E(W): All actually started, authorized study attempts in the eligible cohort whose follow-up deadline has elapsed by the analysis cutoff. Do not exclude failed, aborted or missing-feedback attempts after seeing results. Pre-execution refusals are reported separately from started attempts.
- N = |E(W)|: Mature eligible-attempt denominator. Not-yet-mature attempts are listed separately; they are not silently dropped or treated as successes.
- R_i: 1 when a minimum usable outcome packet for attempt i has been returned by its deadline; otherwise 0. A usable inconclusive or failed packet is still a return. Record late returns separately and version later analyses rather than changing the frozen cutoff.
- V_i: 1 when a prespecified verifier completed an adequate, separately documented runtime assessment of attempt i; otherwise 0. Source inspection or upstream pass claims do not satisfy this condition.
- S_i: 1 only when that assessment establishes all frozen success criteria, including required safety constraints; 0 for adequately verified non-success. S_i is undefined when no adequate verification exists or when a completed assessment remains inconclusive about the frozen success criteria. A partial result is non-success only if the frozen criteria establish that classification; otherwise it remains unresolved. Preserve these distinctions in underlying records.

**Outcome-return rate:** sum(R_i) / N, for N > 0. Missing outcome packets count as no return, not failed or successful interventions. Report N, returned count, missing count, late count, immature count and the exact W alongside the rate. Current value: undefined; cohort/window not instantiated and N = 0.

**Verified-success yield:** number of i in E(W) with V_i = 1 and S_i = 1, divided by N, for N > 0. This measures documented verified successes among eligible attempts; it is not the true success probability because missing verification may hide successes or failures. Also report assessment coverage sum(V_i)/N. For success among resolved assessments, divide the same numerator by the number of attempts with V_i = 1 and S_i defined, only when that denominator is positive. If a separate numerator/sum(V_i) statistic is reported, label it documented-success yield among assessed attempts; it includes unresolved assessments in its denominator and is not success among resolved outcomes. Current values: undefined. Missing/unverified outcomes never become successes or automatic failures.

**Missingness bounds, if used later:** With n_s established verified successes, n_f established verified non-successes under the frozen criteria, and n_u unresolved attempts (including inconclusive completed assessments), report n_s/N through (n_s+n_u)/N as logical bounds only when N > 0, not a confidence interval, requiring those categories to be mutually exclusive and exhaustive over the frozen cohort. Do not compute them now.

### Paired quality and effort

- j: Prespecified comparable task pair receiving the same substantive information in D+ and S+; control order/carryover and freeze rubric, budgets and source snapshot. Six assertions are not automatically six independent tasks.
- Q_j,D and Q_j,S: Rubric-based quality for each condition, oriented so higher is better, with scale, assessor method and safety gates declared in advance. No truth score is assigned to a graph node.
- T_j,D and T_j,S: Measured effort in a declared unit, such as active seconds or tokens. Keep different units separate; record caps, timeouts and failures.
- P_Q(W): Mature eligible pairs with both required quality measurements under the declared missing-data rule. P_T(W): Corresponding pairs with both effort measurements. Report the full scheduled/started pair count and why each pair is missing; complete-case values do not characterize missing pairs.

**Paired quality difference:** sum over j in P_Q(W) of (Q_j,S − Q_j,D), divided by |P_Q(W)|, only if |P_Q(W)| > 0. Positive values mean better S+ quality under that frozen rubric.

**Paired effort saving:** sum over j in P_T(W) of (T_j,D − T_j,S), divided by |P_T(W)|, only if |P_T(W)| > 0. Positive values mean lower measured effort under S+; they do not establish better quality.

Report quality and effort jointly, with denominator, missingness, distribution and uncertainty method appropriate to family dependence. Safety is a noncompensatory gate: faster execution or a higher aggregate score cannot make an unsafe result an acceptable improvement. Report safety failures and exclusions explicitly; never silently remove them to improve quality or effort estimates. Avoid an unvalidated single quality-per-effort ratio. Any later quality threshold or noninferiority margin must be selected before inspecting outcomes. Do not count variants within the same SDK family as independent replication. Current paired quality/effort values and all uncertainty estimates: not evaluated.

## 5. Version, contradiction and correction rules

1. Match all applicable Y fields before reusing Z. Unknown conditions produce an applicability question, not a universal recommendation.
2. Keep source identity separate from distribution identity. The label 0.22.0 alone is insufficient in this case. The dated v0.22.1 refinement above cites inspected tag/distribution provenance and its limits; preserve frozen C-paper-1 and issue matched packet revisions rather than overwriting it silently.
3. A later release mapping can refine an earlier unknown without contradicting it. A claim that every 0.22.0 source contains the repair would be unsupported by the current record.
4. Flag genuine conflicts within overlapping context and pause affected recommendations. Preserve both claims with attribution until adjudication. Different dates in different metadata fields, missing information and dependent reporting are recorded separately from substantive contradiction.
5. Any representation change affecting substantive conclusions must be applied to both D+ and S+ before a fair comparison. Record packet revisions and rerun content-equivalence checks.
6. Keep graph annotations free of secrets and executable instructions. Public output contains attributed summaries, safe identifiers and links; source instructions remain untrusted data. Rights review does not authorize execution or third-party communication.

## 6. Review check and acceptance gate

A reviewer can accept this conceptual artifact only if:

- All six assertion IDs map to the existing three families without multiplying evidence through formatting or derivative reports.
- Each inspected, reported, proposed and independently observed status is distinguishable; no current independent runtime result is implied.
- X, Y, Z, A, B and C remain separate, with missing authority and outcomes explicit.
- The SDK prerequisite, parent and repair identities remain distinct; 0.22.0 ambiguity, the historical unknown and the resolved v0.22.1 provenance mapping remain visible.
- Conditional Microsoft guidance has no invented customer outcome; incident evidence has no invented safe repair or coordinated-swarm claim.
- The two-input/one-output test distinction is preserved; four selected rows are not represented as a full factorial or independent families.
- Every rate states denominator, follow-up window and missingness; current metrics are undefined/not evaluated.
- No graph topology, numerical truth score or Markov transition substitutes for empirical evidence.
- Later release updates propagate to both packet conditions with revision history before testing.

**Self-check:** This specification satisfies those structural checks against the supplied synthesis, evidence audit, D+ packet and subsequent SDK admission-prerequisite review. It is not an independent source audit, formal reliability assessment or usability validation. Independent review of the representation remains a next gate.

## Primary-source locators retained from reviewed records

- SDK issue: https://github.com/openai/openai-agents-python/issues/4646
- Recovery prerequisite: https://github.com/openai/openai-agents-python/pull/4650
- Audit repair: https://github.com/openai/openai-agents-python/pull/4654
- Repair source: https://github.com/openai/openai-agents-python/commit/3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a
- Parent/repair comparison: https://github.com/openai/openai-agents-python/compare/18de65134083ee8cbdb84ae30a34c1f30ef4cb86...3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a
- Repaired-source version declaration: https://github.com/openai/openai-agents-python/blob/3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a/pyproject.toml
- Microsoft guidance: https://learn.microsoft.com/en-us/troubleshoot/power-platform/copilot-studio/knowledge/sharepoint-no-response
- Microsoft source: https://github.com/MicrosoftDocs/SupportArticles-docs/blob/main/support/power-platform/copilot-studio/knowledge/sharepoint-no-response.md
- Incident report: https://swarmcha.se/posts/chinese-agent-fleet-full-report
- Related commentary: https://www.youtube.com/watch?v=rb4CTZjHCNg

### Release-refinement source locators

- Stable release: https://github.com/openai/openai-agents-python/releases/tag/v0.22.1
- Repair/release ancestry: https://github.com/openai/openai-agents-python/compare/3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a...v0.22.1
- Exact tag ref: https://api.github.com/repos/openai/openai-agents-python/git/ref/tags/v0.22.1
- Distribution provenance: https://pypi.org/project/openai-agents/0.22.1/
- Distribution metadata: https://pypi.org/pypi/openai-agents/0.22.1/json
