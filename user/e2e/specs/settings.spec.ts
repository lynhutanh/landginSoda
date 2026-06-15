import { test, expect, request } from '@playwright/test';
import { ApiHelper } from '../helpers/api-helper';
import { injectAuthSession } from '../helpers/auth-helper';
import { SettingsPage } from '../pages/SettingsPage';
import { LoginPage } from '../pages/LoginPage';
import path from 'path';

test.describe('User Settings', () => {
  let apiHelper: ApiHelper;
  let testUser: any;
  let userToken: string;
  const fixturePath = path.resolve(__dirname, '../fixtures/avatar.png');

  test.beforeEach(async () => {
    const requestContext = await request.newContext();
    apiHelper = new ApiHelper(requestContext);
    await apiHelper.cleanupTestUsers();
    
    // Generate fresh credentials dynamically for every test to avoid duplicate email/username DB constraints
    const uniqueId = Math.random().toString(36).substring(2, 7) + Date.now().toString(36).slice(-4);
    testUser = {
      name: `Settings User ${uniqueId}`,
      username: `e2e_set_${uniqueId}`,
      email: `e2e_set_${uniqueId}@example.com`,
      password: 'Password123!',
    };
    
    // Seed user programmatically
    await apiHelper.createTestUser(testUser);
    
    // Get login token
    userToken = await apiHelper.getUserToken(testUser.username, testUser.password);
  });

  test.afterEach(async () => {
    await apiHelper.cleanupTestUsers();
  });

  test('should load profile data correctly into form inputs', async ({ page, context }) => {
    await injectAuthSession(page, context, userToken);
    
    const settingsPage = new SettingsPage(page);
    await settingsPage.navigate();

    await expect(settingsPage.nameInput).toHaveValue(testUser.name);
    await expect(settingsPage.usernameInput).toHaveValue(testUser.username);
    await expect(settingsPage.emailInput).toHaveValue(testUser.email);
  });

  test('should successfully update name, email and phone', async ({ page, context }) => {
    await injectAuthSession(page, context, userToken);
    
    const settingsPage = new SettingsPage(page);
    await settingsPage.navigate();

    const uniqueId = Math.random().toString(36).substring(2, 7);
    const updatedName = `Settings User Updated ${uniqueId}`;
    const updatedEmail = `e2e_set_upd_${uniqueId}@example.com`;
    const updatedPhone = '0987654321';

    await settingsPage.updateProfile({
      name: updatedName,
      email: updatedEmail,
      phone: updatedPhone,
    });

    // Check for success notification on page body
    await expect(page.locator('body')).toContainText('Đã lưu thông tin');

    // Reload page to verify persistence and bypass client-side cache
    await page.reload();

    await expect(settingsPage.nameInput).toHaveValue(updatedName);
    await expect(settingsPage.emailInput).toHaveValue(updatedEmail);
    await expect(settingsPage.phoneInput).toHaveValue(updatedPhone);
  });

  test('should successfully upload and remove avatar image', async ({ page, context }) => {
    await injectAuthSession(page, context, userToken);
    
    const settingsPage = new SettingsPage(page);
    await settingsPage.navigate();

    // Verify initial state: "Chọn ảnh đại diện" button visible
    await expect(page.locator('button:has-text("Chọn ảnh đại diện")')).toBeVisible();

    // Upload fixture file
    await settingsPage.uploadAvatar(fixturePath);

    // Wait for the UI state to update (e.g. "Đổi ảnh khác" or "Xóa ảnh" button appears)
    await expect(page.locator('button:has-text("Đổi ảnh khác")')).toBeVisible({ timeout: 10000 });
    await expect(settingsPage.deleteAvatarBtn).toBeVisible();

    // Remove avatar
    await settingsPage.deleteAvatar();

    // Verify revert back to original state
    await expect(page.locator('button:has-text("Chọn ảnh đại diện")')).toBeVisible();
  });

  test('should successfully change password and log in with new password', async ({ page, context }) => {
    await injectAuthSession(page, context, userToken);
    
    const settingsPage = new SettingsPage(page);
    await settingsPage.navigate();

    const newPassword = 'NewPassword999!';

    await settingsPage.updateProfile({
      password: newPassword,
    });

    await expect(page.locator('body')).toContainText('Đã lưu thông tin');

    // Log out
    await page.goto('/');

    const isMobile = page.viewportSize() ? page.viewportSize()!.width < 768 : false;

    if (isMobile) {
      // Mobile logout
      const hamburger = page.locator('button:has(svg.lucide-menu), button[aria-label="Mở menu"]');
      await hamburger.click();
      const mobileDrawer = page.locator('.animate-drawer-in');
      await mobileDrawer.locator('button:has-text("Đăng xuất")').click();
    } else {
      // Desktop logout
      const userDropdown = page.locator(`button:has-text("${testUser.name}")`).first();
      await userDropdown.click();
      const logoutBtn = page.locator('div[role="menuitem"]:has-text("Đăng xuất"), button:has-text("Đăng xuất")').first();
      await logoutBtn.click();
    }

    await expect(page).toHaveURL(/\/auth\/login/);

    // Try logging in with old password (should fail)
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(testUser.username, testUser.password);
    await expect(page.locator('body')).toContainText('không đúng');

    // Try logging in with new password (should succeed)
    await loginPage.login(testUser.username, newPassword);
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Xin chào, ' + testUser.name);
  });
});
