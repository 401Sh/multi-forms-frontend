import { describe, it, vi, expect, beforeEach } from "vitest"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import UpdateQuestion from "../src/components/surveys/UpdateQuestion"
import { customRender } from "../setupTests"
import { SurveyContext } from "../src/pages/SurveyPage"
import { QuestionType } from "../src/enums/question.enum"
import * as AuthProvider from "../src/hooks/AuthProvider"
import * as requestModule from "../src/api/authorized-request"

vi.mock("../src/api/authorized-request", async () => {
  return {
    send_secure_request: vi.fn()
  }
})

vi.mock("../src/utils/logger", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn()
  }
}))

describe("UpdateQuestion Component", () => {
  const mockOnClose = vi.fn()
  const mockOnSave = vi.fn()
  const mockSetAuth = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.spyOn(AuthProvider, "useAuth").mockReturnValue({
      setAuth: mockSetAuth,
      isAuthenticated: false,
      logout: function (): void {
        throw new Error("Function not implemented.")
      }
    })
  })

  const defaultData = {
    id: "q123",
    name: "Old Question",
    type: QuestionType.TEXT,
    position: 2,
    questionText: "Old text",
    isMandatory: true,
    answer: "Old answer",
    points: 5
  }

  const renderComponent = (data = defaultData) => {
    return customRender(
      <SurveyContext.Provider value="surveyXYZ">
        <UpdateQuestion data={data} onClose={mockOnClose} onSave={mockOnSave} />
      </SurveyContext.Provider>
    )
  }

  it("renders all fields for TEXT type", () => {
    renderComponent()

    expect(screen.getByDisplayValue("Old Question")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Old text")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Old answer")).toBeInTheDocument()
    expect(screen.getByDisplayValue("5")).toBeInTheDocument()
    expect(screen.getByLabelText("Yes")).toBeChecked()
  })

  it("allows changing name and triggers save", async () => {
    const newData = { ...defaultData, name: "Updated Question" }

    vi.spyOn(requestModule, "send_secure_request").mockResolvedValue(newData)

    renderComponent()

    fireEvent.change(screen.getByLabelText("Question Name:"), {
      target: { value: "Updated Question" }
    })

    fireEvent.click(screen.getByText("Save"))

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(newData)
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it("calls onClose when cancel is clicked", () => {
    renderComponent()

    fireEvent.click(screen.getByText("Cancel"))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it("displays error message if update fails", async () => {
    vi.spyOn(requestModule, "send_secure_request").mockRejectedValue(new Error("Failed"))

    renderComponent()

    fireEvent.click(screen.getByText("Save"))

    await waitFor(() => {
      expect(screen.getByText("Error updating question")).toBeInTheDocument()
    })
  })

  it("renders option list component for RADIO type", () => {
    const radioData = {
      ...defaultData,
      type: QuestionType.RADIO,
      questionOptions: [
        { id: "opt1", text: "Option 1", isCorrect: false },
        { id: "opt2", text: "Option 2", isCorrect: true }
      ]
    }

    renderComponent(radioData)

    expect(screen.getByDisplayValue("Option 1")).toBeInTheDocument()
    expect(screen.getByDisplayValue("Option 2")).toBeInTheDocument()
  })
})
