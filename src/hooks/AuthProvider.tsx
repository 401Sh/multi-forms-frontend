import { createContext, useState, useEffect, JSX, useContext } from 'react'
import { useNavigate } from 'react-router';

interface AuthContextType {
  isAuthenticated: boolean,
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    
    if (accessToken) {
      setIsAuthenticated(true)
    } else {
      setIsAuthenticated(false)
      navigate('/login')
    }
  }, [navigate])

  function logout() {
    localStorage.removeItem("accessToken")
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}