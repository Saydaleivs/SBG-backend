import express from "express"
import cors from "cors"
import winston from "winston"
import connectDB from "./configs/db.config"
import env from "./configs/envs"

import { router as paymentRouter } from "./routes/payment.routes"
import { router as authRouter } from "./routes/auth.routes"
import { router as mondayRouter } from "./routes/monday.routes"

const app = express()

const { createLogger, format, transports } = winston

const logger = createLogger({
  level: "info",
  format: format.simple(),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logfile.log" }),
  ],
})

// Middlewares
app.use(cors())
app.use(express.json())

// Routes
app.use("/payment", paymentRouter)
app.use("/auth", authRouter)
app.use("/crm", mondayRouter)

const PORT = env.PORT

connectDB()
  .then(() => {
    app.listen(PORT, () => logger.info("Listening port " + PORT))
  })
  .catch((error) => {
    logger.error("Error starting server:" + error)
  })
