export const THEMES = {
  aurora: {
    id: 'aurora', name: 'Arena', emoji: '⚡',
    bg: '#09090b',
    blobs: ['rgba(6,182,212,0.30)', 'rgba(124,58,237,0.24)', 'rgba(16,185,129,0.18)', 'rgba(14,165,233,0.16)', 'rgba(20,184,166,0.16)'],
    accentFrom: '#c6ff00', accentTo: '#c6ff00', accentSolid: '#c6ff00',
    preview: ['#c6ff00', '#ff4d1c', '#fafafa'],
  },
  sakura: {
    id: 'sakura', name: 'Sakura', emoji: '🌸',
    bg: '#09090b',
    blobs: ['rgba(244,114,182,0.30)', 'rgba(217,70,239,0.22)', 'rgba(251,113,133,0.20)', 'rgba(236,72,153,0.18)', 'rgba(192,38,211,0.16)'],
    accentFrom: '#ff4fa3', accentTo: '#ff4fa3', accentSolid: '#ff4fa3',
    preview: ['#ff4fa3', '#ff4d1c', '#fafafa'],
  },
  sunset: {
    id: 'sunset', name: 'Sunset', emoji: '🌅',
    bg: '#09090b',
    blobs: ['rgba(251,146,60,0.48)', 'rgba(239,68,68,0.40)', 'rgba(234,179,8,0.28)', 'rgba(249,115,22,0.38)', 'rgba(220,38,38,0.24)'],
    accentFrom: '#ff7a1a', accentTo: '#ff7a1a', accentSolid: '#ff7a1a',
    preview: ['#ff7a1a', '#ff4d1c', '#fafafa'],
  },
  ocean: {
    id: 'ocean', name: 'Océan', emoji: '🌊',
    bg: '#09090b',
    blobs: ['rgba(59,130,246,0.40)', 'rgba(20,184,166,0.36)', 'rgba(99,102,241,0.28)', 'rgba(14,165,233,0.34)', 'rgba(6,182,212,0.24)'],
    accentFrom: '#22c8ff', accentTo: '#22c8ff', accentSolid: '#22c8ff',
    preview: ['#22c8ff', '#ff4d1c', '#fafafa'],
  },
  foret: {
    id: 'foret', name: 'Forêt', emoji: '🌿',
    bg: '#09090b',
    blobs: ['rgba(34,197,94,0.40)', 'rgba(16,185,129,0.36)', 'rgba(132,204,22,0.26)', 'rgba(20,184,166,0.28)', 'rgba(74,222,128,0.22)'],
    accentFrom: '#2bff88', accentTo: '#2bff88', accentSolid: '#2bff88',
    preview: ['#2bff88', '#ff4d1c', '#fafafa'],
  },
  galaxy: {
    id: 'galaxy', name: 'Galaxy', emoji: '🔮',
    bg: '#09090b',
    blobs: ['rgba(139,92,246,0.46)', 'rgba(99,102,241,0.38)', 'rgba(168,85,247,0.34)', 'rgba(124,58,237,0.36)', 'rgba(79,70,229,0.26)'],
    accentFrom: '#b18cff', accentTo: '#b18cff', accentSolid: '#b18cff',
    preview: ['#b18cff', '#ff4d1c', '#fafafa'],
  },
}

export type ThemeId = keyof typeof THEMES

export function useTheme() {
  const themeId = useState<ThemeId>('theme-id', () => 'aurora')
  const theme = computed(() => THEMES[themeId.value] ?? THEMES.aurora)

  function applyTheme(id: ThemeId) {
    themeId.value = id
    if (typeof document !== 'undefined') {
      const t = THEMES[id] ?? THEMES.aurora
      const el = document.documentElement
      el.style.setProperty('--theme-bg', t.bg)
      el.style.setProperty('--accent-from', t.accentFrom)
      el.style.setProperty('--accent-to', t.accentTo)
      el.style.setProperty('--accent-solid', t.accentSolid)
    }
  }

  function setTheme(id: ThemeId) {
    applyTheme(id)
    if (typeof localStorage !== 'undefined') localStorage.setItem('fittrack-theme', id)
  }

  function initTheme() {
    if (typeof localStorage === 'undefined') return
    const saved = localStorage.getItem('fittrack-theme') as ThemeId | null
    if (saved && THEMES[saved]) applyTheme(saved)
  }

  return { theme, themeId, setTheme, initTheme, THEMES }
}
