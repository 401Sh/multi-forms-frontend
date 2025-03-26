import { BrowserRouter } from 'react-router'
import AppRoutes from './AppRoutes'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './hooks/AuthProvider'
import NavTab from './components/NavTab'

const queryClient = new QueryClient()

function App() {
  
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <>
          <NavTab />
          <AppRoutes />
          </>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
