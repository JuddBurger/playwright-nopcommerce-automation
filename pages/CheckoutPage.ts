import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class CheckoutPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async fillBillingAddress(
    country: string,
    state: string,
    city: string,
    address: string,
    zip: string,
    phone: string
  ) {
    await this.page.getByLabel('Country:').selectOption(country);
    await this.page.getByLabel('State / province:').selectOption(state);
    await this.page.getByRole('textbox', { name: 'City:' }).fill(city);
    await this.page.getByRole('textbox', { name: 'Address 1:' }).fill(address);
    await this.page.getByRole('textbox', { name: 'Zip / postal code:' }).fill(zip);
    await this.page.getByRole('textbox', { name: 'Phone number:' }).fill(phone);
    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.waitForNetworkIdle();
  }

  async selectShippingMethod(shippingMethod: string) {
    await this.page.getByRole('radio', { name: shippingMethod }).check();
    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.waitForNetworkIdle();
  }

  async selectPaymentMethod(paymentMethod: string) {
    await this.page.getByRole('radio', { name: paymentMethod }).check();
    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.waitForNetworkIdle();
  }

  async fillPaymentInformation(
    cardholderName: string,
    cardNumber: string,
    expirationMonth: string,
    expirationYear: string,
    cvv: string
  ) {
    await this.page.getByRole('textbox', { name: 'Cardholder name:' }).fill(cardholderName);
    await this.page.getByRole('textbox', { name: 'Card number:' }).fill(cardNumber);
    await this.page.getByLabel('Expiration date:').selectOption(expirationMonth);
    await this.page.locator('#ExpireYear').selectOption(expirationYear);
    await this.page.getByRole('textbox', { name: 'Card code:' }).fill(cvv);
    await this.page.getByRole('button', { name: 'Continue' }).click();
    await this.waitForNetworkIdle();
  }

  async getOrderTotal(): Promise<string | null> {
    return await this.page.locator('.order-total .value-summary strong').textContent();
  }

  async validateOrderTotal(expectedTotal: string) {
    await expect(this.page.locator('.order-total .value-summary strong')).toContainText(expectedTotal);
  }

  async confirmOrder() {
    await this.page.getByRole('button', { name: 'Confirm' }).click();
    await this.waitForNetworkIdle();
  }

  async validateOrderSuccess() {
    await expect(this.page.getByText('Your order has been successfully processed!')).toBeVisible({ timeout: 10000 });
  }

  async getOrderNumber(): Promise<string | undefined> {
    const orderNumberText = await this.page.locator('.details .order-number').textContent();
    return orderNumberText?.match(/Order number: (\d+)/)?.[1];
  }
}
