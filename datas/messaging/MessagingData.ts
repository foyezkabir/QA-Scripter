export const AGENT_ID = 'ae4ba9b2-1add-482c-a053-200b729200bd';

export const EXPECTED = {
  pageHeading: 'Messaging',
  connectedChannelsHeading: 'Connected channels',
};

// Fabricated Azure Bot credentials - confirmed live that Teams Connect saves without synchronous
// validation against Azure, so these never need to resolve to a real bot (see findings/messaging.txt).
export const fakeTeamsCredentials = () => ({
  appId: '00000000-0000-0000-0000-000000000001',
  tenantId: 'common',
  appPassword: 'dummy-app-password-value',
});

// Same shape, deliberately invalid Tenant ID - for TestRail case 62072.
export const fakeTeamsCredentialsWithInvalidTenant = () => ({
  appId: '00000000-0000-0000-0000-000000000001',
  tenantId: 'this-is-not-a-valid-tenant-id-!!!',
  appPassword: 'dummy-app-password-value',
});
