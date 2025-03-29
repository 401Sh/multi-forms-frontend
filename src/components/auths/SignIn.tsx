import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import logger from "../../utils/logger"
import { useNavigate } from "react-router"
import { API_Client } from "../../utils/axios-instance"
import { useAuth } from "../../hooks/AuthProvider"
import "../../styles/main.style.scss"

async function signinRequest(
  userData: { login: string, password: string }
) {
  const response =  await API_Client.post("/auth/signin", userData)
  return response.data
}

function SignIn() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { setAuth } = useAuth()

  const mutation = useMutation({
    mutationFn: (newUser: { login: string, password: string }) => 
      signinRequest(newUser),
    onSuccess: (data) => {
      logger.debug("User signed in successfully", data)
      localStorage.setItem("accessToken", data.accessToken)
      setAuth(true)
      navigate("/profile")
    },
    onError: (error: any) => {
      logger.error("Error signing in", error)
      if (error.response && error.response.data) {
        setError(error.response.data.message || "An error occurred")
      } else {
        setError("Error signing in")
      }
    }
  })

  function handleSignIn() {
    if (!login.trim()) {
      setError("Login is required")
      return
    }
    if (!password.trim()) {
      setError("Password is required")
      return
    }
    // if (password.length < 4) {
    //   setError("Password must be at least 4 characters")
    //   return
    // }

    setError(null)

    const user = {
      login,
      password
    }
    
    mutation.mutate(user)
  }
  
  return (
    <div>
      <input
        type="text"
        placeholder="Input login"
        value={login}
        onChange={(e) => setLogin(e.target.value)}
      />
      <input
        type="password"
        placeholder="Input password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="error-message">{error}</p>}

      <div>
        <button className="button" onClick={handleSignIn}>Sign In</button>
      </div>
    </div>
  )
}

export default SignIn