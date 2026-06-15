import { test, expect, request } from '@playwright/test';
import { ApiHelper } from '../helpers/api-helper';
import { injectAuthSession } from '../helpers/auth-helper';

test.describe('Responsive Layout & Mobile Drawer Navigations', () => {
  let apiHelper: ApiHelper;
  const uniqueId = Math.random().toString(36).substring(2, 7);
  const testUser = {
    name: 'Responsive E2E User',
    username: `e2e_test_resp_${uniqueId}`,
    email: `e2e_test_resp_${uniqueId}@example.com`,
    password: 'Password123!',
  };
  let userToken: string;

  test.beforeAll(async () => {
    const requestContext = await request.newContext();
    apiHelper = new ApiHelper(requestContext);
    await apiHelper.cleanupTestUsers();
    await apiHelper.createTestUser(testUser);
    userToken = await apiHelper.getUserToken(testUser.username, testUser.password);
  });

  test.afterAll(async () => {
    await apiHelper.cleanupTestUsers();
  });

  test.describe('Desktop Viewport (1280x720)', () => {
    test.use({ viewport: { width: 1280, height: 720 } });

    test('should show desktop navbar and hide hamburger menu icon', async ({ page, context }) => {
      await injectAuthSession(page, context, userToken);
      await page.goto('/');

      // Verify desktop menu links are visible
      const desktopNav = page.locator('nav.hidden.md\\:flex');
      await expect(desktopNav).toBeVisible();
      await expect(desktopNav.getByText('Trang chủ')).toBeVisible();
      await expect(desktopNav.getByText('Cài đặt')).toBeVisible();

      // Hamburger menu button should NOT be visible
      const mobileMenuButton = page.locator('button[aria-label="Mở menu"], button[aria-label="Đóng menu"]');
      await expect(mobileMenuButton).not.toBeVisible();
    });
  });

  test.describe('Mobile Viewport (iPhone 12)', () => {
    test.use({ viewport: { width: 390, height: 844 } });

    test('should hide desktop navbar, show hamburger menu, and open responsive drawer', async ({ page, context }) => {
      await injectAuthSession(page, context, userToken);
      await page.goto('/');

      // Desktop menu should NOT be visible
      const desktopNav = page.locator('nav.hidden.md\\:flex');
      await expect(desktopNav).not.toBeVisible();

      // Mobile hamburger button should be visible
      const mobileMenuButton = page.locator('button:has(svg.lucide-menu), button[aria-label="Mở menu"]');
      await expect(mobileMenuButton).toBeVisible();

      // Click to open mobile drawer
      await mobileMenuButton.click();

      // Verify drawer wrapper is visible
      const mobileDrawer = page.locator('.animate-drawer-in');
      await expect(mobileDrawer).toBeVisible();
      
      // Verify drawer links are visible inside the mobile drawer
      await expect(mobileDrawer.getByText('Trang chủ')).toBeVisible();
      await expect(mobileDrawer.getByText('Cài đặt')).toBeVisible();
      await expect(mobileDrawer.locator('button:has-text("Đăng xuất")')).toBeVisible();

      // Navigate to Settings inside the mobile drawer
      const settingsLink = mobileDrawer.getByText('Cài đặt').first();
      await settingsLink.click();

      // Verify redirect and drawer closes
      await expect(page).toHaveURL(/\/user\/settings/);
      await expect(mobileDrawer).not.toBeVisible();
    });
  });
});
