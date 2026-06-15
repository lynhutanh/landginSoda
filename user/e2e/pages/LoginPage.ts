import { Locator, Page } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailOrUsernameInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly forgotPasswordLink: Locator;
  readonly registerLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailOrUsernameInput = page.locator('#login-email-or-username');
    this.passwordInput = page.locator('#login-password');
    this.submitButton = page.locator('button[type="submit"]');
    this.forgotPasswordLink = page.getByRole('link', { name: 'Quên mật khẩu?', exact: true });
    this.registerLink = page.getByRole('link', { name: 'Đăng ký ngay', exact: true });
  }

  async navigate() {
    await this.page.goto('/auth/login');
  }

  async login(emailOrUsername: string, password: string) {
    await this.emailOrUsernameInput.fill(emailOrUsername);
    await this.passwordInput.fill(password);
    
    // Mitigate Safari/WebKit aggressive credentials autofill clearing username field
    const currentVal = await this.emailOrUsernameInput.inputValue();
    if (currentVal !== emailOrUsername) {
      await this.emailOrUsernameInput.fill(emailOrUsername);
    }
    
    await this.submitButton.click();
  }
}
