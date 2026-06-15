import { Locator, Page } from '@playwright/test';

export class MaintenancePage {
  readonly page: Page;
  readonly heading: Locator;
  readonly refreshButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Đang bảo trì', exact: true });
    this.refreshButton = page.getByRole('button', { name: 'Kiểm tra lại', exact: true });
  }

  async navigate() {
    await this.page.goto('/maintenance');
  }

  async refresh() {
    await this.refreshButton.click();
  }
}
