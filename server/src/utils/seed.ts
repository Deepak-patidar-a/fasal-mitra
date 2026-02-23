import mongoose from 'mongoose'
import dotenv from 'dotenv'
import Crop from '../models/Crop'
import Disease from '../models/Disease'
import Product from '../models/Product'
import Listing from '../models/Listing'

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
  
  // Create products
    const fungicide = await Product.create({
    name: { en: 'Mancozeb Fungicide', hi: 'मैन्कोज़ेब फफूंदनाशक' },
    type: 'pesticide',
    description: {
        en: 'Broad spectrum fungicide effective against blight and rust diseases.',
        hi: 'व्यापक स्पेक्ट्रम फफूंदनाशक जो झुलसा और रतुआ रोगों के विरुद्ध प्रभावी है।'
    },
    images: []
    })

    const fertilizer = await Product.create({
    name: { en: 'DAP Fertilizer', hi: 'डीएपी खाद' },
    type: 'fertilizer',
    description: {
        en: 'Di-ammonium phosphate fertilizer for strong root development.',
        hi: 'मजबूत जड़ विकास के लिए डाई-अमोनियम फॉस्फेट खाद।'
    },
    images: []
    })

    // Create listings for fungicide
    const listing1 = await Listing.create({
    product: fungicide._id,
    seller: { name: 'Krishi Store Indore', contact: '9876543210' },
    price: 450,
    stock: 100,
    deliveryDays: 2
    })

    const listing2 = await Listing.create({
    product: fungicide._id,
    seller: { name: 'AgriMart Online', contact: '9123456789' },
    price: 420,
    stock: 50,
    deliveryDays: 4
    })

    const listing3 = await Listing.create({
    product: fungicide._id,
    seller: { name: 'Kisan Bazaar', contact: '9988776655' },
    price: 480,
    stock: 200,
    deliveryDays: 1
    })

    // Create listings for fertilizer
    const listing4 = await Listing.create({
    product: fertilizer._id,
    seller: { name: 'Krishi Store Indore', contact: '9876543210' },
    price: 1350,
    stock: 500,
    deliveryDays: 2
    })

    const listing5 = await Listing.create({
    product: fertilizer._id,
    seller: { name: 'AgriMart Online', contact: '9123456789' },
    price: 1299,
    stock: 300,
    deliveryDays: 3
    })

    // Link listings to products
    await Product.findByIdAndUpdate(fungicide._id, {
    listings: [listing1._id, listing2._id, listing3._id]
    })

    await Product.findByIdAndUpdate(fertilizer._id, {
    listings: [listing4._id, listing5._id]
    })

    // Link products to diseases
    await Disease.findByIdAndUpdate(blightDisease._id, {
    products: [fungicide._id, fertilizer._id]
    })

    await Disease.findByIdAndUpdate(rustDisease._id, {
    products: [fungicide._id]
    })

  console.log('Seed data inserted 🌱')
  process.exit(0)
}

seedData().catch((err) => {
  console.error(err)
  process.exit(1)
})
