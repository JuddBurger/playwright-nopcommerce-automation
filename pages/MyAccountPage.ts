import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class MyAccountPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToMyAccount() {
    await this.page.getByRole('banner').getByRole('link', { name: 'My account' }).click();
    await this.waitForNetworkIdle();
  }

  async navigateToOrders() {
    await this.page.locator('#main').getByRole('link', { name: 'Orders' }).click();
    await this.waitForNetworkIdle();
  }

  async validateOrderStatus(status: string) {
    await expect(this.page.getByText(`Order status: ${status}`)).toBeVisible();
  }

  async validateOrderNumber(orderNumber: string) {
    await expect(this.page.getByText(`Order Number: ${orderNumber}`)).toBeVisible();
  }

  async validateOrderExists() {
    await expect(this.page.getByText('$')).toBeVisible();
  }
}
