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
  await Product.deleteMany({})
  await Listing.deleteMany({})
  console.log('Cleared existing data')

  // ============================================================
  // DISEASES
  // ============================================================

  // WHEAT diseases
  const wheatBlight = await Disease.create({
    name: { en: 'Wheat Blight', hi: 'गेहूं का झुलसा' },
    slug: 'wheat-blight',
    symptoms: { en: 'Brown spots on leaves, wilting, yellowing of tips', hi: 'पत्तियों पर भूरे धब्बे, मुरझाना, सिरों का पीला पड़ना' },
    prevention: { en: 'Use resistant varieties, avoid overhead irrigation, apply fungicide', hi: 'प्रतिरोधी किस्मों का उपयोग करें, ऊपर से सिंचाई से बचें, फफूंदनाशक लगाएं' },
    severity: 'high', images: [], products: [], crops: []
  })

  const wheatRust = await Disease.create({
    name: { en: 'Wheat Rust', hi: 'गेहूं का रतुआ' },
    slug: 'wheat-rust',
    symptoms: { en: 'Orange-red pustules on leaves and stems', hi: 'पत्तियों और तनों पर नारंगी-लाल फुंसियां' },
    prevention: { en: 'Apply fungicide early, use certified seeds', hi: 'जल्दी फफूंदनाशक लगाएं, प्रमाणित बीजों का उपयोग करें' },
    severity: 'medium', images: [], products: [], crops: []
  })

  const wheatPowderyMildew = await Disease.create({
    name: { en: 'Powdery Mildew', hi: 'चूर्णिल आसिता' },
    slug: 'wheat-powdery-mildew',
    symptoms: { en: 'White powdery coating on leaves and stems, stunted growth', hi: 'पत्तियों और तनों पर सफेद पाउडर जैसी परत, विकास रुकना' },
    prevention: { en: 'Improve air circulation, apply sulfur-based fungicide, avoid excess nitrogen', hi: 'वायु संचार सुधारें, सल्फर आधारित फफूंदनाशक लगाएं' },
    severity: 'medium', images: [], products: [], crops: []
  })

  // RICE diseases
  const riceBlast = await Disease.create({
    name: { en: 'Rice Blast', hi: 'धान का ब्लास्ट' },
    slug: 'rice-blast',
    symptoms: { en: 'Diamond-shaped lesions on leaves, neck rot, white or gray center with brown border', hi: 'पत्तियों पर हीरे के आकार के घाव, गर्दन सड़न, भूरे किनारे के साथ सफेद केंद्र' },
    prevention: { en: 'Use blast-resistant varieties, apply tricyclazole fungicide, balanced fertilization', hi: 'ब्लास्ट प्रतिरोधी किस्में उपयोग करें, ट्राइसाइक्लाज़ोल फफूंदनाशक लगाएं' },
    severity: 'high', images: [], products: [], crops: []
  })

  const riceBrownSpot = await Disease.create({
    name: { en: 'Brown Spot', hi: 'भूरा धब्बा' },
    slug: 'rice-brown-spot',
    symptoms: { en: 'Oval brown spots with yellow halo on leaves, dark brown spots on grains', hi: 'पत्तियों पर पीले घेरे के साथ अंडाकार भूरे धब्बे, दानों पर गहरे भूरे धब्बे' },
    prevention: { en: 'Treat seeds with thiram, apply mancozeb, maintain proper nutrition', hi: 'बीजों को थीरम से उपचारित करें, मैन्कोज़ेब लगाएं' },
    severity: 'medium', images: [], products: [], crops: []
  })

  const riceBacterialBlight = await Disease.create({
    name: { en: 'Bacterial Blight', hi: 'जीवाणु झुलसा' },
    slug: 'rice-bacterial-blight',
    symptoms: { en: 'Water-soaked lesions on leaf margins turning yellow, wilting of seedlings', hi: 'पत्ती किनारों पर पानी से भरे घाव जो पीले पड़ जाते हैं, पौधों का मुरझाना' },
    prevention: { en: 'Use certified disease-free seeds, copper-based bactericide, drain flooded fields', hi: 'रोगमुक्त प्रमाणित बीज उपयोग करें, तांबा आधारित जीवाणुनाशक लगाएं' },
    severity: 'high', images: [], products: [], crops: []
  })

  // POTATO diseases
  const potatoEarlyBlight = await Disease.create({
    name: { en: 'Early Blight', hi: 'अगेती झुलसा' },
    slug: 'potato-early-blight',
    symptoms: { en: 'Dark brown circular spots with concentric rings on older leaves', hi: 'पुरानी पत्तियों पर सांद्रित छल्लों के साथ गहरे भूरे गोलाकार धब्बे' },
    prevention: { en: 'Apply mancozeb or chlorothalonil, remove infected plant debris, crop rotation', hi: 'मैन्कोज़ेब या क्लोरोथैलोनिल लगाएं, संक्रमित पौधों के अवशेष हटाएं' },
    severity: 'medium', images: [], products: [], crops: []
  })

  const potatoLateBlight = await Disease.create({
    name: { en: 'Late Blight', hi: 'पछेती झुलसा' },
    slug: 'potato-late-blight',
    symptoms: { en: 'Water-soaked dark lesions on leaves and stems, white mold on underside, tuber rot', hi: 'पत्तियों और तनों पर पानी से भरे गहरे घाव, निचली तरफ सफेद फफूंद, कंद सड़न' },
    prevention: { en: 'Apply metalaxyl fungicide, avoid excessive moisture, remove volunteer plants', hi: 'मेटालेक्सिल फफूंदनाशक लगाएं, अत्यधिक नमी से बचें' },
    severity: 'high', images: [], products: [], crops: []
  })

  // TOMATO diseases
  const tomatoLeafCurl = await Disease.create({
    name: { en: 'Leaf Curl Virus', hi: 'पत्ती मोड़ विषाणु' },
    slug: 'tomato-leaf-curl',
    symptoms: { en: 'Upward curling of leaves, yellowing, stunted growth, reduced fruit set', hi: 'पत्तियों का ऊपर की ओर मुड़ना, पीलापन, विकास रुकना, फल कम लगना' },
    prevention: { en: 'Control whitefly vectors, use virus-resistant varieties, remove infected plants', hi: 'सफेद मक्खी को नियंत्रित करें, विषाणु प्रतिरोधी किस्में उपयोग करें' },
    severity: 'high', images: [], products: [], crops: []
  })

  const tomatoEarlyBlight = await Disease.create({
    name: { en: 'Early Blight', hi: 'अगेती झुलसा' },
    slug: 'tomato-early-blight',
    symptoms: { en: 'Dark brown spots with concentric rings on lower leaves, defoliation', hi: 'निचली पत्तियों पर सांद्रित छल्लों के साथ गहरे भूरे धब्बे, पत्ती झड़ना' },
    prevention: { en: 'Apply copper fungicide, maintain plant spacing, avoid wetting foliage', hi: 'तांबा फफूंदनाशक लगाएं, पौधों के बीच उचित दूरी रखें' },
    severity: 'medium', images: [], products: [], crops: []
  })

  const tomatoWilt = await Disease.create({
    name: { en: 'Fusarium Wilt', hi: 'फ्यूजेरियम म्लानि' },
    slug: 'tomato-fusarium-wilt',
    symptoms: { en: 'Yellowing and wilting of lower leaves, brown discoloration of vascular tissue', hi: 'निचली पत्तियों का पीला पड़ना और मुरझाना, संवहनी ऊतक का भूरा पड़ना' },
    prevention: { en: 'Use resistant varieties, soil solarization, avoid waterlogging', hi: 'प्रतिरोधी किस्में उपयोग करें, मिट्टी सोलराइजेशन करें, जलभराव से बचें' },
    severity: 'high', images: [], products: [], crops: []
  })

  // COTTON diseases
  const cottonBollworm = await Disease.create({
    name: { en: 'Bollworm', hi: 'बॉलवर्म' },
    slug: 'cotton-bollworm',
    symptoms: { en: 'Holes in bolls, damaged squares and flowers, presence of caterpillars', hi: 'टिंडों में छेद, क्षतिग्रस्त कलियां और फूल, इल्लियों की उपस्थिति' },
    prevention: { en: 'Use Bt cotton varieties, apply spinosad insecticide, pheromone traps', hi: 'बीटी कपास किस्में उपयोग करें, स्पिनोसैड कीटनाशक लगाएं, फेरोमोन ट्रैप लगाएं' },
    severity: 'high', images: [], products: [], crops: []
  })

  const cottonLeafSpot = await Disease.create({
    name: { en: 'Bacterial Leaf Spot', hi: 'जीवाणु पत्ती धब्बा' },
    slug: 'cotton-leaf-spot',
    symptoms: { en: 'Angular water-soaked spots on leaves turning brown, defoliation in severe cases', hi: 'पत्तियों पर कोणीय पानी से भरे धब्बे जो भूरे पड़ जाते हैं' },
    prevention: { en: 'Spray copper oxychloride, use disease-free seeds, avoid overhead irrigation', hi: 'कॉपर ऑक्सीक्लोराइड छिड़कें, रोगमुक्त बीज उपयोग करें' },
    severity: 'medium', images: [], products: [], crops: []
  })

  // MAIZE diseases
  const maizeNorthernBlight = await Disease.create({
    name: { en: 'Northern Leaf Blight', hi: 'उत्तरी पत्ती झुलसा' },
    slug: 'maize-northern-blight',
    symptoms: { en: 'Long cigar-shaped tan lesions on leaves, premature drying of leaves', hi: 'पत्तियों पर लंबे सिगार आकार के हल्के भूरे घाव, पत्तियों का समय से पहले सूखना' },
    prevention: { en: 'Use resistant hybrids, apply mancozeb, crop rotation with non-host crops', hi: 'प्रतिरोधी संकर किस्में उपयोग करें, मैन्कोज़ेब लगाएं, फसल चक्र अपनाएं' },
    severity: 'medium', images: [], products: [], crops: []
  })

  const maizeRust = await Disease.create({
    name: { en: 'Maize Rust', hi: 'मक्का का रतुआ' },
    slug: 'maize-rust',
    symptoms: { en: 'Brick-red powdery pustules on both leaf surfaces, yellowing around pustules', hi: 'दोनों पत्ती सतहों पर ईंट-लाल पाउडर जैसी फुंसियां, फुंसियों के आसपास पीलापन' },
    prevention: { en: 'Plant early, use tolerant varieties, apply propiconazole fungicide', hi: 'जल्दी बुवाई करें, सहनशील किस्में उपयोग करें, प्रोपिकोनाज़ोल फफूंदनाशक लगाएं' },
    severity: 'medium', images: [], products: [], crops: []
  })

  // ONION diseases
  const onionPurpleBlotch = await Disease.create({
    name: { en: 'Purple Blotch', hi: 'बैंगनी धब्बा' },
    slug: 'onion-purple-blotch',
    symptoms: { en: 'Small white spots with purple center on leaves, lesions expand with yellow margin', hi: 'पत्तियों पर बैंगनी केंद्र के साथ छोटे सफेद धब्बे, पीले किनारे के साथ घाव फैलते हैं' },
    prevention: { en: 'Apply mancozeb or iprodione, avoid overhead irrigation, remove crop debris', hi: 'मैन्कोज़ेब या इप्रोडियोन लगाएं, ऊपर से सिंचाई से बचें' },
    severity: 'high', images: [], products: [], crops: []
  })

  const onionThrips = await Disease.create({
    name: { en: 'Thrips Infestation', hi: 'थ्रिप्स का प्रकोप' },
    slug: 'onion-thrips',
    symptoms: { en: 'Silver streaks on leaves, leaf tips turning white, stunted bulb development', hi: 'पत्तियों पर चांदी जैसी धारियां, पत्ती सिरे सफेद पड़ना, बल्ब विकास रुकना' },
    prevention: { en: 'Apply spinosad or imidacloprid, use blue sticky traps, maintain field hygiene', hi: 'स्पिनोसैड या इमिडाक्लोप्रिड लगाएं, नीले चिपचिपे ट्रैप उपयोग करें' },
    severity: 'medium', images: [], products: [], crops: []
  })

  // SOYBEAN diseases
  const soybeanRust = await Disease.create({
    name: { en: 'Soybean Rust', hi: 'सोयाबीन का रतुआ' },
    slug: 'soybean-rust',
    symptoms: { en: 'Tan to dark brown lesions on leaves, orange pustules on leaf undersides', hi: 'पत्तियों पर हल्के से गहरे भूरे घाव, पत्ती के नीचे नारंगी फुंसियां' },
    prevention: { en: 'Apply triazole fungicide, plant early maturing varieties, monitor regularly', hi: 'ट्रायज़ोल फफूंदनाशक लगाएं, जल्दी पकने वाली किस्में लगाएं' },
    severity: 'high', images: [], products: [], crops: []
  })

  const soybeanMosaic = await Disease.create({
    name: { en: 'Soybean Mosaic Virus', hi: 'सोयाबीन मोज़ेक विषाणु' },
    slug: 'soybean-mosaic',
    symptoms: { en: 'Mottled yellow-green mosaic pattern on leaves, leaf distortion, reduced pod set', hi: 'पत्तियों पर पीले-हरे मोज़ेक पैटर्न, पत्ती विकृति, फली कम लगना' },
    prevention: { en: 'Use virus-free certified seeds, control aphid vectors, remove infected plants', hi: 'विषाणुमुक्त प्रमाणित बीज उपयोग करें, एफिड को नियंत्रित करें' },
    severity: 'medium', images: [], products: [], crops: []
  })

  // SUGARCANE diseases
  const sugarcaneRedRot = await Disease.create({
    name: { en: 'Red Rot', hi: 'लाल सड़न' },
    slug: 'sugarcane-red-rot',
    symptoms: { en: 'Internal reddening of stalk with white patches, sour smell, wilting of top leaves', hi: 'सफेद धब्बों के साथ तने का आंतरिक लाल पड़ना, खट्टी गंध, ऊपरी पत्तियों का मुरझाना' },
    prevention: { en: 'Use disease-free setts, treat with carbendazim, destroy infected crop debris', hi: 'रोगमुक्त पेड़ी उपयोग करें, कार्बेंडाजिम से उपचारित करें' },
    severity: 'high', images: [], products: [], crops: []
  })

  const sugarcaneSmut = await Disease.create({
    name: { en: 'Sugarcane Smut', hi: 'गन्ने की कंडुआ' },
    slug: 'sugarcane-smut',
    symptoms: { en: 'Black whip-like structure emerging from shoot, thin stalks, many tillers', hi: 'अंकुर से काली चाबुक जैसी संरचना निकलना, पतले तने, अधिक कल्ले' },
    prevention: { en: 'Use smut-resistant varieties, hot water treatment of setts at 52°C for 30 min', hi: 'कंडुआ प्रतिरोधी किस्में उपयोग करें, पेड़ी को 52°C पर 30 मिनट गर्म पानी उपचार दें' },
    severity: 'high', images: [], products: [], crops: []
  })

  // MUSTARD diseases
  const mustardWhiteRust = await Disease.create({
    name: { en: 'White Rust', hi: 'सफेद रतुआ' },
    slug: 'mustard-white-rust',
    symptoms: { en: 'White blister-like pustules on leaves and stems, distortion of floral parts', hi: 'पत्तियों और तनों पर सफेद छाले जैसी फुंसियां, फूल के हिस्सों की विकृति' },
    prevention: { en: 'Apply metalaxyl-mancozeb, use tolerant varieties, early sowing', hi: 'मेटालेक्सिल-मैन्कोज़ेब लगाएं, सहनशील किस्में उपयोग करें, जल्दी बुवाई करें' },
    severity: 'medium', images: [], products: [], crops: []
  })

  const mustardAphids = await Disease.create({
    name: { en: 'Mustard Aphids', hi: 'सरसों का माहू' },
    slug: 'mustard-aphids',
    symptoms: { en: 'Colonies of small insects on tender shoots and pods, yellowing, honeydew secretion', hi: 'कोमल अंकुरों और फलियों पर छोटे कीड़ों की कॉलोनी, पीलापन, मधुरस स्राव' },
    prevention: { en: 'Spray dimethoate or imidacloprid, conserve natural enemies, timely sowing', hi: 'डाइमेथोएट या इमिडाक्लोप्रिड छिड़कें, प्राकृतिक शत्रुओं को संरक्षित करें' },
    severity: 'medium', images: [], products: [], crops: []
  })

  console.log('Diseases created ✅')

  // ============================================================
  // CROPS
  // ============================================================

  const wheat = await Crop.create({
    name: { en: 'Wheat', hi: 'गेहूं' },
    slug: 'wheat',
    type: 'Rabi',
    season: { en: 'October to March', hi: 'अक्टूबर से मार्च' },
    irrigationNeeds: { en: 'Moderate — 4 to 5 irrigations needed', hi: 'मध्यम — 4 से 5 सिंचाई की आवश्यकता' },
    soilType: { en: 'Loamy and Clay Loam soil', hi: 'दोमट और चिकनी दोमट मिट्टी' },
    images: [],
    diseases: [wheatBlight._id, wheatRust._id, wheatPowderyMildew._id]
  })

  const rice = await Crop.create({
    name: { en: 'Rice', hi: 'धान' },
    slug: 'rice',
    type: 'Kharif',
    season: { en: 'June to November', hi: 'जून से नवंबर' },
    irrigationNeeds: { en: 'High — requires standing water in field', hi: 'अधिक — खेत में खड़े पानी की आवश्यकता' },
    soilType: { en: 'Clay and Clay Loam soil', hi: 'चिकनी और चिकनी दोमट मिट्टी' },
    images: [],
    diseases: [riceBlast._id, riceBrownSpot._id, riceBacterialBlight._id]
  })

  const potato = await Crop.create({
    name: { en: 'Potato', hi: 'आलू' },
    slug: 'potato',
    type: 'Rabi',
    season: { en: 'October to March', hi: 'अक्टूबर से मार्च' },
    irrigationNeeds: { en: 'Moderate — 5 to 6 irrigations needed', hi: 'मध्यम — 5 से 6 सिंचाई की आवश्यकता' },
    soilType: { en: 'Sandy Loam and Loamy soil', hi: 'बलुई दोमट और दोमट मिट्टी' },
    images: [],
    diseases: [potatoEarlyBlight._id, potatoLateBlight._id]
  })

  const tomato = await Crop.create({
    name: { en: 'Tomato', hi: 'टमाटर' },
    slug: 'tomato',
    type: 'Kharif',
    season: { en: 'June to February', hi: 'जून से फरवरी' },
    irrigationNeeds: { en: 'Moderate — drip irrigation recommended', hi: 'मध्यम — ड्रिप सिंचाई अनुशंसित' },
    soilType: { en: 'Well-drained Sandy Loam soil', hi: 'अच्छी जल निकासी वाली बलुई दोमट मिट्टी' },
    images: [],
    diseases: [tomatoLeafCurl._id, tomatoEarlyBlight._id, tomatoWilt._id]
  })

  const cotton = await Crop.create({
    name: { en: 'Cotton', hi: 'कपास' },
    slug: 'cotton',
    type: 'Kharif',
    season: { en: 'April to December', hi: 'अप्रैल से दिसंबर' },
    irrigationNeeds: { en: 'Moderate — 6 to 8 irrigations needed', hi: 'मध्यम — 6 से 8 सिंचाई की आवश्यकता' },
    soilType: { en: 'Black Cotton soil and Deep Loam', hi: 'काली कपास मिट्टी और गहरी दोमट' },
    images: [],
    diseases: [cottonBollworm._id, cottonLeafSpot._id]
  })

  const maize = await Crop.create({
    name: { en: 'Maize', hi: 'मक्का' },
    slug: 'maize',
    type: 'Kharif',
    season: { en: 'June to October', hi: 'जून से अक्टूबर' },
    irrigationNeeds: { en: 'Moderate — 4 to 6 irrigations needed', hi: 'मध्यम — 4 से 6 सिंचाई की आवश्यकता' },
    soilType: { en: 'Well-drained Loamy soil', hi: 'अच्छी जल निकासी वाली दोमट मिट्टी' },
    images: [],
    diseases: [maizeNorthernBlight._id, maizeRust._id]
  })

  const onion = await Crop.create({
    name: { en: 'Onion', hi: 'प्याज' },
    slug: 'onion',
    type: 'Rabi',
    season: { en: 'October to May', hi: 'अक्टूबर से मई' },
    irrigationNeeds: { en: 'Moderate — 10 to 12 irrigations needed', hi: 'मध्यम — 10 से 12 सिंचाई की आवश्यकता' },
    soilType: { en: 'Sandy Loam to Clay Loam soil', hi: 'बलुई दोमट से चिकनी दोमट मिट्टी' },
    images: [],
    diseases: [onionPurpleBlotch._id, onionThrips._id]
  })

  const soybean = await Crop.create({
    name: { en: 'Soybean', hi: 'सोयाबीन' },
    slug: 'soybean',
    type: 'Kharif',
    season: { en: 'June to October', hi: 'जून से अक्टूबर' },
    irrigationNeeds: { en: 'Low to Moderate — 2 to 3 irrigations needed', hi: 'कम से मध्यम — 2 से 3 सिंचाई की आवश्यकता' },
    soilType: { en: 'Well-drained Loamy to Clay Loam soil', hi: 'अच्छी जल निकासी वाली दोमट से चिकनी दोमट मिट्टी' },
    images: [],
    diseases: [soybeanRust._id, soybeanMosaic._id]
  })

  const sugarcane = await Crop.create({
    name: { en: 'Sugarcane', hi: 'गन्ना' },
    slug: 'sugarcane',
    type: 'Zaid',
    season: { en: 'February to December', hi: 'फरवरी से दिसंबर' },
    irrigationNeeds: { en: 'High — 20 to 25 irrigations needed', hi: 'अधिक — 20 से 25 सिंचाई की आवश्यकता' },
    soilType: { en: 'Deep Well-drained Loamy soil', hi: 'गहरी अच्छी जल निकासी वाली दोमट मिट्टी' },
    images: [],
    diseases: [sugarcaneRedRot._id, sugarcaneSmut._id]
  })

  const mustard = await Crop.create({
    name: { en: 'Mustard', hi: 'सरसों' },
    slug: 'mustard',
    type: 'Rabi',
    season: { en: 'October to March', hi: 'अक्टूबर से मार्च' },
    irrigationNeeds: { en: 'Low — 2 to 3 irrigations needed', hi: 'कम — 2 से 3 सिंचाई की आवश्यकता' },
    soilType: { en: 'Sandy Loam and Loamy soil', hi: 'बलुई दोमट और दोमट मिट्टी' },
    images: [],
    diseases: [mustardWhiteRust._id, mustardAphids._id]
  })

  console.log('Crops created ✅')

  // ============================================================
  // Update diseases with crop references
  // ============================================================

  await Disease.updateMany({ _id: { $in: [wheatBlight._id, wheatRust._id, wheatPowderyMildew._id] } }, { $push: { crops: wheat._id } })
  await Disease.updateMany({ _id: { $in: [riceBlast._id, riceBrownSpot._id, riceBacterialBlight._id] } }, { $push: { crops: rice._id } })
  await Disease.updateMany({ _id: { $in: [potatoEarlyBlight._id, potatoLateBlight._id] } }, { $push: { crops: potato._id } })
  await Disease.updateMany({ _id: { $in: [tomatoLeafCurl._id, tomatoEarlyBlight._id, tomatoWilt._id] } }, { $push: { crops: tomato._id } })
  await Disease.updateMany({ _id: { $in: [cottonBollworm._id, cottonLeafSpot._id] } }, { $push: { crops: cotton._id } })
  await Disease.updateMany({ _id: { $in: [maizeNorthernBlight._id, maizeRust._id] } }, { $push: { crops: maize._id } })
  await Disease.updateMany({ _id: { $in: [onionPurpleBlotch._id, onionThrips._id] } }, { $push: { crops: onion._id } })
  await Disease.updateMany({ _id: { $in: [soybeanRust._id, soybeanMosaic._id] } }, { $push: { crops: soybean._id } })
  await Disease.updateMany({ _id: { $in: [sugarcaneRedRot._id, sugarcaneSmut._id] } }, { $push: { crops: sugarcane._id } })
  await Disease.updateMany({ _id: { $in: [mustardWhiteRust._id, mustardAphids._id] } }, { $push: { crops: mustard._id } })

  // Early blight affects both potato and tomato — many to many
  await Disease.updateOne({ _id: potatoEarlyBlight._id }, { $push: { crops: tomato._id } })
  await Disease.updateOne({ _id: tomatoEarlyBlight._id }, { $push: { crops: potato._id } })

  console.log('Disease-Crop references updated ✅')
  console.log('🌱 Seed complete! 10 crops and 22 diseases added.')
  process.exit(0)
}

seedData().catch((err) => {
  console.error(err)
  process.exit(1)
})