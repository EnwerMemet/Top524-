const { test, expect } = require("@playwright/test");
import { faker } from "@faker-js/faker/locale/en";
const fs = require("fs");

const URL = "https://topgeschenken.nl/";

test.use({
  viewport: { width: 1800, height: 1200 },
});

async function navigateToHomepage(page, URL) {
  console.log("🌐 Navigating to homepage...");
  await page.goto(URL);
  await page.click("#CookieConsentIOAccept");
  await page.waitForTimeout(2000);
  console.log("✅ Homepage loaded and cookie accepted");
}
async function generateEmail() {
  // const firstName = faker.person.firstName();
  const firstName = "Floyd";
  // const lastName = faker.person.lastName();
  const lastName = "Harvey";
  // const email = faker.internet.email({ firstName, lastName });
  const email = "Floyd_Harvey48@yahoo.com";
  console.log(`📧 Generated email: ${email} for ${firstName} ${lastName}`);
}

test.describe("Create account", () => {

  test.beforeEach(async ({ page }) => {
    await navigateToHomepage(page, URL);
  });

  test("Homepage should have the correct title", async ({ page }) => {

    // const firstName = faker.person.firstName();
    const firstName = "Floyd";
    // const lastName = faker.person.lastName();
    const lastName = "Harvey";
    // const email = faker.internet.email({ firstName, lastName });
    const email = "Floyd_Harvey46@yahoo.com";
    console.log(`📧 Generated email: ${email}`);

    console.log("🔐 Starting registration process...");
    await page.getByRole("link", { name: "Inloggen" }).click();
    await page.locator("#email").fill(email);
    await page.getByRole("radio", { name: "Particulier" }).check();
    await page.getByRole("button", { name: "Registreren" }).click();

    console.log("📝 Filling personal details...");
    await page.getByRole("radio", { name: "Dhr." }).check();
    await page.locator("#customer_firstname").fill(firstName);
    await page.locator("#customer_lastname").fill(lastName);
    await page.locator("#customer_addresses_0_postcode").fill("1025XL");
    await page.locator("#customer_addresses_0_number").fill("2000");
    await page.locator("#customer_phoneNumber").fill("08008844");
    await page.locator("#customer_birthday_day").selectOption("1");
    await page.locator("#customer_birthday_month").selectOption("1");
    await page.locator("#customer_birthday_year").selectOption("2000");
    await page.locator("#customer_plainPassword").fill("Top123!");
    await page.getByRole("button", { name: "Registreer je account" }).click();

    console.log("👤 Verifying personal information...");
    await page.getByRole("link", { name: "Persoonlijke informatie" }).click();

    const forename = await page.locator("#customer_firstname").innerText();
    const surname = await page.locator("#customer_lastname").innerText();


    const countryNL = page.locator("#customer_country_choice_0");
    const address = await page
      .locator("#customer_addresses_0_street")
      .innerText();
    const postcode = await page
      .locator("#customer_addresses_0_postcode")
      .innerText();

    console.log("🧪 verify personal info", forename, surname,countryNL,address,postcode );
    expect(forename).toBe(firstName);
    expect(surname).toBe(lastName);
    expect(countryNL).toBeChecked();
    expect(address).toBe("Buikslotermeerplein");
    expect(postcode).toBe("1025XL");
    console.log("✅ Personal information verified!");

    console.log("🔁 Swapping first and last names...");
    await page.locator("#customer_firstname").fill(lastName);
    await page.locator("#customer_lastname").fill(firstName);
    await page.getByRole("button", { name: "Opslaan" }).click();

    console.log("✅ Account creation and verification completed!");
  });

  test.skip("Login with account", async ({ page }) => {
    await page.getByRole("link", { name: "Inloggen" }).click();
    await page.locator().getByRole("input", { name: "username" }).fill(email);
    await page
      .locator()
      .getByRole("input", { name: "password" })
      .fill("Top123!");
  });
});
