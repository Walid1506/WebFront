<template>
  <div>
    <div v-if="sessions.length" class="space-y-2">
      <!-- Chaque séance se déplie d'un appui pour voir ses exercices -->
      <div v-for="s in sessions" :key="s.id" class="rounded-2xl bg-white/[0.03] border border-white/[0.06] overflow-hidden">
        <button
          type="button"
          class="w-full flex items-center gap-3 px-3.5 py-3 text-left"
          :aria-expanded="openIds.has(s.id)"
          @click="toggle(s.id)"
        >
          <span class="w-2.5 h-2.5 rounded-full shrink-0" :style="{ backgroundColor: s.data?.color || 'var(--accent-solid)' }" />
          <span class="flex-1 min-w-0">
            <span class="block text-white font-black text-sm truncate">{{ s.data?.title || 'Séance' }}</span>
            <span class="block text-slate-500 text-xs mt-0.5">{{ formatDate(s.date) }} · {{ summary(s) }}</span>
          </span>
          <UIcon
            name="i-heroicons-chevron-down"
            class="text-slate-500 text-base shrink-0 transition-transform duration-200"
            :class="openIds.has(s.id) ? 'rotate-180' : ''"
          />
        </button>

        <div v-if="openIds.has(s.id)" class="px-3.5 pb-2 border-t border-white/[0.05]">
          <div v-if="s.data?.exercises?.length">
            <div
              v-for="(ex, ei) in s.data.exercises"
              :key="ei"
              class="flex items-center gap-2 py-2.5 border-b border-white/[0.04] last:border-0"
            >
              <span class="text-[10px] font-black text-slate-600 w-5 shrink-0">{{ ei + 1 }}</span>
              <p class="text-white font-bold text-sm flex-1 truncate">{{ ex.name }}</p>
              <div class="flex items-center gap-1 shrink-0 flex-wrap justify-end">
                <span v-if="ex.sets && ex.reps" class="text-xs font-black text-slate-400">{{ ex.sets }}×{{ ex.reps }}</span>
                <span v-else-if="ex.sets" class="text-xs font-black text-slate-400">{{ ex.sets }} séries</span>
                <span
                  v-if="ex.weight"
                  class="text-xs font-black px-2 py-0.5 rounded-full"
                  style="background: color-mix(in srgb, var(--accent-solid) 15%, transparent); border: 1px solid color-mix(in srgb, var(--accent-solid) 25%, transparent); color: var(--accent-solid)"
                >
                  {{ ex.weight }} kg
                </span>
              </div>
            </div>
          </div>
          <p v-else-if="s.data?.notes" class="text-slate-400 text-xs py-2.5 leading-relaxed whitespace-pre-wrap">{{ s.data.notes }}</p>
          <p v-else class="text-slate-600 text-xs font-black text-center py-2.5">Aucun exercice enregistré</p>
        </div>
      </div>
    </div>
    <p v-else class="text-slate-600 text-sm font-black text-center py-2">{{ emptyText }}</p>
  </div>
</template>

<script setup>
defineProps({
  sessions: { type: Array, default: () => [] },
  emptyText: { type: String, default: 'Aucune séance récente' }
})

const openIds = ref(new Set())
function toggle(id) {
  const next = new Set(openIds.value)
  if (next.has(id)) next.delete(id)
  else next.add(id)
  openIds.value = next
}

function summary(s) {
  const n = s.data?.exercises?.length || 0
  if (n) return `${n} exercice${n > 1 ? 's' : ''}`
  return s.data?.notes ? 'Notes' : 'Séance'
}

function formatDate(d) {
  const label = new Date(`${d}T12:00:00`).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' })
  return label.charAt(0).toUpperCase() + label.slice(1)
}
</script>
