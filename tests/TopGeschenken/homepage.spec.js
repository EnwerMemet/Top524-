const { test, expect } = require("@playwright/test");
import * as contents from "../fixtures/contents.js";

const URL = "https://topgeschenken.nl/";
const web = "Topgeschenken.nl";

test.describe("Homepage", () => {
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

    await page.click("#CookieConsentIOAccept");
    await page.waitForTimeout(2000);

    const nav = page.locator(".site-tabs__flex");

    // Check if the menubar has the correct number of items and the correct text
    for (let i = 0; i < contents.menubar.length; i++) {
      const link = nav.getByRole("link").nth(i);
      const linkText = await link.textContent();
      console.log(`✅ Text of link ${i}: ${linkText}`);
      await expect(link).toHaveText(contents.menubar[i]);
    }
  });

  test.skip("Homepage should have the correct gifts", async ({ page }) => {
       // Log gifts of gifts
       const gifts = await nav.locator(
        "ul.site-navigation__list.depth-1 .nav-item > a.category"
      );
      for (let i = 0; i < (await gifts.count()); i++) {
        const giftLink = gifts.nth(i);
        const giftText = await giftLink.textContent();
        console.log(`📌 gift ${i + 1}: ${giftText}`);
        await expect(giftLink).toHaveText(contents.gifts[i]);
      }
  
      // Log gifts categories
      const items = await nav.locator(
        "ul.site-navigation__list.depth-1 .nav-item > a.item"
      );
      for (let i = 0; i < (await items.count()); i++) {
        const itemLink = items.nth(i);
        const itemText = await itemLink.textContent();
        console.log(`🛍️ Item ${i + 1}: ${itemText}`);
        await expect(itemLink).toHaveText(contents.gifts[i]);
      }
  });
});
