// Captured live 2026-07-20 - the REAL current values on the one shared account this suite uses.
// Tests that must temporarily change Company/Role/Full name revert to these exact values
// afterward via a fixture teardown.
export const ORIGINAL = {
  fullName: 'Naiemul Hasan Naiem',
  company: '',
  role: '',
};

export const TEMP_COMPANY_FOR_PERSISTENCE_CHECK = 'QA Persistence Check Co';

// Emoji + special characters for TestRail case 62152.
export const EMOJI_NAME = 'Naiemul 🚀 Hasan-Naiem (QA)';

// Deliberately wrong current password - the update should be rejected before ever touching the
// real password, so no real credential is needed here.
export const WRONG_CURRENT_PASSWORD = 'definitely-the-wrong-password-123';
export const NEW_PASSWORD_CANDIDATE = 'Qa-New-Password-Candidate-987!';
