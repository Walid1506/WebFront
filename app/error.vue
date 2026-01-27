<script setup>
// Récupère les infos de l'erreur envoyée par Nuxt
const props = defineProps(['error'])

// Fonction pour nettoyer l'erreur et revenir à l'accueil
const handleError = () => clearError({ redirect: '/' })
</script>

<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 space-y-6 text-center">
    <UIcon name="i-heroicons-exclamation-triangle" class="text-6xl text-red-500" />
    
    <div>
      <h1 class="text-6xl font-black text-gray-900">{{ error?.statusCode }}</h1>
      <p class="text-xl text-gray-600 mt-2">{{ error?.message || 'Une erreur est survenue' }}</p>
    </div>

    <UButton 
      size="xl" 
      color="black" 
      icon="i-heroicons-home" 
      @click="handleError"
    >
      Retour à l'accueil
    </UButton>
  </div>
</template>