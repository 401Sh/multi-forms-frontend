import axios from "axios"

const protocol = import.meta.env.VITE_API_PROTOCOL
const host = import.meta.env.VITE_API_HOST
const port = import.meta.env.VITE_API_PORT

if (!protocol || !port || !host) {
  throw Error("host or port is undefined")
}

const axiosInstance = axios.create({
  baseURL: `${protocol}${host}:${port}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Добавляем интерсептор для автоматического добавления токена
axiosInstance.interceptors.request.use(
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

export default axiosInstance
