import { Page, expect } from "playwright/test";
import { QuestionType } from "../../src/enums/question.enum";

export async function createQuestion(
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