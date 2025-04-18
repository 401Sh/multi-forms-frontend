import { describe, it, expect, vi, beforeEach } from "vitest"
import { fireEvent, screen, waitFor } from "@testing-library/react"
import { customRender } from "../../setupTests"
import * as AuthProvider from "../../src/hooks/AuthProvider"
import * as axiosInstance from "../../src/utils/axios-instance"
import * as reactRouter from "react-router"
import SignIn from "../../src/components/auths/SignIn"
import React from "react"

// Мокаем useNavigate
vi.mock("react-router", () => ({
  useNavigate: vi.fn()
}))

// Мокаем логгер
vi.mock("../../src/utils/logger", () => ({
  default: {
    debug: vi.fn(),
    error: vi.fn()
  }
}))

// Мокаем axios instance
vi.mock("../../src/utils/axios-instance", () => ({
  API_Client: {
    post: vi.fn()
  }
}))

vi.mock("react-router", () => ({
  useNavigate: () => vi.fn()
}))

describe("SignIn component", () => {
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
    return customRender(<SignIn />)
  }

  it("renders input fields and button", () => {
    renderComponent()

    expect(screen.getByPlaceholderText("Input login")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("Input password")).toBeInTheDocument()
    expect(screen.getByText("Sign In")).toBeInTheDocument()
  })

  it("shows error if login is empty", () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText("Input password"), {
      target: { value: "1234" }
    })

    fireEvent.click(screen.getByText("Sign In"))

    expect(screen.getByText("Login is required")).toBeInTheDocument()
  })

  it("shows error if password is empty", () => {
    renderComponent()

    fireEvent.change(screen.getByPlaceholderText("Input login"), {
      target: { value: "user" }
    })

    fireEvent.click(screen.getByText("Sign In"))

    expect(screen.getByText("Password is required")).toBeInTheDocument()
  })

  it("calls API and navigates on success", async () => {
    const mockResponse = {
      data: {
        accessToken: "abc123"
      }
    }

    vi.spyOn(axiosInstance.API_Client, "post").mockResolvedValue(mockResponse)

    renderComponent()

    fireEvent.change(screen.getByPlaceholderText("Input login"), {
      target: { value: "user" }
    })

    fireEvent.change(screen.getByPlaceholderText("Input password"), {
      target: { value: "password" }
    })

    fireEvent.click(screen.getByText("Sign In"))

    await waitFor(() => {
      expect(mockSetAuth).toHaveBeenCalledWith(true)
      expect(mockNavigate).toHaveBeenCalledWith("/profile")
      expect(localStorage.getItem("accessToken")).toBe("abc123")
    })
  })

  it("shows error message from API on failure", async () => {
    const error = {
      response: {
        data: {
          message: "Invalid credentials"
        }
      }
    }

    vi.spyOn(axiosInstance.API_Client, "post").mockRejectedValue(error)

    renderComponent()

    fireEvent.change(screen.getByPlaceholderText("Input login"), {
      target: { value: "user" }
    })

    fireEvent.change(screen.getByPlaceholderText("Input password"), {
      target: { value: "wrong" }
    })

    fireEvent.click(screen.getByText("Sign In"))

    await waitFor(() => {
      expect(screen.getByText("Invalid credentials")).toBeInTheDocument()
    })
  })

  it("shows generic error if server response is malformed", async () => {
    vi.spyOn(axiosInstance.API_Client, "post").mockRejectedValue({})

    renderComponent()

    fireEvent.change(screen.getByPlaceholderText("Input login"), {
      target: { value: "user" }
    })

    fireEvent.change(screen.getByPlaceholderText("Input password"), {
      target: { value: "password" }
    })

    fireEvent.click(screen.getByText("Sign In"))

    await waitFor(() => {
      expect(screen.getByText("Error signing in")).toBeInTheDocument()
    })
  })
})
