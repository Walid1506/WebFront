export default defineNuxtConfig({
  future: {
    compatibilityVersion: 4
  },

  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxt/test-utils/module',
    '@pinia/nuxt',
    '@pinia-plugin-persistedstate/nuxt'
  ],

  // Configuration spécifique pour forcer la sauvegarde
  piniaPluginPersistedstate: {
    storage: 'localStorage',
    debug: true, // Affiche les logs dans la console si ça bug
  },

  components: {
    dirs: [{ path: '~/components', pathPrefix: false }]
  },

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  routeRules: {
    
    '/': { ssr: false } 
  },

  compatibilityDate: '2025-01-15',

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  }
})