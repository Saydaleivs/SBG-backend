import { Request, Response, NextFunction } from "express"
import paymeTransactionService from "../services/payme.service"
import clickTransactionService, {
  TransactionData,
} from "../services/click.service"
import { PaymeMethod } from "../enums/transaction.enum"
import User from "../models/user.model"
import env from "../configs/envs"
import { mondayService } from "./monday.controllers"
import { IClickFail, IClickSuccess } from "../interfaces/click"

interface ClickTransactionService {
  prepare(data: TransactionData): Promise<IClickSuccess | IClickFail>
  complete(data: TransactionData): Promise<IClickSuccess | IClickFail>
}

class ClickTransactionController {
  private service: ClickTransactionService

  constructor(service: ClickTransactionService) {
    this.service = service
  }

  async prepare(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body
      console.log(data)

      const result = await this.service.prepare(data)

      res
        .set({
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        })
        .send(result)
    } catch (err: any) {
      res.status(err?.statusCode).json({
        err,
      })
    }
  }

  async complete(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body

      const result = await this.service.complete(data)

      res
        .set({
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        })
        .send(result)
    } catch (err: any) {
      res.status(err?.statusCode).json({
        err,
      })
    }
  }
}

class PaymeTransactionController {
  private service: any // Adjust this to the actual type of transactionService

  constructor(service: any) {
    this.service = service
    this.payme = this.payme.bind(this)
  }

  async payme(req: Request, res: Response, next: NextFunction) {
    try {
      const { method, params, id } = req.body

      switch (method) {
        case PaymeMethod.CheckPerformTransaction: {
          await this.service.checkPerformTransaction(params, id)
          return res.json({ result: { allow: true } })
        }
        case PaymeMethod.CheckTransaction: {
          const result = await this.service.checkTransaction(params, id)
          return res.json({ result, id })
        }
        case PaymeMethod.CreateTransaction: {
          const result = await this.service.createTransaction(params, id)
          return res.json({ result, id })
        }
        case PaymeMethod.PerformTransaction: {
          const result = await this.service.performTransaction(params, id)
          return res.json({ result, id })
        }
        case PaymeMethod.CancelTransaction: {
          const result = await this.service.cancelTransaction(params, id)
          return res.json({ result, id })
        }
        default: {
          throw new Error("Invalid Payme method")
        }
      }
    } catch (error: any) {
      console.log(next(error))

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
  }

  async paymentDetails(req: Request, res: Response) {
    const { id } = req.query
    if (!id) return res.status(400).send("id is not provided")

    const user = await User.findById(id)
    if (!user) {
      return res.status(404).send("User not found")
    }

    if (user.paid) {
      return res.status(400).send("User already paid")
    }

    if (!user.itemId) {
      await mondayService
        .addRegisteredUser(user.fullName, user.email)
        .then(async (response: any) => {
          const itemId = response.data.data.create_item.id
          await User.findByIdAndUpdate(user._id, { itemId })
        })
        .catch((err: any) => {
          return res.status(500).send(err)
        })
    }

    const clickMerchantDetails = {
      merchant_id: env.CLICK_MERCHANT_ID,
      merchant_user_id: env.CLICK_MERCHANT_USER_ID,
      service_id: env.CLICK_SERVICE_ID,
      order_id: user._id,
      amount: user.amount,
    }

    const paymeMerchantDetails = {
      merchant_id: env.PAYME_MERCHANT_ID,
      order_id: user._id,
      amount: user.amount! * 100,
    }

    return res.send({
      click: clickMerchantDetails,
      payme: paymeMerchantDetails,
    })
  }
}

export const paymeTransaction = new PaymeTransactionController(
  paymeTransactionService
)

export const clickTransaction = new ClickTransactionController(
  clickTransactionService as any
)

// export new ClickTransactionController(clickTransactionService)
