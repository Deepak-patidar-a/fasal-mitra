import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Upload,
  Camera,
  Loader,
  AlertTriangle,
  CheckCircle,
  X,
  Microscope,
  RefreshCw
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { diagnoseImage, type DiagnosisResult } from '@/services/diagnosisService'

const ImageDiagnosis = () => {
  const { t } = useTranslation()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [diagnosing, setDiagnosing] = useState(false)
  const [results, setResults] = useState<DiagnosisResult[]>([])
  const [error, setError] = useState('')
  const [modelWarmingUp, setModelWarmingUp] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError(t('invalid_image'))
      return
    }

    const url = URL.createObjectURL(file)
    setImageUrl(url)
    setImageFile(file)
    setResults([])
    setError('')
    setModelWarmingUp(false)
  }

  const handleDiagnose = async () => {
    if (!imageFile) return

    try {
      setDiagnosing(true)
      setError('')
      setModelWarmingUp(false)
      const diagnosis = await diagnoseImage(imageFile)
      setResults(diagnosis)
    } catch (err: any) {
      if (err.message === 'model_loading') {
        setModelWarmingUp(true)
        setError(t('model_warming_up'))
      } else {
        setError(t('diagnosis_error'))
      }
    } finally {
      setDiagnosing(false)
    }
  }

  const handleReset = () => {
    setImageUrl(null)
    setImageFile(null)
    setResults([])
    setError('')
    setModelWarmingUp(false)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'text-success bg-success/10 border-success/20'
    if (confidence >= 40) return 'text-warning bg-warning/10 border-warning/20'
    return 'text-error bg-error/10 border-error/20'
  }

  return (
  <div className="flex flex-col gap-4">

    {/* Upload Area */}
    {!imageUrl ? (
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-border hover:border-primary rounded-xl p-8 flex flex-col items-center gap-3 cursor-pointer transition-colors group"
      >
        <div className="bg-primary/10 p-4 rounded-full group-hover:bg-primary/20 transition-colors">
          <Upload className="w-8 h-8 text-primary" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-text-primary">
            {t('upload_image')}
          </p>
          <p className="text-xs text-text-secondary mt-1">
            {t('upload_image_desc')}
          </p>
        </div>
        <Button size="sm" variant="outline" className="pointer-events-none mt-2">
          <Camera className="w-4 h-4 mr-2" />
          {t('choose_photo')}
        </Button>
      </div>
    ) : (
      <div className="flex flex-col gap-4">
        <div className="relative">
          <img
            src={imageUrl}
            alt="Crop for diagnosis"
            className="w-full h-56 object-cover rounded-xl border border-border"
          />
          <button
            onClick={handleReset}
            className="absolute top-2 right-2 bg-surface/90 backdrop-blur-sm p-1.5 rounded-full hover:bg-error/10 hover:text-error transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <Button
          onClick={handleDiagnose}
          disabled={diagnosing}
          className="w-full bg-primary hover:bg-primary-light"
        >
          {diagnosing ? (
            <>
              <Loader className="w-4 h-4 mr-2 animate-spin" />
              {t('diagnosing')}
            </>
          ) : (
            <>
              <Microscope className="w-4 h-4 mr-2" />
              {t('diagnose_now')}
            </>
          )}
        </Button>
      </div>
    )}

    {/* Error */}
    {error && (
      <div className="flex items-start gap-2 bg-error/10 text-error text-sm px-4 py-3 rounded-xl">
        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
        <div className="flex flex-col gap-2">
          <p>{error}</p>
          {modelWarmingUp && (
            <button
              onClick={handleDiagnose}
              className="flex items-center gap-1 text-xs underline hover:no-underline"
            >
              <RefreshCw className="w-3 h-3" />
              {t('retry')}
            </button>
          )}
        </div>
      </div>
    )}

    {/* Results */}
    {results.length > 0 && (
      <div>
        <h3 className="text-sm font-bold text-text-primary mb-3">
          {t('diagnosis_results')}
        </h3>
        <div className="flex flex-col gap-2">
          {results.map((result, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between px-4 py-3 rounded-xl border ${
                idx === 0
                  ? 'border-primary/30 bg-primary/5'
                  : 'border-border bg-background'
              }`}
            >
              <div className="flex items-center gap-3">
                {idx === 0 && (
                  <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                )}
                <span className={`text-sm font-medium ${
                  idx === 0 ? 'text-text-primary' : 'text-text-secondary'
                }`}>
                  {result.disease}
                </span>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full border ${
                getConfidenceColor(result.confidence)
              }`}>
                {result.confidence}%
              </span>
            </div>
          ))}
        </div>
      </div>
    )}

    <input
      ref={fileInputRef}
      type="file"
      accept="image/*"
      onChange={handleImageUpload}
      className="hidden"
    />
  </div>
)
}

export default ImageDiagnosis
