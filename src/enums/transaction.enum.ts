export enum PaymeMethod {
  CheckPerformTransaction = "CheckPerformTransaction",
  CheckTransaction = "CheckTransaction",
  CreateTransaction = "CreateTransaction",
  PerformTransaction = "PerformTransaction",
  CancelTransaction = "CancelTransaction",
  GetStatement = "GetStatement",
}

export enum PaymeErrorCode {
  InvalidAmount = -31001,
  UserNotFound = -31050,
  ProductNotFound = -31050,
  CantDoOperation = -31008,
  TransactionNotFound = -31003,
  AlreadyDone = -31060,
  Pending = -31050,
  InvalidAuthorization = -32504,
}

export const PaymeError = {
  InvalidAmount: {
    name: "InvalidAmount",
    code: -31001,
    message: {
      uz: "Noto'g'ri summa",
      ru: "Недопустимая сумма",
      en: "Invalid amount",
    },
  },
  UserNotFound: {
    name: "UserNotFound",
    code: -31050,
    message: {
      uz: "Biz sizning hisobingizni topolmadik.",
      ru: "Мы не нашли вашу учетную запись",
      en: "We couldn't find your account",
    },
  },
  ProductNotFound: {
    name: "ProductNotFound",
    code: -31050,
    message: {
      uz: "Biz mahsulotni topolmadik.",
      ru: "Нам не удалось найти товар.",
      en: "We could not find the product.",
    },
  },
  CantDoOperation: {
    name: "CantDoOperation",
    code: -31008,
    message: {
      uz: "Biz operatsiyani bajara olmaymiz",
      ru: "Мы не можем сделать операцию",
      en: "We can't do operation",
    },
  },
  TransactionNotFound: {
    name: "TransactionNotFound",
    code: -31003,
    message: {
      uz: "Tranzaktsiya topilmadi",
      ru: "Транзакция не найдена",
      en: "Transaction not found",
    },
  },
  AlreadyDone: {
    name: "AlreadyDone",
    code: -31060,
    message: {
      uz: "Mahsulot uchun to'lov qilingan",
      ru: "Оплачено за товар",
      en: "Paid for the product",
    },
  },
  Pending: {
    name: "Pending",
    code: -31050,
    message: {
      uz: "Mahsulot uchun to'lov kutilayapti",
      ru: "Ожидается оплата товар",
      en: "Payment for the product is pending",
    },
  },
  InvalidAuthorization: {
    name: "InvalidAuthorization",
    code: -32504,
    message: {
      uz: "Avtorizatsiya yaroqsiz",
      ru: "Авторизация недействительна",
      en: "Authorization invalid",
    },
  },
}

export enum PaymeData {
  UserId = "user_id",
  OrderId = "order_id",
  ProductId = "product_id",
}

export enum PaymeTransactionState {
  Paid = 2,
  Pending = 1,
  PendingCanceled = -1,
  PaidCanceled = -2,
}

export enum ClickError {
  Success = 0,
  SignFailed = -1,
  InvalidAmount = -2,
  ActionNotFound = -3,
  AlreadyPaid = -4,
  UserNotFound = -5,
  TransactionNotFound = -6,
  BadRequest = -8,
  TransactionCanceled = -9,
}

export enum ClickAction {
  Prepare = 0,
  Complete = 1,
}

export enum ClickTransactionStatus {
  Pending = "PENDING",
  Paid = "PAID",
  Canceled = "CANCELED",
}
