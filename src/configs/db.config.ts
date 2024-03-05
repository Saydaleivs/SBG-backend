import mongoose from "mongoose"
import env from "../configs/envs"

const MONGO_URI = env.MONGO_URI

const connectDB = async () => {
  if (!MONGO_URI) {
    throw new Error("Mongo uri is undefined")
  }

  try {
    const connection = await mongoose.connect(MONGO_URI)
    console.log("MongoDB connected:", connection.connection.host)
  } catch (error) {
    console.error("Error connecting to MongoDB:", error)
    process.exit(1) // Exit process with failure
  }
}

export default connectDB
