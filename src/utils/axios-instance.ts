import axios from "axios"

const protocol = import.meta.env.VITE_API_PROTOCOL
const host = import.meta.env.VITE_API_HOST
const port = import.meta.env.VITE_API_PORT

if (!protocol || !port || !host) {
  throw Error("host or port is undefined")
}

export const API_URL = `${protocol}://${host}:${port}/api`

export const API_Client = axios.create({
  baseURL: API_URL
})