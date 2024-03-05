export interface PaymeErrorMessage {
  uz: string
  ru: string
  en: string
}

export interface PaymeErrorObject {
  name: string
  code: number
  message: PaymeErrorMessage
}
