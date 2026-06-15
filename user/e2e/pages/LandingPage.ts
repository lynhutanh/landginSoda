import { Locator, Page } from '@playwright/test';

export class LandingPage {
  readonly page: Page;
  readonly loginLink: Locator;
  readonly registerLink: Locator;
  readonly startForFreeButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginLink = page.getByRole('link', { name: 'Đăng nhập', exact: true }).first();
    this.registerLink = page.getByRole('link', { name: 'Đăng ký', exact: true }).first();
    this.startForFreeButton = page.getByRole('link', { name: 'Bắt đầu miễn phí' });
  }

  async navigate() {
    await this.page.goto('/');
  }
}
