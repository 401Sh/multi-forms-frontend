import { describe, it, vi, expect, beforeEach } from "vitest"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import CreateQuestion from "../../src/components/surveys/CreateQuestion"
import { QuestionType } from "../../src/enums/question.enum"
import { customRender } from "../../setupTests"
import { SurveyContext } from "../../src/pages/SurveyPage"
import * as AuthProvider from "../../src/hooks/AuthProvider"
import * as requestModule from "../../src/api/authorized-request"
import React from "react"

// Мокаем `send_secure_request`
vi.mock("../../src/api/authorized-request", async () => {
  return {
    send_secure_request: vi.fn()
  }
})

// Мокаем логгер
vi.mock("../../src/utils/logger", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn(),
    debug: vi.fn()
  }
}))

describe("CreateQuestion Component", () => {
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

  const renderComponent = () => {
    return customRender(
      <SurveyContext.Provider value="survey123">
        <CreateQuestion onClose={mockOnClose} onSave={mockOnSave} />
      </SurveyContext.Provider>
    )
  }

  it("renders all form fields and buttons", () => {
    renderComponent()

    expect(screen.getByText("Create New Question")).toBeInTheDocument()
    expect(screen.getByLabelText("Question Name:")).toBeInTheDocument()
    expect(screen.getByLabelText("Question Type:")).toBeInTheDocument()
    expect(screen.getByLabelText("Question Position:")).toBeInTheDocument()
    expect(screen.getByText("Save")).toBeInTheDocument()
    expect(screen.getByText("Cancel")).toBeInTheDocument()
  })

  it("shows error if trying to save without name", async () => {
    renderComponent()

    fireEvent.click(screen.getByText("Save"))

    await waitFor(() => {
      expect(screen.getByText("Question name is required")).toBeInTheDocument()
    })
  })

  it("calls onSave and onClose on successful creation", async () => {
    const mockResponse = {
      id: "new-id",
      name: "My Question",
      type: QuestionType.RADIO,
      position: 2
    }

    vi.spyOn(requestModule, "send_secure_request").mockResolvedValue(mockResponse)

    renderComponent()

    fireEvent.change(screen.getByLabelText("Question Name:"), {
      target: { value: "My Question" }
    })

    fireEvent.change(screen.getByLabelText("Question Type:"), {
      target: { value: QuestionType.RADIO }
    })

    fireEvent.change(screen.getByLabelText("Question Position:"), {
      target: { value: "2" }
    })

    fireEvent.click(screen.getByText("Save"))

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledWith(mockResponse)
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it("shows error if request fails", async () => {
    vi.spyOn(requestModule, "send_secure_request").mockRejectedValue(new Error("Fail"))

    renderComponent()

    fireEvent.change(screen.getByLabelText("Question Name:"), {
      target: { value: "Fail Question" }
    })

    fireEvent.click(screen.getByText("Save"))

    await waitFor(() => {
      expect(screen.getByText("Error creating question")).toBeInTheDocument()
    })
  })

  it("calls onClose when cancel is clicked", () => {
    renderComponent()

    fireEvent.click(screen.getByText("Cancel"))

    expect(mockOnClose).toHaveBeenCalled()
  })
})
