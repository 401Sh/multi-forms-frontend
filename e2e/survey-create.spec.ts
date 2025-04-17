import { test, expect, Page } from "@playwright/test"
import { QuestionType } from "../src/enums/question.enum"

test("Create survey", async ({ page }) => {
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
  
  // Создание анкеты  
  await page.goto('/surveys/self')
  await expect(page).toHaveURL(/\/surveys\/self/)
  await page.getByRole('button', { name: /Create Survey/i }).click()
  await page.waitForURL(/\/surveys\/.+$/)

  await expect(page).toHaveURL(/\/surveys\/[a-zA-Z0-9-]+$/)
  await expect(page.locator('body')).toContainText(/survey/i)

  // Обновление анкеты
  await page.getByRole('button', { name: /update survey/i }).click()
  const modal = page.locator('.modal-window')
  await expect(modal).toBeVisible()

  const newSurveyName = 'E2E Test Survey Name'
  await modal.getByLabel('Survey Name:').fill(newSurveyName)
  await modal.getByLabel('Yes').check()
  await modal.getByRole('button', { name: 'Save' }).click()

  await expect(modal).toBeHidden()
  await expect(page.locator('h2').nth(0)).toContainText("Name: " + newSurveyName)

  // Создание вопросов
  await createQuestion(page, {
    name: 'Your name',
    type: QuestionType.TEXT,
    position: 1,
  })
  
  await createQuestion(page, {
    name: 'Choose your gender',
    type: QuestionType.RADIO,
    position: 2,
  })
  
  await createQuestion(page, {
    name: 'Select your hobbies',
    type: QuestionType.CHECK_BOX,
    position: 3,
  })

  await expect(page.getByText('Your name')).toBeVisible()
  await expect(page.getByText('Choose your gender')).toBeVisible()
  await expect(page.getByText('Select your hobbies')).toBeVisible()
  
  // Настройка вопросов
  await updateQuestion(page, {
    originalName: 'Your name',
    updatedName: 'What is your full name?',
    questionText: 'Please enter your full name',
    isMandatory: true,
    answer: 'John Doe',
    points: 5,
    position: 1
  })

  await updateQuestion(page, {
    originalName: 'Choose your gender',
    updatedName: 'What is your gender?',
    questionText: 'Please select your gender',
    isMandatory: true,
    position: 2,
    options: [
      { text: 'Male', points: 1, isCorrect: false },
      { text: 'Female', points: 1, isCorrect: false }
    ]
  })

  await updateQuestion(page, {
    originalName: 'Select your hobbies',
    updatedName: 'What is your favorite hobbies?',
    questionText: 'Please select your favorite hobbies',
    isMandatory: true,
    position: 2,
    options: [
      { text: 'Sport', points: 1, isCorrect: false },
      { text: 'Handmade', points: 2, isCorrect: true },
      { text: 'Games', points: 3, isCorrect: true }
    ]
  })
})


async function createQuestion(
  page: Page,
  { name, type, position }: { name: string; type: string; position: number }
) {
  await page.getByRole('button', { name: /add question/i }).click()

  const modal = page.locator('.modal-window')
  await expect(modal).toBeVisible()

  await modal.getByLabel('Question Name:').fill(name)
  if (type != QuestionType.TEXT) {
    await modal.getByLabel('Question Type:').selectOption(type)
  }
  await modal.getByLabel('Question Position:').fill(position.toString())

  await modal.getByRole('button', { name: 'Save' }).click()
  await expect(modal).toBeHidden()
}


async function updateQuestion(
  page: Page,
  {
    originalName,
    updatedName,
    questionText,
    isMandatory,
    answer,
    points,
    position,
    options,
  }: {
    originalName: string
    updatedName: string
    questionText: string
    isMandatory: boolean
    answer?: string
    points?: number
    position?: number
    options?: {
      text: string
      points: number
      isCorrect: boolean
    }[]
  }
) {
  const questionBlock = page.locator('label', { hasText: originalName }).locator('..')
  await questionBlock.getByRole('button', { name: 'Update Question' }).click()

  const modal = page.locator('.modal-window')
  await expect(modal).toBeVisible()

  await modal.getByLabel('Question Name:').fill(updatedName)
  await modal.getByLabel('Question Text:').fill(questionText)
  await modal.locator(`input[name="mandatoryType"][value="${isMandatory}"]`).check()

  if (position !== undefined) {
    await modal.getByLabel('Question Position:').fill(position.toString())
  }

  if (answer !== undefined) {
    await modal.getByLabel('Correct Answer:').fill(answer)
  }

  if (points !== undefined) {
    await modal.getByLabel('Question Points:').fill(points.toString())
  }

  if (options && options.length > 0) {
    for (const [index, opt] of options.entries()) {
      if (index >= 1) await modal.getByRole('button', { name: 'Add Option' }).click()

      const optInputs = modal.locator('.option-item').nth(index)
      await optInputs.locator('input[type="text"]').fill(opt.text)
      await optInputs.locator('input[type="number"]').fill(opt.points.toString())

      if (await optInputs.locator('input[type="checkbox"]').count()) {
        if (opt.isCorrect) {
          await optInputs.locator('input[type="checkbox"]').check()
        }
      } else if (await optInputs.locator('input[type="radio"]').count()) {
        if (opt.isCorrect) {
          await optInputs.locator('input[type="radio"]').check()
        }
      }
    }
  }

  await modal.getByRole('button', { name: 'Save' }).click()
  await expect(modal).toBeHidden()
}
  