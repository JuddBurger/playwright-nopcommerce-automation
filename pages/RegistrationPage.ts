import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegistrationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToRegistration() {
    await this.page.getByRole('link', { name: 'Register' }).click();
    await expect(this.page).toHaveURL(/\/register/);
  }

  async fillRegistrationForm(firstName: string, lastName: string, email: string, password: string) {
    await this.page.getByLabel('Male', { exact: true }).check();
    await this.page.getByLabel('First name:').fill(firstName);
    await this.page.getByLabel('Last name:').fill(lastName);
    await this.page.getByLabel('Email:').fill(email);
    await this.page.getByLabel('Password:', { exact: true }).fill(password);
    await this.page.getByLabel('Confirm password:').fill(password);
  }

  async submitRegistration() {
    await this.page.getByRole('button', { name: 'Register' }).click();
    await expect(this.page.getByText('Your registration completed')).toBeVisible({ timeout: 10000 });
  }

  async registerUser(firstName: string, lastName: string, email: string, password: string) {
    await this.navigateToRegistration();
    await this.fillRegistrationForm(firstName, lastName, email, password);
    await this.submitRegistration();
  }
}
