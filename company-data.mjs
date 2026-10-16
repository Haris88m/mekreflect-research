export const research = [
  {
    slug: 'context-handoffs',
    title: 'Context and handoffs',
    category: 'Operational AI research',
    status: 'Implemented workflows and recorded experiments',
    summary: 'Useful AI work depends on what the next person or digital worker receives. This research examines source versions, specialist responsibilities and the uncertainty that can disappear when work moves between roles.',
    question: 'How can a handoff preserve the evidence, unresolved questions and decision context needed to carry work forward?',
    method: [
      'Start with an operational process and identify the sources, responsibilities and decisions at each stage. Give specialist workers distinct review questions, a shared source context and an explicit output contract. Reconcile their available findings rather than assuming every branch succeeds.',
      'Use fictional source packs to compare fuller and deliberately incomplete receiving contexts. Retain the actual worker outputs, inspect the structured fields separately from the prose, and replay deterministic source checks without rewriting the original response.'
    ],
    findings: [
      'A recorded hosted-AI experiment exposed a mismatch between cautious prose and actionable fields: a worker warned that updates were missing but returned an older deadline and budget ceiling in fields labelled current. The source-manifest correction cleared unsupported current fields in the downstream projection while preserving the received values and raw response.',
      'Source retrieval can resolve missing facts without resolving the whole decision. In more complex development cases, workers disagreed about whether updated sources and approved scalar values also established that finished documents had been reconciled. That disagreement remains part of the result.'
    ],
    limits: [
      'The recorded experiments use authored fictional cases, including a deliberately incomplete context condition. Source coverage does not prove correct interpretation, and matching a local integrity record is not independent authentication.'
    ],
    next: [
      'Develop independently reviewed cases and separate source availability, field currentness and finished-package readiness in the scoring. Compare useful completion and reviewer effort alongside unsupported decisions.'
    ],
    technical: ['Role-based context contracts', 'Parallel specialist review', 'Partial-failure synthesis', 'Source-version manifests', 'Field-level currentness and replay']
  },
  {
    slug: 'evidence-decisions',
    title: 'Evidence and decision rights',
    category: 'Evidence-governed workflows',
    status: 'Implemented control patterns',
    summary: 'Preparing work, approving it, attempting an action and confirming its completion are different events. This research asks how software can preserve those distinctions and keep human responsibility visible.',
    question: 'What evidence and authority should be required before a workflow advances to its next state?',
    method: [
      'Connect factual statements to source identifiers and approved wording. Keep unresolved or conflicting material separate from information permitted for a particular output. Treat retrieval as the selection of useful evidence, not a guarantee that a generated conclusion is correct.',
      'Bind completion records to the same case and its registered receipt. Recheck artifact existence, validation status and a stored digest at the state transition. Keep approval decisions separate from the executor that must enforce them.'
    ],
    findings: [
      'Inspected completion controls reject missing, changed or wrong-case receipts. A saved local test run exercised selected identity and tamper checks with temporary artifacts and in-memory state. This makes an attempted action distinguishable from a result supported by an intact record.',
      'Append-only approval records make intent and decisions inspectable, but do not themselves execute approved work. Likewise, a matching artifact digest establishes identity and consistency rather than the semantic truth of the underlying evidence.'
    ],
    limits: [
      'A tested state-transition guard covers its inspected path. Correct evidence curation, authenticated authority and enforcement by every relevant executor remain separate responsibilities.'
    ],
    next: [
      'Test stale approvals, payload changes, repeat attempts and unknown outcomes across one complete bounded workflow. Make the reason for each transition understandable to the person reviewing the work.'
    ],
    technical: ['Claim-level provenance', 'Approved output contracts', 'Identity-bound completion receipts', 'Artifact integrity checks', 'Separate policy, approval and execution']
  },
  {
    slug: 'operational-integrity',
    title: 'Operational systems and data integrity',
    category: 'Practical systems research',
    status: 'Implemented transactional mechanisms',
    summary: 'Operational errors often begin with ordinary details: an ambiguous unit, a duplicated document, an overlapping reporting period or a stock figure without a physical count. Reliable systems need to preserve those meanings, not merely display convincing totals.',
    question: 'How can a working system remain useful when source records are incomplete, repeated or uncertain?',
    method: [
      'Represent quantities as exact decimals and monetary amounts as integer minor units. Bind each event identifier to its kind and canonical payload. Return the previous result for an identical retry and reject the same identifier when its details change.',
      'Use transactions for receipt posting and paired transfers so a failure cannot leave half an operation committed. Preserve human-entered events across imports and block unresolved units from creating stock movements.',
      'Keep historical purchases separate from present stock, and observation time separate from the period being reported. Record failed collection, stale coverage and unknown amounts explicitly rather than silently treating them as zero.'
    ],
    findings: [
      'Implemented ledger mechanisms preserve unknown stock until a physical count establishes a baseline. Duplicate receipt controls, payload-bound retries and rollback tests address different ways quantities or money could be counted twice.',
      'The meaning of a record still matters after the arithmetic is correct. Recording a payment allocation does not move money or independently reconcile a bank account. An atomic transfer record does not prove physical arrival.'
    ],
    limits: [
      'The implementation supports bounded local operations, not every accounting or inventory process. Partial deliveries, in-transit stock and auditable reversals require their own workflows and acceptance checks.'
    ],
    next: [
      'Use synthetic records to exercise ambiguous units, retries, late events and partial failures. Develop correction and reconciliation procedures before expanding automation, with a clear owner for each unresolved record.'
    ],
    technical: ['Exact quantities and money', 'Canonical event payloads', 'Idempotent retries', 'Atomic commit and rollback', 'Physical baselines and source coverage']
  },
  {
    slug: 'model-evaluation',
    title: 'Model evaluation and bounded use',
    category: 'Applied model research',
    status: 'Interfaces, adaptation and numerical experiments',
    summary: 'A model earns a place in a workflow through the task it can perform and the conditions under which it fails. This research connects model interfaces, context limits, local adaptation and computational experiments to practical decisions.',
    question: 'How do a model, its information and its assumptions change a result—and when is that result useful enough to rely on?',
    method: [
      'Separate provider selection from the actual request. Build explicit failure responses for absent configuration, empty output and transport errors. Inspect which context enters the request and distinguish a conversation-turn limit from a hard token budget.',
      'Keep contextual configuration separate from parameter adaptation. Historical small-model work includes low-rank adapters, dataset revisions, training checkpoints, saved weights and local-inference packaging. Review those artifacts before drawing conclusions about capability.',
      'Evaluate the task and output contract, not only whether a request completed. Compare a base model and an adapted model under common conditions, with source rights, held-out examples and a defensible grader.',
      'Use controlled numerical experiments to examine how information choices and model assumptions alter generated outcomes. Keep input versions, fitted parameters, random seeds and replay evidence visible.'
    ],
    findings: [
      'Provider and routing checks can establish deterministic selection and failure behaviour without establishing current live-provider quality. Budget-aware routing is also different from hard spend enforcement.',
      'Preserved adapter artifacts support a concrete history of parameter-efficient training experiments. Completed training schedules and recorded loss do not establish held-out improvement. Evaluation results from a different external model cannot be attributed to a local adapter.',
      'Repeated-seed numerical work showed differing sensitivity across generated outcomes. That observation concerns conditional simulation, not measured institutional behaviour or a validated forecast.'
    ],
    limits: [
      'The inspected adaptation evidence does not establish production suitability or a reproducible quality gain. In the numerical comparisons, fitted parameters and input information both differed, so the effect of additional information was not causally isolated.'
    ],
    next: [
      'Freeze a permitted held-out task set, inspect the grader and report error, abstention, format validity, latency and resource use. Compare model assistance with deterministic rules and human review where they are credible alternatives.',
      'Investigate information and collective decisions with clearer sensitivity protocols. Hold parameters and source versions constant when isolating an input change, and distinguish reproducible simulated behaviour from external validity.'
    ],
    technical: ['Provider abstraction', 'Context limits and budget signals', 'Parameter-efficient low-rank adaptation', 'Baseline and held-out evaluation', 'Numerical sensitivity and replay']
  },
  {
    slug: 'people-methods',
    title: 'People and working methods',
    category: 'Practical AI enablement',
    status: 'Individual coaching and a proposed pilot approach',
    summary: 'Developing an AI workflow also means developing the person responsible for it. The working method should help someone brief the assistant, choose appropriate evidence, challenge an answer and decide what happens next.',
    question: 'How can operational knowledge become a repeatable AI working method that people understand and can improve?',
    method: [
      'Start with the responsibilities a person wants to carry, the inputs the assignment needs and the decisions that remain theirs. Separate essential information from useful background, and facts from assumptions.',
      'Turn that brief into role-based procedures, review questions and useful artifacts. Feedback should improve the next context, instruction or implementation rather than disappear into a conversation.',
      'Design the next stage around one bounded assignment with an agreed owner, approved material and a baseline. Combine practical coaching with a working system so the person can explain and question the result.'
    ],
    findings: [
      'In an individual coaching case, a consultant independently tried the context-first framework on a hypothetical assignment and identified the distinction between essential inputs and helpful background as useful. A follow-up operating plan and assistant instructions were delivered.',
      'That initial trial supports further investigation of the method beyond founder use. The proposed next stage connected a working archive, role-based procedures, reporting and delivery artifacts to a supervised real-work pilot.'
    ],
    limits: [
      'The completed case concerns an individual and a hypothetical exercise. Organisational pilot adoption, measured learning gains and productivity improvement have not been established by that feedback.'
    ],
    next: [
      'Agree a real assignment and review responsibilities before the pilot. Track preparation time, corrections, accepted output and review effort, and ask whether the person can explain the evidence and limitations without relying on the assistant.'
    ],
    technical: ['Context-first briefing', 'Essential inputs and background', 'Role-based operating procedures', 'Artifact-based handoffs', 'Baseline-to-pilot learning']
  }
];

export const cases = [
  {
    slug: 'current-fields-at-a-handoff',
    title: 'When the caveat does not reach the current fields',
    status: 'Recorded hosted-AI experiment with fictional inputs',
    question: 'What happens when a worker recognises missing evidence in prose but still supplies a value that software treats as current?',
    context: 'A fictional bidding workflow used a tender, amendments and operational registers. Specialist reviews fed a synthesis and a receiving decision worker. One receiving packet deliberately omitted later records, allowing inspection of the difference between the context supplied and the fields returned.',
    method: [
      'Retain the actual hosted worker responses and compare the incomplete receiving condition with a source-bound condition. Inspect warnings, scalar fields and readiness recommendations separately.',
      'Associate each current field with its required source identifiers. If the receiving packet lacks a required source, clear that field in the downstream projection, preserve its received value as unverified history and retain the untouched original response. Apply the rule selectively so an unrelated supported field is not erased.'
    ],
    observations: [
      'The incomplete-context worker explicitly warned that updates were unavailable and limited its recommendation to preparation. It nevertheless returned a superseded deadline and ceiling under fields labelled current. The observed failure was structured-field currentness, not an actual external submission.',
      'The source-bound worker retained the amended fields while holding the case for other evidence and delivery gaps. A separate unambiguously ready synthetic control reached a local mock receipt. More complex recovery cases preserved disagreement over finished-package readiness even after unknown scalar fields were resolved.'
    ],
    limits: [
      'The missing-source condition was evaluator-created. The records, approvals and receipts were fictional; the source rule checks coverage rather than interpretation or full bid readiness. Some authored readiness labels remain disputed.'
    ],
    next: [
      'Use independently reviewed cases with separate labels for current facts, reconciled documents and approval applicability. Measure useful completion and review effort as well as incorrect commitments.'
    ]
  },
  {
    slug: 'exact-records-under-retry',
    title: 'Keeping records exact when work is repeated',
    status: 'Implemented local ledger and historical contract checks',
    question: 'Can a retry, ambiguous unit or failed operation change stock or money without a valid new event?',
    context: 'A local operational ledger connected source documents, product mappings, physical counts, receipts, transfers and payment allocations. The practical requirement was to preserve evidence and uncertainty while preventing repeated processing from silently creating another purchase, movement or payment record.',
    method: [
      'Use exact decimals for quantities and integer minor units for money. Store an event identifier together with its type and canonical payload. An identical retry returns the existing result; changed details under that identifier are rejected.',
      'Commit receipts and paired transfer movements atomically. Check for an existing receipt before posting, block unresolved stock units and preserve referenced human events during imports. Test rollback after an injected failure and verify that backup creation refuses to overwrite an existing file.'
    ],
    observations: [
      'Inspected code and test contracts cover duplicate receipts, conflicting event identifiers, precise arithmetic, transactional rollback and preservation across imports. A saved local verification includes an isolated count-entry exercise; it does not turn that test entry into production stock.',
      'Historical purchases remain distinct from present inventory. Without a physical-count baseline, stock remains unknown. Payment allocation is recorded with its evidence but is not represented as payment execution or independent bank reconciliation.'
    ],
    limits: [
      'The mechanism covers a bounded local ledger. Physical arrival, partial deliveries, in-transit stock and subsequent corrections require explicit operational confirmation or additional workflows.'
    ],
    next: [
      'Develop auditable corrections and reversals, then test one reconciled period using permitted source records. Keep reporting coverage, physical confirmation and responsibility for unresolved entries visible.'
    ]
  },
  {
    slug: 'a-context-first-working-method',
    title: 'Turning a development goal into a working method',
    status: 'Individual coaching and an initial scenario trial',
    question: 'What does a person need to provide and review before an AI assistant can help with a substantive assignment?',
    context: 'An individual consultant wanted to develop a more practical way of working with AI. The coaching began with the responsibilities he wanted to practise, the information an assignment requires and the judgement that should remain with him. The initial exercise used a hypothetical consulting scenario.',
    method: [
      'Prepare a context-first framework, an input checklist and review instructions. Separate facts from assumptions and essential inputs from useful background before asking for a solution.',
      'Ask the participant to try the approach independently. Use the resulting feedback to develop a follow-up operating plan and assistant instruction block, connecting the person\'s development to a proposed archive, role-based procedures and reviewable delivery artifacts.'
    ],
    observations: [
      'The participant independently attempted the hypothetical assignment and gave substantive feedback on the value of context before solutions and the distinction between required inputs and helpful background.',
      'The follow-up plan and instructions were delivered. They proposed a real assignment selected with a manager, a permitted working archive, reporting and delivery procedures, and a supervised pilot. Delivery of the plan is complete; acceptance and implementation of that next stage are separate questions.'
    ],
    limits: [
      'This was individual coaching, not an employer commission or an organisational rollout. The feedback does not establish measured productivity, learning gains or completed team adoption.'
    ],
    next: [
      'Select one real assignment with an agreed owner, permitted information and a baseline. Observe preparation time, review effort, factual corrections and accepted output, alongside the participant\'s ability to explain and challenge the result.'
    ]
  }
];
