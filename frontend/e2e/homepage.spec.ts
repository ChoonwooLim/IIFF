import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and displays hero section", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/IIFF/i);
    await expect(page.locator("nav")).toBeVisible();
  });

  test("navbar has correct links", async ({ page }) => {
    await page.goto("/");
    const nav = page.locator("nav");
    await expect(nav.getByText("게시판")).toBeVisible();
    await expect(nav.getByText("회의실")).toBeVisible();
    await expect(nav.getByText("PDF")).toBeVisible();
    await expect(nav.getByText("Present")).toBeVisible();
  });

  test("navigates to boards page", async ({ page }) => {
    await page.goto("/");
    await page.getByText("게시판").first().click();
    await expect(page).toHaveURL("/boards");
  });

  test("navigates to meetings page", async ({ page }) => {
    await page.goto("/");
    await page.getByText("회의실").first().click();
    await expect(page).toHaveURL("/meetings");
  });
});
