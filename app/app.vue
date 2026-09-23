<template>
  <div>
    <!-- L'app se charge sous l'écran de démarrage (qui se masque tout seul) : les données sont prêtes quand il disparaît -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <UNotifications />
    <InstallBanner />
    <SplashScreen />
  </div>
</template>

<script setup>
import SplashScreen from '~/components/custom/SplashScreen.vue'
import InstallBanner from '~/components/custom/InstallBanner.vue'

// Apply saved theme immediately so the splash screen uses the right background
const { initTheme } = useTheme()
if (typeof window !== 'undefined') initTheme()
</script>
