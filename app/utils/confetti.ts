// Pluie de confettis sur un canvas plein écran : deux canons en bas des côtés, une gerbe au centre
// et une pluie venue du haut. Renvoie une fonction qui arrête l'animation.
export function launchConfetti(canvas: HTMLCanvasElement, colors: string[]) {
  const ctx = canvas.getContext('2d')
  if (!ctx || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return () => {}

  let width = 0
  let height = 0
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    width = window.innerWidth
    height = window.innerHeight
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
  }
  resize()

  type Piece = {
    x: number, y: number, vx: number, vy: number, size: number, ratio: number, color: string
    rot: number, vr: number, tilt: number, vt: number, round: boolean, delay: number
  }
  const pieces: Piece[] = []

  function add(x: number, y: number, angle: number, speed: number, delay = 0) {
    pieces.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 7 + Math.random() * 6,
      ratio: 0.45 + Math.random() * 0.45,
      color: colors[Math.floor(Math.random() * colors.length)] || '#ffffff',
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.35,
      tilt: Math.random() * Math.PI * 2,
      vt: 0.08 + Math.random() * 0.12,
      round: Math.random() < 0.22,
      delay
    })
  }

  // Vitesses en pixels par image (60 i/s), proportionnelles à la hauteur de l'écran
  const power = Math.max(height, 560) / 30
  for (let i = 0; i < 75; i++) {
    add(-10, height * 0.95, -Math.PI / 2.9 + (Math.random() - 0.5) * 0.6, power * (0.55 + Math.random() * 0.55))
    add(width + 10, height * 0.95, -Math.PI + Math.PI / 2.9 + (Math.random() - 0.5) * 0.6, power * (0.55 + Math.random() * 0.55))
  }
  for (let i = 0; i < 45; i++) {
    add(width / 2, height * 0.4, Math.random() * Math.PI * 2, power * (0.15 + Math.random() * 0.35))
  }
  for (let i = 0; i < 60; i++) {
    add(Math.random() * width, -20, Math.PI / 2, 1 + Math.random() * 2, 20 + Math.random() * 70)
  }

  let frameId = 0
  let last = performance.now()
  const start = last

  function frame(now: number) {
    // Même vitesse quel que soit l'écran (60 ou 120 Hz)
    const dt = Math.min(2.5, (now - last) / (1000 / 60))
    last = now
    ctx!.clearRect(0, 0, width, height)

    for (let i = pieces.length - 1; i >= 0; i--) {
      const p = pieces[i]!
      if (p.delay > 0) {
        p.delay -= dt
        continue
      }
      // Freinage de l'air + gravité : les confettis montent vite puis retombent en voletant
      const drag = Math.pow(0.955, dt)
      p.vx *= drag
      p.vy = p.vy * drag + 0.22 * dt
      p.tilt += p.vt * dt
      p.rot += p.vr * dt
      p.x += (p.vx + Math.sin(p.tilt) * 0.6) * dt
      p.y += p.vy * dt

      if (p.y > height + 30) {
        pieces.splice(i, 1)
        continue
      }

      ctx!.save()
      ctx!.translate(p.x, p.y)
      ctx!.rotate(p.rot)
      ctx!.scale(1, Math.cos(p.tilt))
      ctx!.fillStyle = p.color
      if (p.round) {
        ctx!.beginPath()
        ctx!.arc(0, 0, p.size * 0.4, 0, Math.PI * 2)
        ctx!.fill()
      } else {
        ctx!.fillRect(-p.size / 2, (-p.size * p.ratio) / 2, p.size, p.size * p.ratio)
      }
      ctx!.restore()
    }

    if (pieces.length && now - start < 8000) frameId = requestAnimationFrame(frame)
    else ctx!.clearRect(0, 0, width, height)
  }

  frameId = requestAnimationFrame(frame)
  window.addEventListener('resize', resize)

  return () => {
    cancelAnimationFrame(frameId)
    window.removeEventListener('resize', resize)
  }
}
