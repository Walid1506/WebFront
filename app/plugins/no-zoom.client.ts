// Safari iOS ignore user-scalable=no : on bloque le pincement pour que l'app ne se décale pas à gauche/droite
export default defineNuxtPlugin(() => {
  const prevent = (e: Event) => e.preventDefault()
  document.addEventListener('gesturestart', prevent, { passive: false })
  document.addEventListener('gesturechange', prevent, { passive: false })
})
