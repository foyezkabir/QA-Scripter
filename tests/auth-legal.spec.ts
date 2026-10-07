import { test } from '../fixtures/base';

test.use({ storageState: { cookies: [], origins: [] } });

test('TC-55: Verify that the terms page is a placeholder under review', { tag: ['@regression'] }, async ({ legalPage }) => {
  await legalPage.openTerms();
  await legalPage.expectTermsPageIsOpen();
  await legalPage.expectTermsAreStillAPlaceholder();
});

test('TC-56: Verify that Go back on the terms page returns to the previous page', { tag: ['@regression'] }, async ({ signInPage, legalPage }) => {
  await signInPage.open();
  await signInPage.clickTermsLink();
  await legalPage.expectTermsPageIsOpen();
  await legalPage.clickGoBack();
  await signInPage.expectPageIsOpen();
});

test('TC-57: Verify that the privacy page is a placeholder under review', { tag: ['@regression'] }, async ({ legalPage }) => {
  await legalPage.openPrivacy();
  await legalPage.expectPrivacyPageIsOpen();
  await legalPage.expectPrivacyPolicyIsStillAPlaceholder();
});

test('TC-58: Verify that Go back on the privacy page returns to the previous page', { tag: ['@regression'] }, async ({ signInPage, legalPage }) => {
  await signInPage.open();
  await signInPage.clickPrivacyLink();
  await legalPage.expectPrivacyPageIsOpen();
  await legalPage.clickGoBack();
  await signInPage.expectPageIsOpen();
});
