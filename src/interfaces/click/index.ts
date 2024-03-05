import { ClickError } from "../../enums/transaction.enum"

export interface IClickFail {
  error: ClickError
  error_note: string
  click_trans_id?: undefined
  merchant_trans_id?: undefined
  merchant_prepare_id?: undefined
}

export interface IClickSuccess {
  click_trans_id: string
  merchant_trans_id: string
  merchant_prepare_id: number
  error: ClickError
  error_note: string
}
