export default defineEventHandler(async (event) => {
  const apiKey = useRuntimeConfig().groqApiKey
  if (!apiKey) {
    throw createError({ statusCode: 500, message: 'Clé API Groq manquante' })
  }

  const { imageBase64, mimeType = 'image/jpeg' } = await readBody(event)
  if (!imageBase64) {
    throw createError({ statusCode: 400, message: 'Image manquante' })
  }
  // Groq refuse les images base64 de plus de 4 Mo
  if (imageBase64.length > 5_000_000) {
    throw createError({ statusCode: 413, message: 'Image trop lourde' })
  }

  const prompt = `Cette photo montre un code-barres de produit alimentaire (EAN-13, EAN-8 ou UPC).
Lis les chiffres imprimés en clair sous (ou à côté de) les barres, de gauche à droite, y compris le premier chiffre isolé à gauche et le dernier à droite.
Réponds UNIQUEMENT avec un JSON valide, sans texte autour : {"digits": "3017620422003"}
Si aucun numéro de code-barres n'est lisible, réponds {"digits": ""}. N'invente jamais de chiffres.`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: 'qwen/qwen3.8-27b',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } },
            { type: 'text', text: prompt }
          ]
        }
      ],
      temperature: 0,
      max_tokens: 60
    })
  })

  if (!response.ok) {
    throw createError({ statusCode: response.status, message: `Erreur Groq : ${await response.text()}` })
  }

  const data = await response.json()
  const raw = String(data.choices?.[0]?.message?.content || '')
  const match = raw.match(/"digits"\s*:\s*"([\d\s-]*)"/)
  return { digits: (match ? match[1] : raw).replace(/\D/g, '') }
})
