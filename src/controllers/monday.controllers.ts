import { Request, Response } from "express"
import MondayService from "../services/monday.services"
import { validateContactForm } from "../models/user.model"
import { MondayDetails } from "../enums/monday.enum"

export const mondayService = new MondayService(
  MondayDetails.API_URL.toString(),
  MondayDetails.API_TOKEN.toString()
)

export const addDealController = async (req: Request, res: Response) => {
  const { name, phone, message } = req.body

  const { error } = validateContactForm(req.body)
  if (error) return res.status(400).send(error.message)

  mondayService
    .addContactDeal(name, phone, message)
    .then(() => {
      res.send("Your message sent successfully")
    })
    .catch((err) => res.status(500).send(err.message))
}
