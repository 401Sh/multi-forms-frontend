import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import "@testing-library/jest-dom"
import { render } from "@testing-library/react"
import React, { JSX } from "react"
import { MemoryRouter } from "react-router"
import { AuthProvider } from "./src/hooks/AuthProvider"

// Создаем QueryClient
const queryClient = new QueryClient()

// Обертка для рендеринга
function AllTheProviders({ children }: { children: JSX.Element }) {
  return (
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AuthProvider>
          {children}
        </AuthProvider>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

// Перезапишем render из @testing-library/react, чтобы использовать кастомную обертку
export const customRender = (ui: React.ReactElement, options?: any) =>
  render(ui, { wrapper: AllTheProviders, ...options })

// Экспортируем customRender, чтобы использовать его в тестах
export * from "@testing-library/react"