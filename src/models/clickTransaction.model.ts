import mongoose, { Document } from "mongoose"
import { ClickTransactionStatus } from "../enums/transaction.enum"

interface Transaction extends Document {
  id: string
  user_id: string
  product_id: string
  status: ClickTransactionStatus
  amount: number
  create_time: number
  perform_time: number
  cancel_time: number
  prepare_id: string
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
    product_id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: Object.values(ClickTransactionStatus),
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
    prepare_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Transaction =
  mongoose.models.clickTransaction ||
  mongoose.model<Transaction>("clickTransaction", transactionSchema)

export default Transaction
