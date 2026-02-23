import mongoose, { Document, Schema } from 'mongoose'

export interface IDisease extends Document {
  name: { en: string; hi: string }
  slug: string
  crops: mongoose.Types.ObjectId[]
  symptoms: { en: string; hi: string }
  prevention: { en: string; hi: string }
  images: string[]
  severity: 'low' | 'medium' | 'high'
  products: mongoose.Types.ObjectId[]
  createdAt: Date
}

const DiseaseSchema = new Schema<IDisease>(
  {
    name: {
      en: { type: String, required: true },
      hi: { type: String, required: true }
    },
    slug: { type: String, required: true, unique: true, lowercase: true },
    crops: [{ type: Schema.Types.ObjectId, ref: 'Crop' }],
    symptoms: {
      en: { type: String, required: true },
      hi: { type: String, required: true }
    },
    prevention: {
      en: { type: String, required: true },
      hi: { type: String, required: true }
    },
    images: [{ type: String }],
    severity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    products: [{ type: Schema.Types.ObjectId, ref: 'Product' }]
  },
  { timestamps: true }
)

export default mongoose.model<IDisease>('Disease', DiseaseSchema)