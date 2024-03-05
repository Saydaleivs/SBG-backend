import express from "express"
import { resgisterController } from "../controllers/auth.controllers"
export const router = express.Router()

router.post("/register", resgisterController)
