<template>
  <div class="bg-slate-900/50 backdrop-blur-xl rounded-[28px] md:rounded-[40px] p-5 md:p-8 border border-white/5 shadow-2xl">
    <!-- Header -->
    <div class="flex justify-between items-start mb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <div class="w-2 h-2 bg-blue-400 rounded-full shadow-[0_0_10px_rgba(96,165,250,0.8)]"></div>
          <h2 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Hydratation</h2>
        </div>
        <div class="flex items-baseline gap-2">
          <span class="text-5xl font-[1000] tracking-tighter text-white">{{ count }}</span>
          <span class="text-xl font-black text-blue-400 italic">/ 8</span>
        </div>
        <p class="text-slate-500 text-xs font-medium mt-1">{{ count >= 8 ? 'Objectif atteint ! 🎯' : `${8 - count} verre${8 - count > 1 ? 's' : ''} restant` }}</p>
      </div>
      <button @click="reset" class="p-3 rounded-2xl bg-slate-800 text-slate-500 hover:text-white transition active:scale-95">
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
          class="w-full aspect-square rounded-xl flex items-center justify-center transition-all duration-300 active:scale-90"
          :class="i <= count ? 'bg-blue-500/20 border border-blue-500/50' : 'bg-slate-800 border border-white/5'"
        >
          <UIcon
            name="i-heroicons-beaker"
            class="text-lg transition-all duration-300"
            :class="i <= count ? 'text-blue-400' : 'text-slate-700'"
          />
        </div>
      </button>
    </div>

    <!-- Progress bar -->
    <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
      <div
        class="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
        :style="{ width: `${(count / 8) * 100}%` }"
      />
    </div>
  </div>
</template>

<script setup>
const storageKey = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return `fittrack_water_${today}`
})

const count = ref(0)

onMounted(() => {
  const saved = localStorage.getItem(storageKey.value)
  count.value = saved ? parseInt(saved) : 0
})

function toggle(i) {
  if (i === count.value) {
    count.value = i - 1
  } else {
    count.value = i
  }
  localStorage.setItem(storageKey.value, count.value)
}

function reset() {
  count.value = 0
  localStorage.setItem(storageKey.value, 0)
}
</script>
