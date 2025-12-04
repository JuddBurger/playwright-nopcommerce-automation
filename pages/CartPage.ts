import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CartPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToCart(itemCount: number) {
    await this.scrollToTop();
    await this.page.waitForTimeout(500);
    await this.page.getByRole('link', { name: `Shopping cart (${itemCount})` }).click();
    await this.waitForNetworkIdle();
  }

  async getOrderTotal(): Promise<string | null> {
    return await this.page.locator('.order-total .value-summary strong').textContent();
  }

  async validateOrderTotal(expectedTotal: string) {
    await expect(this.page.locator('.order-total .value-summary strong')).toContainText(expectedTotal);
  }

  async removeItemBySettingQuantityToZero(productName: string) {
    await this.page.getByRole('row', { name: productName }).getByLabel('Qty.').click();
    await this.page.getByRole('row', { name: productName }).getByLabel('Qty.').fill('0');
    await this.page.getByRole('row', { name: productName }).getByLabel('Qty.').press('Enter');
    await this.waitForNetworkIdle();
  }

  async agreeToTermsAndCheckout() {
    await this.page.getByRole('checkbox', { name: 'I agree with the terms of' }).check();
    await this.page.getByRole('button', { name: 'Checkout' }).click();
    await this.waitForNetworkIdle();
  }
}
