import { PaymeTransactionRepo } from "../repositories/transaction.repo"
import UserRepo from "../repositories/user.repo"
import {
  PaymeError,
  PaymeData,
  PaymeTransactionState,
} from "../enums/transaction.enum"
import TransactionError from "../errors/payme/transaction.error"
import { mondayService } from "../controllers/monday.controllers"

interface Account {
  order_id: string
}

interface TransactionParams {
  id: string
  account: Account
  time?: number
  amount?: number
  reason?: number
}

class TransactionService {
  constructor(
    private repo: typeof PaymeTransactionRepo,
    private userRepo: typeof UserRepo
  ) {}

  async checkPerformTransaction(params: TransactionParams, id: string) {
    const {
      account: { order_id: orderId },
    } = params
    let { amount } = params
    amount = Math.floor((amount || 0) / 100)

    const user = await this.userRepo.getById(orderId)
    if (!user) {
      throw new TransactionError(PaymeError.UserNotFound, id, PaymeData.OrderId)
    }

    const transaction = await this.repo.getByFilter({ user_id: orderId })
    if (transaction) {
      if (transaction.state !== PaymeTransactionState.Pending)
        throw new TransactionError(PaymeError.ProductNotFound, id)
    }

    if (user.amount !== amount) {
      throw new TransactionError(PaymeError.InvalidAmount, id, "")
    }
  }

  async checkTransaction(params: TransactionParams, id: string) {
    const transaction = await this.repo.getById(params.id)

    if (!transaction) {
      throw new TransactionError(PaymeError.TransactionNotFound, id)
    }

    return {
      create_time: transaction.create_time,
      perform_time: transaction.perform_time,
      cancel_time: transaction.cancel_time,
      transaction: transaction.id,
      state: transaction.state,
      reason: transaction.reason,
    }
  }

  async createTransaction(params: TransactionParams, id: string) {
    const {
      account: { order_id: userId },
      time,
    } = params
    let { amount } = params
    amount = Math.floor((amount || 0) / 100)

    await this.checkPerformTransaction(params, id)

    let transaction = await this.repo.getById(params.id)
    if (transaction) {
      if (transaction.state !== PaymeTransactionState.Pending) {
        throw new TransactionError(PaymeError.CantDoOperation, id)
      }

      const currentTime = Date.now()
      const expirationTime =
        (currentTime - transaction.create_time) / 60000 < 12 // 12m

      if (!expirationTime) {
        await this.repo.updateById(params.id, {
          state: PaymeTransactionState.PendingCanceled,
          reason: 4,
        })

        throw new TransactionError(PaymeError.CantDoOperation, id)
      }

      return {
        create_time: transaction.create_time,
        transaction: transaction.id,
        state: PaymeTransactionState.Pending,
      }
    }

    transaction = await this.repo.getByFilter({ user_id: userId })

    if (transaction) {
      if (transaction.state === PaymeTransactionState.Paid)
        throw new TransactionError(PaymeError.AlreadyDone, id)
      if (transaction.state === PaymeTransactionState.Pending)
        throw new TransactionError(PaymeError.Pending, id)
    }

    const newTransaction = await this.repo.create({
      id: params.id,
      state: PaymeTransactionState.Pending,
      amount,
      user_id: userId,
      create_time: time,
    })

    await this.userRepo.addTransactionDetails(userId, newTransaction.id)

    return {
      transaction: newTransaction.id,
      state: PaymeTransactionState.Pending,
      create_time: newTransaction.create_time,
    }
  }

  async performTransaction(params: TransactionParams, id: string) {
    const currentTime = Date.now()

    const transaction = await this.repo.getById(params.id)
    if (!transaction) {
      throw new TransactionError(PaymeError.TransactionNotFound, id)
    }

    if (transaction.state !== PaymeTransactionState.Pending) {
      if (transaction.state !== PaymeTransactionState.Paid) {
        throw new TransactionError(PaymeError.CantDoOperation, id)
      }

      return {
        perform_time: transaction.perform_time,
        transaction: transaction.id,
        state: PaymeTransactionState.Paid,
      }
    }

    const expirationTime = (currentTime - transaction.create_time) / 60000 < 12 // 12m

    if (!expirationTime) {
      await this.repo.updateById(params.id, {
        state: PaymeTransactionState.PendingCanceled,
        reason: 4,
        cancel_time: currentTime,
      })

      throw new TransactionError(PaymeError.CantDoOperation, id, "")
    }

    await this.repo.updateById(params.id, {
      state: PaymeTransactionState.Paid,
      perform_time: currentTime,
    })

    await this.userRepo.userPaid(transaction.user_id)

    await mondayService.addSubscriber(transaction.user_id)

    return {
      perform_time: currentTime,
      transaction: transaction.id,
      state: PaymeTransactionState.Paid,
    }
  }

  async cancelTransaction(params: TransactionParams, id: string) {
    const transaction = await this.repo.getById(params.id)
    if (!transaction) {
      throw new TransactionError(PaymeError.TransactionNotFound, id)
    }

    const currentTime = Date.now()

    if (transaction.state > 0) {
      await this.repo.updateById(params.id, {
        state: -Math.abs(transaction.state),
        reason: params.reason,
        cancel_time: currentTime,
      })
    }

    return {
      cancel_time: transaction.cancel_time || currentTime,
      transaction: transaction.id,
      state: -Math.abs(transaction.state),
    }
  }
}

export default new TransactionService(PaymeTransactionRepo, UserRepo)
