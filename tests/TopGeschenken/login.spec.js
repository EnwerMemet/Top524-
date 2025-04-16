import { test, expect } from "@playwright/test";
import { faker } from "@faker-js/faker/locale/en";
import fs from "fs";
import * as accounts from "./accounts.json";

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
  const firstName = faker.person.firstName();
  const lastName = faker.person.lastName();
  const email = faker.internet.email({ firstName, lastName });
  console.log(`📧 Generated email: ${email} for ${firstName} ${lastName}`);
  return { firstName, lastName, email };
}

async function login(page, email, password) {
  await page.getByRole("link", { name: "Inloggen" }).click();
  await page.locator("#field-username").fill(email);
  await page.locator("#field-password").fill(password);
  await page.getByText(/Accountoverzicht/)
}

test.describe("Create account", () => {
  test.beforeEach(async ({ page }) => {
    await navigateToHomepage(page, URL);
  });

  test("Login with account", async ({ page }) => {
    await login(page, accounts.email, accounts.password);
    // Add assertions here
  });
});
