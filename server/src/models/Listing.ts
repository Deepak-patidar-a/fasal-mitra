import mongoose, { Document, Schema } from 'mongoose'

export interface IListing extends Document {
  product: mongoose.Types.ObjectId
  seller: {
    name: string
    contact: string
  }
  price: number
  stock: number
  deliveryDays: number
  createdAt: Date
}

const ListingSchema = new Schema<IListing>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    seller: {
      name: { type: String, required: true },
      contact: { type: String, required: true }
    },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    deliveryDays: { type: Number, required: true, default: 3 }
  },
  { timestamps: true }
)

export default mongoose.model<IListing>('Listing', ListingSchema)