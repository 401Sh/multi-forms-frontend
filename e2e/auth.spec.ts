import { test, expect } from "@playwright/test"

test.describe("Авторизация", () => {
  test("успешный вход", async ({ page }) => {
    await page.goto("/auth/signin")

    await expect(page.locator('h1')).toHaveText(/auth page/i)
    
    await page.getByPlaceholder('Input login').fill('e2e_test_account')
    await page.getByPlaceholder('Input password').fill('password')
    await page.getByRole('button', { name: 'Sign In' }).click()

    // Ждём редирект
    await page.waitForURL('/profile')

    // Проверка успешного входа
    await expect(page).toHaveURL(/\/profile/)
    await expect(page.getByRole("heading", { name: /profile page/i })).toBeVisible()
  })

//   test("ошибка при неверных данных", async ({ page }) => {
//     await page.goto("/auth/signin")

//     await page.getByPlaceholder("Input login").fill("wrong_user")
//     await page.getByPlaceholder("Input password").fill("wrong_pass")
//     await page.getByRole("button", { name: "Sign In" }).click()

//     await expect(page.locator("".error-message")).toBeVisible()
//     await expect(page.locator("".error-message")).toContainText(/error/i)
//   })
})
