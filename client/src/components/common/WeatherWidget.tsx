import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  CloudRain,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  AlertTriangle
} from 'lucide-react'
import { getLocationAndWeather, type WeatherData } from '@/services/weatherService'

const WeatherWidget = () => {
  const { t } = useTranslation()
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    getLocationAndWeather()
      .then(setWeather)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 animate-pulse">
        <div className="h-4 bg-border rounded w-32 mb-4" />
        <div className="h-10 bg-border rounded w-24 mb-3" />
        <div className="h-3 bg-border rounded w-48" />
      </div>
    )
  }

  if (error || !weather) {
    return (
      <div className="bg-surface border border-border rounded-2xl p-6 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-warning shrink-0" />
        <p className="text-sm text-text-secondary">{t('weather_unavailable')}</p>
      </div>
    )
  }

  // Simple irrigation alert logic
  const needsIrrigation = weather.humidity < 40
  const highHumidity = weather.humidity > 80

  return (
    <div className="bg-surface border border-border rounded-2xl p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          <span className="text-sm font-semibold text-text-primary">{weather.city}</span>
        </div>
        <img
          src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
          alt={weather.description}
          className="w-12 h-12"
        />
      </div>

      {/* Temperature */}
      <div className="flex items-end gap-2 mb-1">
        <span className="text-5xl font-bold text-text-primary">{weather.temp}°</span>
        <span className="text-lg text-text-secondary mb-2">C</span>
      </div>
      <p className="text-sm text-text-secondary capitalize mb-4">{weather.description}</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="flex flex-col items-center gap-1 bg-background rounded-xl p-3">
          <Thermometer className="w-4 h-4 text-warning" />
          <span className="text-xs font-medium text-text-primary">{weather.feels_like}°</span>
          <span className="text-xs text-text-secondary">{t('feels_like')}</span>
        </div>
        <div className="flex flex-col items-center gap-1 bg-background rounded-xl p-3">
          <Droplets className="w-4 h-4 text-primary" />
          <span className="text-xs font-medium text-text-primary">{weather.humidity}%</span>
          <span className="text-xs text-text-secondary">{t('humidity')}</span>
        </div>
        <div className="flex flex-col items-center gap-1 bg-background rounded-xl p-3">
          <Wind className="w-4 h-4 text-text-secondary" />
          <span className="text-xs font-medium text-text-primary">{weather.wind_speed}</span>
          <span className="text-xs text-text-secondary">{t('wind')}</span>
        </div>
      </div>

      {/* Irrigation Alert */}
      {needsIrrigation && (
        <div className="flex items-center gap-2 bg-warning/10 border border-warning/20 rounded-xl px-4 py-3">
          <CloudRain className="w-4 h-4 text-warning shrink-0" />
          <p className="text-xs text-warning font-medium">{t('irrigation_alert_low')}</p>
        </div>
      )}

      {highHumidity && (
        <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-xl px-4 py-3">
          <CloudRain className="w-4 h-4 text-primary shrink-0" />
          <p className="text-xs text-primary font-medium">{t('irrigation_alert_high')}</p>
        </div>
      )}

    </div>
  )
}

export default WeatherWidget