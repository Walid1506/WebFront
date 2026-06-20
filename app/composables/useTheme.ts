export const THEMES = {
  aurora: {
    id: 'aurora', name: 'Aurora', emoji: '🌌',
    bg: '#060d1a',
    blobs: ['rgba(6,182,212,0.30)', 'rgba(124,58,237,0.24)', 'rgba(16,185,129,0.18)', 'rgba(14,165,233,0.16)', 'rgba(20,184,166,0.16)'],
    accentFrom: '#22d3ee', accentTo: '#34d399', accentSolid: '#22d3ee',
    preview: ['#22d3ee', '#a78bfa', '#34d399'],
  },
  sakura: {
    id: 'sakura', name: 'Sakura', emoji: '🌸',
    bg: '#1e0818',
    bgImage: '/images/gif sakura.gif',
    bgOverlay: 'rgba(20, 4, 16, 0.55)',
    blobs: ['rgba(244,114,182,0.30)', 'rgba(217,70,239,0.22)', 'rgba(251,113,133,0.20)', 'rgba(236,72,153,0.18)', 'rgba(192,38,211,0.16)'],
    accentFrom: '#f472b6', accentTo: '#e879f9', accentSolid: '#f472b6',
    preview: ['#f472b6', '#e879f9', '#fb7185'],
  },
  sunset: {
    id: 'sunset', name: 'Sunset', emoji: '🌅',
    bg: '#180900',
    blobs: ['rgba(251,146,60,0.48)', 'rgba(239,68,68,0.40)', 'rgba(234,179,8,0.28)', 'rgba(249,115,22,0.38)', 'rgba(220,38,38,0.24)'],
    accentFrom: '#fb923c', accentTo: '#fbbf24', accentSolid: '#fb923c',
    preview: ['#fb923c', '#ef4444', '#fbbf24'],
  },
  ocean: {
    id: 'ocean', name: 'Océan', emoji: '🌊',
    bg: '#00060f',
    blobs: ['rgba(59,130,246,0.40)', 'rgba(20,184,166,0.36)', 'rgba(99,102,241,0.28)', 'rgba(14,165,233,0.34)', 'rgba(6,182,212,0.24)'],
    accentFrom: '#60a5fa', accentTo: '#2dd4bf', accentSolid: '#60a5fa',
    preview: ['#60a5fa', '#2dd4bf', '#818cf8'],
  },
  foret: {
    id: 'foret', name: 'Forêt', emoji: '🌿',
    bg: '#031008',
    blobs: ['rgba(34,197,94,0.40)', 'rgba(16,185,129,0.36)', 'rgba(132,204,22,0.26)', 'rgba(20,184,166,0.28)', 'rgba(74,222,128,0.22)'],
    accentFrom: '#4ade80', accentTo: '#34d399', accentSolid: '#4ade80',
    preview: ['#4ade80', '#34d399', '#a3e635'],
  },
  galaxy: {
    id: 'galaxy', name: 'Galaxy', emoji: '🔮',
    bg: '#07001c',
    blobs: ['rgba(139,92,246,0.46)', 'rgba(99,102,241,0.38)', 'rgba(168,85,247,0.34)', 'rgba(124,58,237,0.36)', 'rgba(79,70,229,0.26)'],
    accentFrom: '#a78bfa', accentTo: '#c084fc', accentSolid: '#a78bfa',
    preview: ['#a78bfa', '#818cf8', '#c084fc'],
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
