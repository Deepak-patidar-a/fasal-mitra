import mongoose, { Document, Schema } from 'mongoose'

export interface ICrop extends Document {
  name: { en: string; hi: string }
  slug: string
  type: 'Kharif' | 'Rabi' | 'Zaid'
  season: { en: string; hi: string }
  irrigationNeeds: { en: string; hi: string }
  soilType: { en: string; hi: string }
  images: string[]
  diseases: mongoose.Types.ObjectId[]
  createdAt: Date
}

const CropSchema = new Schema<ICrop>(
  {
    name: {
      en: { type: String, required: true },
      hi: { type: String, required: true }
    },
    slug: { type: String, required: true, unique: true, lowercase: true },
    type: { type: String, enum: ['Kharif', 'Rabi', 'Zaid'], required: true },
    season: {
      en: { type: String, required: true },
      hi: { type: String, required: true }
    },
    irrigationNeeds: {
      en: { type: String, required: true },
      hi: { type: String, required: true }
    },
    soilType: {
      en: { type: String, required: true },
      hi: { type: String, required: true }
    },
    images: [{ type: String }],
    diseases: [{ type: Schema.Types.ObjectId, ref: 'Disease' }]
  },
  { timestamps: true }
)

export default mongoose.model<ICrop>('Crop', CropSchema)