import { isValidObjectId } from "mongoose"
import User from "../models/user.model"

class UserRepo {
  private model: typeof User

  constructor(model: typeof User) {
    this.model = model
  }

  async getById(userId: string) {
    if (!isValidObjectId(userId)) return null

    return this.model.findById(userId)
  }

  async addTransactionDetails(userId: string, transactionId: string) {
    if (!isValidObjectId(userId)) return null

    return this.model.findOneAndUpdate(
      { _id: userId },
      { transaction: transactionId }
    )
  }

  async userPaid(userId: string) {
    if (!isValidObjectId(userId)) return null

    return this.model.findByIdAndUpdate(userId, { paid: true })
  }
}

export default new UserRepo(User)
