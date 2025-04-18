import { expect, test } from '@playwright/test'
import { createSurvey } from './test-functions/survey-create'
import { createSurveyResponse } from './test-functions/response-create'
import { deleteSurvey } from './test-functions/survey-delete'

const surveyName = 'E2E Test Survey Name'

test.describe.serial("Survey Full Flow", () => {
  test.beforeEach(async ({ page }) => {
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

  test("Create survey", async ({ page }) => {
    await createSurvey(page, surveyName)
  })

  test("Submit response", async ({ page }) => {
    await createSurveyResponse(page, surveyName)
  })

  test("Check responses and delete survey", async ({ page }) => {
    await deleteSurvey(page, surveyName)
  })
})
