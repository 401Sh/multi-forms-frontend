import pino from "pino"

const logger = pino({
  level: "debug",  // "info", "warn", "error"
  transport: {
    target: "pino-pretty",
    options: {
      translateTime: "SYS:standard",
      ignore: "pid,hostname"
    }
  }
})

export default logger
