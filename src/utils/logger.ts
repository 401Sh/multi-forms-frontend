import pino from "pino"

const logLevel = import.meta.env.VITE_LOG_LEVEL || "info"

const logger = pino({
  level: logLevel,  // "info", "warn", "error"
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "SYS:standard",
      ignore: "pid,hostname"
    }
  }
})

export default logger
