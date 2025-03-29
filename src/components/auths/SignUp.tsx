import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import logger from "../../utils/logger"
import { useNavigate } from "react-router"
import { API_Client } from "../../utils/axios-instance"
import { useAuth } from "../../hooks/AuthProvider"

async function signupRequest(
  userData: { login: string, password: string }
) {
  const response =  await API_Client.post("/auth/signup", userData)
  return response.data
}

function SignUp() {
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()
  const { setAuth } = useAuth()

  const mutation = useMutation({
    mutationFn: (newUser: { login: string, password: string }) => 
      signupRequest(newUser),
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

  function handleSignUp() {
    if (!login.trim()) {
      setError("Login is required")
      return
    }
    if (!password.trim()) {
      setError("Password is required")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setError(null)

    const newUser = {
      login,
      password
    }
    
    mutation.mutate(newUser)
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
        type="text"
        placeholder="Input password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="password"
        placeholder="Confirm password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      />

      {error && <p className="error-message">{error}</p>}

      <div>
        <button onClick={handleSignUp}>Sign Up</button>
      </div>
    </div>
  )
}

export default SignUp