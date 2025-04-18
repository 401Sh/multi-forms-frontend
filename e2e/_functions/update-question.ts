import { Page, expect } from "playwright/test"

export async function updateQuestion(
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