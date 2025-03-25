import axios from "axios"
import logger from "./logger"

const protocol = import.meta.env.VITE_API_PROTOCOL
const host = import.meta.env.VITE_API_HOST
const port = import.meta.env.VITE_API_PORT

if (!protocol || !port || !host) {
  throw Error("host or port is undefined")
}

const axiosPrivate = axios.create({
  baseURL: `${protocol}${host}:${port}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Добавляем интерсептор для автоматического добавления токена
axiosPrivate.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken") // Или другой способ хранения токена

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

axiosPrivate.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const token = localStorage.getItem("accessToken")

        if (!token) {
          logger.debug("Cannot refresh tokens. Access token is missing")
          throw new Error("Access token is missing")
        }
        
        const response = await axios.post(
          `${protocol}${host}:${port}/api/auth/refresh`,
          undefined,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )
        const { accessToken } = response.data

        localStorage.setItem("accessToken", accessToken)

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return axios(originalRequest)
      } catch (error: any) {
        // Handle refresh token error or redirect to login
        logger.error("Error while refreshing token: ", error.response.data)
        localStorage.removeItem("accessToken")
      }
    }

    return Promise.reject(error)
  }
)

export default axiosPrivate
