import test, { expect } from "playwright/test"

test("Create response", async ({ page }) => {
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
  await page.goto("/surveys")
  await expect(page).toHaveURL(/\/surveys/)

  await page.locator('li', { hasText: newSurveyName }).click()
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
})