export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.groqApiKey

  if (!apiKey) {
    throw createError({ statusCode: 500, message: 'Clé API Groq manquante' })
  }

  const body = await readBody(event)
  const { imageBase64, mimeType = 'image/jpeg' } = body

  if (!imageBase64) {
    throw createError({ statusCode: 400, message: 'Image manquante' })
  }

  // Groq refuse les images base64 de plus de 4 Mo (le client redimensionne avant l'envoi)
  if (imageBase64.length > 5_000_000) {
    throw createError({ statusCode: 413, message: 'Image trop lourde' })
  }
  const imageUrl = `data:${mimeType};base64,${imageBase64}`

  const prompt = `Tu es un expert en nutrition. Analyse l'aliment ou le repas dans cette image.

Identifie le(s) aliment(s) et estime les valeurs nutritionnelles pour la portion visible dans l'assiette.

Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans backticks, sans aucun texte avant ou après :
{
  "name": "nom du plat ou aliment principal",
  "portion": 300,
  "calories": 450,
  "proteins": 35.0,
  "carbs": 40.0,
  "fats": 15.0,
  "confidence": "haute"
}

Règles :
- "portion" : poids total estimé en grammes de ce qui est visible (entier)
- Les macros sont pour LA PORTION ESTIMÉE (pas pour 100g)
- "confidence" : "haute" si clairement identifiable, "moyenne" si approximatif, "basse" si incertain
- "proteins", "carbs", "fats" : 1 décimale maximum
- "calories" : entier
- Si ce n'est pas de la nourriture : confidence "basse" et toutes les valeurs à 0`

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
            { type: 'image_url', image_url: { url: imageUrl } },
            { type: 'text', text: prompt }
          ]
        }
      ],
      temperature: 0.2,
      max_tokens: 300
    })
  })

  if (!response.ok) {
    const err = await response.text()
    throw createError({ statusCode: response.status, message: `Erreur Groq : ${err}` })
  }

  const data = await response.json()
  const rawText = data.choices?.[0]?.message?.content?.trim()

  if (!rawText) {
    throw createError({ statusCode: 500, message: 'Réponse vide de Groq' })
  }

  try {
    const cleaned = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    return JSON.parse(cleaned)
  } catch {
    throw createError({ statusCode: 500, message: 'Réponse Groq non parseable : ' + rawText })
  }
})
