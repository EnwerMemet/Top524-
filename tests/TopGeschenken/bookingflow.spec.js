const { test, expect } = require("@playwright/test");
import * as contents from "../fixtures/contents.js";

const URL = "https://topgeschenken.nl/";
const web = "Topgeschenken.nl";
test.use({
  viewport: { width: 1800, height: 1200 },
});

test.describe("Homepage - booking flow", () => {
  test.beforeEach(async ({ page }) => {
    console.log("🌐 Navigating to the homepage...");
    await page.goto(URL);
    await page.click("#CookieConsentIOAccept");
    await page.waitForTimeout(2000); // Added wait to ensure page is ready
  });

  test.afterEach(async ({ page }) => {
    await page.waitForTimeout(6000);
  });

  test("Anonymous: order a chocolate", async ({ page }) => {
    console.log("🍫 Starting the booking flow for chocolate...");

    await page.click("#item-130");
    const url = page.url();
    expect(url).toContain("chocolade");
    const tony = `Tony's Chocolonely Je wordt bedankt`;
    await page.mouse.wheel(0, 500);
    await page
      .locator('a[href*="tonys-chocolonely-je-wordt-bedankt"]')
      .first()
      .waitFor({ state: "visible" });
    await page.click('a[href*="tonys-chocolonely-je-wordt-bedankt"]', {
      force: true,
    });

    await expect(page.url()).toContain("tonys-chocolonely-je-wordt-bedankt");
    await expect(page.locator(".product-title")).toHaveText(tony);

    console.log("🛒 Adding product to the cart...");
    await page.waitForTimeout(2000);
    await page.click('#product_form_submit:has-text("Voeg toe aan winkelwagen")');

    page.on("dialog", async (dialog) => {
      console.log("📢 Dialog message:", dialog.message());
      await dialog.accept();
    });

    await page.getByRole("button", { name: "Doorgaan zonder kaartje" }).click();
    await page.click('a:has-text("Verder gaan met bestellen")');
    console.log("📋 Filling in delivery address...");
    
    await page.locator('#cart_order_deliveryAddressType').selectOption('1');
    await page.locator('#cart_order_deliveryAddressAttn').click();
    await page.locator('#cart_order_deliveryAddressAttn').fill('Jan');
    await page.locator('#cart_order_deliveryAddressPostcode').click();
    await page.locator('#cart_order_deliveryAddressPostcode').fill('1025XL');
    await page.locator('#cart_order_deliveryAddressNumber').click();
    await page.locator('#cart_order_deliveryAddressNumber').fill('2000');
    await page.locator('#cart_order_deliveryAddressStreet').dblclick();
    await page.locator('#cart_order_deliveryAddressPhoneNumber').click();
    await page.locator('#cart_order_deliveryAddressPhoneNumber').fill('08008844');

    await page.waitForTimeout(500); // Small wait after filling out the address

    console.log("📅 Selecting delivery date...");
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const options = { month: 'long', day: 'numeric' };
    const formattedDate = tomorrow.toLocaleDateString('en-US', options).toLowerCase();
    await page.getByLabel(formattedDate).click();

    console.log("➡️ Proceeding to the next step...");
    await page.getByRole('button', { name: 'Volgende stap' }).click();

    console.log("👤 Filling in customer details...");
    await page.getByRole('radio', { name: 'Nee (doorgaan als gast)' }).check();
    await page.locator('#cart_customer_email').fill('tester@1secmail.com');
    await page.locator('#cart_customer_firstname').fill('Amer');
    await page.locator('#cart_customer_lastname').fill('Noordhuizen');
    await page.locator('#cart_customer_default_invoice_address_postcode').fill('1025XL');
    await page.locator('#cart_customer_default_invoice_address_number').fill('2000');
    await page.locator('#cart_customer_phonenumber').fill('08008844');

    await page.getByRole('checkbox', { name: 'Ik ontvang graag nieuws-en' }).uncheck();
    await page.getByRole('checkbox', { name: 'Ik accepteer de algemene' }).check();

    console.log("💳 Selecting payment method...");
    await page.getByRole('radio', { name: 'iDEAL' }).check();
    await page.getByRole('button', { name: 'Bestelling betalen' }).click();

    console.log("❌ Cancelling the transaction...");
    await page.getByTestId('cancel-transaction-button').click();
    await page.getByTestId('cancel-transaction-confirm-dialog-confirm').click();
  });
});
