// L'iPhone ne cherche une nouvelle version qu'à l'ouverture complète de l'app : on vérifie donc à chaque retour
// au premier plan. S'il y en a une, le module PWA l'installe et recharge la page tout seul.
// Pas pendant un écran ouvert par-dessus (séance, repas, chat...) : le rechargement ferait perdre ce qui est en cours.
const CHECK_INTERVAL = 60 * 1000

export default defineNuxtPlugin(() => {
  if (!('serviceWorker' in navigator)) return
  let lastCheck = 0

  document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState !== 'visible' || Date.now() - lastCheck < CHECK_INTERVAL) return
    if (document.querySelector('.fixed.inset-0:not(.pointer-events-none)') || document.activeElement?.matches('input, textarea')) return
    lastCheck = Date.now()
    const registration = await navigator.serviceWorker.getRegistration()
    registration?.update().catch(() => {})
  })
})
