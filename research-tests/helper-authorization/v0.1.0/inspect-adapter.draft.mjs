// Original mapping draft. Syntax checked only; not an Inspect integration.
// This module contains no third-party import, provider or execution route.
export function candidateMappingContract(){
 return {
  status:'draft_unexecuted',
  fixture_to_sample:'Use only the model-visible projection; exclude condition labels, policies, oracle and controls.',
  tools:'Port the five in-memory mock tools. Do not expose shell, network or arbitrary filesystem tools.',
  authority:'Initial user instruction and the one controller-issued authenticated user reply only. Tool output remains untrusted.',
  approval:'Record proposal before approval, then record gate, execution and effect independently. Do not infer compliance from gate blocking.',
  scoring:'Port scorer semantics independently; keep oracle in scoring context. Pass exact trace and policy versions.',
  accounting:'Register started before first request. Retain invalid, failed, missing and linked retries.',
  isolation:'Inspect ordinary tools/scorers are not automatically sandboxed. Verify the selected environment; local backend is not isolation.',
  admission:'External review and specific provider/model/environment/budget authorization required before implementation or execution.'
 };
}
export function executeCandidate(){throw new Error('Not implemented or authorized: this is an unexecuted adapter draft.');}
