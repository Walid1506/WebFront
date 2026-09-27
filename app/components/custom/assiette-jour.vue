<template>
  <div>
    <template v-if="meals.length">
      <div class="grid grid-cols-4 gap-2 text-center pb-3">
        <div>
          <p class="text-white font-black text-lg leading-none">{{ totals.kcal }}</p>
          <p class="text-[10px] text-slate-500 font-black uppercase mt-1">kcal</p>
        </div>
        <div>
          <p class="text-blue-400 font-black text-lg leading-none">{{ totals.prot }}g</p>
          <p class="text-[10px] text-slate-500 font-black uppercase mt-1">Prot</p>
        </div>
        <div>
          <p class="text-orange-400 font-black text-lg leading-none">{{ totals.carbs }}g</p>
          <p class="text-[10px] text-slate-500 font-black uppercase mt-1">Gluc</p>
        </div>
        <div>
          <p class="text-[#9DFF00] font-black text-lg leading-none">{{ totals.fats }}g</p>
          <p class="text-[10px] text-slate-500 font-black uppercase mt-1">Lip</p>
        </div>
      </div>

      <!-- Rangé par repas ; chaque repas se déplie d'un appui pour voir les aliments -->
      <div v-for="group in groups" :key="group.key" class="border-t border-white/[0.06]">
        <button
          type="button"
          class="w-full flex items-center gap-2 py-2.5 text-left"
          :disabled="!group.entries.length"
          :aria-expanded="openGroups.has(group.key)"
          @click="toggleGroup(group.key)"
        >
          <UIcon :name="group.icon" class="text-base shrink-0" :style="{ color: group.color }" />
          <span class="text-white font-black text-sm">{{ group.label }}</span>
          <span class="ml-auto text-xs font-black" :class="group.entries.length ? 'text-slate-300' : 'text-slate-600'">
            {{ group.entries.length ? `${group.kcal} kcal` : 'Rien' }}
          </span>
          <UIcon
            v-if="group.entries.length"
            name="i-heroicons-chevron-down"
            class="text-slate-500 text-sm shrink-0 transition-transform duration-200"
            :class="openGroups.has(group.key) ? 'rotate-180' : ''"
          />
        </button>
        <div v-if="openGroups.has(group.key)" class="pb-2.5 space-y-2">
          <div v-for="{ item: meal, index } in group.entries" :key="index" class="flex items-center gap-3">
            <img :src="meal.img" class="w-10 h-10 rounded-xl object-cover bg-white shrink-0" loading="lazy" decoding="async" width="40" height="40" @error="onMealImageError" />
            <p class="flex-1 min-w-0 text-white font-bold text-sm truncate">{{ meal.name }}</p>
            <p class="text-xs font-black text-slate-400 shrink-0">{{ meal.amount }} g · {{ meal.kcal }} kcal</p>
          </div>
        </div>
      </div>

      <p v-if="water > 0" class="text-xs font-black text-sky-400 pt-3 border-t border-white/[0.06]">
        Eau : {{ water }} L
      </p>
    </template>
    <p v-else class="text-slate-600 text-sm font-black text-center py-2">{{ emptyText }}</p>
  </div>
</template>

<script setup>
const props = defineProps({
  meals: { type: Array, default: () => [] },
  water: { type: Number, default: 0 },
  emptyText: { type: String, default: "Rien d'enregistré aujourd'hui" }
})

// Repas et totaux : app/utils/meals.ts
const groups = computed(() => groupByMeal(props.meals))
const totals = computed(() => sumMeals(props.meals))

const openGroups = ref(new Set())
function toggleGroup(key) {
  const next = new Set(openGroups.value)
  if (next.has(key)) next.delete(key)
  else next.add(key)
  openGroups.value = next
}

function onMealImageError(e) {
  if (e.target.dataset.fallback) return
  e.target.dataset.fallback = '1'
  e.target.src = 'https://placehold.co/600x600/1e293b/94a3b8?text=Aliment'
}
</script>
