import * as crypto from "crypto"
import environments from "../configs/envs"

export const checkClickSignature = (
  data: {
    transId: string
    serviceId: string
    userId: string
    merchantPrepareId?: string
    amount: string
    action: string
    signTime: string
  },
  signString: string
): boolean => {
  const {
    transId,
    serviceId,
    userId,
    merchantPrepareId,
    amount,
    action,
    signTime,
  } = data

  const CLICK_SECRET_KEY = environments.CLICK_SECRET_KEY

  const prepareId = merchantPrepareId || ""

  const signature = `${transId}${serviceId}${CLICK_SECRET_KEY}${userId}${prepareId}${amount}${action}${signTime}`

  const signatureHash = crypto.createHash("md5").update(signature).digest("hex")

  return signatureHash === signString
}
