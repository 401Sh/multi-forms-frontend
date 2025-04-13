import { fireEvent, screen, waitFor } from "@testing-library/react"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { customRender } from "../setupTests"
import UpdateSurvey from "../src/components/surveys/UpdateSurvey"
import { SurveyAccess } from "../src/enums/survey.enum"
import { SurveyContext } from "../src/pages/SurveyPage"

// Мокаем send_secure_request
vi.mock("../src/api/authorized-request", () => ({
  send_secure_request: vi.fn()
}))
import { send_secure_request } from "../src/api/authorized-request"

// Мокаем логгер
vi.mock("../src/utils/logger", () => ({
  default: {
    info: vi.fn(),
    error: vi.fn()
  }
}))

// Мокаем useAuth
vi.mock("../src/hooks/AuthProvider", async () => {
  const actual: any = await vi.importActual("../src/hooks/AuthProvider")
  return {
    ...actual,
    useAuth: () => ({ setAuth: vi.fn() })
  }
})

describe("UpdateSurvey component", () => {
  const mockSurveyId = "test-survey-id"

  const defaultSurvey = {
    id: mockSurveyId,
    name: "Test Survey",
    description: "Test description",
    isPublished: false,
    access: SurveyAccess.PUBLIC,
    totalPoints: 10
  }

  const mockOnClose = vi.fn()
  const mockOnSave = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  const renderComponent = () =>
    customRender(
      <SurveyContext.Provider value={mockSurveyId}>
        <UpdateSurvey
          data={defaultSurvey}
          onClose={mockOnClose}
          onSave={mockOnSave}
        />
      </SurveyContext.Provider>
    )

  it("renders all fields correctly", () => {
    renderComponent()

    expect(screen.getByLabelText("Survey Name:")).toHaveValue("Test Survey")
    expect(screen.getByLabelText("Survey Description:")).toHaveValue("Test description")
    expect(screen.getByLabelText("No")).toBeChecked()
    expect(screen.getByLabelText("Yes")).not.toBeChecked()
    expect(screen.getByLabelText("Access Type:")).toHaveValue("public")
  })

  it("updates input fields on user change", () => {
    renderComponent()

    fireEvent.change(screen.getByLabelText("Survey Name:"), {
      target: { value: "Updated Survey" }
    })
    fireEvent.click(screen.getByLabelText("Yes"))
    fireEvent.change(screen.getByLabelText("Access Type:"), {
      target: { value: SurveyAccess.LINK }
    })

    expect(screen.getByLabelText("Survey Name:")).toHaveValue("Updated Survey")
    expect(screen.getByLabelText("Yes")).toBeChecked()
    expect(screen.getByLabelText("Access Type:")).toHaveValue("link")
  })

  it("calls onSave and onClose on successful save", async () => {
    (send_secure_request as any).mockResolvedValue({
      name: "Updated Survey",
      description: "Test description",
      isPublished: true,
      access: SurveyAccess.LINK
    })

    renderComponent()

    fireEvent.change(screen.getByLabelText("Survey Name:"), {
      target: { value: "Updated Survey" }
    })
    fireEvent.click(screen.getByLabelText("Yes"))
    fireEvent.change(screen.getByLabelText("Access Type:"), {
      target: { value: SurveyAccess.LINK }
    })

    fireEvent.click(screen.getByText("Save"))

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalled()
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it("shows error message on request failure", async () => {
    (send_secure_request as any).mockRejectedValue(new Error("API error"))

    renderComponent()

    fireEvent.click(screen.getByText("Save"))

    await waitFor(() => {
      expect(screen.getByText("Error updating survey")).toBeInTheDocument()
    })
  })

  it("calls onClose when Cancel is clicked", () => {
    renderComponent()

    fireEvent.click(screen.getByText("Cancel"))

    expect(mockOnClose).toHaveBeenCalled()
  })
})
