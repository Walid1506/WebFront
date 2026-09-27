import { serverSupabaseClient } from '#supabase/server'

// Appelé par le raccourci iOS « FitTrack Pas » (une web app ne peut pas lire l'app Santé) :
//   GET /api/pas?cle=<lien personnel>&pas=<nombre de pas du jour>
// Le jeton est vérifié par la fonction SQL log_steps (supabase/migrations/20260927_pas_sante.sql).

// Seule fonction de la base appelée ici (le projet n'a pas de types Supabase générés)
type StepsDatabase = {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: { log_steps: { Args: { p_token: string, p_steps: number }, Returns: number } }
  }
}

// Le raccourci peut envoyer « 8543 », « 8 543 », « 8543,6 » ou « 8,543 » selon la langue de l'iPhone
function parseSteps(raw: unknown) {
  let text = String(raw ?? '').replace(/[^\d.,]/g, '')
  if (!text) return null
  // Séparateurs de milliers (groupes de 3 chiffres) ou virgule décimale
  if (/^\d{1,3}([.,]\d{3})+$/.test(text)) text = text.replace(/[.,]/g, '')
  else text = text.replace(',', '.')
  const steps = Math.round(Number(text))
  return Number.isFinite(steps) && steps >= 0 && steps <= 200000 ? steps : null
}

export default defineEventHandler(async (event) => {
  setHeader(event, 'cache-control', 'no-store')

  const body = event.method === 'POST' ? await readBody(event).catch(() => null) : null
  const params = { ...getQuery(event), ...(body && typeof body === 'object' ? body : {}) }
  const token = String(params.cle || '').trim().toLowerCase()
  const steps = parseSteps(params.pas)

  if (!/^[0-9a-f]{32}$/.test(token)) {
    throw createError({ statusCode: 400, message: 'Lien FitTrack invalide : recopie ton lien depuis l\'app.' })
  }
  if (steps === null) {
    throw createError({ statusCode: 400, message: 'Nombre de pas manquant après « pas= ».' })
  }

  const supabase = await serverSupabaseClient<StepsDatabase>(event)
  const { error } = await supabase.rpc('log_steps', { p_token: token, p_steps: steps })
  if (error) {
    if (error.message?.includes('Lien inconnu')) {
      throw createError({ statusCode: 404, message: 'Lien FitTrack inconnu : recopie ton lien depuis l\'app.' })
    }
    console.error('Erreur log_steps :', error)
    throw createError({ statusCode: 500, message: 'Les pas n\'ont pas pu être enregistrés.' })
  }

  return `${steps} pas envoyés à FitTrack ✅`
})
