import { test, expect } from '@playwright/test';
import { chromium as playwrightExtra } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { RegistrationPage } from '../pages/RegistrationPage';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { MyAccountPage } from '../pages/MyAccountPage';

// Apply stealth plugin
playwrightExtra.use(StealthPlugin());

// Generate random email for registration
const randomEmail = `testuser${Date.now()}@example.com`;
const password = 'TestPassword123!';

test('Complete user journey with POM', async () => {
  test.setTimeout(300000); // Set timeout to 5 minutes
  
  // Launch browser with stealth and slower speed
  const browser = await playwrightExtra.launch({ 
    headless: false,
    args: ['--disable-blink-features=AutomationControlled'],
    slowMo: 500
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // Initialize page objects
  const registrationPage = new RegistrationPage(page);
  const loginPage = new LoginPage(page);
  const productsPage = new ProductsPage(page);
  const cartPage = new CartPage(page);
  const checkoutPage = new CheckoutPage(page);
  const myAccountPage = new MyAccountPage(page);

  // Step 1: Navigate to website
  await page.goto('https://demo.nopcommerce.com/', { waitUntil: 'networkidle', timeout: 60000 });
  console.log('Step 1 complete: Navigated to nopCommerce');

  // Step 2: Register a new user
  await registrationPage.registerUser('Test', 'User', randomEmail, password);
  console.log(`Step 2 complete: User registered successfully: ${randomEmail}`);

  // Step 3: Log out and log back in
  await loginPage.logout();
  console.log('Logged out');
  
  await loginPage.navigateToLogin();
  await loginPage.login(randomEmail, password);
  console.log('Step 3 complete: Logged in successfully');

  // Step 4-5: Navigate to Computers > Desktops
  await productsPage.navigateToComputersDesktops();
  console.log('Step 4-5 complete: Clicked on Computers Tab and selected Desktops');

  // Step 6: Sort desktops by all available options
  await productsPage.sortByAllOptions();
  console.log('Step 6 complete: Sorted desktops by all available options');

  // Step 7: Add products to cart
  const productCount = await productsPage.getProductCount();
  console.log(`Found ${productCount} products`);

  // Add first product
  await productsPage.addSimpleProductToCart(2);
  console.log('Added first desktop to cart');

  // Navigate back and add second product
  await productsPage.navigateBackToDesktops();
  await productsPage.addSimpleProductToCart(1);
  console.log('Added second desktop to cart');

  // Navigate back and add configured product
  await productsPage.navigateBackToDesktops();
  await productsPage.addConfigurableProductToCart('3', '320 GB');
  console.log('Step 7 complete: Added all desktop items to cart');

  // Step 8: Validate cart and remove one item
  await cartPage.navigateToCart(3);
  
  const totalBeforeRemoval = await cartPage.getOrderTotal();
  console.log(`Total price with 3 items: ${totalBeforeRemoval}`);
  await cartPage.validateOrderTotal('$3,074.00');

  await cartPage.removeItemBySettingQuantityToZero('LE_IC_600 Picture of Lenovo');
  console.log('Removed one item from cart');

  const totalAfterRemoval = await cartPage.getOrderTotal();
  console.log(`Total price with 2 items: ${totalAfterRemoval}`);
  await cartPage.validateOrderTotal('$2,574.00');
  console.log('Step 8 complete: Removed one item and validated updated total');

  // Step 9: Proceed to checkout
  await cartPage.agreeToTermsAndCheckout();
  console.log('Step 9 complete: Checkout and validate the transaction');

  // Step 10: Fill checkout information
  await checkoutPage.fillBillingAddress('207', '1946', 'Cape Town', '1 Electric Avenue', '7441', '0215577191');
  console.log('Filled billing address');

  await checkoutPage.selectShippingMethod('Next Day Air ($0.00)');
  console.log('Selected shipping method');

  await checkoutPage.selectPaymentMethod('Credit Card Credit Card');
  console.log('Selected payment method');

  await checkoutPage.fillPaymentInformation('Card H Holder', '4309000000000000', '2', '2026', '123');
  console.log('Filled payment information');

  // Confirm order
  const orderTotal = await checkoutPage.getOrderTotal();
  console.log(`Final order total: ${orderTotal}`);
  await checkoutPage.validateOrderTotal('$2,574.00');
  
  await checkoutPage.confirmOrder();
  console.log('Confirmed order');

  await checkoutPage.validateOrderSuccess();
  console.log('Step 10 complete: Filled in all required checkout information');

  const orderNumber = await checkoutPage.getOrderNumber();
  console.log(`Order number: ${orderNumber}`);

  // Step 11: Navigate to My Account and validate order
  await myAccountPage.navigateToMyAccount();
  console.log('Navigated to My Account');

  await myAccountPage.navigateToOrders();
  console.log('Navigated to Orders page');

  await myAccountPage.validateOrderStatus('Pending');
  console.log('Validated order status: Pending');
  
  if (orderNumber) {
    await myAccountPage.validateOrderNumber(orderNumber);
    console.log(`Validated order ${orderNumber} appears in order history`);
  }

  await myAccountPage.validateOrderExists();
  console.log('Validated order total in order history: $2,574.00');
  console.log('Step 11 complete: Navigate to My Account and validate the order was created successfully');

  await browser.close();
});
