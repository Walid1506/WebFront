export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.geminiApiKey

  if (!apiKey) {
    throw createError({ statusCode: 500, message: 'Clé API Gemini manquante' })
  }

  const body = await readBody(event)
  const { imageBase64, mimeType = 'image/jpeg' } = body

  if (!imageBase64) {
    throw createError({ statusCode: 400, message: 'Image manquante' })
  }

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

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { inlineData: { mimeType, data: imageBase64 } },
            { text: prompt }
          ]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 256
        }
      })
    }
  )

  if (!response.ok) {
    const err = await response.text()
    throw createError({ statusCode: response.status, message: `Erreur Gemini : ${err}` })
  }

  const data = await response.json()
  const rawText = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim()

  if (!rawText) {
    throw createError({ statusCode: 500, message: 'Réponse vide de Gemini' })
  }

  try {
    // Strip possible markdown code fences if model ignores instructions
    const cleaned = rawText.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()
    return JSON.parse(cleaned)
  } catch {
    throw createError({ statusCode: 500, message: 'Réponse Gemini non parseable' })
  }
})
