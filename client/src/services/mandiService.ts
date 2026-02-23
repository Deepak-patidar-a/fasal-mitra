const API_KEY = import.meta.env.VITE_MANDI_API_KEY

export interface MandiRecord {
  state: string
  district: string
  market: string
  commodity: string
  variety: string
  min_price: string
  max_price: string
  modal_price: string
  date: string
}

export const getMandiPrices = async (
  commodity: string,
  state?: string
): Promise<MandiRecord[]> => {
  const params = new URLSearchParams({
    'api-key': API_KEY,
    format: 'json',
    limit: '10',
    'filters[commodity]': commodity
  })

  if (state) {
    params.append('filters[state]', state)
  }

  const res = await fetch(
    `https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070?${params}`
  )

  if (!res.ok) throw new Error('Mandi API failed')

  const data = await res.json()
  return data.records || []
}