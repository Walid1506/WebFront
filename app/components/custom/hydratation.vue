<template>
  <div class="bg-white/[0.04] backdrop-blur-xl rounded-[28px] md:rounded-[40px] p-5 md:p-8 border border-white/[0.08] shadow-2xl">
    <!-- Header -->
    <div class="flex justify-between items-start mb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: 'var(--accent-solid)', boxShadow: '0 0 10px color-mix(in srgb, var(--accent-solid) 80%, transparent)' }"></div>
          <h2 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Hydratation</h2>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-5xl font-[1000] tracking-tighter text-white">{{ count }}</span>
          <span class="text-xl font-black italic text-[var(--accent-solid)]">/ 8</span>
        </div>
        <p class="text-slate-500 text-xs font-medium mt-1">{{ count >= 8 ? 'Objectif atteint ! 🎯' : `${8 - count} verre${8 - count > 1 ? 's' : ''} restant` }}</p>
      </div>
      <button @click="reset" class="p-3 rounded-2xl bg-white/[0.08] text-slate-500 hover:text-white transition active:scale-95">
        <UIcon name="i-heroicons-arrow-path" class="text-lg" />
      </button>
    </div>

    <!-- Glasses grid -->
    <div class="grid grid-cols-8 gap-2 mb-5">
      <button
        v-for="i in 8"
        :key="i"
        @click="toggle(i)"
        class="flex flex-col items-center gap-1 group"
      >
        <div
          class="w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-300 active:scale-90 border"
          :class="i <= count ? '' : 'bg-white/[0.06] border-white/[0.08]'"
          :style="i <= count ? { backgroundColor: 'color-mix(in srgb, var(--accent-solid) 20%, transparent)', borderColor: 'color-mix(in srgb, var(--accent-solid) 50%, transparent)' } : {}"
        >
          <UIcon
            name="i-heroicons-beaker"
            class="text-lg transition-all duration-300"
            :class="i <= count ? 'text-[var(--accent-solid)]' : 'text-slate-700'"
          />
        </div>
      </button>
    </div>

    <!-- Progress bar -->
    <div class="h-1.5 bg-white/[0.08] rounded-full overflow-hidden">
      <div
        class="h-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] rounded-full transition-all duration-500"
        :style="{ width: `${(count / 8) * 100}%` }"
      />
    </div>
  </div>
</template>

<script setup>
const { theme } = useTheme()

const storageKey = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return `fittrack_water_${today}`
})

const count = ref(0)

onMounted(() => {
  const saved = localStorage.getItem(storageKey.value)
  count.value = saved ? parseInt(saved) : 0
})

function playWaterSound() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    const ctx = new AudioCtx()
    const now = ctx.currentTime
    const dur = 0.58

    // White noise buffer
    const samples = Math.ceil(ctx.sampleRate * dur)
    const buf = ctx.createBuffer(1, samples, ctx.sampleRate)
    const d = buf.getChannelData(0)
    for (let i = 0; i < samples; i++) d[i] = Math.random() * 2 - 1

    const src = ctx.createBufferSource()
    src.buffer = buf

    // Bandpass sweeping up: simulates glass filling (air column shortens → pitch rises)
    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.setValueAtTime(380, now)
    bp.frequency.exponentialRampToValueAtTime(1350, now + dur)
    bp.Q.setValueAtTime(2.5, now)
    bp.Q.linearRampToValueAtTime(5, now + dur)

    // Smooth envelope: quick attack, sustain, fade out
    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.001, now)
    gain.gain.exponentialRampToValueAtTime(0.52, now + 0.05)
    gain.gain.setValueAtTime(0.52, now + dur * 0.6)
    gain.gain.exponentialRampToValueAtTime(0.001, now + dur)

    src.connect(bp)
    bp.connect(gain)
    gain.connect(ctx.destination)
    src.start(now)
    src.stop(now + dur)
  } catch {}
}

function toggle(i) {
  if (i === count.value) {
    count.value = i - 1
  } else {
    count.value = i
  }
  localStorage.setItem(storageKey.value, count.value)
  playWaterSound()
}

function reset() {
  count.value = 0
  localStorage.setItem(storageKey.value, 0)
}
</script>
