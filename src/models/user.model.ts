import Joi from "joi"
import mongoose, { Document, Model } from "mongoose"

interface UserAttributes {
  email: string
  fullName: string
  paid: boolean
  amount?: number
  transaction?: string
  itemId?: number
}

interface UserDocument extends Document, UserAttributes {}

interface UserModel extends Model<UserDocument> {}

const userSchema = new mongoose.Schema<UserDocument, UserModel>({
  email: { type: String, required: [true, "Please provide email"] },
  fullName: { type: String, required: [true, "Please provide email"] },
  paid: { type: Boolean, default: false, required: true },
  amount: { type: Number },
  transaction: { type: String },
  itemId: { type: Number },
})

const User =
  (mongoose.models.users as UserModel) ||
  mongoose.model<UserDocument, UserModel>("users", userSchema)

export const validateUser = (user: UserAttributes) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    fullName: Joi.string().min(1).required(),
  })

  return schema.validate(user)
}

export const validateContactForm = (user: any) => {
  const schema = Joi.object({
    phone: Joi.string().min(13).required(),
    name: Joi.string().min(1).required(),
    message: Joi.string().optional(),
  })

  return schema.validate(user)
}

export default User
