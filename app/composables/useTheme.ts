export const THEMES = {
  aurora: {
    id: 'aurora', name: 'Aurora', emoji: '🌌',
    bg: '#060d1a',
    blobs: ['rgba(6,182,212,0.22)', 'rgba(124,58,237,0.18)', 'rgba(16,185,129,0.12)', 'rgba(14,165,233,0.12)', 'rgba(20,184,166,0.12)'],
    accent: 'from-cyan-400 to-emerald-400',
    accentSolid: '#22d3ee',
    preview: ['#22d3ee', '#a78bfa', '#34d399'],
  },
  sakura: {
    id: 'sakura', name: 'Sakura', emoji: '🌸',
    bg: '#140810',
    blobs: ['rgba(244,114,182,0.25)', 'rgba(217,70,239,0.20)', 'rgba(251,113,133,0.15)', 'rgba(236,72,153,0.15)', 'rgba(192,38,211,0.12)'],
    accent: 'from-pink-400 to-fuchsia-500',
    accentSolid: '#f472b6',
    preview: ['#f472b6', '#e879f9', '#fb7185'],
  },
  sunset: {
    id: 'sunset', name: 'Sunset', emoji: '🌅',
    bg: '#0f0700',
    blobs: ['rgba(251,146,60,0.25)', 'rgba(239,68,68,0.20)', 'rgba(234,179,8,0.15)', 'rgba(249,115,22,0.18)', 'rgba(220,38,38,0.12)'],
    accent: 'from-orange-400 to-amber-400',
    accentSolid: '#fb923c',
    preview: ['#fb923c', '#ef4444', '#fbbf24'],
  },
  ocean: {
    id: 'ocean', name: 'Océan', emoji: '🌊',
    bg: '#00060f',
    blobs: ['rgba(59,130,246,0.25)', 'rgba(20,184,166,0.20)', 'rgba(99,102,241,0.15)', 'rgba(14,165,233,0.18)', 'rgba(6,182,212,0.12)'],
    accent: 'from-blue-400 to-teal-400',
    accentSolid: '#60a5fa',
    preview: ['#60a5fa', '#2dd4bf', '#818cf8'],
  },
  foret: {
    id: 'foret', name: 'Forêt', emoji: '🌿',
    bg: '#030d05',
    blobs: ['rgba(34,197,94,0.22)', 'rgba(16,185,129,0.20)', 'rgba(132,204,22,0.15)', 'rgba(20,184,166,0.15)', 'rgba(74,222,128,0.10)'],
    accent: 'from-green-400 to-emerald-400',
    accentSolid: '#4ade80',
    preview: ['#4ade80', '#34d399', '#a3e635'],
  },
  galaxy: {
    id: 'galaxy', name: 'Galaxy', emoji: '🔮',
    bg: '#08001a',
    blobs: ['rgba(139,92,246,0.28)', 'rgba(99,102,241,0.22)', 'rgba(168,85,247,0.18)', 'rgba(124,58,237,0.20)', 'rgba(79,70,229,0.15)'],
    accent: 'from-violet-400 to-purple-500',
    accentSolid: '#a78bfa',
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
      document.documentElement.style.setProperty('--theme-bg', t.bg)
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
