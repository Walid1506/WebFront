<template>
  <Teleport to="body">
    <div
      class="fixed inset-0 z-[700] flex items-center justify-center px-5"
      :class="{ closing }"
      role="dialog"
      aria-modal="true"
      :aria-label="word"
      @touchmove.prevent
      @keydown.esc="close"
    >
      <div class="backdrop absolute inset-0 bg-black/75 backdrop-blur-md" @click="close" />

      <div class="relative w-full max-w-[360px] sm:max-w-[520px] flex flex-col sm:flex-row-reverse sm:items-end">
        <!-- La carte est la bulle du chat : c'est lui qui « dit » le mot -->
        <div class="bubble relative flex-1 rounded-[32px] border border-white/[0.12] px-6 pt-7 pb-6 text-center shadow-2xl" :style="{ backgroundColor: bubbleBg }">
          <p
            class="word font-[1000] tracking-tighter leading-none pb-1 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] bg-clip-text text-transparent"
            :class="word.length > 13 ? 'text-[32px]' : 'text-[42px]'"
          >
            {{ word }}
          </p>
          <p class="text-white font-black text-base mt-3 break-words">{{ sessionName }} validée 💪</p>
          <p class="text-slate-400 text-sm font-bold mt-1">{{ dateLabel }} · ajoutée au calendrier</p>
          <button
            ref="thanksButton"
            type="button"
            class="mt-6 w-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black text-lg py-3.5 rounded-2xl shadow-[0_10px_30px_color-mix(in_srgb,var(--accent-solid)_40%,transparent)] active:scale-95 transition-transform"
            @click="close"
          >
            Merci
          </button>
          <!-- Pointe de la bulle, tournée vers le chat -->
          <span class="bubble-tail absolute w-6 h-6 rotate-45 border-white/[0.12]" :style="{ backgroundColor: bubbleBg }" />
        </div>

        <Mascotte class="cat-slot w-[128px] h-auto shrink-0 ml-7 -mt-1 sm:ml-0 sm:mt-0 sm:mr-1 sm:mb-[-6px]" />
      </div>

      <canvas ref="canvas" class="fixed inset-0 pointer-events-none" aria-hidden="true" />
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  sessionName: { type: String, default: 'Séance' },
  dateLabel: { type: String, default: '' }
})

const emit = defineEmits(['close'])

const { theme } = useTheme()

// Jamais deux fois de suite le même mot
const WORDS = [
  'Bravo !', 'Bien joué !', 'Chapeau !', 'Félicitations !', 'Génial !', 'Trop fort !', 'Impressionnant !',
  'Excellent !', 'Magnifique !', 'Superbe !', 'Champion !', 'Respect !', 'Incroyable !', 'Parfait !',
  'Tu gères !', 'Au top !', 'Énorme !', 'Formidable !', 'Épatant !', 'Tu déchires !', 'Fantastique !',
  'Quelle perf !', 'Masterclass !', 'Sensationnel !'
]
const LAST_WORD_KEY = 'fittrack-last-bravo'

function pickWord() {
  let last = ''
  try { last = localStorage.getItem(LAST_WORD_KEY) || '' } catch {}
  const choices = WORDS.filter(w => w !== last)
  const next = choices[Math.floor(Math.random() * choices.length)]
  try { localStorage.setItem(LAST_WORD_KEY, next) } catch {}
  return next
}

const word = pickWord()

// Fond opaque un peu plus clair que le thème : la pointe de la bulle se fond dans la carte
const bubbleBg = computed(() => {
  const hex = theme.value.bg
  const mix = c => Math.round(parseInt(hex.slice(c, c + 2), 16) * 0.9 + 255 * 0.1)
  return `rgb(${mix(1)},${mix(3)},${mix(5)})`
})

const canvas = ref(null)
const thanksButton = ref(null)
const closing = ref(false)
let stopConfetti = () => {}

onMounted(() => {
  thanksButton.value?.focus({ preventScroll: true })
  const t = theme.value
  stopConfetti = launchConfetti(canvas.value, [t.accentFrom, t.accentTo, '#FFD166', '#FF6B9A', '#FFFFFF', '#8B7CFF', '#FF9F45'])
})

onBeforeUnmount(() => stopConfetti())

function close() {
  if (closing.value) return
  closing.value = true
  setTimeout(() => emit('close'), 220)
}
</script>

<style scoped>
.backdrop { animation: fade-in 0.25s ease both; }
.bubble { animation: bubble-pop 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) both; }
.word { animation: word-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.25s both; }

/* Pointe en bas à gauche (téléphone), à gauche en bas sur grand écran : toujours vers le chat.
   Sous le contenu de la carte (z-index -1 dans la carte isolée) : la lueur du bouton la teinte comme le reste */
.bubble { isolation: isolate; }
.bubble-tail { z-index: -1; left: 72px; bottom: -12.5px; border-right-width: 1px; border-bottom-width: 1px; }
@media (min-width: 640px) {
  .bubble-tail { left: -12.5px; bottom: 44px; border-right-width: 0; border-left-width: 1px; }
}

.closing .backdrop, .closing .cat-slot { animation: fade-out 0.2s ease forwards; }
.closing .bubble { animation: bubble-out 0.2s ease forwards; }

@keyframes fade-in {
  from { opacity: 0; }
}
@keyframes fade-out {
  to { opacity: 0; }
}
@keyframes bubble-out {
  to { opacity: 0; transform: scale(0.92); }
}
@keyframes bubble-pop {
  from { opacity: 0; transform: scale(0.6) translateY(20px); }
}
@keyframes word-pop {
  from { opacity: 0; transform: scale(0.4) rotate(-6deg); }
}

@media (prefers-reduced-motion: reduce) {
  .backdrop, .bubble, .word { animation: none; }
}
</style>
