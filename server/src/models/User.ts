import mongoose, { Document, Schema } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  phone: string
  passwordHash: string
  role: 'farmer' | 'expert'
  preferredLanguage: 'en' | 'hi'
  savedCrops: mongoose.Types.ObjectId[]
  searchHistory: string[]
  location: {
    state: string
    district: string
  }
  createdAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    phone: { type: String, required: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['farmer', 'expert'], default: 'farmer' },
    preferredLanguage: { type: String, enum: ['en', 'hi'], default: 'en' },
    savedCrops: [{ type: Schema.Types.ObjectId, ref: 'Crop' }],
    searchHistory: [{ type: String }],
    location: {
      state: { type: String, default: '' },
      district: { type: String, default: '' }
    }
  },
  { timestamps: true }
)

export default mongoose.model<IUser>('User', UserSchema)