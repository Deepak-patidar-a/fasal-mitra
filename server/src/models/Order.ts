import mongoose, { Document, Schema } from 'mongoose'

export interface IOrder extends Document {
  user: mongoose.Types.ObjectId
  listing: mongoose.Types.ObjectId
  quantity: number
  totalAmount: number
  razorpayOrderId: string
  status: 'pending' | 'paid' | 'failed'
  createdAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    listing: {
      type: Schema.Types.ObjectId,
      ref: 'Listing',
      required: true
    },
    quantity: { type: Number, required: true, default: 1 },
    totalAmount: { type: Number, required: true },
    razorpayOrderId: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending'
    }
  },
  { timestamps: true }
)

export default mongoose.model<IOrder>('Order', OrderSchema)