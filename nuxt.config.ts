export default defineNuxtConfig({
  future: { compatibilityVersion: 4 },

  runtimeConfig: {
    groqApiKey: process.env.GROQ_API_KEY || '',
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'https://fittrack-kappa.vercel.app'
    }
  },
  compatibilityDate: '2025-01-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],

  app: {
    head: {
      meta: [
        // Pas de zoom : l'app reste fixe comme une app native (sinon un pincement la décale à gauche/droite)
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'FitTrack' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'theme-color', content: '#060d1a' },
        { name: 'msapplication-TileColor', content: '#060d1a' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
        { rel: 'apple-touch-startup-image', href: '/pwa-512x512.png' },
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
    // La nouvelle version s'installe dès l'ouverture de l'app (sinon l'iPhone garde l'ancienne un moment)
    registerType: 'autoUpdate',
    manifest: {
      name: 'FitTrack',
      short_name: 'FitTrack',
      description: 'Application de suivi sportif FitTrack',
      theme_color: '#060d1a',
      background_color: '#060d1a',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' }
      ]
    },
    workbox: {
      additionalManifestEntries: [],
      importScripts: ['/sw-push.js'],
      // Tout ce qu'il faut pour ouvrir l'app gardé sur le téléphone : code, styles, polices, photos des aliments.
      // (Sans cette liste, le module n'en gardait que ses petits fichiers internes : tout repassait par le réseau)
      globPatterns: ['**/*.{js,css,html,woff2}', 'foods/*.webp', 'images/*.{jpg,png,webp}']
    },
    devOptions: { enabled: false }
  },

  // Icônes incluses dans le code de l'app (sinon chacune est demandée au serveur au premier affichage)
  icon: {
    clientBundle: {
      scan: true,
      // Icônes des repas (app/utils/meals.ts, fichier que le scan ne lit pas)
      icons: ['lucide:coffee', 'lucide:utensils', 'lucide:cookie', 'heroicons:squares-2x2']
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
    '/**': { ssr: false },
    // Page de l'app générée à l'avance : le service worker la garde et l'app s'ouvre sans attendre le réseau
    '/': { prerender: true },
    // Photos des aliments et logo : gardés en cache au lieu d'être redemandés au serveur à chaque affichage
    '/foods/**': { headers: { 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' } },
    '/images/**': { headers: { 'cache-control': 'public, max-age=86400, stale-while-revalidate=604800' } }
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