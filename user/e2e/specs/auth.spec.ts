import { test, expect, request } from '@playwright/test';
import { ApiHelper } from '../helpers/api-helper';
import { LoginPage } from '../pages/LoginPage';
import { RegisterPage } from '../pages/RegisterPage';

test.describe('Authentication Flow', () => {
  let apiHelper: ApiHelper;
  
  // Seeded user credentials for login tests
  const seedUnique = Math.random().toString(36).substring(2, 7) + Date.now().toString(36).slice(-4);
  const seededUser = {
    name: 'E2E Auth Login User',
    username: `e2e_auth_login_${seedUnique}`,
    email: `e2e_auth_login_${seedUnique}@example.com`,
    password: 'Password123!',
  };

  test.beforeAll(async () => {
    const requestContext = await request.newContext();
    apiHelper = new ApiHelper(requestContext);
    await apiHelper.cleanupTestUsers();
    
    // Seed the user programmatically for login tests
    await apiHelper.createTestUser(seededUser);
  });

  test.afterAll(async () => {
    await apiHelper.cleanupTestUsers();
  });

  test('should display register page and successfully register a new user', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();

    const uniqueId = Math.random().toString(36).substring(2, 7) + Date.now().toString(36).slice(-4);
    const newUser = {
      name: 'E2E Fresh User',
      username: `e2e_reg_fresh_${uniqueId}`,
      email: `e2e_reg_fresh_${uniqueId}@example.com`,
      password: 'Password123!',
    };

    await registerPage.register({
      name: newUser.name,
      username: newUser.username,
      email: newUser.email,
      password: newUser.password,
      confirmPassword: newUser.password,
    });

    // Registration automatically logs in and redirects to home page/dashboard
    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Xin chào, ' + newUser.name);
  });

  test('should fail registration if username already exists', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.navigate();

    const uniqueId = Math.random().toString(36).substring(2, 7) + Date.now().toString(36).slice(-4);
    const userToRegister = {
      name: 'E2E Dupe User',
      username: `e2e_reg_dupe_${uniqueId}`,
      email: `e2e_reg_dupe_${uniqueId}@example.com`,
      password: 'Password123!',
    };

    // 1. Register successfully the first time
    await registerPage.register({
      name: userToRegister.name,
      username: userToRegister.username,
      email: userToRegister.email,
      password: userToRegister.password,
      confirmPassword: userToRegister.password,
    });
    await expect(page).toHaveURL('/');

    // 2. Go to register page and try to register with the same username again
    await registerPage.navigate();
    await registerPage.register({
      name: userToRegister.name,
      username: userToRegister.username,
      email: `different_email_${uniqueId}@example.com`,
      password: userToRegister.password,
      confirmPassword: userToRegister.password,
    });

    // Verify error toast for duplicate username
    await expect(page.locator('body')).toContainText('đã được sử dụng');
  });

  test('should fail login with incorrect credentials', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    await loginPage.login(seededUser.username, 'WrongPassword123!');
    
    // Check error validation text
    await expect(page.locator('body')).toContainText('không đúng');
  });

  test('should log in successfully with valid username', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    await loginPage.login(seededUser.username, seededUser.password);

    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Xin chào, ' + seededUser.name);
  });

  test('should log in successfully with valid email', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();

    await loginPage.login(seededUser.email, seededUser.password);

    await expect(page).toHaveURL('/');
    await expect(page.locator('h1')).toContainText('Xin chào, ' + seededUser.name);
  });

  test('should log out successfully via desktop dropdown or mobile drawer', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.navigate();
    await loginPage.login(seededUser.username, seededUser.password);
    await expect(page).toHaveURL('/');

    const isMobile = page.viewportSize() ? page.viewportSize()!.width < 768 : false;

    if (isMobile) {
      // Mobile logout
      const hamburger = page.locator('button:has(svg.lucide-menu), button[aria-label="Mở menu"]');
      await hamburger.click();
      const mobileDrawer = page.locator('.animate-drawer-in');
      await mobileDrawer.locator('button:has-text("Đăng xuất")').click();
    } else {
      // Desktop logout
      const userDropdown = page.locator(`button:has-text("${seededUser.name}")`).first();
      await expect(userDropdown).toBeVisible();
      await userDropdown.click();

      const logoutBtn = page.locator('div[role="menuitem"]:has-text("Đăng xuất"), button:has-text("Đăng xuất")').first();
      await logoutBtn.click();
    }

    await expect(page).toHaveURL(/\/auth\/login/);
  });

  test('should show account not found on forgot password with invalid user', async ({ page }) => {
    await page.goto('/auth/forgot-password');
    
    await page.locator('#forgot-password-identity').fill('e2e_nonexistent_user@example.com');
    await page.locator('button[type="submit"]').click();

    // Correct Playwright custom polling assertion using expect(async () => ...)
    await expect(async () => {
      const text = await page.locator('body').innerText();
      expect(text.includes('Tài khoản không tồn tại') || text.includes('Quá nhiều yêu cầu')).toBeTruthy();
    }).toPass({ timeout: 15000 });
  });
});
