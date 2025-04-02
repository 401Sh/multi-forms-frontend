import { createContext, useState, useEffect, JSX, useContext } from 'react'
import { useNavigate } from 'react-router'

interface AuthContextType {
  isAuthenticated: boolean,
  setAuth: (isAuth: boolean) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const navigate = useNavigate()

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    setIsAuthenticated(!!accessToken)
  }, [])

  function logout() {
    setIsAuthenticated(false)
    localStorage.removeItem("accessToken")
    navigate('/auth/signin')
  }

  function setAuth(isAuth: boolean) {
    if (isAuth) setIsAuthenticated(true)
    else logout()
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setAuth, logout }}>
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