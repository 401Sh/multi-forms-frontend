import { expect, Page } from "@playwright/test"
import { QuestionType } from "../../src/enums/question.enum"
import { createQuestion } from "../_functions/create-question"
import { updateQuestion } from "../_functions/update-question"

export async function createSurvey(page: Page, surveyName: string) {
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

  await modal.getByLabel('Survey Name:').fill(surveyName)
  await modal.getByLabel('Yes').check()
  await modal.getByRole('button', { name: 'Save' }).click()

  await expect(modal).toBeHidden()
  await expect(page.locator('h2').nth(0)).toContainText("Name: " + surveyName)

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
}
  