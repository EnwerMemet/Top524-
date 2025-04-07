const { test, expect } = require("@playwright/test");
import * as contents from "../fixtures/contents.js";

const URL = "https://topgeschenken.nl/";
const web = "Topgeschenken.nl";

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
    await page.close();
  });
  test.only("book a beauty product", async ({ page }) => {
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
    await page.click('button:has-text("Voeg toe aan winkelwagen")');
    await page.waitForTimeout(5000);
    page.on('dialog', dialog => dialog.accept());
    await page.click('button:has-text("Doorgaan zonder kaartje")');
  });
});
