<template>
  <!-- Bouton flottant -->
  <div>
    <button
      v-if="!isOpen"
      @click="isOpen = true"
      class="fixed bottom-24 right-4 md:bottom-8 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] shadow-2xl shadow-[color:var(--accent-solid)]/30 flex items-center justify-center active:scale-95 transition-all duration-200"
      :class="isRunning ? 'animate-pulse' : ''"
    >
      <UIcon name="i-heroicons-clock" class="text-black text-2xl" />
      <span v-if="isRunning" class="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full text-[10px] font-black text-black flex items-center justify-center">
        {{ Math.ceil(remaining / 60) > 0 && remaining > 60 ? Math.ceil(remaining / 60) + 'm' : remaining + 's' }}
      </span>
    </button>

    <!-- Overlay timer -->
    <Transition name="slide-up">
      <div v-if="isOpen" class="fixed inset-0 z-[200] flex flex-col items-center justify-center backdrop-blur-2xl" :style="{ backgroundColor: theme.bgImage ? bgAlpha(theme.bg, 0.55) : bgAlpha(theme.bg, 0.96) }">
        <!-- GIF background (sakura) -->
        <div v-if="theme.bgImage" class="absolute inset-0 -z-10 overflow-hidden">
          <img :src="theme.bgImage" class="w-full h-full object-cover scale-110" style="filter: blur(3px)" />
          <div class="absolute inset-0" :style="{ backgroundColor: theme.bgOverlay }"></div>
        </div>
        <div class="absolute -top-20 left-1/4 w-72 h-72 rounded-full blur-[100px] pointer-events-none" :style="{ backgroundColor: theme.blobs[0] }"></div>
        <div class="absolute bottom-0 right-1/4 w-72 h-72 rounded-full blur-[100px] pointer-events-none" :style="{ backgroundColor: theme.blobs[1] }"></div>
        <!-- Header -->
        <div class="absolute top-0 left-0 right-0 flex justify-between items-center p-6">
          <p class="text-xs font-black uppercase tracking-widest text-slate-500">Timer de repos</p>
          <button @click="closeTimer" class="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white transition">
            <UIcon name="i-heroicons-x-mark" class="text-xl" />
          </button>
        </div>

        <!-- SVG Ring -->
        <div class="relative w-56 h-56 mb-10">
          <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1e293b" stroke-width="6" />
            <circle
              cx="50" cy="50" r="45" fill="none"
              :stroke="isFinished ? '#ef4444' : theme.accentSolid"
              stroke-width="6"
              stroke-linecap="round"
              :stroke-dasharray="283"
              :stroke-dashoffset="283 * (1 - progress)"
              class="transition-all duration-1000"
            />
          </svg>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-6xl font-[1000] tracking-tighter" :class="isFinished ? 'text-red-400' : 'text-white'">
              {{ formatTime(remaining) }}
            </span>
            <span v-if="isFinished" class="text-red-400 text-xs font-black uppercase tracking-widest mt-1 animate-pulse">Terminé !</span>
            <span v-else class="text-slate-600 text-xs font-black uppercase tracking-widest mt-1">{{ formatTime(duration) }} total</span>
          </div>
        </div>

        <!-- Presets -->
        <div class="flex gap-3 mb-10">
          <button
            v-for="p in presets"
            :key="p"
            @click="setPreset(p)"
            class="px-4 py-2 rounded-2xl text-sm font-black uppercase tracking-wider transition-all duration-200"
            :class="duration === p && !isRunning ? 'bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white shadow-lg shadow-[color:var(--accent-solid)]/20' : 'bg-white/[0.06] text-slate-400 hover:bg-white/[0.10] border border-white/[0.08]'"
          >
            {{ formatTime(p) }}
          </button>
        </div>

        <!-- Controls -->
        <div class="flex items-center gap-5">
          <button @click="reset" class="w-14 h-14 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition active:scale-95">
            <UIcon name="i-heroicons-arrow-path" class="text-2xl" />
          </button>
          <button
            @click="toggleTimer"
            class="w-20 h-20 rounded-full flex items-center justify-center font-black text-2xl shadow-2xl active:scale-95 transition-all duration-200"
            :class="isRunning ? 'bg-red-500 text-white shadow-red-500/30' : 'bg-gradient-to-br from-[var(--accent-from)] to-[var(--accent-to)] text-white shadow-[color:var(--accent-solid)]/20'"
          >
            <UIcon :name="isRunning ? 'i-heroicons-pause' : 'i-heroicons-play'" class="text-3xl" />
          </button>
          <button @click="addTime(30)" class="w-14 h-14 rounded-full bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-slate-400 hover:text-white transition active:scale-95">
            <span class="text-xs font-black">+30s</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const { theme } = useTheme()
function bgAlpha(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgba(${r},${g},${b},${alpha})`
}
const isOpen = ref(false)
const presets = [30, 60, 90, 120, 180]
const duration = ref(90)
const remaining = ref(90)
const isRunning = ref(false)
const isFinished = ref(false)
let interval = null

const progress = computed(() => {
  if (duration.value === 0) return 0
  return remaining.value / duration.value
})

function formatTime(s) {
  const m = Math.floor(s / 60)
  const sec = s % 60
  if (m > 0) return `${m}:${sec.toString().padStart(2, '0')}`
  return `${s}s`
}

function setPreset(s) {
  clearInterval(interval)
  isRunning.value = false
  isFinished.value = false
  duration.value = s
  remaining.value = s
}

function toggleTimer() {
  if (isFinished.value) { reset(); return }
  if (isRunning.value) {
    clearInterval(interval)
    isRunning.value = false
  } else {
    isRunning.value = true
    isFinished.value = false
    interval = setInterval(() => {
      if (remaining.value <= 0) {
        clearInterval(interval)
        isRunning.value = false
        isFinished.value = true
        if (navigator.vibrate) navigator.vibrate([200, 100, 200])
        return
      }
      remaining.value--
    }, 1000)
  }
}

function reset() {
  clearInterval(interval)
  isRunning.value = false
  isFinished.value = false
  remaining.value = duration.value
}

function addTime(s) {
  remaining.value = Math.min(remaining.value + s, 599)
  if (remaining.value > duration.value) duration.value = remaining.value
}

function closeTimer() {
  isOpen.value = false
}

onUnmounted(() => clearInterval(interval))
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(40px); }
</style>
