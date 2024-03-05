import PaymeTransaction from "../models/paymeTransaction.model"
import ClickTransaction from "../models/clickTransaction.model"

class TransactionRepo {
  private model: typeof PaymeTransaction | typeof ClickTransaction

  constructor(model: typeof PaymeTransaction) {
    this.model = model
  }

  async create(data: any) {
    return await this.model.create(data)
  }

  async getById(transactionId: string) {
    return this.model.findOne({ id: transactionId })
  }

  async getByFilter(filter: any) {
    return this.model.findOne(filter)
  }

  async updateById(transactionId: string, update: any) {
    return this.model.findOneAndUpdate({ id: transactionId }, update)
  }
}

export const PaymeTransactionRepo = new TransactionRepo(PaymeTransaction)

export const ClickTransactionRepo = new TransactionRepo(ClickTransaction)
