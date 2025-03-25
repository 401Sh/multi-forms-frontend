import axios from "axios"

const protocol = import.meta.env.VITE_API_PROTOCOL
const host = import.meta.env.VITE_API_HOST
const port = import.meta.env.VITE_API_PORT

if (!protocol || !port || !host) {
  throw Error("host or port is undefined")
}

const axiosPublic = axios.create({
  baseURL: `${protocol}${host}:${port}/api`,
  headers: {
    'Content-Type': 'application/json'
  }
})


export default axiosPublic