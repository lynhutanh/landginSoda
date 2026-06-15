import { BrowserContext, Page } from '@playwright/test';

/**
 * Programmatically injects a JWT token into the browser context cookies
 * to bypass manual login forms in E2E tests for the User application.
 */
export async function injectAuthSession(
  page: Page,
  context: BrowserContext,
  token: string
) {
  // Inject user token cookie
  await context.addCookies([
    {
      name: 'user_token',
      value: token,
      domain: 'localhost',
      path: '/',
      httpOnly: false,
      secure: false,
      sameSite: 'Strict',
    },
  ]);
}
