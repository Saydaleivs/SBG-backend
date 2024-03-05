import express from "express"
import { paymeTransaction } from "../controllers/payment.controllers"
import { clickTransaction } from "../controllers/payment.controllers"
import {
  basicAuth,
  restrictIP,
  PaymeErrorHandler,
} from "../middlewares/payme.auth"
export const router = express.Router()

router.get("/details", paymeTransaction.paymentDetails)

router.post(
  "/payme",
  basicAuth,
  restrictIP,
  paymeTransaction.payme,
  PaymeErrorHandler
)

router.post("/click/prepare", clickTransaction.prepare)

router.post("/click/complete", clickTransaction.complete)
