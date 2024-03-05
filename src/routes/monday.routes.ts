import express from "express"
import {
  addDealController,
  mondayService,
} from "../controllers/monday.controllers"
import userRepo from "../repositories/user.repo"
import { Users } from "../enums/monday.enum"

export const router = express.Router()

router.post("/contact-form", addDealController)

router.get("/test", async (req, res) => {
  const response = await mondayService.getGroups(Users.BOARD_ID)
  res.json(response.data)
})
