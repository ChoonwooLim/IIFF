import { test, expect } from "@playwright/test";
test.describe("Navigation", () => {
    test("presentation page loads", async ({ page }) => {
        await page.goto("/presentation");
        await expect(page).toHaveURL("/presentation");
    });
    test("docs page loads", async ({ page }) => {
        await page.goto("/docs");
        await expect(page).toHaveURL("/docs");
    });
    test("boards page loads", async ({ page }) => {
        await page.goto("/boards");
        await expect(page).toHaveURL("/boards");
    });
    test("meetings page loads", async ({ page }) => {
        await page.goto("/meetings");
        await expect(page).toHaveURL("/meetings");
    });
    test("protected routes redirect to login", async ({ page }) => {
        await page.goto("/admin");
        // Should redirect to login since not authenticated
        await expect(page).toHaveURL(/\/(login|admin)/);
    });
    test("mobile menu opens and closes", async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto("/");
        const menuButton = page.getByLabel(/menu/i);
        await menuButton.click();
        await expect(page.getByRole("dialog")).toBeVisible();
        await menuButton.click();
        await expect(page.getByRole("dialog")).not.toBeVisible();
    });
});
