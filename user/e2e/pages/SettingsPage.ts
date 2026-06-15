import { Locator, Page } from '@playwright/test';

export class SettingsPage {
  readonly page: Page;
  readonly fileInput: Locator;
  readonly nameInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly submitButton: Locator;
  readonly chooseAvatarBtn: Locator;
  readonly deleteAvatarBtn: Locator;
  readonly backToHomeLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.fileInput = page.locator('input[type="file"]');
    this.nameInput = page.locator('#settings-name');
    this.usernameInput = page.locator('#settings-username');
    this.passwordInput = page.locator('#settings-password');
    this.emailInput = page.locator('#settings-email');
    this.phoneInput = page.locator('#settings-phone');
    this.submitButton = page.locator('button[type="submit"]');
    this.chooseAvatarBtn = page.locator('button:has-text("Chọn ảnh đại diện"), button:has-text("Đổi ảnh khác")');
    this.deleteAvatarBtn = page.locator('button:has-text("Xóa ảnh")');
    this.backToHomeLink = page.getByRole('link', { name: 'Về trang chủ', exact: true });
  }

  async navigate() {
    await this.page.goto('/user/settings');
  }

  async updateProfile(payload: {
    name?: string;
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
  }) {
    if (payload.name !== undefined) {
      await this.nameInput.fill(payload.name);
    }
    if (payload.username !== undefined) {
      await this.usernameInput.fill(payload.username);
    }
    if (payload.email !== undefined) {
      await this.emailInput.fill(payload.email);
    }
    if (payload.phone !== undefined) {
      await this.phoneInput.fill(payload.phone);
    }
    if (payload.password !== undefined) {
      await this.passwordInput.fill(payload.password);
    }
    await this.submitButton.click();
  }

  async uploadAvatar(filePath: string) {
    // Set file input files directly
    await this.fileInput.setInputFiles(filePath);
  }

  async deleteAvatar() {
    await this.deleteAvatarBtn.click();
  }
}
