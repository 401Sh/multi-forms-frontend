import axios from "axios"

const host = import.meta.env.VITE_API_HOST
const port = import.meta.env.VITE_API_PORT

if (!port || !host) {
  throw Error("host or port is undefined")
}

const axiosInstance = axios.create({
  baseURL: `${host}:${port}`,
  headers: {
    'Content-Type': 'application/json',
  },
})

export default axiosInstance
