import mongoose, { Document } from "mongoose"

interface Transaction extends Document {
  id: string
  user_id: string
  state: number
  amount: number
  create_time: number
  perform_time: number
  cancel_time: number
  reason: number | null
}

const transactionSchema = new mongoose.Schema<Transaction>(
  {
    id: {
      type: String,
      required: true,
    },
    user_id: {
      type: String,
      required: true,
    },
    state: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    create_time: {
      type: Number,
      default: Date.now(),
    },
    perform_time: {
      type: Number,
      default: 0,
    },
    cancel_time: {
      type: Number,
      default: 0,
    },
    reason: {
      type: Number,
      default: null,
    },
  },
  {
    timestamps: true,
  }
)

const Transaction =
  mongoose.models.paymeTransactions ||
  mongoose.model<Transaction>("paymeTransactions", transactionSchema)

export default Transaction
