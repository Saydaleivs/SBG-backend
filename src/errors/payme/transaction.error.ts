import { PaymeErrorMessage, PaymeErrorObject } from "../../interfaces/payme"
import BaseError from "./base.error"

class TransactionError extends BaseError {
  transactionErrorCode: number
  transactionErrorMessage: PaymeErrorMessage
  transactionData: any // Type according to your data structure
  transactionId: string
  isTransactionError: boolean

  constructor(transactionError: PaymeErrorObject, id: string, data?: any) {
    super(transactionError.name, transactionError.code)

    this.transactionErrorCode = transactionError.code
    this.transactionErrorMessage = transactionError.message
    this.transactionData = data
    this.transactionId = id
    this.isTransactionError = true
  }
}

export default TransactionError
