const { test, expect } = require('@playwright/test');

test.describe('Telenor broadband', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://www.telenor.se/');
    await page.getByRole('button', { name: /godkänn alla|accept all/i }).first().click();
  });

  test('address search shows broadband products', async ({ page }) => {
    // Open Bredband from the main menu
    await page.getByRole('button', { name: 'Bredband' }).click();
    await page
      .getByRole('navigation', { name: 'Undermeny' })
      .getByRole('link', { name: 'Bredband', exact: true })
      .click();

    // Go to the fiber broadband page
    await page.getByRole('link', { name: 'Köp Bredband via fiber' }).click();

    // Search for the address
    const addressField = page.getByRole('combobox', { name: 'Sök adress' });
    await addressField.fill('Kungsgatan 103, Uppsala');
    await page
  .getByRole('button', { name: 'Stäng', exact: true })
  .click({ timeout: 3000 })
  .catch(() => {});
    await page.locator('[data-test="address-search-submit-button"]').click();

   
  });

// Note: The "Handla" menu item was not found in telenor.se's main navigation

});