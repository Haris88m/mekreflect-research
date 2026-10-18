# What Public Agent Benchmarks Establish About Authorization and Policy Compliance: An Evidence Review v0.1

MEKreflect | Documentary pilot | Source cutoff: 2026-10-18

No benchmark runs, model calls for evaluation, or software installations; no empirical performance reproduced.

**Status:** Prepared for review. Not externally published.

## Executive finding

These benchmarks can inform different pieces of an agent policy, but the reviewed evidence does not establish end-to-end authorization compliance. In particular, original τ-bench acknowledges that a passing outcome can omit required confirmation. [T1](https://arxiv.org/html/2406.12045v1)

MEKreflect’s contribution here is a source-linked documentary assessment and an explicitly untested policy proposal. It is not a model ranking or a certification.

## Scope and method

Purposive three-benchmark document analysis supporting evidence-backed AI policies; not a systematic literature review, benchmark ranking, safety certification, or conformity assessment.

Read relevant paper design/scoring/limitations sections and official repository/documentation pages, including displayed API excerpts. Code each dimension against the cited locator. This is a document-level review, not an exhaustive task-by-task or code-level audit. not_reported means not established in this reviewed source set, never proven absence. All status assignments and policy implications are MEKreflect analysis, not author endorsements.

### Included
- Named benchmark has a primary paper and official implementation/documentation.
- Evidence concerns tool-using agents and at least one of adversarial instructions, harmful requests, or domain-policy compliance.
- Versioned papers anchor historical claims; current official documentation is explicitly separated.

### Excluded
- Later τ²-bench/τ³-bench capabilities and fixes.
- Secondary commentary as evidence; live-service execution; new model experiments.
- Cross-benchmark score aggregation, causal claims, deployment guarantees.
- Private data, proprietary evaluation records and third-party publication.

### Reading the coverage labels
- **documented**: Cited material directly specifies the stated feature; not evidence of comprehensive effectiveness.
- **partially_documented**: Related feature or limited implementation is documented, but coverage or inference remains incomplete.
- **not_reported**: Not established in the reviewed cited material; absence of documentation is not absence of capability.
- **not_applicable**: Outside the stated construct for this comparison; not a quality judgment.

Labels describe evidence available for each dimension, not scores or a common scale. In particular, repeatability concerns experimental rerun support; pass^k instead measures consistency of task success across trials.

## Prior art and infrastructure

BenchmarkCards is prior art for standardized benchmark documentation. MEKreflect makes no claim to have invented benchmark cards; this pilot adds a narrow authorization-focused evidence-to-policy mapping. [B1](https://arxiv.org/abs/2410.12974v3)

Inspect supplies evaluation infrastructure such as tasks, tools and scorers. Use of Inspect is not itself a benchmark result or certification. [I1](https://inspect.aisi.org.uk/)

## Evidence cards

### AgentDojo

**Identity:** arXiv:2406.13352v3 (2024-11-24). [Official repository](https://github.com/ethz-spylab/agentdojo).

**Revision boundary:** Repository identity verified; immutable commit not captured. Current documentation is supplementary, not assumed identical to paper.

**Author-reported evidence:** Paper describes an extensible attack environment; official results expose configuration-specific outcomes. No numerical result is reproduced here. [D1](https://arxiv.org/html/2406.13352v3) [D2](https://agentdojo.spylab.ai/results/) [D3](https://github.com/ethz-spylab/agentdojo) [D4](https://agentdojo.spylab.ai/concepts/task_suite_and_tasks/) [D5](https://agentdojo.spylab.ai/api/base_tasks/)

**MEKreflect assessment:** Useful evidence about the boundary between user intent and attacker-controlled content. A low attack-success figure alone cannot establish general approval compliance.

**Does not establish:** Exhaustive authorization lifecycle coverage, live-service protection, or universal safety.

**Next evidence needed:** Pin revision and enumerate which included tasks and scorers actually test each approval boundary.

### AgentHarm

**Identity:** arXiv:2410.09024v3 (2025-04-18). [Official repository](https://github.com/UKGovernmentBEIS/inspect_evals/tree/main/src/inspect_evals/agentharm).

**Revision boundary:** Official implementation identity verified; commit not captured. Viewed changelog includes 6-B as recommended version alongside other entries; no version was installed or selected for execution.

**Author-reported evidence:** Authors describe synthetic proxy tasks and capability-sensitive harmful-completion scoring. This review does not validate their empirical performance. [H1](https://arxiv.org/html/2410.09024v3) [H2](https://ukgovernmentbeis.github.io/inspect_evals/evals/agentharm/) [H3](https://github.com/UKGovernmentBEIS/inspect_evals/tree/main/src/inspect_evals/agentharm)

**MEKreflect assessment:** Misuse resistance is a distinct requirement from respecting a legitimate user’s approval. Authorization cannot make a prohibited action safe.

**Does not establish:** Real-world harmful capability, compliant benign approval handling, or recovery after external damage.

**Next evidence needed:** Pin implementation, dataset split and judges; verify intended-versus-executed call handling before any comparison.

### Original τ-bench

**Identity:** arXiv:2406.12045v1 (2024-06-17). [Official repository](https://github.com/sierra-research/tau-bench).

**Revision boundary:** Original repository identity verified; commit not captured. Later τ²-bench and τ³-bench are excluded, including later task fixes.

**Author-reported evidence:** Authors explicitly distinguish successful reward from full policy compliance. Current repository warns that original tasks are outdated. [T1](https://arxiv.org/html/2406.12045v1) [T2](https://github.com/sierra-research/tau-bench) [T3](https://raw.githubusercontent.com/sierra-research/tau-bench/main/tau_bench/envs/retail/wiki.md)

**MEKreflect assessment:** The clearest policy-evidence gap in this pilot is that an outcome metric need not verify the approval procedure that produced it.

**Does not establish:** Universal policy adherence from pass^k or final database correctness, or equivalence with successor benchmarks.

**Next evidence needed:** Add separately validated pre-action approval and revocation checks to an immutable original configuration.

## Coverage matrix

Every cell is documentary coding. Source locators identify the reviewed material, including where a feature was not established. Current documentation is not silently projected back onto historical experiments.

| Dimension | AgentDojo | AgentHarm | Original τ-bench |
|---|---|---|---|
| Construct measured | **documented** — Indirect prompt-injection robustness in stateful tool use. [D1](https://arxiv.org/html/2406.13352v3) (§§3.1–3.3) | **documented** — Direct malicious-user requests and jailbreak resistance. [H1](https://arxiv.org/html/2410.09024v3) (§2) | **documented** — Policy-guided tool use with simulated users. [T1](https://arxiv.org/html/2406.12045v1) (§3) |
| Explicit authorization | **partially_documented** — User-task intent is explicit; separate action-approval coverage is unspecified. [D1](https://arxiv.org/html/2406.13352v3) (§3.1 User tasks) | **partially_documented** — Direct requests specify intent, not a benign approval protocol. [H1](https://arxiv.org/html/2410.09024v3) (§§2, 3.1.1) | **documented** — Retail policy requires detailed action disclosure and affirmative confirmation before consequential database updates. [T1](https://arxiv.org/html/2406.12045v1) (Appendix B.1, Retail policies, opening rules) |
| Changed authorization | **not_reported** — No changed-approval test class identified in reviewed task design. [D1](https://arxiv.org/html/2406.13352v3) (§3.1) | **not_reported** — No changed-approval test class identified in reviewed behavior design. [H1](https://arxiv.org/html/2410.09024v3) (§3.1.1) | **not_reported** — Dynamic dialogue alone does not establish changed-approval tests; dedicated coverage was not identified in the reviewed design. [T1](https://arxiv.org/html/2406.12045v1) (§3 User simulation) |
| Revoked authorization | **not_reported** — Revocation coverage not established by reviewed task specification. [D1](https://arxiv.org/html/2406.13352v3) (§3.1) | **not_reported** — Revocation coverage not established by reviewed behavior specification. [H1](https://arxiv.org/html/2410.09024v3) (§3.1.1) | **not_reported** — Dedicated revocation checks not identified in reviewed reward definition. [T1](https://arxiv.org/html/2406.12045v1) (§3 Reward) |
| Untrusted instructions | **documented** — Attacks replace untrusted tool-returned data. [D1](https://arxiv.org/html/2406.13352v3) (§3.3) | **not_applicable** — Indirect third-party injection is outside this paper’s stated direct-misuse setting. [H1](https://arxiv.org/html/2410.09024v3) (§2) | **not_reported** — Reviewed original design does not specify an adversarial tool-output injection suite. [T1](https://arxiv.org/html/2406.12045v1) (§3) |
| Consequential tool side effects | **documented** — Tools mutate simulated application state; this is not live-service execution evidence. [D1](https://arxiv.org/html/2406.13352v3) (§3.1 Environments and Tools) | **partially_documented** — Synthetic functions have no side effects; harmful execution is proxied. [H1](https://arxiv.org/html/2410.09024v3) (§3.1.2) | **documented** — APIs mutate simulated databases deterministically; live-service effects are not established. [T1](https://arxiv.org/html/2406.12045v1) (§3 Databases and APIs) |
| Final state versus trajectory checks | **partially_documented** — Current API supports optional trace-based security checks, otherwise state/output checks; per-task adoption was not audited. [D5](https://agentdojo.spylab.ai/api/base_tasks/) (security; security_from_traces) | **partially_documented** — Rubrics inspect calls/outputs; narrow semantic and refusal judges supplement them. [H1](https://arxiv.org/html/2410.09024v3) (§3.1.3) | **partially_documented** — Final database/output reward can pass despite omitted confirmation; authors explicitly acknowledge this. [T1](https://arxiv.org/html/2406.12045v1) (§3 Reward) |
| Utility preservation | **documented** — Benign utility, utility under attack, and targeted attack success are separate measures. [D2](https://agentdojo.spylab.ai/results/) (results column definitions; see also paper §3.4) | **documented** — Current documentation exposes benign counterpart evaluation separately from harmful tasks. [H2](https://ukgovernmentbeis.github.io/inspect_evals/evals/agentharm/) (agentharm_benign) | **documented** — Reward evaluates task outcomes and required information. [T1](https://arxiv.org/html/2406.12045v1) (§3 Reward) |
| Repeatability | **partially_documented** — Repository exposes model, suite, attack and defense selections; repeatability was not independently tested. [D3](https://github.com/ethz-spylab/agentdojo) (Running the benchmark) | **partially_documented** — Split, behavior filters, judges and agent settings are configurable; repeatability was not tested here. [H2](https://ukgovernmentbeis.github.io/inspect_evals/evals/agentharm/) (Parameters) | **partially_documented** — pass^k measures all-k-trials task-success reliability, not reproduction of an experiment; repeatability was not tested here. [T1](https://arxiv.org/html/2406.12045v1) (§3 Pass^k) |
| Recovery | **not_reported** — Reviewed scoring API does not specify a separate recovery-after-violation metric. [D5](https://agentdojo.spylab.ai/api/base_tasks/) (utility/security methods) | **partially_documented** — Tools support self-correction after errors; a separate post-violation recovery metric is not established, nor reversal of real harm. [H1](https://arxiv.org/html/2410.09024v3) (§3.1.2) | **not_reported** — Reviewed primary reward does not separately score recovery from an authorization violation. [T1](https://arxiv.org/html/2406.12045v1) (§3 Reward) |
| Configuration and scoring comparability | **partially_documented** — Results page warns against fair cross-model ranking because attack/defense coverage differs. [D2](https://agentdojo.spylab.ai/results/) (Note) | **partially_documented** — Current changelog alters executed-call credit and refusal-derived metrics; these revisions are not the paper configuration. [H3](https://github.com/UKGovernmentBEIS/inspect_evals/tree/main/src/inspect_evals/agentharm) (7-B and 5-B) | **partially_documented** — Current original-repository defaults allow different user models; its tasks are explicitly flagged outdated. [T2](https://github.com/sierra-research/tau-bench) (warning; User simulators) |

## Comparability limits
- Different constructs and desired score directions make a single league table misleading. Harmful-task completion, attacker success and benign success are not interchangeable.
- A benchmark score is conditional on the agent system, task distribution, tools, attack budget, prompts, model snapshot, simulator/judge and scorer implementation.
- Paper versions are pinned; repository commits and archived page snapshots are not. This is a documented reproducibility limitation and a gate before empirical reuse.
- Current AgentDojo trace hooks are not evidence that every historical task used trajectory checks.
- Original τ-bench final-state success cannot alone establish procedurally valid approval; successor results must remain separate.
- AgentHarm public release coverage and scorer revisions require denominator and implementation checks before reproducing author-reported comparisons.
- No numerical scores, confidence intervals, or rates were calculated. No effectiveness claim is based on our own experiments.

## Worked policy requirement: MR-POL-001

**Proposed and untested.** Bind consequential execution to current, specific approval

**Evidence gap → requirement:** Original τ-bench acknowledges that outcome success can omit confirmation (T1). AgentDojo motivates testing third-party attempts to redirect actions (D1). Neither fact proves the proposed control works. [T1](https://arxiv.org/html/2406.12045v1) [D1](https://arxiv.org/html/2406.13352v3)

**Bounded scope:** A synthetic customer-support agent cancelling or modifying one customer’s retail order. This is an illustrative policy design, not legal advice, certification, or a deployment authorization.

Before each consequential write, the execution gateway must verify an unexpired, unrevoked approval bound to the authenticated customer, delegated agent identity, exact action, order ID and canonical payload. Material changes require a fresh approval. Retrieved content cannot grant approval. Approval is necessary but does not override other safety or business constraints.

### Approval binding
- **actor:** Authenticated customer principal plus delegated agent principal/session
- **action:** cancel_order or modify_order; no wildcard
- **target:** Exact customer-owned order ID
- **payload:** Canonical operation parameters, item IDs, destination/refund method where relevant, and disclosed amount; bind a digest to the displayed details
- **lifecycle:** One-use identifier, issuance/expiry time, policy version and revocation state; atomically check and consume before commit

### Enforcement

An execution gateway outside the model checks ownership, allowed action, payload digest, expiry and revocation at commit time. Reject mismatches before side effects; write tamper-evident decision and commit events. Use idempotency keys. Fail closed if approval state is unavailable. This is a proposed architecture, not an implemented control.

### Acceptance tests

- **AT-1:** Exact disclosed action is approved by the authenticated user. Expected: One intended write succeeds; approval, decision and commit events correlate; task utility succeeds.

- **AT-2:** No approval, tool-output claim of approval, or approval by another principal. Expected: No write; request valid approval or deny. Log reason without exposing secrets.

- **AT-3:** Change target order, item list, destination, amount or action after approval. Expected: No write under old approval; require fresh displayed details and approval.

- **AT-4:** Revoke or expire approval after planning but before commit, including a concurrent revocation. Expected: Gateway serialization gives revocation precedence if recorded before the commit decision; no write. Record ordering evidence.

- **AT-5:** Replay approval or retry after ambiguous network response. Expected: No duplicate write; reconcile by idempotency key; never infer new approval.

- **AT-6:** Forbidden write occurs then is undone, leaving correct final state. Expected: Trajectory compliance fails despite matching final state; report containment and recovery separately.

All mandatory negative cases must produce zero unauthorized committed writes; positive controls must complete the approved operation. Check gateway events and database diff independently. Report per-case outcomes and repeated-trial distributions, not only an aggregate. No tests have been executed.

**Owner:** Proposed accountable role: deploying organization’s agent product owner; security engineering owns enforcement and independent evaluation reviews evidence. No named owner has accepted this assignment.

**Review trigger:** Review before release and whenever tools, policy, identity/approval mechanisms, model/scaffold, scorer or benchmark revision changes; review immediately after any authorization incident.

## Open questions
- Which exact task IDs distinguish missing, changed and revoked approval at the moment of execution?
- Which task scorers detect a forbidden intermediate action that leaves no final-state difference?
- What is the immutable repository and dataset revision corresponding to each published result?
- How should legitimate utility be preserved when approval is unavailable, ambiguous or revoked?
- How robust are simulator and judge decisions to changed models, prompts and adversarial content?
- Which real side effects require irreversible-action tests beyond these simulations?
- Can a second reviewer independently recode the matrix and resolve disagreements before publication?

## Source register

All sources accessed 18 October 2026. Web pages and branch references are mutable. Versioned paper identities are the historical anchors; no immutable implementation snapshot was captured.
- **D1** — [AgentDojo paper, v3, 24 November 2024; §§3.1–3.4](https://arxiv.org/html/2406.13352v3)
- **D2** — [AgentDojo official results; comparison warning and trace access](https://agentdojo.spylab.ai/results/)
- **D3** — [AgentDojo official repository; README and configuration example](https://github.com/ethz-spylab/agentdojo)
- **D4** — [AgentDojo current task documentation; User tasks and trace checks](https://agentdojo.spylab.ai/concepts/task_suite_and_tasks/)
- **D5** — [AgentDojo current API; security and security_from_traces](https://agentdojo.spylab.ai/api/base_tasks/)
- **H1** — [AgentHarm paper, v3, 18 April 2025; §§2–3.2, 4.1](https://arxiv.org/html/2410.09024v3)
- **H2** — [AgentHarm official Inspect Evals documentation; parameters and release note](https://ukgovernmentbeis.github.io/inspect_evals/evals/agentharm/)
- **H3** — [AgentHarm official implementation; changelog](https://github.com/UKGovernmentBEIS/inspect_evals/tree/main/src/inspect_evals/agentharm)
- **T1** — [Original τ-bench paper, v1, 17 June 2024; §§3, 6 and Appendix B](https://arxiv.org/html/2406.12045v1)
- **T2** — [Original τ-bench official repository; warning and user-simulator settings](https://github.com/sierra-research/tau-bench)
- **T3** — [Original τ-bench repository retail policy; confirmation and identity rules](https://raw.githubusercontent.com/sierra-research/tau-bench/main/tau_bench/envs/retail/wiki.md)
- **B1** — [BenchmarkCards, arXiv:2410.12974v3, 2 June 2025; abstract](https://arxiv.org/abs/2410.12974v3)
- **I1** — [Inspect official documentation; Welcome and components](https://inspect.aisi.org.uk/)
