import { expect, Page } from "playwright/test"

export async function deleteSurvey(page: Page, surveyName: string) {
  // Переход на страницу ответов
  await page.goto('/surveys/self')
  await expect(page).toHaveURL(/\/surveys\/self/)

  await page.locator('li', { hasText: surveyName }).click()
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
}