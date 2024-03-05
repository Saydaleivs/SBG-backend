import env from "../configs/envs"

export enum MondayDetails {
  API_TOKEN = env.MONDAY_API_TOKEN as any,
  API_URL = "https://api.monday.com/v2/",
}

export enum ContactForm {
  GROUP_ID = "clients",
  BOARD_ID = env.CONTACT_FORM_BOARD_ID as any,
}

export enum Users {
  GROUP_ID = "users",
  BOARD_ID = env.USERS_BOARD_ID as any,
}

export enum UserColumns {
  EMAIL = "email7",
  DATE = "date",
}

export enum Subscribers {
  GROUP_ID = "new_group",
  BOARD_ID = env.SUBSCRIBERS_BOARD_ID as any,
}

export enum SubscriberColumns {
  EMAIL = "text",
  PAYMENT_AMOUNT = "numbers",
  DATE = "date4",
}
