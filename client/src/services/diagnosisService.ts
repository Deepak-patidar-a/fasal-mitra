const HF_API_KEY = import.meta.env.VITE_HF_API_KEY

// This model is specifically trained on PlantVillage dataset
// It covers 38 classes of plant diseases
const MODEL_URL =
  'https://router.huggingface.co/hf-inference/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification'

export interface DiagnosisResult {
  disease: string
  confidence: number
}

export const diagnoseImage = async (
  file: File
): Promise<DiagnosisResult[]> => {
  const response = await fetch(MODEL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${HF_API_KEY}`,
      'Content-Type': 'application/octet-stream'
    },
    body: file
  })

  if (!response.ok) {
    const error = await response.json()
    // Model is loading on HF servers — cold start
    if (response.status === 503) {
      throw new Error('model_loading')
    }
    throw new Error(error.error || 'Diagnosis failed')
  }

  const results = await response.json()

  // HF returns array of { label, score }
  return results
    .slice(0, 3)
    .map((item: { label: string; score: number }) => ({
      disease: item.label,
      confidence: Math.round(item.score * 100)
    }))
}