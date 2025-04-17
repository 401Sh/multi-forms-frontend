import { describe, it, expect, vi, beforeEach } from "vitest"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import { customRender } from "../../setupTests"
import * as AuthProvider from "../../src/hooks/AuthProvider"
import * as axiosInstance from "../../src/utils/axios-instance"
import * as reactRouter from "react-router"
import SignUp from "../../src/components/auths/SignUp"

vi.mock("react-router", () => ({
  useNavigate: vi.fn()
}))

vi.mock("../../src/utils/logger", () => ({
  default: {
    debug: vi.fn(),
    error: vi.fn()
  }
}))

vi.mock("../../src/utils/axios-instance", () => ({
  API_Client: {
    post: vi.fn()
  }
}))

vi.mock("react-router", () => ({
  useNavigate: () => vi.fn()
}))

describe("SignUp component", () => {
  const mockSetAuth = vi.fn()
  const mockNavigate = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()

    vi.spyOn(AuthProvider, "useAuth").mockReturnValue({
      setAuth: mockSetAuth,
      isAuthenticated: false,
      logout: function (): void {
        throw new Error("Function not implemented.")
      }
    }),

    vi.spyOn(reactRouter, "useNavigate").mockReturnValue(mockNavigate)
  })

  const renderComponent = () => {
    return customRender(<SignUp />)
  }

  it("renders all input fields and button", () => {
    renderComponent()

    expect(screen.getByPlaceholderText("Input login")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Input password")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Confirm password")).toBeInTheDocument()
    expect(screen.getByText("Sign Up")).toBeInTheDocument()
  })

  it("shows error if login is empty", () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText("Input password"), {
      target: { value: "password123" }
    })
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "password123" }
    })

    fireEvent.click(screen.getByText("Sign Up"))

    expect(screen.getByText("Login is required")).toBeInTheDocument()
  })

  it("shows error if password is empty", () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText("Input login"), {
      target: { value: "user" }
    })
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "password123" }
    })

    fireEvent.click(screen.getByText("Sign Up"))

    expect(screen.getByText("Password is required")).toBeInTheDocument()
  })

  it("shows error if passwords do not match", () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText("Input login"), {
      target: { value: "user" }
    })
    fireEvent.change(screen.getByPlaceholderText("Input password"), {
      target: { value: "password123" }
    })
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "different" }
    })

    fireEvent.click(screen.getByText("Sign Up"))

    expect(screen.getByText("Passwords do not match")).toBeInTheDocument()
  })

  it("calls API and navigates on successful signup", async () => {
    const mockResponse = {
      data: {
        accessToken: "signup_token"
      }
    }

    vi.spyOn(axiosInstance.API_Client, "post").mockResolvedValue(mockResponse)

    renderComponent()

    fireEvent.change(screen.getByPlaceholderText("Input login"), {
      target: { value: "newuser" }
    })
    fireEvent.change(screen.getByPlaceholderText("Input password"), {
      target: { value: "mypassword" }
    })
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "mypassword" }
    })

    fireEvent.click(screen.getByText("Sign Up"))

    await waitFor(() => {
      expect(mockSetAuth).toHaveBeenCalledWith(true)
      expect(mockNavigate).toHaveBeenCalledWith("/profile")
      expect(localStorage.getItem("accessToken")).toBe("signup_token")
    })
  })

  it("shows API error message on failure", async () => {
    const error = {
      response: {
        data: {
          message: "User already exists"
        }
      }
    }

    vi.spyOn(axiosInstance.API_Client, "post").mockRejectedValue(error)

    renderComponent()

    fireEvent.change(screen.getByPlaceholderText("Input login"), {
      target: { value: "duplicateUser" }
    })
    fireEvent.change(screen.getByPlaceholderText("Input password"), {
      target: { value: "password" }
    })
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "password" }
    })

    fireEvent.click(screen.getByText("Sign Up"))

    await waitFor(() => {
      expect(screen.getByText("User already exists")).toBeInTheDocument()
    })
  })

  it("shows generic error if no response from server", async () => {
    vi.spyOn(axiosInstance.API_Client, "post").mockRejectedValue({})

    renderComponent()

    fireEvent.change(screen.getByPlaceholderText("Input login"), {
      target: { value: "fail" }
    })
    fireEvent.change(screen.getByPlaceholderText("Input password"), {
      target: { value: "123456" }
    })
    fireEvent.change(screen.getByPlaceholderText("Confirm password"), {
      target: { value: "123456" }
    })

    fireEvent.click(screen.getByText("Sign Up"))

    await waitFor(() => {
      expect(screen.getByText("Error signing in")).toBeInTheDocument()
    })
  })
})
