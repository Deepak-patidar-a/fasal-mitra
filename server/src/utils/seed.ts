import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Crop from '../models/Crop'
import Disease from '../models/Disease'

dotenv.config()

const seedData = async () => {
  await mongoose.connect(process.env.MONGODB_URI as string)
  console.log('Connected to MongoDB')

  // Clear existing
  await Crop.deleteMany({})
  await Disease.deleteMany({})

  // Create diseases first
  const blightDisease = await Disease.create({
    name: { en: 'Wheat Blight', hi: 'गेहूं का झुलसा' },
    slug: 'wheat-blight',
    symptoms: {
      en: 'Brown spots on leaves, wilting, yellowing of tips',
      hi: 'पत्तियों पर भूरे धब्बे, मुरझाना, सिरों का पीला पड़ना'
    },
    prevention: {
      en: 'Use resistant varieties, avoid overhead irrigation, apply fungicide',
      hi: 'प्रतिरोधी किस्मों का उपयोग करें, ऊपर से सिंचाई से बचें, फफूंदनाशक लगाएं'
    },
    severity: 'high',
    images: [],
    products: []
  })

  const rustDisease = await Disease.create({
    name: { en: 'Wheat Rust', hi: 'गेहूं का रतुआ' },
    slug: 'wheat-rust',
    symptoms: {
      en: 'Orange-red pustules on leaves and stems',
      hi: 'पत्तियों और तनों पर नारंगी-लाल फुंसियां'
    },
    prevention: {
      en: 'Apply fungicide early, use certified seeds',
      hi: 'जल्दी फफूंदनाशक लगाएं, प्रमाणित बीजों का उपयोग करें'
    },
    severity: 'medium',
    images: [],
    products: []
  })

  // Create wheat crop
  await Crop.create({
    name: { en: 'Wheat', hi: 'गेहूं' },
    slug: 'wheat',
    type: 'Rabi',
    season: { en: 'October to March', hi: 'अक्टूबर से मार्च' },
    irrigationNeeds: { en: 'Moderate — 4 to 5 irrigations', hi: 'मध्यम — 4 से 5 सिंचाई' },
    soilType: { en: 'Loamy and Clay Loam', hi: 'दोमट और चिकनी दोमट मिट्टी' },
    images: [],
    diseases: [blightDisease._id, rustDisease._id]
  })

  // Update diseases with crop reference
  await Disease.updateMany(
    { _id: { $in: [blightDisease._id, rustDisease._id] } },
    { $push: { crops: (await Crop.findOne({ slug: 'wheat' }))?._id } }
  )

  console.log('Seed data inserted 🌱')
  process.exit(0)
}

seedData().catch((err) => {
  console.error(err)
  process.exit(1)
})