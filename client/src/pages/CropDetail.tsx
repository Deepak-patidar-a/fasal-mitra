import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Leaf, Droplets, Sun, Layers, AlertTriangle, ArrowLeft, MessageCircle } from 'lucide-react'
import { getCropBySlug } from '@/services/cropService'
import { useAuth } from '@/context/AuthContext'
import MandiPrices from '@/components/common/MandiPrices'
import LazyImage from '@/components/common/LazyImage'

interface Disease {
  _id: string
  name: { en: string; hi: string }
  slug: string
  severity: 'low' | 'medium' | 'high'
  images: string[]
}

interface Crop {
  _id: string
  name: { en: string; hi: string }
  slug: string 
  type: 'Kharif' | 'Rabi' | 'Zaid'
  season: { en: string; hi: string }
  irrigationNeeds: { en: string; hi: string }
  soilType: { en: string; hi: string }
  images: string[]
  diseases: Disease[]
}

const severityColor = {
  low: 'bg-success/10 text-success',
  medium: 'bg-warning/10 text-warning',
  high: 'bg-error/10 text-error'
}

const CropDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = (i18n.language?.split('-')[0] || 'en') as 'en' | 'hi'
  

  const [crop, setCrop] = useState<Crop | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const { user, savedCrops, toggleSaveCrop, addToSearchHistory } = useAuth()
  const isSaved = crop ? savedCrops.includes(crop._id) : false

  useEffect(() => {
    const fetchCrop = async () => {
      try {
        setLoading(true)
        setError(false)
        const data = await getCropBySlug(slug as string)
        setCrop(data)
        addToSearchHistory(slug as string)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchCrop()
  }, [slug])

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Leaf className="w-10 h-10 text-primary animate-pulse" />
          <p className="text-text-secondary">{t('loading')}</p>
        </div>
      </div>
    )
  }

  // Error State
  if (error || !crop) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertTriangle className="w-12 h-12 text-error" />
          <h2 className="text-xl font-bold text-text-primary">{t('crop_not_found')}</h2>
          <p className="text-text-secondary">{t('crop_not_found_desc')}</p>
          <button
            onClick={() => navigate('/')}
            className="text-primary hover:underline flex items-center gap-1 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back_home')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">

      {/* Hero Banner */}
      <section className="bg-gradient-to-b from-primary/10 to-background px-4 md:px-8 lg:px-12 py-10">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </button>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center shrink-0">
              <Leaf className="w-10 h-10 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
                  {crop.name[lang]}
                </h1>
                <span className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full">
                  {crop.type}
                </span>
              </div>
              {user && (
                <div className="flex items-center gap-3">
            <button
                onClick={() => toggleSaveCrop(crop._id)}
                disabled={isSaved}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors text-sm font-medium ${
                isSaved
                    ? 'bg-primary text-white border-primary'
                    : 'bg-surface text-text-secondary border-border hover:border-primary hover:text-primary'
                }`}
            >
                <Leaf className="w-4 h-4" />
                {isSaved ? t('saved') : t('save_crop')}
            </button>
            <button
              onClick={() => navigate(`/chat/${crop.slug}`)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface text-text-secondary hover:border-primary hover:text-primary transition-colors text-sm font-medium"
            >
              <MessageCircle className="w-4 h-4" />
              {t('join_chat')}
            </button>
            </div>
            )}
              <p className="text-text-secondary text-sm md:text-base">
                {t('crop_detail_subtitle', { name: crop.name[lang] })}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-surface border border-border rounded-xl p-5 flex items-start gap-4">
            <div className="bg-warning/10 p-2.5 rounded-lg shrink-0">
              <Sun className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">{t('season')}</p>
              <p className="text-sm font-semibold text-text-primary">{crop.season[lang]}</p>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5 flex items-start gap-4">
            <div className="bg-primary/10 p-2.5 rounded-lg shrink-0">
              <Droplets className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">{t('irrigation')}</p>
              <p className="text-sm font-semibold text-text-primary">{crop.irrigationNeeds[lang]}</p>
            </div>
          </div>

          <div className="bg-surface border border-border rounded-xl p-5 flex items-start gap-4">
            <div className="bg-primary/10 p-2.5 rounded-lg shrink-0">
              <Layers className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-text-secondary uppercase tracking-wide mb-1">{t('soil_type')}</p>
              <p className="text-sm font-semibold text-text-primary">{crop.soilType[lang]}</p>
            </div>
          </div>

        </div>
      </section>

      {/* Diseases Grid */}
      <section className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-text-primary mb-2">
            {t('diseases_heading')}
          </h2>
          <p className="text-text-secondary mb-6 text-sm">
            {t('diseases_subheading', { name: crop.name[lang] })}
          </p>

          {crop.diseases.length === 0 ? (
            <div className="bg-surface border border-border rounded-xl p-10 text-center">
              <p className="text-text-secondary">{t('no_diseases')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {crop.diseases.map((disease) => (
                <button
                  key={disease._id}
                  onClick={() => navigate(`/disease/${disease.slug}`)}
                  className="bg-surface border border-border rounded-xl overflow-hidden hover:border-primary hover:shadow-md transition-all text-left group"
                >
                  {/* Disease Image */}
                  <div className="w-full h-40 bg-primary/5 flex items-center justify-center overflow-hidden">
                    {disease.images[0] ? (
                      <LazyImage
                        src={disease.images[0]}
                        alt={disease.name[lang]}
                        className="w-full h-full"
                        fallback={<AlertTriangle className="w-10 h-10 text-text-secondary/30" />}
                      />
                    ) : (
                      <AlertTriangle className="w-10 h-10 text-text-secondary/30" />
                    )}
                  </div>

                  {/* Disease Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-text-primary">
                        {disease.name[lang]}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${severityColor[disease.severity]}`}>
                        {t(disease.severity)}
                      </span>
                    </div>
                    <p className="text-xs text-primary mt-2 group-hover:underline">
                      {t('view_solutions')}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>
     <section className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto">
            <MandiPrices commodity={crop.name.en} />
        </div>
        </section>
    </div>
  )
}

export default CropDetail


