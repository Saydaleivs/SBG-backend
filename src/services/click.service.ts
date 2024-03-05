import { ClickTransactionRepo } from "../repositories/transaction.repo"
import UserRepo from "../repositories/user.repo"
import {
  ClickError,
  ClickAction,
  ClickTransactionStatus,
} from "../enums/transaction.enum"
import { checkClickSignature } from "../helpers/check-signature.helper"
import { mondayService } from "../controllers/monday.controllers"

export interface TransactionData {
  click_trans_id: string
  service_id: string
  merchant_trans_id: string
  product_id: string
  amount: string
  action: string
  sign_time: string
  sign_string: string
  merchant_prepare_id?: string
  error?: number
}

class TransactionService {
  private repo: typeof ClickTransactionRepo
  private userRepo: typeof UserRepo

  constructor(repo: typeof ClickTransactionRepo, userRepo: typeof UserRepo) {
    this.repo = repo
    this.userRepo = userRepo
  }

  async prepare(data: TransactionData) {
    const {
      click_trans_id: transId,
      service_id: serviceId,
      merchant_trans_id: userId,
      amount,
      action,
      sign_time: signTime,
      sign_string: signString,
    } = data

    const signatureData = {
      transId,
      serviceId,
      userId,
      amount,
      action,
      signTime,
    }
    console.log(signatureData)

    const checkSignature = checkClickSignature(signatureData, signString)
    if (!checkSignature) {
      return {
        error: ClickError.SignFailed,
        error_note: "Invalid sign",
      }
    }

    if (parseInt(action) !== ClickAction.Prepare) {
      return {
        error: ClickError.ActionNotFound,
        error_note: "Action not found",
      }
    }

    const isAlreadyPaid = await this.repo.getByFilter({
      userId,
      status: ClickTransactionStatus.Paid,
    })
    if (isAlreadyPaid) {
      return {
        error: ClickError.AlreadyPaid,
        error_note: "Already paid",
      }
    }

    const user = await this.userRepo.getById(userId)
    if (!user) {
      return {
        error: ClickError.UserNotFound,
        error_note: "User not found",
      }
    }

    if (parseInt(amount) !== user.amount) {
      return {
        error: ClickError.InvalidAmount,
        error_note: "Incorrect parameter amount",
      }
    }

    const transaction = await this.repo.getById(transId)
    if (transaction && transaction.status === ClickTransactionStatus.Canceled) {
      return {
        error: ClickError.TransactionCanceled,
        error_note: "Transaction canceled",
      }
    }

    const time = new Date().getTime()

    await this.repo.create({
      id: transId,
      user_id: userId,
      status: ClickTransactionStatus.Pending,
      create_time: time,
      amount,
      prepare_id: time,
    })

    return {
      click_trans_id: transId,
      merchant_trans_id: userId,
      merchant_prepare_id: time,
      error: ClickError.Success,
      error_note: "Success",
    }
  }

  async complete(data: TransactionData) {
    const {
      click_trans_id: transId,
      service_id: serviceId,
      merchant_trans_id: userId,
      merchant_prepare_id: prepareId,
      amount,
      action,
      sign_time: signTime,
      sign_string: signString,
      error,
    } = data

    const signatureData = {
      transId,
      serviceId,
      userId,
      prepareId,
      amount,
      action,
      signTime,
    }

    const checkSignature = checkClickSignature(signatureData, signString)
    if (!checkSignature) {
      return {
        error: ClickError.SignFailed,
        error_note: "Invalid sign",
      }
    }

    if (parseInt(action) !== ClickAction.Complete) {
      return {
        error: ClickError.ActionNotFound,
        error_note: "Action not found",
      }
    }

    const user = await this.userRepo.getById(userId)
    if (!user) {
      return {
        error: ClickError.UserNotFound,
        error_note: "User not found",
      }
    }

    const isPrepared = await this.repo.getByFilter({
      prepare_id: prepareId,
    })
    if (!isPrepared) {
      return {
        error: ClickError.TransactionNotFound,
        error_note: "Transaction not found",
      }
    }

    const isAlreadyPaid = await this.repo.getByFilter({
      userId,
      status: ClickTransactionStatus.Paid,
    })
    if (isAlreadyPaid) {
      return {
        error: ClickError.AlreadyPaid,
        error_note: "Already paid for course",
      }
    }

    if (parseInt(amount) !== user.amount) {
      return {
        error: ClickError.InvalidAmount,
        error_note: "Incorrect parameter amount",
      }
    }

    const transaction = await this.repo.getById(transId)
    if (transaction && transaction.status === ClickTransactionStatus.Canceled) {
      return {
        error: ClickError.TransactionCanceled,
        error_note: "Transaction canceled",
      }
    }

    const time = new Date().getTime()

    if (error! < 0) {
      await this.repo.updateById(transId, {
        status: ClickTransactionStatus.Canceled,
        cancel_time: time,
      })

      return {
        error: ClickError.TransactionNotFound,
        error_note: "Transaction not found",
      }
    }

    await this.repo.updateById(transId, {
      status: ClickTransactionStatus.Paid,
      perform_time: time,
    })

    await this.userRepo.userPaid(userId)

    await mondayService.addSubscriber(userId)

    return {
      click_trans_id: transId,
      merchant_trans_id: userId,
      merchant_confirm_id: time,
      error: ClickError.Success,
      error_note: "Success",
    }
  }
}

export default new TransactionService(ClickTransactionRepo, UserRepo)
