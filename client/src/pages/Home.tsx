import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Search, Mic, Leaf, CloudRain, TrendingUp, Microscope } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { searchCrops, getAllCrops } from '@/services/cropService'
import WeatherWidget from '@/components/common/WeatherWidget'
import MandiPrices from '@/components/common/MandiPrices'
import ImageDiagnosis from '@/components/common/ImageDiagnosis'




interface CropSummary {
  _id: string
  name: { en: string; hi: string }
  slug: string
  type: string
  images: string[]
}

const Home = () => {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language?.split('-')[0] || 'en') as 'en' | 'hi'
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [dbCrops, setDbCrops] = useState<CropSummary[]>([])
  const [searchResults, setSearchResults] = useState<CropSummary[]>([])
  const [searching, setSearching] = useState(false)
  

  useEffect(() => {
    getAllCrops().then(setDbCrops).catch(console.error)
    }, [])

  useEffect(() => {
    if (!query.trim()) {
        setSearchResults([])
        return
    }
    const timeout = setTimeout(async () => {
        setSearching(true)
        try {
        const results = await searchCrops(query)
        setSearchResults(results)
        } catch {
        setSearchResults([])
        } finally {
        setSearching(false)
        }
    }, 400)

    return () => clearTimeout(timeout)
    }, [query])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/crop/${query.trim().toLowerCase()}`)
    }
  }

  const handleVoiceSearch = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition

    if (!SpeechRecognition) {
      alert('Voice search not supported in this browser')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'hi-IN'
    recognition.start()

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setQuery(transcript)
    }
  }

  const popularCrops = [
    { label: 'Wheat', labelHi: 'गेहूं', slug: 'wheat' },
    { label: 'Rice', labelHi: 'चावल', slug: 'rice' },
    { label: 'Potato', labelHi: 'आलू', slug: 'potato' },
    { label: 'Tomato', labelHi: 'टमाटर', slug: 'tomato' },
    { label: 'Cotton', labelHi: 'कपास', slug: 'cotton' },
    { label: 'Maize', labelHi: 'मक्का', slug: 'maize' },
  ]
  const cropsToShow = dbCrops.length > 0 ? dbCrops : popularCrops
  return (
    <div className="flex flex-col">

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background px-4 md:px-8 lg:px-12 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center flex flex-col items-center gap-6">

          {/* Badge */}
          <div className="flex items-center gap-2 bg-primary/10 text-primary px-4 py-1.5 rounded-full text-sm font-medium">
            <Leaf className="w-4 h-4" />
            {t('hero_badge')}
          </div>

          {/* Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-text-primary leading-tight">
            {t('hero_heading')}
          </h1>

          {/* Subheading */}
          <p className="text-base md:text-lg text-text-secondary max-w-2xl">
            {t('hero_subheading')}
          </p>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-2xl flex items-center gap-2 bg-surface border border-border rounded-xl px-4 py-3 shadow-md focus-within:border-primary transition-colors"
          >
            <Search className="w-5 h-5 text-text-secondary shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('search_placeholder')}
              className="flex-1 bg-transparent outline-none text-text-primary placeholder:text-text-secondary text-sm md:text-base"
            />
            <button
              type="button"
              onClick={handleVoiceSearch}
              className="text-text-secondary hover:text-primary transition-colors p-1"
              aria-label="Voice search"
            >
              <Mic className="w-5 h-5" />
            </button>
            <Button type="submit" size="sm" className="bg-primary hover:bg-primary-light shrink-0">
              {t('search_button')}
            </Button>
          </form>
          {/* Search Dropdown */}
        {query.trim() && (
        <div className="w-full max-w-2xl bg-surface border border-border rounded-xl shadow-lg overflow-hidden">
            {searching ? (
            <div className="px-4 py-3 text-sm text-text-secondary">{t('loading')}</div>
            ) : searchResults.length > 0 ? (
            searchResults.map((crop) => (
                <button
                key={crop._id}
                onClick={() => navigate(`/crop/${crop.slug}`)}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-background transition-colors text-left border-b border-border last:border-0"
                >
                <Leaf className="w-4 h-4 text-primary shrink-0" />
                <div>
                    <p className="text-sm font-medium text-text-primary">
                    {crop.name[lang]}
                    </p>
                    <p className="text-xs text-text-secondary">{crop.type}</p>
                </div>
                </button>
            ))
            ) : (
            <div className="px-4 py-3 text-sm text-text-secondary">
                {t('no_results')}
            </div>
            )}
        </div>
        )}
          {/* Popular Crops */}
          <div className="flex flex-wrap justify-center gap-2">
            <span className="text-sm text-text-secondary">{t('popular')}:</span>
            {cropsToShow.map((crop) => (
            <button
                key={'slug' in crop ? crop.slug : (crop as any).slug}
                onClick={() => navigate(`/crop/${'slug' in crop ? crop.slug : (crop as any).slug}`)}
                className="bg-surface border border-border rounded-xl p-4 flex flex-col items-center gap-3 hover:border-primary hover:shadow-md transition-all group"
            >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Leaf className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm font-medium text-text-primary">
                {'name' in crop && typeof crop.name === 'object'
                    ? (crop.name as any)[lang]
                    : (crop as any).label}
                </span>
            </button>
            ))}
          </div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="border-y border-border bg-surface px-4 md:px-8 lg:px-12 py-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="flex items-center gap-4">
            <div className="bg-primary/10 p-3 rounded-lg">
              <Leaf className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">{t('feature_1_title')}</h3>
              <p className="text-xs text-text-secondary">{t('feature_1_desc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-warning/10 p-3 rounded-lg">
              <CloudRain className="w-6 h-6 text-warning" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">{t('feature_2_title')}</h3>
              <p className="text-xs text-text-secondary">{t('feature_2_desc')}</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-success/10 p-3 rounded-lg">
              <TrendingUp className="w-6 h-6 text-success" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-text-primary">{t('feature_3_title')}</h3>
              <p className="text-xs text-text-secondary">{t('feature_3_desc')}</p>
            </div>
          </div>

        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
            <h2 className="text-lg font-bold text-text-primary mb-3">{t('local_weather')}</h2>
            <WeatherWidget />
            </div>
            <div className="lg:col-span-2">
            <h2 className="text-lg font-bold text-text-primary mb-3">{t('mandi_prices')}</h2>
            <MandiPrices commodity="Wheat" />
            </div>
        </div>
        </section>
      {/* AI Diagnosis Section */}
{/* AI Diagnosis Section */}
<section className="px-4 md:px-8 lg:px-12 py-8">
  <div className="max-w-7xl mx-auto">
    <h2 className="text-lg font-bold text-text-primary mb-3">
      {t('ai_diagnosis_heading')}
    </h2>

    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left — Upload & Diagnose */}
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-xl">
                <Microscope className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-base font-bold text-text-primary">
                  {t('ai_diagnosis_title')}
                </h3>
                <p className="text-xs text-text-secondary">
                  {t('ai_diagnosis_subtitle')}
                </p>
              </div>
            </div>
            <ImageDiagnosis />
          </div>

          {/* Right — How it works */}
          <div className="flex flex-col justify-center gap-6 lg:border-l lg:border-border lg:pl-8">
            <h3 className="text-base font-bold text-text-primary">
              {t('how_it_works')}
            </h3>

            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-sm font-bold text-primary">{step}</span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-semibold text-text-primary">
                    {t(`how_step_${step}_title`)}
                  </p>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {t(`how_step_${step}_desc`)}
                  </p>
                </div>
              </div>
            ))}

            {/* Disclaimer */}
            <div className="bg-warning/10 border border-warning/20 rounded-xl px-4 py-3 mt-2">
              <p className="text-xs text-warning leading-relaxed">
                {t('diagnosis_disclaimer')}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  </section>
        
      {/* Popular Crops Grid */}
      <section className="px-4 md:px-8 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
            {t('popular_crops_heading')}
          </h2>
          <p className="text-text-secondary mb-8">{t('popular_crops_subheading')}</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {popularCrops.map((crop) => (
              <button
                key={crop.slug}
                onClick={() => navigate(`/crop/${crop.slug}`)}
                className="bg-surface border border-border rounded-xl p-4 flex flex-col items-center gap-3 hover:border-primary hover:shadow-md transition-all group"
              >
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Leaf className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm font-medium text-text-primary">{crop.label}</span>
                <span className="text-xs text-text-secondary">{crop.labelHi}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default Home