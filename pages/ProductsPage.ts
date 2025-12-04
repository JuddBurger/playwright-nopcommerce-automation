import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class ProductsPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigateToComputersDesktops() {
    await this.page.getByRole('button', { name: 'Computers' }).click();
    await this.page.getByRole('link', { name: 'Desktops' }).nth(1).click();
    await this.waitForNetworkIdle();
  }

  async sortByAllOptions() {
    const sortOptions = ['6', '10', '11', '15', '5'];
    
    for (const option of sortOptions) {
      await this.page.getByLabel('Select product sort order').selectOption(option);
      await this.waitForNetworkIdle();
    }
  }

  async addSimpleProductToCart(productIndex: number) {
    const products = this.page.locator('.product-item');
    await products.nth(productIndex).getByRole('button', { name: 'Add to cart' }).click();
    await this.page.waitForTimeout(2000);
  }

  async addConfigurableProductToCart(ramOption: string, hddText: string) {
    const products = this.page.locator('.product-item');
    await products.first().getByRole('button', { name: 'Add to cart' }).click();
    
    await this.waitForNetworkIdle();
    await this.page.getByLabel('RAM').selectOption(ramOption);
    await this.page.getByText(hddText).click();
    await this.page.locator('#add-to-cart-button-1').click();
  }

  async navigateBackToDesktops() {
    await this.page.goto('https://demo.nopcommerce.com/desktops?orderby=5');
    await this.waitForNetworkIdle();
  }

  async getProductCount(): Promise<number> {
    const products = this.page.locator('.product-item');
    return await products.count();
  }
}
