import { test, expect, request } from '@playwright/test';
import { ApiHelper } from '../helpers/api-helper';
import { injectAuthSession } from '../helpers/auth-helper';

test.describe('User Dashboard', () => {
  let apiHelper: ApiHelper;
  const uniqueId = Math.random().toString(36).substring(2, 7);
  const testUser = {
    name: 'Dashboard E2E User',
    username: `e2e_test_dash_${uniqueId}`,
    email: `e2e_test_dash_${uniqueId}@example.com`,
    password: 'Password123!',
  };
  let userToken: string;

  test.beforeAll(async () => {
    const requestContext = await request.newContext();
    apiHelper = new ApiHelper(requestContext);
    await apiHelper.cleanupTestUsers();
    
    // Seed user programmatically
    await apiHelper.createTestUser(testUser);
    
    // Get login token programmatically
    userToken = await apiHelper.getUserToken(testUser.username, testUser.password);
  });

  test.afterAll(async () => {
    await apiHelper.cleanupTestUsers();
  });

  test('should redirect unauthenticated user to landing page', async ({ page }) => {
    await page.goto('/');
    
    // Landing page has header text or CTA
    await expect(page.locator('h1')).toContainText('Giải pháp quản lý');
    await expect(page.locator('h1')).toContainText('cho doanh nghiệp');
  });

  test('should display authenticated dashboard when token cookie is injected', async ({ page, context }) => {
    await injectAuthSession(page, context, userToken);
    await page.goto('/');

    // Verify personalized greeting
    await expect(page.locator('h1')).toContainText('Xin chào, ' + testUser.name);
    await expect(page.locator('body')).toContainText('Tổng quan tài khoản và hoạt động gần đây của bạn.');
  });

  test('should navigate to Settings page via Settings shortcut card', async ({ page, context }) => {
    await injectAuthSession(page, context, userToken);
    await page.goto('/');

    // Scope search inside the 'main' content to select the dashboard card, ignoring hidden desktop navbar link
    const settingsCard = page.locator('main a:has-text("Cài đặt")').first();
    await expect(settingsCard).toBeVisible();
    await settingsCard.click();

    // Verify redirect to user settings page
    await expect(page).toHaveURL(/\/user\/settings/);
    await expect(page.locator('h1')).toContainText('Cài đặt tài khoản');
  });

  test('should navigate to Settings page via Profile card shortcut', async ({ page, context }) => {
    await injectAuthSession(page, context, userToken);
    await page.goto('/');

    // Locate and click the profile/account card shortcut (this is unique and only inside main content)
    const profileCard = page.locator('main a:has-text("Thông tin tài khoản")').first();
    await expect(profileCard).toBeVisible();
    await profileCard.click();

    // Verify redirect to settings page
    await expect(page).toHaveURL(/\/user\/settings/);
    await expect(page.locator('h1')).toContainText('Cài đặt tài khoản');
  });
});
