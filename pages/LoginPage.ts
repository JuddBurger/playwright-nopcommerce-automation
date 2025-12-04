import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToLogin() {
    await this.page.getByRole('link', { name: 'Log in' }).click();
    await expect(this.page).toHaveURL(/\/login/);
  }

  async login(email: string, password: string) {
    await this.page.getByLabel('Email:').fill(email);
    await this.page.getByLabel('Password:').fill(password);
    await this.page.getByRole('button', { name: 'Log in' }).click();
    await expect(this.page.getByRole('link', { name: 'Log out' })).toBeVisible({ timeout: 10000 });
  }

  async logout() {
    await this.page.getByRole('link', { name: 'Log out' }).click();
    await expect(this.page.getByRole('link', { name: 'Log in' })).toBeVisible();
  }
}
