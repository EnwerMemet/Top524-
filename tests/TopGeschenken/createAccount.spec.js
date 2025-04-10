const { test, expect } = require("@playwright/test");

const URL = "https://topgeschenken.nl/";

test.use({
  viewport: { width: 1800, height: 1200 },
});

async function navigateToHomepage(page, URL) {
  await page.goto(URL);
  await page.click("#CookieConsentIOAccept");
  await page.waitForTimeout(2000);
}

test.describe("Create account", () => {
  test("Homepage should have the correct title", async ({ page }) => {
    // Ensure the page is passed correctly to the function
    await navigateToHomepage(page, URL);

    // Proceed with the registration flow
    await page.getByRole('link', { name: 'Inloggen' }).click();
    await page.locator('#email').fill('tester1@1secmail.com');
    await page.getByRole('radio', { name: 'Particulier' }).check();
    await page.getByRole('button', { name: 'Registreren' }).click();  // Do this once
    await page.getByRole('radio', { name: 'Dhr.' }).check();
    await page.locator('#customer_firstname').fill('Tester');
    await page.locator('#customer_lastname').fill('Top');
    await page.locator('#customer_addresses_0_postcode').fill('1025XL');
    await page.locator('#customer_addresses_0_number').fill('2000');
    await page.locator('#customer_phoneNumber').fill('08008844');
    await page.locator('#customer_birthday_day').selectOption('1');
    await page.locator('#customer_birthday_month').selectOption('1');
    await page.locator('#customer_birthday_year').selectOption('2000');
    await page.locator('#customer_plainPassword').fill('Top123!');
    await page.getByRole('button', { name: 'Registreer je account' }).click();
    await page.getByRole('link', { name: 'Persoonlijke informatie' }).click();

    // Optional: Update information if needed
    await page.locator('#customer_firstname').fill('Updated Name');
    await page.locator('#customer_lastname').fill('Updated Lastname');
    await page.getByRole('button', { name: 'Opslaan' }).click();
  });
});
