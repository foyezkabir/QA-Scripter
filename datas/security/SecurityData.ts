export const AGENT_ID = 'ae4ba9b2-1add-482c-a053-200b729200bd';

// A syntactically-valid but non-existent agent id - reused from the same pattern already proven
// in datas/skills/SkillsData.ts (case 62040) against a different route for this section's own
// TestRail case (62122).
export const INVALID_AGENT_ID = '00000000-0000-0000-0000-000000000000';

export const EXPECTED = {
  agentNotFoundHeading: 'Agent not found',
  agentNotFoundText: "This agent doesn't exist or you don't have access to it.",
};

// Same secret-shape pattern as tests/chat.spec.ts TC-18 (sk-* keys, Bearer tokens, long hex/base64
// blobs) - reused here for a broader sweep across multiple already-explored pages, not just Chat.
export const SECRET_PATTERN = /sk-[a-zA-Z0-9]{10,}|Bearer\s+[A-Za-z0-9._-]{10,}|\b[a-f0-9]{32,}\b/;
