import { NextFunction, Request, Response } from "express"
import TransactionError from "../errors/payme/transaction.error"
import { PaymeError } from "../enums/transaction.enum"
import env from "../configs/envs"

export const basicAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"]

  const paymeUsername = env.PAYME_LOGIN
  const paymePassword = env.PAYME_TOKEN

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.json({
      error: PaymeError.InvalidAuthorization,
      id: req.body.id,
    })
  }

  const base64Credentials = authHeader.split(" ")[1]
  const credentials = Buffer.from(base64Credentials, "base64").toString("ascii")
  const [username, password] = credentials.split(":")

  if (username !== paymeUsername || password !== paymePassword) {
    return res.json({
      error: PaymeError.InvalidAuthorization,
      id: req.body.id,
    })
  }

  next()
}

export const restrictIP = (req: Request, res: Response, next: NextFunction) => {
  const allowedIPs = [
    "185.178.51.131",
    "185.178.51.132",
    "195.158.31.134",
    "195.158.31.10",
    "195.158.28.124",
    "195.158.5.82",
  ]
  let clientIP: string | undefined =
    typeof req.headers["x-forwarded-for"] === "string"
      ? req.headers["x-forwarded-for"]
      : Array.isArray(req.headers["x-forwarded-for"])
      ? req.headers["x-forwarded-for"][0]
      : req.connection.remoteAddress

  if (!clientIP || !allowedIPs.includes(clientIP)) {
    return res.json({
      error: PaymeError.InvalidAuthorization,
      id: req.body.id,
    })
  }

  next()
}

export const PaymeErrorHandler = (error: any, req: Request, res: Response) => {
  if (error.isTransactionError) {
    return res.json({
      error: {
        code: error.transactionErrorCode,
        message: error.transactionErrorMessage,
        data: error.transactionData,
      },
      id: error.transactionId,
    })
  }

  res.status(error.statusCode || 500).json({
    error,
  })
}
