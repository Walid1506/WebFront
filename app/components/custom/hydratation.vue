<template>
  <div class="bg-white/[0.04] backdrop-blur-xl rounded-[28px] p-5 border border-white/[0.08] shadow-2xl">
    <!-- Header -->
    <div class="flex justify-between items-start mb-5">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: 'var(--accent-solid)', boxShadow: '0 0 10px color-mix(in srgb, var(--accent-solid) 80%, transparent)' }"></div>
          <h2 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Hydratation</h2>
        </div>
        <p class="text-slate-500 text-xs font-medium mt-0.5">
          {{ count >= 8 ? 'Objectif atteint ! 🎯' : `${8 - count} verre${8 - count > 1 ? 's' : ''} restant` }}
        </p>
      </div>
      <button @click="reset" class="p-3 rounded-2xl bg-white/[0.08] text-slate-500 hover:text-white transition active:scale-95">
        <UIcon name="i-heroicons-arrow-path" class="text-lg" />
      </button>
    </div>

    <!-- Ring gauge — slide gauche/droite pour remplir -->
    <div
      ref="gaugeEl"
      class="relative flex justify-center items-center py-4 select-none touch-none"
      style="cursor: ew-resize"
      @touchstart.prevent="dragStart"
      @touchmove.prevent="dragMove"
      @touchend="dragEnd"
      @mousedown.prevent="dragStart"
    >
      <svg width="200" height="200" viewBox="0 0 200 200" style="overflow: visible">
        <!-- Track -->
        <circle
          cx="100" cy="100" r="80"
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          stroke-width="16"
          stroke-linecap="round"
          :stroke-dasharray="`${TRACK} ${CIRCUM}`"
          transform="rotate(135 100 100)"
        />
        <!-- Progress -->
        <circle
          cx="100" cy="100" r="80"
          fill="none"
          stroke-width="16"
          stroke-linecap="round"
          :stroke-dasharray="`${progress} ${CIRCUM}`"
          transform="rotate(135 100 100)"
          :style="{ stroke: 'var(--accent-solid)', transition: dragging ? 'none' : 'stroke-dasharray 0.4s cubic-bezier(0.34,1.56,0.64,1)' }"
        />
      </svg>

      <!-- Centre -->
      <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span class="text-6xl font-[1000] tracking-tighter text-white leading-none">{{ count }}</span>
        <span class="text-sm font-black mt-1" style="color: var(--accent-solid)">/ 8</span>
        <span class="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1">verres</span>
      </div>

      <!-- Hint -->
      <div v-if="count === 0" class="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none">
        <div class="flex items-center gap-1.5 opacity-25">
          <UIcon name="i-heroicons-arrows-right-left" class="text-xs text-white" />
          <span class="text-[10px] font-black text-white uppercase tracking-wider">Glisse</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const storageKey = computed(() => `fittrack_water_${new Date().toISOString().slice(0, 10)}`)

const count = ref(0)
const dragging = ref(false)
const gaugeEl = ref(null)

const CIRCUM = 2 * Math.PI * 80
const TRACK = CIRCUM * 0.75

const progress = computed(() => TRACK * (count.value / 8))

let dragStartX = 0
let dragStartCount = 0

onMounted(() => {
  count.value = parseInt(localStorage.getItem(storageKey.value) || '0')
  window.addEventListener('mousemove', onMouseMove)
  window.addEventListener('mouseup', dragEnd)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMouseMove)
  window.removeEventListener('mouseup', dragEnd)
})

function dragStart(e) {
  dragging.value = true
  dragStartX = e.touches ? e.touches[0].clientX : e.clientX
  dragStartCount = count.value
}

function dragMove(e) {
  if (!dragging.value) return
  update(e.touches ? e.touches[0].clientX : e.clientX)
}

function onMouseMove(e) {
  if (!dragging.value) return
  update(e.clientX)
}

function dragEnd() {
  if (!dragging.value) return
  dragging.value = false
  localStorage.setItem(storageKey.value, count.value)
}

function update(clientX) {
  const delta = clientX - dragStartX
  const steps = Math.round(delta / 26)
  const newCount = Math.max(0, Math.min(8, dragStartCount + steps))
  if (newCount !== count.value) {
    if (newCount > count.value) playWaterSound()
    count.value = newCount
  }
}

function playWaterSound() {
  try {
    const audio = new Audio('/eau-coule.mp3')
    audio.volume = 1
    audio.play()
  } catch {}
}

function reset() {
  count.value = 0
  localStorage.setItem(storageKey.value, 0)
}
</script>
