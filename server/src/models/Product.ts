import mongoose, { Document, Schema } from 'mongoose'

export interface IProduct extends Document {
  name: { en: string; hi: string }
  type: 'fertilizer' | 'pesticide'
  description: { en: string; hi: string }
  images: string[]
  listings: mongoose.Types.ObjectId[]
  createdAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      en: { type: String, required: true },
      hi: { type: String, required: true }
    },
    type: {
      type: String,
      enum: ['fertilizer', 'pesticide'],
      required: true
    },
    description: {
      en: { type: String, required: true },
      hi: { type: String, required: true }
    },
    images: [{ type: String }],
    listings: [{ type: Schema.Types.ObjectId, ref: 'Listing' }]
  },
  { timestamps: true }
)

export default mongoose.model<IProduct>('Product', ProductSchema)