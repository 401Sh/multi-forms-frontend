import { BrowserRouter } from 'react-router'
import AppRoutes from './AppRoutes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

function App() {
  localStorage.setItem("accessToken", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJmN2M5ZjJiNC0yMDgzLTRkNjktODUzMS03MjJiMzMwMzY3MzIiLCJsb2dpbiI6IkdyYWhhbTg4IiwiaWF0IjoxNzQyNzkwODk2LCJleHAiOjE3NDI4NzcyOTZ9.RBfQAHmb0y5LXUp1g62RFSbEtgakzBBfCgx_8I8oo8I");

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
