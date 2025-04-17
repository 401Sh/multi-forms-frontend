import { test, expect } from "@playwright/test"

test('должна отображаться главная страница', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveTitle(/My App/i)
  await expect(page.getByRole('heading', { name: /Welcome/i })).toBeVisible()
})
