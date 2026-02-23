const API_KEY = import.meta.env.VITE_WEATHER_API_KEY

export interface WeatherData {
  city: string
  temp: number
  feels_like: number
  humidity: number
  description: string
  icon: string
  wind_speed: number
}

export const getWeatherByCoords = async (
  lat: number,
  lon: number
): Promise<WeatherData> => {
  const res = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  )
  if (!res.ok) throw new Error('Weather fetch failed')
  const data = await res.json()

  return {
    city: data.name,
    temp: Math.round(data.main.temp),
    feels_like: Math.round(data.main.feels_like),
    humidity: data.main.humidity,
    description: data.weather[0].description,
    icon: data.weather[0].icon,
    wind_speed: data.wind.speed
  }
}

export const getLocationAndWeather = (): Promise<WeatherData> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'))
      return
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const weather = await getWeatherByCoords(
            position.coords.latitude,
            position.coords.longitude
          )
          resolve(weather)
        } catch (err) {
          reject(err)
        }
      },
      () => reject(new Error('Location permission denied'))
    )
  })
}