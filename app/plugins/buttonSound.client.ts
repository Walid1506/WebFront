export default defineNuxtPlugin(() => {
  let ctx: AudioContext | null = null

  function getCtx() {
    if (!ctx || ctx.state === 'closed') {
      ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    }
    return ctx
  }

  function playClick() {
    try {
      const c = getCtx()
      const o = c.createOscillator()
      const g = c.createGain()
      o.connect(g)
      g.connect(c.destination)
      o.type = 'sine'
      o.frequency.value = 620
      g.gain.setValueAtTime(0.08, c.currentTime)
      g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + 0.07)
      o.start()
      o.stop(c.currentTime + 0.07)
    } catch {}
  }

  document.addEventListener('pointerdown', (e) => {
    const el = e.target as HTMLElement
    if (el.closest('button') || el.closest('[role="button"]')) {
      playClick()
    }
  }, { passive: true })
})
