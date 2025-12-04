import { test, expect } from '@playwright/test';
import { chromium as playwrightExtra } from 'playwright-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { RegistrationPage } from '../pages/RegistrationPage';

// Apply stealth plugin
playwrightExtra.use(StealthPlugin());

test.describe('Negative Registration Tests', () => {
  test.setTimeout(180000); // Set timeout to 3 minutes

  test('Should show error when registering with mismatched passwords', async () => {
    // Launch browser
    const browser = await playwrightExtra.launch({ 
      headless: false,
      args: ['--disable-blink-features=AutomationControlled'],
      slowMo: 500
    });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    // Navigate to website
    await page.goto('https://demo.nopcommerce.com/', { waitUntil: 'networkidle', timeout: 60000 });
    console.log('Navigated to nopCommerce');

    // Navigate to registration page
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL(/\/register/);
    console.log('On registration page');

    // Fill registration form with mismatched passwords
    const randomEmail = `testuser${Date.now()}@example.com`;
    await page.getByLabel('Male', { exact: true }).check();
    await page.getByLabel('First name:').fill('Test');
    await page.getByLabel('Last name:').fill('User');
    await page.getByLabel('Email:').fill(randomEmail);
    await page.getByLabel('Password:', { exact: true }).fill('Password123!');
    await page.getByLabel('Confirm password:').fill('DifferentPassword123!');
    
    // Submit registration
    await page.getByRole('button', { name: 'Register' }).click();
    await page.waitForTimeout(2000);
    console.log('Attempted registration with mismatched passwords');

    // Validate error message appears
    const errorMessage = page.locator('.field-validation-error');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await errorMessage.textContent();
    console.log(`Error message displayed: ${errorText}`);

    // Verify we're still on the registration page
    await expect(page).toHaveURL(/\/register/);
    console.log('Confirmed: Still on registration page after failed registration');

    await browser.close();
  });

  test('Should show error when registering with an already existing email', async () => {
    // Launch browser
    const browser = await playwrightExtra.launch({ 
      headless: false,
      args: ['--disable-blink-features=AutomationControlled'],
      slowMo: 500
    });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    // Navigate to website
    await page.goto('https://demo.nopcommerce.com/', { waitUntil: 'networkidle', timeout: 60000 });
    console.log('Navigated to nopCommerce');

    // First registration - create a user
    const existingEmail = `existing${Date.now()}@example.com`;
    const password = 'Password123!';
    
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL(/\/register/);
    
    await page.getByLabel('Male', { exact: true }).check();
    await page.getByLabel('First name:').fill('Test');
    await page.getByLabel('Last name:').fill('User');
    await page.getByLabel('Email:').fill(existingEmail);
    await page.getByLabel('Password:', { exact: true }).fill(password);
    await page.getByLabel('Confirm password:').fill(password);
    await page.getByRole('button', { name: 'Register' }).click();
    
    await expect(page.getByText('Your registration completed')).toBeVisible({ timeout: 10000 });
    console.log(`First registration successful: ${existingEmail}`);

    // Log out
    await page.getByRole('link', { name: 'Log out' }).click();
    await page.waitForLoadState('networkidle');

    // Attempt to register again with the same email
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL(/\/register/);
    
    await page.getByLabel('Male', { exact: true }).check();
    await page.getByLabel('First name:').fill('Another');
    await page.getByLabel('Last name:').fill('User');
    await page.getByLabel('Email:').fill(existingEmail);
    await page.getByLabel('Password:', { exact: true }).fill(password);
    await page.getByLabel('Confirm password:').fill(password);
    await page.getByRole('button', { name: 'Register' }).click();
    await page.waitForTimeout(2000);
    console.log('Attempted registration with existing email');

    // Validate error message appears
    const errorMessage = page.locator('.message-error');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await errorMessage.textContent();
    console.log(`Error message displayed: ${errorText}`);
    
    // Verify error contains relevant text
    await expect(errorMessage).toContainText(/already exists/i);
    console.log('Confirmed: Error message indicates email already exists');

    await browser.close();
  });

  test('Should show error when registering with invalid email format', async () => {
    // Launch browser
    const browser = await playwrightExtra.launch({ 
      headless: false,
      args: ['--disable-blink-features=AutomationControlled'],
      slowMo: 500
    });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    // Navigate to website
    await page.goto('https://demo.nopcommerce.com/', { waitUntil: 'networkidle', timeout: 60000 });
    console.log('Navigated to nopCommerce');

    // Navigate to registration page
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL(/\/register/);
    console.log('On registration page');

    // Fill registration form with invalid email format
    await page.getByLabel('Male', { exact: true }).check();
    await page.getByLabel('First name:').fill('Test');
    await page.getByLabel('Last name:').fill('User');
    await page.getByLabel('Email:').fill('invalid-email-format');
    await page.getByLabel('Password:', { exact: true }).fill('Password123!');
    await page.getByLabel('Confirm password:').fill('Password123!');
    
    // Submit registration
    await page.getByRole('button', { name: 'Register' }).click();
    await page.waitForTimeout(2000);
    console.log('Attempted registration with invalid email format');

    // Validate error message appears
    const errorMessage = page.locator('.field-validation-error');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await errorMessage.textContent();
    console.log(`Error message displayed: ${errorText}`);

    // Verify we're still on the registration page
    await expect(page).toHaveURL(/\/register/);
    console.log('Confirmed: Still on registration page after invalid email');

    await browser.close();
  });

  test('Should show error when registering with password that does not meet requirements', async () => {
    // Launch browser
    const browser = await playwrightExtra.launch({ 
      headless: false,
      args: ['--disable-blink-features=AutomationControlled'],
      slowMo: 500
    });
    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 }
    });
    const page = await context.newPage();

    // Navigate to website
    await page.goto('https://demo.nopcommerce.com/', { waitUntil: 'networkidle', timeout: 60000 });
    console.log('Navigated to nopCommerce');

    // Navigate to registration page
    await page.getByRole('link', { name: 'Register' }).click();
    await expect(page).toHaveURL(/\/register/);
    console.log('On registration page');

    // Fill registration form with weak password (too short)
    const randomEmail = `testuser${Date.now()}@example.com`;
    await page.getByLabel('Male', { exact: true }).check();
    await page.getByLabel('First name:').fill('Test');
    await page.getByLabel('Last name:').fill('User');
    await page.getByLabel('Email:').fill(randomEmail);
    await page.getByLabel('Password:', { exact: true }).fill('12345');
    await page.getByLabel('Confirm password:').fill('12345');
    
    // Submit registration
    await page.getByRole('button', { name: 'Register' }).click();
    await page.waitForTimeout(2000);
    console.log('Attempted registration with weak password');

    // Validate error message appears
    const errorMessage = page.locator('.field-validation-error');
    await expect(errorMessage).toBeVisible({ timeout: 5000 });
    const errorText = await errorMessage.textContent();
    console.log(`Error message displayed: ${errorText}`);

    // Verify we're still on the registration page
    await expect(page).toHaveURL(/\/register/);
    console.log('Confirmed: Still on registration page after weak password');

    await browser.close();
  });
});
