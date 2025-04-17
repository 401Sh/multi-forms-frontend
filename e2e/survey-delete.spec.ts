import test, { expect } from "playwright/test"

test("Delete survey", async ({ page }) => {
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
  
  const newSurveyName = 'E2E Test Survey Name'
  
  // Переход на страницу ответов
  await page.goto('/surveys/self')
  await expect(page).toHaveURL(/\/surveys\/self/)

  await page.locator('li', { hasText: newSurveyName }).click()
  await expect(page).toHaveURL(/\/surveys/i)
  
  // Проверка таблицы ответов
  await page.getByRole('button', { name: /Responses Sheet/ }).click()
  await expect(page).toHaveURL(/\/surveys\/[^/]+\?tab=sheets$/)

  const table = page.getByRole("table")
  await expect(table).toBeVisible()

  // Проверка, что есть только одна строка-ответ (одна строка в tbody)
  const rows = table.locator("tbody > tr")
  await expect(rows).toHaveCount(1)

  // Удаление анкеты
  await page.getByRole('button', { name: /Constructor/ }).click()
  await expect(page).toHaveURL(/\/surveys\/[^/]+\?tab=constructor$/)

  await page.getByRole('button', { name: /Delete Survey/ }).click()
  await expect(page).toHaveURL(/\/surveys\/self/)

  // Выход из аккаунта
  await page.getByRole('button', { name: /Log Out/ }).click()
  await expect(page).toHaveURL(/\/auth\/signin/)
})