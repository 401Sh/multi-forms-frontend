import { expect, Page } from "playwright/test"

export async function createSurveyResponse(page: Page, surveyName: string) {
  // Переход на страницу ответов
  await page.goto("/surveys")
  await expect(page).toHaveURL(/\/surveys/)

  await page.locator('li', { hasText: surveyName }).nth(0).click()
  await expect(page).toHaveURL(/\/surveys\/.*\/form/)
  await expect(page.locator("form")).toBeVisible()

  // Ответы на вопросы
  const nameInput = page.locator(".question", { hasText: "What is your full name?" }).locator("input[type='text']")
  await nameInput.fill("John Doe")

  const femaleOption = page.locator(".question", { hasText: "What is your gender?" }).getByText("Female", { exact: true }).locator("input[type='radio']")
  await femaleOption.check()

  const hobbiesQuestion = page.locator(".question", { hasText: "What is your favorite hobbies?" })
  await hobbiesQuestion.getByText("Handmade", { exact: true }).locator("input[type='checkbox']").check()
  await hobbiesQuestion.getByText("Games", { exact: true }).locator("input[type='checkbox']").check()

  // Отправка результатов
  await page.getByRole("button", { name: "Отправить" }).click()
  await expect(page).toHaveURL(/.*\/success/)
}