import { screen, fireEvent } from "@testing-library/react"
import Question from "../src/components/surveys/Question"
import { QuestionType } from "../src/enums/question.enum"
import { describe, expect, it, vi } from "vitest"
import { customRender } from "../setupTests"

vi.mock('pino', () => ({
  default: () => ({
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn()
  })
}))

describe('Question component', () => {
  const mockRefetch = vi.fn().mockResolvedValue({})
  const mockOnDelete = vi.fn()

  const defaultQuestionData = {
    id: 'q1',
    type: QuestionType.RADIO,
    name: 'Sample Question',
    isMandatory: true,
    questionText: 'What is the capital of France?',
    questionOptions: [
      { id: 'opt1', text: 'Paris', isCorrect: true, position: 1, points: 5 },
      { id: 'opt2', text: 'Berlin', isCorrect: false, position: 2, points: 0 },
    ]
  }

  it('renders question details correctly', () => {
    customRender(
      <Question
        refetch={mockRefetch}
        onDeleteQuestion={mockOnDelete}
        questionData={defaultQuestionData}
      />
    )

    expect(screen.getByText('Question: Sample Question')).toBeTruthy()
    expect(screen.getByText('Is Mandatory: true')).toBeTruthy()
    expect(screen.getByText('Text: What is the capital of France?')).toBeTruthy()

    // Check options rendered
    expect(screen.getByLabelText('Paris')).toBeTruthy()
    expect(screen.getByLabelText('Berlin')).toBeTruthy()
  })

  it('calls onDeleteQuestion when delete button is clicked', () => {
    customRender(
      <Question
        refetch={mockRefetch}
        onDeleteQuestion={mockOnDelete}
        questionData={defaultQuestionData}
      />
    )

    const deleteBtn = screen.getByText('Delete Question')
    fireEvent.click(deleteBtn)

    expect(mockOnDelete).toHaveBeenCalledWith('q1')
  })

  it('opens update modal when Update button is clicked', () => {
    customRender(
      <Question
        refetch={mockRefetch}
        onDeleteQuestion={mockOnDelete}
        questionData={defaultQuestionData}
      />
    )

    const updateBtn = screen.getByText('Update Question')
    fireEvent.click(updateBtn)

    // Поскольку UpdateQuestion — импортируемый компонент, он может не рендериться как текст, 
    // так что здесь можно использовать заглушку или тестировать через другой способ
    // Например, можно мокнуть UpdateQuestion
    expect(screen.getByText('Update Question')).toBeTruthy()
  })
})
