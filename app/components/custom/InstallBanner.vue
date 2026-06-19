<template>
  <Transition name="banner-up">
    <div v-if="show"
      class="fixed bottom-0 left-0 right-0 z-[8000] bg-[#0a1525]/98 backdrop-blur-2xl border-t border-white/[0.10] px-5 pt-4 pb-safe">
      <div class="flex items-start gap-4 max-w-lg mx-auto">
        <!-- Logo -->
        <div class="w-12 h-12 rounded-[14px] overflow-hidden border border-white/10 shrink-0">
          <img src="/images/logo.jpg" class="w-full h-full object-cover" />
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-white font-black text-sm">Installer FitTrack</p>
          <p class="text-slate-400 text-xs mt-0.5 leading-relaxed">
            Appuie sur
            <span class="inline-flex items-center gap-0.5 bg-white/10 rounded-md px-1.5 py-0.5 text-white font-black">
              <UIcon name="i-heroicons-arrow-up-tray" class="text-sm" />
            </span>
            puis <span class="text-white font-black">"Sur l'écran d'accueil"</span>
          </p>
        </div>
        <button @click="dismiss" class="p-1.5 text-slate-600 hover:text-slate-400 transition shrink-0">
          <UIcon name="i-heroicons-x-mark" class="text-lg" />
        </button>
      </div>
      <!-- Flèche animée pointant vers le bas (bouton partage Safari) -->
      <div class="flex justify-center mt-3 mb-1">
        <div class="flex flex-col items-center gap-1 text-cyan-400 animate-bounce">
          <UIcon name="i-heroicons-chevron-down" class="text-xl" />
          <UIcon name="i-heroicons-chevron-down" class="text-base opacity-60" />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const show = ref(false)

onMounted(() => {
  // Afficher seulement sur iOS Safari hors standalone
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (navigator as any).standalone
  const dismissed = localStorage.getItem('install-banner-dismissed')

  if (isIOS && !isStandalone && !dismissed) {
    // Afficher après 4s pour ne pas perturber le chargement
    setTimeout(() => { show.value = true }, 4000)
  }
})

function dismiss() {
  show.value = false
  localStorage.setItem('install-banner-dismissed', '1')
}
</script>

<style scoped>
.pb-safe { padding-bottom: max(16px, env(safe-area-inset-bottom)); }
.banner-up-enter-active, .banner-up-leave-active { transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
.banner-up-enter-from, .banner-up-leave-to { opacity: 0; transform: translateY(100%); }
</style>
