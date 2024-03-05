import { Request, Response } from "express"
import User, { validateUser } from "../models/user.model"
import sendMail from "../utils/mail.utils"
import env from "../configs/envs"

export const resgisterController = async (req: Request, res: Response) => {
  const user = req.body
  const { error } = validateUser(user)
  if (error) return res.status(400).send(error.message)

  let isAvailableUser = await User.findOne({ email: user.email })

  if (!isAvailableUser) {
    const newUser = new User({
      fullName: user.fullName,
      email: user.email,
      paid: false,
      amount: env.COURSE_PRICE,
    })

    isAvailableUser = await newUser.save()
  }

  if (isAvailableUser.paid) {
    return res.status(400).send("За это email уже оплачено")
  }

  await sendMail(
    isAvailableUser.email,
    "Verification",
    "",
    "verification",
    isAvailableUser.fullName,
    `http://localhost:3000/payment/${isAvailableUser._id}`
  )
    .then(() => {
      res.status(201).send("Email has been sent successfully")
    })
    .catch((err) =>
      res.status(400).send(JSON.stringify(err.message || "error happened"))
    )
}
