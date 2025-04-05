import { useMutation, useQuery } from "@tanstack/react-query"
import logger from "../utils/logger"
import { send_secure_request } from "../api/authorized-request"
import { useEffect, useState } from "react"
import { useAuth } from "../hooks/AuthProvider"
import "../styles/main.style.scss"

async function updateProfileRequest(
  setAuth: (isAuth: boolean) => void,
  updateData: { login?: string, password?: string }
) {
  const response = await send_secure_request(
    "patch",
    "/users/self",
    setAuth,
    undefined,
    updateData
  )
  return response.data
}

async function deleteProfileRequest(
  setAuth: (isAuth: boolean) => void
) {
  const response = await send_secure_request(
    "delete",
    "/users/self",
    setAuth
  )
  return response.data
}

function ProfilePage() {
  const [userLogin, setUserLogin] = useState("")
  const [login, setLogin] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const { setAuth } = useAuth()

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["profile"],
    queryFn: () => send_secure_request("get", "/users/self", setAuth),
    placeholderData: (prev) => prev
  })

  useEffect(() => {
    if (data?.login) {
      setUserLogin(data.login)
    }
    if (isError) {
      setErrorMessage(error.message)
    }
  }, [data])
  
  
  function updateFields() {
    refetch()
    setSuccess("Profile updated successfully")
  }

  const updateMutation = useMutation({
    mutationFn: (updateData: { login?: string, password?: string }) => 
      updateProfileRequest(setAuth, updateData),
    onSuccess: () => {
      logger.info("Profile updated successfully")
      updateFields()
    },
    onError: (error: any) => {
      logger.error("Error updating profile", error.response.data)
      setErrorMessage("Failed to update profile: " + error.response.data.message)
    }
  })


  const deleteMutation = useMutation({
    mutationFn: () => deleteProfileRequest(setAuth),
    onSuccess: (_data) => {
      logger.info("Profile deleted successfully")
      setAuth(false)
    },
    onError: (error: any) => {
      logger.error("Error deleting profile", error.response.data)
      setErrorMessage("Failed to delete profile: " + error.response.data.message)
    }
  })

  function handleSave() {
    setSuccess(null)
    setErrorMessage(null)

    if (login.trim() === "" && password.trim() === "") {
      setErrorMessage("At least one field must be filled")
      return
    }

    if (password && password !== confirmPassword) {
      setErrorMessage("Passwords do not match")
      return
    }

    const updateData: Record<string, string> = {}

    if (login.trim()) updateData.login = login
    if (password.trim()) updateData.password = password

    updateMutation.mutate(updateData)
  }

  function handleDelete() {
    deleteMutation.mutate()
  }

  if (isLoading) {
    return <div className="container">Loading...</div>
  }
  
  return (
    <div className="container">
      <h1>profile page</h1>
      <h1>{userLogin}</h1>
      <div>
        <label htmlFor="login">Login</label>
        <input
          type="text"
          id="login"
          value={login}
          onChange={(e) => setLogin(e.target.value)}
          placeholder="Enter login"
        />
      </div>
      <div>
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
      </div>
      <div>
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm password"
        />
      </div>
      {success && <p className="success-message">{success}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <button className="button" onClick={handleSave}>Save changes</button>
      <button className="button" onClick={handleDelete}>Delete account</button>
    </div>
  )
}

export default ProfilePage