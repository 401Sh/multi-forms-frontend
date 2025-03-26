import axios from "axios"
import { API_Client, API_URL } from "../utils/axios-instance"
import logger from "../utils/logger"

type Params = Record<string, any>

export async function send_secure_request(
  method: "get" | "post" | "put" | "delete" | "patch",
  url: string,
  setAuth: (isAuth: boolean) => void,
  params?: Params,
  data?: any
) {
  let token = localStorage.getItem("accessToken")

  try {
    const response = await API_Client.request({
      method,
      url,
      params,
      data,
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined
      }
    })

    const newToken = response.data.accessToken
    if (newToken) {
      localStorage.setItem("accessToken", newToken)
    }

    return response.data
  } catch (error: any) {
    if (error.response) {
      const status = error.response.status
      logger.info(status)

      if (status === 401) {
        try {
          const refreshResponse = await axios.post(
            `${API_URL}/auth/refresh`,
            undefined,
            {
              headers: {
                Authorization: `Bearer ${token}`
              }
            }
          )

          const refreshedToken = refreshResponse.data.accessToken

          if (refreshedToken) {
            localStorage.setItem("accessToken", refreshedToken)
            return send_secure_request(method, url, setAuth, data)
          }
        } catch (refreshError) {
          logger.error("Token refresh failed", refreshError)
          localStorage.removeItem("accessToken")
          setAuth(false)
        }
      }
    }
    throw error
  }
}
