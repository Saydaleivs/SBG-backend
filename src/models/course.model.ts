import mongoose, { Document, Model } from "mongoose"

interface CourseAttributes {
  title: string
  price: number
}

interface CourseDocument extends Document, CourseAttributes {}

interface CourseModel extends Model<CourseDocument> {}

const courseSchema = new mongoose.Schema<CourseDocument, CourseModel>({
  title: { type: String, required: true },
  price: { type: Number, required: true },
})

const Course =
  (mongoose.models.courses as CourseModel) ||
  mongoose.model<CourseDocument, CourseModel>("courses", courseSchema)

export default Course
