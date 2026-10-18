# SDK admission prerequisites: release provenance and protected-oracle design

18 October 2026 UTC · Read-only source review · Public-safe research brief

## Result

**Release mapping resolved; runtime admission remains pending.** OpenAI Agents Python **0.22.1** is the first stable release after the repair whose tag contains commit `3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a`. Official PyPI provenance ties its wheel and source distribution to the same tag commit. This is source/distribution provenance, not independent verification that the software passes the proposed experiment.

No dependencies were installed, SDK code or tests executed, model/provider calls made, money spent, live incidents replayed, or external communications sent. Local shell use read supplied research and wrote this brief. Prior audits informed this review; it is not blinded review.

## 1. Exact release evidence

- Repair: [commit 3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a](https://github.com/openai/openai-agents-python/commit/3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a), dated 2026-08-26 02:07:02 UTC.
- Previous stable tag `v0.22.0`: annotated tag object `a3f6c1a8c211f9b089aff900f704c1c8e488773b` resolves to commit `4df9ecfae1761ca6fea67cc5a20b383c1d492024`. [Tag object](https://api.github.com/repos/openai/openai-agents-python/git/tags/a3f6c1a8c211f9b089aff900f704c1c8e488773b). Comparing repair → v0.22.0 returns behind, 0 ahead/57 behind, with v0.22.0 as merge base. [Comparison](https://github.com/openai/openai-agents-python/compare/3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a...v0.22.0).
- `v0.22.1` resolves directly to `f0b884ac4c583637a0757b31702fa9808f0f84ad`. [Tag ref](https://api.github.com/repos/openai/openai-agents-python/git/ref/tags/v0.22.1). Comparing repair → v0.22.1 returns ahead, 50 ahead/0 behind, with the exact repair as merge base. [Comparison](https://github.com/openai/openai-agents-python/compare/3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a...v0.22.1).
- [GitHub release](https://github.com/openai/openai-agents-python/releases/tag/v0.22.1) published at **2026-09-08T09:18:00Z**, non-draft/non-prerelease. Its notes explicitly include both #4650 and #4654. The [latest 100 release records](https://api.github.com/repos/openai/openai-agents-python/releases?per_page=100) show no intervening release between v0.22.0 (August 19) and v0.22.1. All [v0.22 tag refs](https://api.github.com/repos/openai/openai-agents-python/git/matching-refs/tags/v0.22) are .0, .1, .2 and .3. This supports the first-stable mapping; it is not an exhaustive assertion about deleted tags or every possible development distribution.
- [PyPI 0.22.1](https://pypi.org/project/openai-agents/0.22.1/) displays verified publishing provenance for **both artifacts** identifying the repository and publishing commit `f0b884ac4c583637a0757b31702fa9808f0f84ad`, matching the tag above. It links [publishing run 34209227175, attempt 1](https://github.com/openai/openai-agents-python/actions/runs/34209227175/attempts/1). We inspected displayed provenance, not independently verified Sigstore signatures or downloaded artifact contents.
- [PyPI JSON](https://pypi.org/pypi/openai-agents/0.22.1/json): wheel `openai_agents-0.22.1-py3-none-any.whl` uploaded **2026-09-08T09:22:16.376451Z**, SHA-256 `41e09c74ac8a1de4735a16f687b544a9c4a611602bc83a83dccad0e28b955615`; sdist `openai_agents-0.22.1.tar.gz` uploaded **2026-09-08T09:22:18.601191Z**, SHA-256 `bf2fedeb2799bc40f069a8ef2648836cd88c42d4a762ce93edf8924240d741c1`. Both reported not yanked.

The [repair's pyproject](https://github.com/openai/openai-agents-python/blob/3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a/pyproject.toml) still declares 0.22.0. A local package version string therefore cannot identify the source state. Release-level upgrade comparisons would also introduce many other changes; use the isolated commit pair for causal reproduction.

## 2. Dependency and fixture freeze

Candidate baseline is `18de65134083ee8cbdb84ae30a34c1f30ef4cb86`; repair is `3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a`. Prior ancestry audit established that baseline already contains recovery prerequisite #4650. The repair changes only two runner files and one regression-test file.

Freshly inspected [baseline tree](https://api.github.com/repos/openai/openai-agents-python/git/trees/18de65134083ee8cbdb84ae30a34c1f30ef4cb86) and [repair tree](https://api.github.com/repos/openai/openai-agents-python/git/trees/3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a) have **identical** `pyproject.toml` blob `db7a3a6195f294676a16f6160a7c4f8c9777436a` and `uv.lock` blob `8db8ff84b856d3ec8f906c6ef222609a215f1d20` (854,167 bytes). [Pinned lock](https://github.com/openai/openai-agents-python/blob/3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a/uv.lock).

Lock format version 1, revision 3, requires Python >=3.10; marker branches include 3.12–3.13. Relevant locked entries: openai 3.0.0, pydantic 2.12.3, griffelib 2.0.1, typing-extensions 4.14.1, requests 2.34.2, websockets 15.0.1, mcp 2.0.0, pytest 8.4.1, pytest-asyncio 1.1.0, pytest-mock 3.14.1. These are a selected inventory, **not a complete minimal dependency closure**. The lock includes package artifact hashes and many unrelated development/optional packages. Build-system requirement `hatchling` is unpinned in pyproject and has no package entry in the inspected lock. Neither uv nor an exact interpreter build is frozen by this inventory. Do not re-resolve broad ranges or install all extras as a shortcut.

Proposed future environment: exact Python 3.12.13, following the issue's reported interpreter, with OS/architecture, interpreter artifact, installer version, selected transitive wheels and hashes recorded. This is a proposal, not an available or tested environment. Freeze a minimal test closure separately; either pin build tools or use a reviewed source-path method that avoids building. Both commit conditions must use the same resolved dependency artifacts.

Pinned fixture/source identities at the repair:

- [Regression test](https://github.com/openai/openai-agents-python/blob/3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a/tests/test_runner_guardrail_resume.py): blob `975efbceda92f483c62eacc6ffab499b92dbf4ec`.
- [Response constructors](https://github.com/openai/openai-agents-python/blob/3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a/tests/test_responses.py): `fbb38e40725bb42c8ed278018b685e2b93be53eb`.
- [In-memory session](https://github.com/openai/openai-agents-python/blob/3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a/tests/utils/simple_session.py): `94bcc97e9ebe78fea38c34fb48ceefc1358fcf97`.
- [Scripted-model implementation](https://github.com/openai/openai-agents-python/blob/3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a/src/agents/testing/model.py): tree-recorded blob `d14576ee2608fda6681156fb7cd8dc117c608a0f`; full implementation not audited in this pass.
- [Test configuration](https://github.com/openai/openai-agents-python/blob/3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a/tests/conftest.py): `8e83cafa70c578ecbdc04315019432f5d6a84461`. It substitutes failing methods for the two OpenAI model implementations unless explicitly opted out and uses a testing trace processor. It only inserts a dummy key when an ambient key is absent; consequently it is **not credential sanitization or network isolation**. A future executor must clear inherited credentials and independently deny network egress.

The [repository MIT license](https://github.com/openai/openai-agents-python/blob/3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a/LICENSE), blob `e5ad2c5aa30343f143a5c418004ca1a8d2cfaff4`, covers the repository software with copyright/permission-notice preservation. The recursive tree has no additional LICENSE/NOTICE-named files. The inspected regression fixtures are synthetic local counters, response constructors and memory state, without real payment, notification or personal data. No contrary notice was found in inspected fixture files. This is bounded reuse evidence, not complete dependency-license clearance. Do not copy separately hosted gist content or issue prose under an assumed MIT grant. Review selected dependency licenses before redistributing a bundle.

## 3. Smallest protected same-oracle plan (not executed)

Use the same immutable external test artifact against baseline and repair. Do not compare each commit's own test suite. Keep the public, already-inspected regression family labeled development material; it cannot become an unseen generalization holdout.

Minimum first row: non-streamed failure and recovery, live state, append fails before commit, pre-approval guardrails disabled. Approve only the first synthetic tool; leave the second approval unresolved. The approved effect increments a local counter and returns a fixed receipt. The second tool fails loudly if called. Use ScriptedModel only and tracing disabled.

Freeze assertions at each checkpoint:

1. First resume raises the exact injected append exception. Durable state already contains one input and one output audit result with expected diagnostic values. Effect/input/output counters are each one; start/end hooks each one; scripted model call count one; remaining approval identity is the second call. Persisted history has the first call but no output before recovery.
2. Retry recovers history with exactly one first-call output, preserves audit results in public result and durable state, leaves only the second approval, and performs no additional effect, guardrail, hook or model call.
3. Explicitly reject the remaining synthetic approval; completion yields the scripted final response, preserves both audit collections, includes exactly one call/output pair for each call in session, result and final model input, leaves counters/hooks unchanged and model call count exactly two.

A baseline failure must be the designated audit-preservation assertion after the injected failure, not an import, dependency, setup, timeout or unrelated recovery failure. The repaired source must pass the same assertions. Broader claims require the other three inspected matrix rows, including JSON round-trip, streaming direction changes, commit-then-raise and the pre-approval row where two input checks are intentional. Four rows remain one family, not four independent cases.

Before admitting a repair candidate, require negative controls:

- No injected persistence failure: both sources satisfy the basic synthetic workflow (separates setup failure from target bug).
- Unapproved tool remains a tripwire; no invented approval or blanket approval can pass.
- Evaluator-owned corrupted-result fixtures: missing input/output audit entry, duplicate tool output, duplicate effect counter and unauthorized-tool counter must each be rejected by the checker. This validates checker sensitivity without treating deliberate source mutations as a successful repair.
- Import-path/source-identity checks prevent both conditions accidentally importing the installed repaired package. Reject edited oracle files, relaxed assertions, skips, xfails and missing test collection.

Protect oracle/fixtures outside the writable candidate tree; record SHA-256 of the final authored harness and resolved environment manifest, collect raw local results, and require a separate reviewer. Exact harness checksum is still **unknown because no harness was authored or executed**. Network egress denied, empty credentials, bounded time/memory/process limits, no provider opt-ins, no external tracing and abort on any attempted network access are execution prerequisites.

## 4. What changed and what still blocks admission

Resolved: first-stable release/tag ancestry; exact GitHub timestamp and PyPI upload times/artifact hashes; displayed distribution provenance; identical lock/pyproject across the isolated pair; fixture blob inventory and bounded rights evidence; a concrete minimal oracle/control specification.

Pending: selected dependency closure and licenses; exact interpreter/build-tool artifacts; complete imported-fixture audit; authored, hashed and independently reviewed protected harness; approved isolated executor/resource ceiling; baseline fails for the intended reason and repair passes; checker negative controls actually exercised. **Zero independent reproductions, zero admitted execution cases, zero performance scores.** Release mapping no longer blocks source applicability, but does not clear the runtime gate.

## Journal-ready paragraph

The SDK release mapping is now source-verified: 0.22.1 is the first stable release after the repair, and its tag contains commit 3603dc92c90d0d9aebf382e6c0e7dbc6b22d430a. GitHub published it on September 8, 2026 at 09:18:00 UTC; PyPI records wheel upload at 09:22:16.376451 UTC and ties both artifacts to tag commit f0b884ac4c583637a0757b31702fa9808f0f84ad. The preceding 0.22.0 tag lacks the repair despite the repaired development source still displaying version 0.22.0. This establishes release provenance, not independently verified runtime behavior. The baseline and repair also share an identical dependency lock; isolated reproduction and protected-oracle review remain pending.
