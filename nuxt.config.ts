export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },

  runtimeConfig: {
    groqApiKey: process.env.GROQ_API_KEY || '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000'
    }
  },
  compatibilityDate: '2025-01-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    }
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/test-utils/module',
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@vite-pwa/nuxt', 
    '@nuxtjs/supabase'
  ],
  
  // 👇 Configuration Supabase 👇
  supabase: {
    // On gère les redirections nous-mêmes dans les pages pour éviter les conflits
    redirect: false 
  },

  // 👇 Toute la configuration de l'application mobile (PWA) 👇
  pwa: {
    manifest: {
      name: 'FitTrack',
      short_name: 'FitTrack',
      description: 'Application de suivi sportif FitTrack',
      theme_color: '#0f172a',
      background_color: '#0f172a',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    devOptions: {
      enabled: false
    }
  },

  // 👇 Configuration des langues 👇
  i18n: {
    lazy: true,
    langDir: 'locales',
    strategy: 'no_prefix',
    defaultLocale: 'fr',
    locales: [
      { code: 'fr', file: 'fr.json', name: 'Français' },
      { code: 'en', file: 'en.json', name: 'English' }
    ]
  },

  // 👇 Gestion automatique des composants 👇
  components: {
    dirs: [{ path: '~/components', pathPrefix: false }]
  },

  // 👇 LA CLÉ POUR SUPPRIMER LES ERREURS D'HYDRATION 👇
  routeRules: {
    // On force TOUTES les pages à charger uniquement côté navigateur
    '/**': { ssr: false }
  },

  // 👇 Configuration Style Eslint 👇
  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})