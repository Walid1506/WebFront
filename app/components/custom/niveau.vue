<template>
  <div class="space-y-4">

    <!-- Carte niveau principale -->
    <div class="relative rounded-[30px] overflow-hidden border border-white/[0.08] bg-white/[0.04] backdrop-blur-2xl p-6 shadow-2xl">
      <!-- Blobs dynamiques selon le niveau -->
      <div class="absolute -top-16 -right-16 w-56 h-56 rounded-full blur-[80px] pointer-events-none opacity-30"
        :class="`bg-gradient-to-br ${levelInfo.color}`"></div>
      <div class="absolute -bottom-10 -left-10 w-40 h-40 rounded-full blur-[60px] pointer-events-none opacity-20"
        :class="`bg-gradient-to-br ${levelInfo.color}`"></div>

      <div class="relative flex items-center gap-5">
        <!-- Badge niveau -->
        <div class="shrink-0 relative">
          <div class="w-20 h-20 rounded-[24px] flex items-center justify-center shadow-2xl"
            :class="`bg-gradient-to-br ${levelInfo.color}`">
            <span class="text-white font-[1000] text-3xl tracking-tighter">{{ levelInfo.level }}</span>
          </div>
          <div v-if="levelInfo.level < 10"
            class="absolute -bottom-2 -right-2 bg-[#060d1a] border border-white/10 rounded-full px-2 py-0.5">
            <span class="text-[9px] font-black text-slate-400 uppercase tracking-wider">{{ levelInfo.name }}</span>
          </div>
          <div v-else class="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full px-2 py-0.5">
            <span class="text-[9px] font-black text-black uppercase tracking-wider">{{ levelInfo.name }}</span>
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <p class="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Niveau</p>
          <p class="text-white font-[1000] text-2xl tracking-tighter">{{ levelInfo.name }}</p>
          <p class="text-slate-500 text-xs mt-1 font-bold">
            <span :class="`bg-gradient-to-r ${levelInfo.color} bg-clip-text text-transparent font-black`">{{ totalXP }} XP</span>
            <span v-if="levelInfo.level < 10"> · encore {{ levelInfo.xpToNext }} XP</span>
            <span v-else> · Niveau max !</span>
          </p>
        </div>
      </div>

      <!-- Barre de progression -->
      <div v-if="levelInfo.level < 10" class="relative mt-5">
        <div class="flex justify-between text-[10px] font-black text-slate-600 mb-1.5">
          <span>Niv. {{ levelInfo.level }}</span>
          <span>Niv. {{ levelInfo.level + 1 }}</span>
        </div>
        <div class="h-2.5 bg-white/[0.06] rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-1000 ease-out"
            :class="`bg-gradient-to-r ${levelInfo.color}`"
            :style="{ width: `${animatedProgress}%` }"></div>
        </div>
        <p class="text-center text-[10px] text-slate-600 font-black mt-1.5">{{ levelInfo.progress }}%</p>
      </div>

      <!-- Niveau max -->
      <div v-else class="mt-4 flex items-center justify-center gap-2 py-2 rounded-2xl bg-gradient-to-r from-yellow-500/10 to-amber-500/10 border border-yellow-500/20">
        <UIcon name="i-heroicons-trophy" class="text-yellow-400" />
        <span class="text-yellow-300 font-black text-sm">Niveau maximum atteint !</span>
      </div>
    </div>

    <!-- Détail XP -->
    <div class="bg-white/[0.04] backdrop-blur-2xl rounded-[28px] border border-white/[0.08] p-5">
      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Sources d'XP</p>
      <div class="space-y-3">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center shrink-0">
            <UIcon name="i-heroicons-calendar-days" class="text-violet-400" />
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-center mb-1">
              <p class="text-white font-black text-sm">Séances loggées</p>
              <span class="text-violet-400 font-black text-sm">+{{ breakdown.sessions }} XP</span>
            </div>
            <p class="text-slate-600 text-xs">{{ breakdown.sessions / 100 }} séance{{ breakdown.sessions / 100 > 1 ? 's' : '' }} × 100 XP</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <UIcon name="i-heroicons-bookmark" class="text-cyan-400" />
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-center mb-1">
              <p class="text-white font-black text-sm">Séances sauvegardées</p>
              <span class="text-cyan-400 font-black text-sm">+{{ breakdown.templates }} XP</span>
            </div>
            <p class="text-slate-600 text-xs">{{ breakdown.templates / 30 }} modèle{{ breakdown.templates / 30 > 1 ? 's' : '' }} × 30 XP</p>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0"
            :class="breakdown.streakDays > 0 ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-white/[0.04] border border-white/[0.06]'">
            <UIcon name="i-heroicons-fire" :class="breakdown.streakDays > 0 ? 'text-orange-400' : 'text-slate-700'" />
          </div>
          <div class="flex-1">
            <div class="flex justify-between items-center mb-1">
              <p class="text-white font-black text-sm">Streak actuel</p>
              <span :class="breakdown.streakDays > 0 ? 'text-orange-400' : 'text-slate-700'" class="font-black text-sm">+{{ breakdown.streak }} XP</span>
            </div>
            <p class="text-slate-600 text-xs">
              <span v-if="breakdown.streakDays > 0">{{ breakdown.streakDays }} jour{{ breakdown.streakDays > 1 ? 's' : '' }} consécutif{{ breakdown.streakDays > 1 ? 's' : '' }} × 25 XP</span>
              <span v-else>Aucun streak — entraîne-toi aujourd'hui !</span>
            </p>
          </div>
        </div>
      </div>

      <div class="mt-4 pt-4 border-t border-white/[0.06] flex justify-between items-center">
        <p class="text-slate-500 font-black text-sm uppercase tracking-wider">Total</p>
        <p class="font-[1000] text-xl tracking-tighter"
          :class="`bg-gradient-to-r ${levelInfo.color} bg-clip-text text-transparent`">
          {{ totalXP }} XP
        </p>
      </div>
    </div>

    <!-- Prochains paliers -->
    <div class="bg-white/[0.04] backdrop-blur-2xl rounded-[28px] border border-white/[0.08] p-5">
      <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Paliers</p>
      <div class="space-y-2">
        <div v-for="(lvl, i) in levelsList" :key="i"
          class="flex items-center gap-3 rounded-2xl p-3 transition-all"
          :class="lvl.current ? 'bg-white/[0.06] border border-white/[0.10]' : 'opacity-40'">
          <div class="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-black text-sm"
            :class="`bg-gradient-to-br ${lvl.color}`">
            <span :class="lvl.current ? 'text-white' : 'text-white/60'">{{ lvl.level }}</span>
          </div>
          <div class="flex-1">
            <p class="font-black text-sm" :class="lvl.current ? 'text-white' : 'text-slate-600'">{{ lvl.name }}</p>
          </div>
          <span class="text-xs font-black" :class="lvl.current ? 'text-slate-400' : 'text-slate-700'">{{ lvl.threshold }} XP</span>
          <UIcon v-if="lvl.current" name="i-heroicons-chevron-right" class="text-slate-600 text-sm" />
          <UIcon v-else-if="lvl.done" name="i-heroicons-check" class="text-emerald-500 text-sm" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
const { totalXP, levelInfo, breakdown, loading, fetchXP } = useXP()

const animatedProgress = ref(0)

onMounted(async () => {
  await fetchXP()
  setTimeout(() => { animatedProgress.value = levelInfo.value.progress }, 100)
})

watch(() => levelInfo.value.progress, (v) => { animatedProgress.value = v })

const THRESHOLDS = [0, 300, 700, 1300, 2100, 3200, 4600, 6300, 8500, 11000, 14500]
const NAMES = ['', 'Débutant', 'Apprenti', 'Régulier', 'Confirmé', 'Athlète', 'Expert', 'Élite', 'Maître', 'Champion', 'Légende']
const COLORS = [
  '', 'from-slate-400 to-slate-500', 'from-slate-300 to-slate-400',
  'from-emerald-400 to-green-500', 'from-emerald-400 to-teal-500',
  'from-cyan-400 to-blue-500', 'from-blue-400 to-indigo-500',
  'from-violet-400 to-purple-600', 'from-purple-400 to-pink-500',
  'from-yellow-400 to-orange-500', 'from-yellow-300 to-amber-500',
]

const levelsList = computed(() =>
  THRESHOLDS.slice(0, 10).map((t, i) => ({
    level: i + 1,
    name: NAMES[i + 1],
    threshold: t,
    color: COLORS[i + 1],
    current: levelInfo.value.level === i + 1,
    done: totalXP.value >= t && levelInfo.value.level > i + 1,
  }))
)
</script>
