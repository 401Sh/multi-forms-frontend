import { render, screen, fireEvent } from "@testing-library/react"
import { describe, it, expect, vi } from "vitest"
import UpdateOptionsList from "../../src/components/surveys/UpdateOptionsList"
import { QuestionType } from "../../src/enums/question.enum"
import { QuestionOption } from "../../src/interfaces/question-option.interface"

describe("UpdateOptionsList", () => {
  const baseOption: QuestionOption = {
    id: "opt1",
    text: "Option 1",
    isCorrect: false,
    points: 0,
    position: 1
  }

  const setup = (type = QuestionType.CHECK_BOX, options = [baseOption]) => {
    const mockHandleChange = vi.fn()
    render(
      <UpdateOptionsList
        type={type}
        data={options}
        handleChange={mockHandleChange}
      />
    )
    return { mockHandleChange }
  }

  it("renders option inputs correctly", () => {
    setup()
    expect(screen.getByPlaceholderText("Option text")).toHaveValue("Option 1")
    expect(screen.getByDisplayValue("0")).toBeInTheDocument()
    expect(screen.getByRole("checkbox")).toBeInTheDocument()
  })

  it("adds new option when Add Option is clicked", () => {
    const { mockHandleChange } = setup()
    const addBtn = screen.getByText("Add Option")
    fireEvent.click(addBtn)

    expect(mockHandleChange).toHaveBeenCalled()
    const newOptions = mockHandleChange.mock.calls[0][0]
    expect(newOptions).toHaveLength(2)
    expect(newOptions[1].text).toBe("")
  })

  it("deletes option when Delete button is clicked", () => {
    const { mockHandleChange } = setup()
    const deleteBtn = screen.getByText("Delete")
    fireEvent.click(deleteBtn)

    expect(mockHandleChange).toHaveBeenCalledWith([])
  })

  it("updates option text when changed", () => {
    const { mockHandleChange } = setup()
    const input = screen.getByPlaceholderText("Option text")
    fireEvent.change(input, { target: { value: "Updated Text" } })

    expect(mockHandleChange).toHaveBeenCalledWith([
      { ...baseOption, text: "Updated Text" }
    ])
  })

  it("updates points when number input is changed", () => {
    const { mockHandleChange } = setup()
    const numberInput = screen.getByDisplayValue("0")
    fireEvent.change(numberInput, { target: { value: "10" } })

    expect(mockHandleChange).toHaveBeenCalledWith([
      { ...baseOption, points: 10 }
    ])
  })

  it("toggles checkbox for CHECK_BOX type", () => {
    const { mockHandleChange } = setup(QuestionType.CHECK_BOX)
    const checkbox = screen.getByRole("checkbox")
    fireEvent.click(checkbox)

    expect(mockHandleChange).toHaveBeenCalledWith([
      { ...baseOption, isCorrect: true }
    ])
  })

  it("selects only one option for RADIO type", () => {
    const options = [
      { ...baseOption },
      { ...baseOption, id: "opt2", position: 2 }
    ]
    const { mockHandleChange } = setup(QuestionType.RADIO, options)

    const radios = screen.getAllByRole("radio")
    fireEvent.click(radios[1])

    const expected = options.map(opt => ({
      ...opt,
      isCorrect: opt.id === "opt2"
    }))
    expect(mockHandleChange).toHaveBeenCalledWith(expected)
  })
})
