import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { TrendingUp, MapPin, AlertTriangle, RefreshCw } from 'lucide-react'
import { getMandiPrices, type MandiRecord } from '@/services/mandiService'

interface Props {
  commodity: string
}

const MandiPrices = ({ commodity }: Props) => {
  const { t } = useTranslation()
  const [records, setRecords] = useState<MandiRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const fetchPrices = async () => {
    try {
      setLoading(true)
      setError(false)
      const data = await getMandiPrices(commodity)
      setRecords(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
  }, [commodity])

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-border rounded w-40 mb-4" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 bg-border rounded-xl mb-3" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col items-center gap-3">
        <AlertTriangle className="w-8 h-8 text-warning" />
        <p className="text-sm text-text-secondary text-center">{t('mandi_error')}</p>
        <button
          onClick={fetchPrices}
          className="flex items-center gap-2 text-sm text-primary hover:underline"
        >
          <RefreshCw className="w-4 h-4" />
          {t('retry')}
        </button>
      </div>
    )
  }

  if (records.length === 0) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 text-center">
        <p className="text-sm text-text-secondary">{t('mandi_no_data')}</p>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-success" />
          <h3 className="text-sm font-bold text-text-primary">
            {t('mandi_prices_for')} {commodity}
          </h3>
        </div>
        <button
          onClick={fetchPrices}
          className="text-text-secondary hover:text-primary transition-colors"
          aria-label="Refresh"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Table Header */}
      <div className="grid grid-cols-4 gap-2 px-3 py-2 bg-background rounded-lg mb-2">
        <span className="text-xs font-semibold text-text-secondary">{t('market')}</span>
        <span className="text-xs font-semibold text-text-secondary text-right">{t('min')}</span>
        <span className="text-xs font-semibold text-text-secondary text-right">{t('max')}</span>
        <span className="text-xs font-semibold text-text-secondary text-right">{t('modal')}</span>
      </div>

      {/* Records */}
      {/* Scrollable records */}
        <div className="overflow-y-auto max-h-[280px] flex flex-col gap-2 pr-1">
        {records.map((record, idx) => (
            <div
            key={idx}
            className="grid grid-cols-4 gap-2 px-3 py-3 border border-border rounded-xl hover:border-primary transition-colors"
            >
            <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-text-primary truncate">
                {record.market}
                </span>
                <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-text-secondary" />
                <span className="text-xs text-text-secondary truncate">
                    {record.district}
                </span>
                </div>
            </div>
            <span className="text-xs font-medium text-text-primary text-right self-center">
                ₹{record.min_price}
            </span>
            <span className="text-xs font-medium text-text-primary text-right self-center">
                ₹{record.max_price}
            </span>
            <span className="text-xs font-bold text-success text-right self-center">
                ₹{record.modal_price}
            </span>
            </div>
        ))}
        </div>

      {/* Footer note */}
      <p className="text-xs text-text-secondary mt-3 text-center">
        {t('mandi_source')}
      </p>
    </div>
  )
}

export default MandiPrices