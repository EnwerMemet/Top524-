const { test, expect } = require("@playwright/test");
import * as contents from "../fixtures/contents.js";

const URL = "https://topgeschenken.nl/";
const web = "Topgeschenken.nl";
test.use({
  viewport: { width: 1800, height: 1200 },
});

test.describe.skip("Homepage", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.click("#CookieConsentIOAccept");
  });
  test.afterEach(async ({ page }) => {
    await page.waitForTimeout(5000);
    await page.close();
  });

  test("Homepage should have the correct title", async ({ page }) => {
    const title = await page.getAttribute("a.header-bar__item--logo", "title");
    expect(title).toBe(web);

    const nav = page.locator(".site-tabs__flex");

    // Check if the menubar has the correct number of items and the correct text
    for (let i = 0; i < contents.menubar.length; i++) {
      const link = nav.getByRole("link").nth(i);
      const linkText = await link.textContent();
      console.log(`✅ Text of link ${i}: ${linkText}`);
      await expect(link).toHaveText(contents.menubar[i]);
    }
  });

  test("Homepage should have the correct gifts", async ({ page }) => {
    // Log gifts of gifts
    const gifts = await page.locator("a.category");
    for (let i = 0; i < (await gifts.count()); i++) {
      const giftLink = gifts.nth(i);
      const giftText = await giftLink.textContent();
      console.log(`📌 gift ${i + 1}: ${giftText}`);
      await expect(giftLink).toHaveText(contents.gifts[i]);
    }
  });
  test("Homepage should have the correct assortments", async ({ page }) => {
    // Log gifts of gifts
    const gifts = await page.locator("a.assortment-grid__anchor");
    for (let i = 0; i < (await gifts.count()); i++) {
      const giftLink = gifts.nth(i);
      const giftText = await giftLink.textContent();
      console.log(`📌 assortment ${i + 1}: ${giftText}`);
      await expect(giftLink).toHaveText(contents.assortments[i]);
    }
  });
});

test.describe("Homepage - booking flow", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(URL);
    await page.click("#CookieConsentIOAccept");
  });
  test.afterEach(async ({ page }) => {
    await page.waitForTimeout(5000);
  });
  test.only("book a chocolate", async ({ page }) => {
    await page.click("#item-130");
    const url = page.url();
    expect(url).toContain("chocolade");
    // click on chocolade
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
    await page.waitForTimeout(2000);
    await page.click('#product_form_submit:has-text("Voeg toe aan winkelwagen")');

    page.on("dialog", async (dialog) => {
      console.log(`mesg`, dialog.message());
      await dialog.accept();
    });
    await page.getByRole("button", { name: "Doorgaan zonder kaartje" }).click();
    await page.click('a:has-text("Verder gaan met bestellen")');


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
    // Get tomorrow's date
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  // Format it as e.g., "April 10,"
  const options = { month: 'long', day: 'numeric' };
  const formattedDate = tomorrow.toLocaleDateString('en-US', options).toLowerCase(); 

  await page.getByLabel(formattedDate).click();
  await page.getByRole('button', { name: 'Volgende stap' }).click();
  await page.getByRole('radio', { name: 'Nee (doorgaan als gast)' }).check();
  await page.locator('#cart_customer_email').click();
  await page.locator('#cart_customer_email').fill('tester@1secmail.com');
  await page.locator('#cart_customer_firstname').click();
  await page.locator('#cart_customer_firstname').fill('Amer');
  await page.locator('#cart_customer_lastname').click();
  await page.locator('#cart_customer_lastname').fill('Noordhuizen');
  await page.locator('#cart_customer_default_invoice_address_postcode').dblclick();
  await page.locator('#cart_customer_default_invoice_address_postcode').fill('1025XL');
  await page.locator('#cart_customer_default_invoice_address_number').dblclick();
  await page.locator('#cart_customer_default_invoice_address_number').fill('2000');
  await page.locator('#cart_customer_default_invoice_address_street').click();
  await page.locator('#cart_customer_phonenumber').dblclick();
  await page.locator('#cart_customer_phonenumber').fill('08008844');
  await page.getByRole('checkbox', { name: 'Ik ontvang graag nieuws-en' }).uncheck();
  await page.getByRole('checkbox', { name: 'Ik accepteer de algemene' }).check();
  await page.getByRole('radio', { name: 'iDEAL' }).check();
  await page.getByRole('button', { name: 'Bestelling betalen' }).click();
  await page.getByTestId('payment-qr-title').click();
  await page.getByTestId('cancel-transaction-button').click();
  await page.getByRole('heading', { name: 'Are you sure you want to' }).click();
  await page.getByText('If you cancel, you will be').click();
  await page.getByTestId('cancel-transaction-confirm-dialog-confirm').click();
  });
});


