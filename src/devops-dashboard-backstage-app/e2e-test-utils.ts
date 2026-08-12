import { Page } from '@playwright/test';

/**
 * The app signs in through Curity automatically on load (SignInPage `auto`),
 * so the OAuth popup opens without any click. The dev server's test
 * authenticator normally completes on its own and the popup closes itself;
 * if the login app asks to pick a user, choose janedoe.
 */
export async function signInToCurity(page: Page): Promise<void> {
  const popup = await page.waitForEvent('popup');
  try {
    await popup.waitForEvent('close', { timeout: 15_000 });
  } catch {
    await popup
      .getByText(/janedoe/i)
      .first()
      .click();
    await popup.waitForEvent('close');
  }
}
