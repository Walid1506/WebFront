<template>
  <Transition name="splash-out">
    <div v-if="visible" class="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden" style="background-color: var(--theme-bg, #060d1a)">

      <!-- Blobs animés (couleurs du thème) -->
      <div class="absolute inset-0 pointer-events-none">
        <div class="blob blob-1 absolute w-[500px] h-[500px] rounded-full blur-[120px]" :style="{ backgroundColor: theme.blobs[0] }"></div>
        <div class="blob blob-2 absolute w-[400px] h-[400px] rounded-full blur-[100px]" :style="{ backgroundColor: theme.blobs[1] }"></div>
        <div class="blob blob-3 absolute w-[350px] h-[350px] rounded-full blur-[110px]" :style="{ backgroundColor: theme.blobs[2] }"></div>
      </div>

      <!-- Contenu centré -->
      <div class="relative flex flex-col items-center gap-8">

        <!-- Logo avec glow -->
        <div class="logo-container" :class="{ 'logo-ready': step >= 1 }">
          <div class="logo-glow"></div>
          <div class="w-28 h-28 rounded-[32px] overflow-hidden border-2 border-white/10 shadow-2xl relative">
            <img src="/images/logo.jpg" alt="FitTrack" class="w-full h-full object-cover" />
            <div class="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-emerald-400/10"></div>
          </div>
        </div>

        <!-- Texte -->
        <div class="text-container flex flex-col items-center gap-2" :class="{ 'text-ready': step >= 2 }">
          <h1 class="text-5xl font-[1000] tracking-tighter uppercase italic text-white leading-none">
            Fit<span class="bg-gradient-to-r from-cyan-400 to-emerald-400 bg-clip-text text-transparent">Track</span>
          </h1>
          <p class="text-slate-500 font-bold text-sm tracking-widest uppercase">Ta progression, ton histoire</p>
        </div>

        <!-- Loader -->
        <div class="dots-container flex items-center gap-2" :class="{ 'dots-ready': step >= 3 }">
          <div class="dot dot-1 w-2 h-2 rounded-full bg-cyan-400"></div>
          <div class="dot dot-2 w-2 h-2 rounded-full bg-cyan-400/70"></div>
          <div class="dot dot-3 w-2 h-2 rounded-full bg-cyan-400/40"></div>
        </div>

      </div>

    </div>
  </Transition>
</template>

<script setup>
const emit = defineEmits(['done'])
const visible = ref(true)
const step = ref(0)
const { theme } = useTheme()

onMounted(() => {
  // Animation séquentielle
  setTimeout(() => { step.value = 1 }, 100)   // logo
  setTimeout(() => { step.value = 2 }, 500)   // texte
  setTimeout(() => { step.value = 3 }, 900)   // dots
  setTimeout(() => { visible.value = false; emit('done') }, 2400)
})
</script>

<style scoped>
/* Aurora blobs */
.blob { position: absolute; }
.blob-1 { top: -100px; left: -100px; animation: float1 8s ease-in-out infinite; }
.blob-2 { top: 50%; right: -80px; animation: float2 10s ease-in-out infinite; }
.blob-3 { bottom: -80px; left: 20%; animation: float3 9s ease-in-out infinite; }

@keyframes float1 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(40px, 30px) scale(1.1); } }
@keyframes float2 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(-30px, -40px) scale(1.05); } }
@keyframes float3 { 0%, 100% { transform: translate(0, 0) scale(1); } 50% { transform: translate(20px, -30px) scale(1.08); } }

/* Logo */
.logo-container { position: relative; opacity: 0; transform: scale(0.6); transition: all 0.7s cubic-bezier(0.34, 1.56, 0.64, 1); }
.logo-container.logo-ready { opacity: 1; transform: scale(1); }

.logo-glow {
  position: absolute; inset: -20px;
  background: radial-gradient(circle, rgba(34, 211, 238, 0.3) 0%, transparent 70%);
  border-radius: 50%; opacity: 0;
  animation: none;
}
.logo-ready .logo-glow { animation: glow-pulse 2s ease-in-out infinite; }

@keyframes glow-pulse {
  0%, 100% { opacity: 0.4; transform: scale(0.9); }
  50% { opacity: 1; transform: scale(1.1); }
}

/* Texte */
.text-container { opacity: 0; transform: translateY(20px); transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s; }
.text-container.text-ready { opacity: 1; transform: translateY(0); }

/* Dots */
.dots-container { opacity: 0; transition: opacity 0.4s ease 0.1s; }
.dots-container.dots-ready { opacity: 1; }

.dot { animation: bounce 1.2s ease-in-out infinite; }
.dot-1 { animation-delay: 0s; }
.dot-2 { animation-delay: 0.2s; }
.dot-3 { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-8px); }
}

/* Exit */
.splash-out-leave-active { transition: opacity 0.6s ease, transform 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
.splash-out-leave-to { opacity: 0; transform: scale(1.05); }
</style>
