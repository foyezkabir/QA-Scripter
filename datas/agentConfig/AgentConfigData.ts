export const AGENT_ID = 'ae4ba9b2-1add-482c-a053-200b729200bd';
export const AGENT_NAME = 'Rex Dev';

// Captured live 2026-07-20 - the REAL, current values on the one shared dev agent this whole
// suite depends on. Tests that must temporarily change Role/Description to prove a behavior
// revert to these exact values afterward via a fixture teardown (never Agent Name itself - too
// many other spec files key off the literal string 'Rex Dev').
export const ORIGINAL = {
  role: 'Executive Assistant',
  description: 'Answer questions, check my calendar, emails, reminders, manage Teams',
};

export const TEMP_ROLE_FOR_PERSISTENCE_CHECK = 'QA Persistence Check Role';

// Same script-inert pattern as tests/chat.spec.ts TC-19 - a distinct global flag name so the two
// checks can never false-positive off each other.
export const SCRIPT_PAYLOAD = '<script>window.__qaConfigScriptExecuted = true;</script>';
