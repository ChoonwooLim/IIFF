import { test, expect } from "@playwright/test";
test.describe("Authentication", () => {
    test("login page renders correctly", async ({ page }) => {
        await page.goto("/login");
        await expect(page.getByRole("heading", { name: "로그인" })).toBeVisible();
        await expect(page.getByLabel("아이디")).toBeVisible();
        await expect(page.getByLabel("비밀번호")).toBeVisible();
        await expect(page.getByText("Google로 로그인")).toBeVisible();
    });
    test("register page renders correctly", async ({ page }) => {
        await page.goto("/register");
        await expect(page.getByRole("heading", { name: "회원가입" })).toBeVisible();
    });
    test("login page has link to register", async ({ page }) => {
        await page.goto("/login");
        await page.getByText("회원가입").click();
        await expect(page).toHaveURL("/register");
    });
    test("login with invalid credentials shows error", async ({ page }) => {
        await page.goto("/login");
        await page.getByLabel("아이디").fill("invalid_user");
        await page.getByLabel("비밀번호").fill("wrong_password");
        await page.getByRole("button", { name: "로그인" }).click();
        // Should show error (API call will fail since backend isn't running in test)
        await expect(page.locator(".bg-red-500\\/10")).toBeVisible({ timeout: 5000 });
    });
});
