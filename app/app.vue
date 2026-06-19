<template>
  <div>
    <SplashScreen v-if="showSplash" @done="showSplash = false" />
    <Transition name="app-fade">
      <div v-if="!showSplash">
        <NuxtLayout>
          <NuxtPage />
        </NuxtLayout>
        <UNotifications />
        <InstallBanner />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import SplashScreen from '~/components/custom/SplashScreen.vue'
import InstallBanner from '~/components/custom/InstallBanner.vue'

const showSplash = ref(true)

// Apply saved theme immediately so the splash screen uses the right background
const { initTheme } = useTheme()
if (typeof window !== 'undefined') initTheme()
</script>

<style>
.app-fade-enter-active { transition: opacity 0.5s ease; }
.app-fade-enter-from { opacity: 0; }
</style>
