import { Locator, Page } from '@playwright/test';

export class RegisterPage {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly usernameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly loginLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.locator('#reg-name');
    this.usernameInput = page.locator('#reg-username');
    this.emailInput = page.locator('#reg-email');
    this.passwordInput = page.locator('#reg-password');
    this.confirmPasswordInput = page.locator('#reg-confirm');
    this.submitButton = page.locator('button[type="submit"]');
    this.loginLink = page.getByRole('link', { name: 'Đăng nhập', exact: true });
  }

  async navigate() {
    await this.page.goto('/auth/register');
  }

  async register(payload: {
    name: string;
    username: string;
    email: string;
    password?: string;
    confirmPassword?: string;
  }) {
    await this.nameInput.fill(payload.name);
    await this.usernameInput.fill(payload.username);
    await this.emailInput.fill(payload.email);
    await this.passwordInput.fill(payload.password || 'Password123!');
    await this.confirmPasswordInput.fill(payload.confirmPassword || payload.password || 'Password123!');
    
    // WebKit autofill handling
    const currentUsername = await this.usernameInput.inputValue();
    if (currentUsername !== payload.username) {
      await this.usernameInput.fill(payload.username);
    }
    
    await this.submitButton.click();
  }
}
