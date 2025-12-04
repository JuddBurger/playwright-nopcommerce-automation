# nopCommerce Playwright Test Automation

Automated end-to-end testing suite for nopCommerce demo site using Playwright with TypeScript and Page Object Model pattern.

## Features

- **Complete User Journey Testing**: Registration, login, product browsing, cart management, checkout, and order validation
- **Page Object Model**: Clean, maintainable architecture with reusable page objects
- **Negative Testing**: Registration validation tests covering edge cases
- **Stealth Plugin**: Bypasses bot detection using puppeteer-extra-plugin-stealth
- **Product Sorting**: Tests all available sorting options (Position, Name, Price)

## Tech Stack

- **Playwright** - End-to-end testing framework
- **TypeScript** - Type-safe test development
- **playwright-extra** - Enhanced Playwright with plugin support
- **puppeteer-extra-plugin-stealth** - Cloudflare/bot detection bypass

## Project Structure

```
├── e2e/
│   ├── nopCommerceJourney.pom.spec.ts    # Main user journey test
│   └── registration.negative.spec.ts      # Negative registration tests
├── pages/
│   ├── BasePage.ts                        # Base page object class
│   ├── RegistrationPage.ts                # Registration functionality
│   ├── LoginPage.ts                       # Login/logout operations
│   ├── ProductsPage.ts                    # Product browsing and cart
│   ├── CartPage.ts                        # Shopping cart management
│   ├── CheckoutPage.ts                    # Checkout flow
│   └── MyAccountPage.ts                   # Account and order validation
└── playwright.config.ts                   # Playwright configuration
```

## Installation
- Powershell to be used for below commands:
1. Clone the repository:
git clone https://github.com/JuddBurger/playwright-nopcommerce-automation
cd playwright-nopcommerce-automation

2. Install dependencies:
npm install

3. Install Playwright browsers:
npx playwright install firefox

## Running Tests

### User Journey Test (Complete E2E Flow)
npm run test:journey

This test covers Steps 1-11 of Task 4 of assessment:
- User registration with validation
- Login authentication
- Product browsing and sorting (all sort options)
- Adding products to cart (simple and configurable)
- Cart management and validation
- Complete checkout process
- Order confirmation and validation

### Negative Registration Tests
npm run test:negative

Tests include:
- Mismatched password validation
- Existing email detection
- Invalid email format validation
- Weak password validation

### Bugs found:
- Able to use single letter to register for name and surname
- Able to use weak password for regsiter eg aaaaaa

### All Tests
npx playwright test

## Test Configuration

- **Browser**: Firefox (configurable)
- **Mode**: Headed
- **Viewport**: 1920x1080
- **Timeout**: 5 minutes per test
- **slowMo**: 500ms between actions for stability

## Key Test Scenarios

### 1. Complete User Journey
11-step end-to-end test covering the entire shopping experience from registration to order confirmation.

### 2. Product Sorting Validation
Iterates through all available sort options:
- Position (default)
- Name: A to Z
- Name: Z to A
- Price: Low to High
- Price: High to Low

### 3. Negative Testing
Validates proper error handling for invalid registration attempts.

## Notes

- Tests use stealth plugin to avoid bot detection on the demo site
- slowMo is set to 500ms to handle site responsiveness after experiencing delays in peak time.
- Tests are designed for the nopCommerce demo environment: https://demo.nopcommerce.com/

## Future Enhancements

- [ ] Add more negative test scenarios
- [ ] Implement API testing
- [ ] CI/CD pipeline integration
- [ ] Cross-browser testing (Chrome, Safari)

## Author

Judd Burger - Automation Test Engineer
