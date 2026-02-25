import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  ArrowLeft,
  AlertTriangle,
  ShieldCheck,
  FlaskConical,
  Leaf
} from 'lucide-react'
import { getDiseaseBySlug } from '@/services/diseaseService'
import PageTransition from '@/components/common/PageTransition'

interface Product {
  _id: string
  name: { en: string; hi: string }
  type: 'fertilizer' | 'pesticide'
  description: { en: string; hi: string }
  images: string[]
}

interface Crop {
  _id: string
  name: { en: string; hi: string }
  slug: string
}

interface Disease {
  _id: string
  name: { en: string; hi: string }
  slug: string
  symptoms: { en: string; hi: string }
  prevention: { en: string; hi: string }
  severity: 'low' | 'medium' | 'high'
  images: string[]
  crops: Crop[]
  products: Product[]
}

const severityColor = {
  low: 'bg-success/10 text-success border-success/20',
  medium: 'bg-warning/10 text-warning border-warning/20',
  high: 'bg-error/10 text-error border-error/20'
}

const DiseaseDetail = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = (i18n.language?.split('-')[0] || 'en') as 'en' | 'hi'

  const [disease, setDisease] = useState<Disease | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchDisease = async () => {
      try {
        setLoading(true)
        setError(false)
        const data = await getDiseaseBySlug(slug as string)
        setDisease(data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    fetchDisease()
  }, [slug])

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

  if (error || !disease) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertTriangle className="w-12 h-12 text-error" />
          <h2 className="text-xl font-bold text-text-primary">{t('disease_not_found')}</h2>
          <p className="text-text-secondary">{t('disease_not_found_desc')}</p>
          <button
            onClick={() => navigate(-1)}
            className="text-primary hover:underline flex items-center gap-1 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </button>
        </div>
      </div>
    )
  }

  return (
    <PageTransition>
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className="bg-gradient-to-b from-error/5 to-background px-4 md:px-8 lg:px-12 py-10">
        <div className="max-w-7xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            {t('back')}
          </button>

          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="w-20 h-20 bg-error/10 rounded-2xl flex items-center justify-center shrink-0">
              <AlertTriangle className="w-10 h-10 text-error" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl md:text-4xl font-bold text-text-primary">
                  {disease.name[lang]}
                </h1>
                <span className={`text-xs font-medium px-3 py-1 rounded-full border ${severityColor[disease.severity]}`}>
                  {t(disease.severity)} {t('severity')}
                </span>
              </div>

              {/* Affected Crops */}
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className="text-sm text-text-secondary">{t('affects')}:</span>
                {disease.crops.map((crop) => (
                  <button
                    key={crop._id}
                    onClick={() => navigate(`/crop/${crop.slug}`)}
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <Leaf className="w-3 h-3" />
                    {crop.name[lang]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Disease Images */}
      {disease.images.length > 0 && (
        <section className="px-4 md:px-8 lg:px-12 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {disease.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={disease.name[lang]}
                  className="w-full h-40 object-cover rounded-xl border border-border"
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Symptoms & Prevention */}
      <section className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Symptoms */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-error/10 p-2 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-error" />
              </div>
              <h2 className="text-lg font-bold text-text-primary">{t('symptoms')}</h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {disease.symptoms[lang]}
            </p>
          </div>

          {/* Prevention */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-success/10 p-2 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-success" />
              </div>
              <h2 className="text-lg font-bold text-text-primary">{t('prevention')}</h2>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed">
              {disease.prevention[lang]}
            </p>
          </div>

        </div>
      </section>

      {/* Recommended Products */}
      <section className="px-4 md:px-8 lg:px-12 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-primary/10 p-2 rounded-lg">
              <FlaskConical className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-bold text-text-primary">{t('recommended_products')}</h2>
          </div>

          {disease.products.length === 0 ? (
            <div className="bg-surface border border-border rounded-xl p-10 text-center">
              <p className="text-text-secondary">{t('no_products')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {disease.products.map((product) => (
                <div
                  key={product._id}
                  onClick={() => navigate(`/product/${product._id}`)}
                  className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-semibold text-text-primary">
                      {product.name[lang]}
                    </h3>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full shrink-0">
                      {t(product.type)}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {product.description[lang]}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

    </div>
    </PageTransition>
  )
}

export default DiseaseDetail


