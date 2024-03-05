import dotenv from "dotenv"
dotenv.config()

export default {
  // Database
  MONGO_URI: process.env.MONGO_URI,

  // Monday.com
  MONDAY_API_TOKEN: process.env.MONDAY_API_TOKEN,
  CONTACT_FORM_BOARD_ID: process.env.CONTACT_FORM_BOARD_ID,
  USERS_BOARD_ID: process.env.USERS_BOARD_ID,
  SUBSCRIBERS_BOARD_ID: process.env.SUBSCRIBERS_BOARD_ID,

  // Payme
  PAYME_MERCHANT_KEY: process.env.PAYME_MERCHANT_KEY,
  PAYME_MERCHANT_ID: process.env.PAYME_MERCHANT_ID,
  PAYME_TOKEN:
    process.env.PAYME_TOKEN || "oBGi3neVO8BcZD?CrkNfRFgfKYk%XxFkw#pG",
  PAYME_LOGIN: process.env.PAYME_LOGIN || "Paycom",
  PAYME_PASSWORD: process.env.PAYME_PASSWORD,

  // Click
  CLICK_MERCHANT_ID: process.env.CLICK_MERCHANT_ID,
  CLICK_MERCHANT_USER_ID: process.env.CLICK_MERCHANT_USER_ID,
  CLICK_SERVICE_ID: process.env.CLICK_SERVICE_ID,
  CLICK_SECRET_KEY: process.env.CLICK_SECRET_KEY,

  // Mail
  MAIL: "no-reply@sbg.co.uz",
  MAIL_PASS: process.env.MAIL_PASS,

  // Others
  PORT: process.env.PORT || 8000,
  CLIENT_DOMAIN: process.env.CLIENT_DOMAIN,
  COURSE_PRICE: process.env.COURSE_PRICE,
}
