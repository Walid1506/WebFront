<template>
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
    <div class="w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden relative flex flex-col h-[90vh]">
      <Transition name="slide" mode="out-in">
        
        <div v-if="currentStep === 'main'" class="flex flex-col h-full w-full p-6">
          <div class="flex justify-between items-start mb-6">
            <div class="flex-1 mr-4">
              <div class="border-b border-white/10 pb-3">
                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">
                  Nom de ton entraînement
                </label>

                <input
                  v-model="sessionData.title"
                  type="text"
                  placeholder="Ex: Push lourd, Jambes, Cardio..."
                  class="w-full bg-transparent text-2xl font-[1000] tracking-tighter text-white outline-none placeholder-slate-700 focus:text-green-500 transition-colors"
                />

                <p class="text-slate-500 font-bold text-xs mt-1 capitalize">
                  {{ formattedDate }}
                </p>
              </div>

              <div class="grid grid-cols-2 gap-3 mt-4">
                <div>
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    Catégorie
                  </label>
                  <select
                    v-model="sessionData.category"
                    class="w-full bg-slate-900 border border-white/10 text-white py-3 px-4 rounded-2xl outline-none focus:border-green-500"
                  >
                    <option value="">Choisir</option>
                    <option value="haut">Haut</option>
                    <option value="bas">Bas</option>
                    <option value="push">Push</option>
                    <option value="pull">Pull</option>
                    <option value="jambes">Jambes</option>
                    <option value="full-body">Full body</option>
                    <option value="cardio">Cardio</option>
                    <option value="mobilite">Mobilité</option>
                    <option value="repos">Repos</option>
                  </select>
                </div>

                <div>
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                    Nombre d'exercices
                  </label>
                  <div class="h-[50px] rounded-2xl border border-white/10 bg-slate-900 px-4 flex items-center text-white font-black">
                    {{ sessionData.exercises.length }}
                  </div>
                </div>
              </div>

              <div class="mt-4">
                <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">
                  Notes
                </label>
                <textarea
                  v-model="sessionData.notes"
                  rows="3"
                  placeholder="Notes, ressenti, objectif..."
                  class="w-full bg-slate-900 border border-white/10 text-white py-3 px-4 rounded-2xl outline-none focus:border-green-500 resize-none"
                />
              </div>
            </div>

            <button
              @click="$emit('close')"
              class="p-3 bg-slate-900 rounded-2xl hover:bg-slate-800 transition-colors shrink-0"
            >
              <UIcon name="i-heroicons-x-mark" class="text-white text-xl" />
            </button>
          </div>

          <div class="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-2">
            <div v-if="sessionData.exercises.length === 0" class="text-center py-10 opacity-30">
              <UIcon name="i-heroicons-fire" class="text-6xl mb-2" />
              <p class="text-sm font-black uppercase">Ajoute ton premier exercice</p>
            </div>

            <div
              v-for="(exo, index) in sessionData.exercises"
              :key="`${exo.name}-${index}`"
              class="bg-slate-900/50 p-4 rounded-3xl border border-white/5 relative"
            >
              <div class="absolute top-4 right-4 flex gap-2">
                <button
                  @click="editExercise(exo, index)"
                  class="p-2 text-blue-400 bg-blue-400/10 rounded-lg hover:bg-blue-400 hover:text-white transition"
                >
                  <UIcon name="i-heroicons-pencil-square-solid" />
                </button>

                <button
                  @click="removeExercise(index)"
                  class="p-2 text-red-400 bg-red-400/10 rounded-lg hover:bg-red-400 hover:text-white transition"
                >
                  <UIcon name="i-heroicons-trash-solid" />
                </button>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-20 h-20 rounded-2xl overflow-hidden bg-white border border-white/10 shrink-0 flex items-center justify-center">
                  <template v-if="isVideo(exo.mediaType, exo.mediaUrl)">
                    <video
                      :src="exo.mediaUrl"
                      class="w-full h-full object-cover"
                      autoplay
                      muted
                      loop
                      playsinline
                      preload="metadata"
                    />
                  </template>

                  <template v-else-if="exo.mediaUrl">
                    <img
                      :src="exo.mediaUrl"
                      :alt="exo.name"
                      class="w-full h-full object-cover"
                      loading="lazy"
                      referrerpolicy="no-referrer"
                      @error="onImageError"
                    />
                  </template>

                  <template v-else>
                    <div class="w-full h-full flex items-center justify-center text-slate-500 font-black text-2xl bg-slate-800">
                      {{ exo.name?.charAt(0) || '?' }}
                    </div>
                  </template>
                </div>

                <div class="min-w-0 flex-1 pr-20">
                  <h4 class="text-white font-bold text-lg leading-tight">
                    {{ exo.name }}
                  </h4>

                  <p class="text-[11px] font-black uppercase text-slate-500 mt-1">
                    {{ exo.category }} <span v-if="exo.equipment">• {{ exo.equipment }}</span>
                  </p>

                  <p v-if="exo.description" class="text-sm text-slate-300 mt-2 leading-snug line-clamp-2">
                    {{ exo.description }}
                  </p>

                  <div class="flex flex-wrap items-center gap-2 mt-3">
                    <span class="bg-green-500/10 text-green-500 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">
                      {{ exo.sets }} sets
                    </span>
                    <span class="bg-blue-500/10 text-blue-500 text-[10px] px-2 py-0.5 rounded-full font-black uppercase">
                      {{ exo.reps }} reps
                    </span>
                    <span
                      v-if="exo.weight !== null && exo.weight !== undefined && exo.weight !== ''"
                      class="bg-orange-500/10 text-orange-500 text-[10px] px-2 py-0.5 rounded-full font-black uppercase"
                    >
                      {{ exo.weight }} kg
                    </span>
                    <span
                      v-if="exo.rest"
                      class="bg-purple-500/10 text-purple-400 text-[10px] px-2 py-0.5 rounded-full font-black uppercase"
                    >
                      {{ exo.rest }} sec
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-4 space-y-3 pt-4 border-t border-white/10">
            <button
              @click="openLibrary"
              class="w-full bg-white text-black font-black text-sm py-4 rounded-2xl hover:bg-slate-200 transition-all flex items-center justify-center gap-2 shadow-xl"
            >
              <UIcon name="i-heroicons-plus-circle" class="text-xl" />
              Ajouter un exercice
            </button>

            <button
              @click="saveSession"
              class="w-full bg-green-500 text-black font-black text-lg py-4 rounded-2xl shadow-[0_10px_30px_rgba(34,197,94,0.4)] hover:scale-[1.02] active:scale-95 transition-all"
            >
              Terminer la séance
            </button>
          </div>
        </div>

        <div v-else-if="currentStep === 'library'" class="flex flex-col h-full w-full bg-[#050505]">
          <div class="p-4 sm:p-5 flex items-center gap-3 border-b border-white/5">
            <button
              @click="currentStep = 'main'"
              class="p-2 text-slate-400 hover:text-white transition"
            >
              <UIcon name="i-heroicons-arrow-left" class="text-xl" />
            </button>

            <div class="relative flex-1">
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
              />
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Rechercher un exercice"
                class="w-full h-12 rounded-2xl bg-slate-900 border border-white/5 pl-11 pr-4 text-white outline-none focus:border-green-500"
              />
            </div>
          </div>

          <div class="p-4 border-b border-white/5 bg-black/30">
            <div class="flex flex-wrap gap-2">
              <button
                v-for="cat in categories"
                :key="cat"
                @click="activeCategory = cat"
                class="px-4 py-2 rounded-full font-black text-[11px] uppercase transition-all"
                :class="activeCategory === cat
                  ? 'bg-green-500 text-black'
                  : 'bg-slate-900 text-slate-300 border border-white/5'"
              >
                {{ cat }}
              </button>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <div
              v-for="exo in filteredLibrary"
              :key="exo.id"
              @click="openConfig(exo)"
              class="rounded-[28px] bg-[#0b0b0b] border border-white/5 p-4 flex items-center gap-4 hover:border-green-500/30 hover:bg-green-500/5 transition-all cursor-pointer"
            >
              <div class="w-24 h-24 rounded-2xl overflow-hidden bg-white shrink-0 flex items-center justify-center">
                <template v-if="isVideo(exo.mediaType, exo.mediaUrl)">
                  <video
                    :src="exo.mediaUrl"
                    class="w-full h-full object-cover"
                    autoplay
                    muted
                    loop
                    playsinline
                    preload="metadata"
                  />
                </template>

                <template v-else>
                  <img
                    :src="exo.mediaUrl"
                    :alt="exo.name"
                    class="w-full h-full object-cover"
                    loading="lazy"
                    referrerpolicy="no-referrer"
                    @error="onImageError"
                  />
                </template>
              </div>

              <div class="min-w-0 flex-1">
                <h4 class="text-white font-[1000] text-xl leading-tight">
                  {{ exo.name }}
                </h4>

                <p class="text-slate-400 text-base mt-1 font-semibold">
                  {{ exo.equipment }}
                </p>

                <p class="text-slate-300/90 text-sm leading-snug mt-2 line-clamp-3">
                  {{ exo.description }}
                </p>
              </div>

              <div class="shrink-0">
                <button
                  class="w-10 h-10 rounded-full bg-slate-900 border border-white/5 flex items-center justify-center text-slate-400"
                >
                  <UIcon name="i-heroicons-plus" class="text-xl" />
                </button>
              </div>
            </div>

            <div v-if="filteredLibrary.length === 0" class="py-16 text-center text-slate-500">
              Aucun exercice trouvé
            </div>
          </div>
        </div>

        <div v-else-if="currentStep === 'config'" class="flex flex-col h-full w-full p-6 sm:p-8">
          <div class="flex items-center gap-3 mb-6">
            <button
              @click="currentStep = 'library'"
              class="p-2 text-slate-400 hover:text-white transition"
            >
              <UIcon name="i-heroicons-arrow-left" class="text-xl" />
            </button>
            <div>
              <h3 class="text-2xl font-black text-white">
                {{ activeExo?.name }}
              </h3>
              <p class="text-slate-500 text-xs font-black uppercase mt-1">
                {{ activeExo?.category }} <span v-if="activeExo?.equipment">• {{ activeExo?.equipment }}</span>
              </p>
            </div>
          </div>

          <div class="overflow-y-auto pr-2 custom-scrollbar space-y-4 flex-1">
            <div v-if="activeExo?.mediaUrl" class="rounded-3xl overflow-hidden border border-white/5 bg-white flex items-center justify-center">
              <template v-if="isVideo(activeExo.mediaType, activeExo.mediaUrl)">
                <video
                  :src="activeExo.mediaUrl"
                  class="w-full h-56 object-cover"
                  autoplay
                  muted
                  loop
                  playsinline
                  preload="metadata"
                />
              </template>

              <template v-else>
                <img
                  :src="activeExo.mediaUrl"
                  :alt="activeExo.name"
                  class="w-full h-56 object-cover"
                  loading="lazy"
                  referrerpolicy="no-referrer"
                  @error="onImageError"
                />
              </template>
            </div>

            <div class="bg-slate-900 p-4 rounded-3xl border border-white/5">
              <p class="text-slate-300 text-sm leading-relaxed">
                {{ activeExo?.description }}
              </p>
            </div>

            <div class="flex items-center justify-between bg-slate-900 p-4 rounded-3xl border border-white/5">
              <span class="font-black uppercase text-xs text-slate-500">Séries</span>
              <div class="flex items-center gap-4">
                <button @click="decrease('sets')" class="w-10 h-10 bg-slate-800 rounded-full font-bold text-white">-</button>
                <input v-model.number="activeConfig.sets" type="number" min="1" class="w-12 bg-transparent text-center font-black text-xl outline-none text-white" />
                <button @click="increase('sets')" class="w-10 h-10 bg-slate-800 rounded-full font-bold text-white">+</button>
              </div>
            </div>

            <div class="flex items-center justify-between bg-slate-900 p-4 rounded-3xl border border-white/5">
              <span class="font-black uppercase text-xs text-slate-500">Répétitions</span>
              <div class="flex items-center gap-4">
                <button @click="decrease('reps')" class="w-10 h-10 bg-slate-800 rounded-full font-bold text-white">-</button>
                <input v-model.number="activeConfig.reps" type="number" min="1" class="w-12 bg-transparent text-center font-black text-xl outline-none text-white" />
                <button @click="increase('reps')" class="w-10 h-10 bg-slate-800 rounded-full font-bold text-white">+</button>
              </div>
            </div>

            <div class="flex items-center justify-between bg-slate-900 p-4 rounded-3xl border border-white/5">
              <span class="font-black uppercase text-xs text-slate-500">Repos (sec)</span>
              <div class="flex items-center gap-4">
                <button @click="decrease('rest', 0)" class="w-10 h-10 bg-slate-800 rounded-full font-bold text-white">-</button>
                <input v-model.number="activeConfig.rest" type="number" min="0" class="w-16 bg-transparent text-center font-black text-xl outline-none text-white" />
                <button @click="increase('rest')" class="w-10 h-10 bg-slate-800 rounded-full font-bold text-white">+</button>
              </div>
            </div>

            <div class="bg-slate-900 p-6 rounded-3xl border border-white/5 text-center">
              <label class="font-black uppercase text-[10px] text-slate-500 block mb-2">
                Charge (optionnel - kg)
              </label>
              <input
                v-model.number="activeConfig.weight"
                type="number"
                min="0"
                step="0.5"
                class="bg-transparent text-center font-[1000] text-5xl w-full outline-none text-green-500"
                placeholder="0"
              />
            </div>

            <div class="bg-slate-900 p-4 rounded-3xl border border-white/5">
              <label class="font-black uppercase text-[10px] text-slate-500 block mb-3">
                Notes exercice
              </label>
              <textarea
                v-model="activeConfig.notes"
                rows="3"
                placeholder="Tempo, consignes, focus..."
                class="w-full bg-slate-800 border border-white/10 text-white py-3 px-4 rounded-2xl outline-none resize-none"
              />
            </div>
          </div>

          <button
            @click="confirmExercise"
            class="mt-6 w-full bg-white text-black font-[1000] py-5 rounded-3xl hover:bg-green-500 transition-all shadow-xl"
          >
            {{ editingIndex !== null ? "Mettre à jour" : "Ajouter l'exercice" }}
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { exerciseLibrary } from '~/data/exerciseLibrary'

const props = defineProps({
  date: String,
  initialData: Object
})

const emit = defineEmits(['close', 'save'])

const currentStep = ref('main')
const searchQuery = ref('')
const activeCategory = ref('Tout')
const editingIndex = ref<number | null>(null)

const sessionData = ref({
  title: '',
  category: '',
  notes: '',
  exercises: [] as any[]
})

const activeExo = ref<any>(null)
const activeConfig = ref(createDefaultConfig())

const categories = ['Tout', 'Pec', 'Dos', 'Jambes', 'Epaules', 'Bras', 'Abdos', 'Cardio', 'Mobilite']

const formattedDate = computed(() => {
  if (!props.date) return ''
  return new Date(props.date).toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
})

const filteredLibrary = computed(() => {
  return exerciseLibrary.filter((exo) => {
    const matchCat =
      activeCategory.value === 'Tout' || exo.category === activeCategory.value

    const q = searchQuery.value.trim().toLowerCase()

    const matchSearch =
      !q ||
      exo.name.toLowerCase().includes(q) ||
      exo.description.toLowerCase().includes(q) ||
      exo.equipment.toLowerCase().includes(q) ||
      exo.muscle.toLowerCase().includes(q)

    return matchCat && matchSearch
  })
})

onMounted(() => {
  if (props.initialData) {
    const data = JSON.parse(JSON.stringify(props.initialData))
    sessionData.value.title = data.title || data.customTitle || ''
    sessionData.value.category = data.category || ''
    sessionData.value.notes = data.notes || ''
    sessionData.value.exercises = data.exercises || []
  }
})

function createDefaultConfig() {
  return {
    sets: 4,
    reps: 12,
    weight: null as number | null,
    rest: 60,
    notes: ''
  }
}

function openLibrary() {
  editingIndex.value = null
  currentStep.value = 'library'
}

function openConfig(exo: any) {
  activeExo.value = exo
  activeConfig.value = createDefaultConfig()
  currentStep.value = 'config'
}

function editExercise(exo: any, index: number) {
  activeExo.value = {
    id: exo.id,
    name: exo.name,
    muscle: exo.muscle,
    category: exo.category,
    equipment: exo.equipment,
    description: exo.description,
    mediaType: exo.mediaType,
    mediaUrl: exo.mediaUrl
  }

  activeConfig.value = {
    sets: exo.sets ?? 4,
    reps: exo.reps ?? 12,
    weight: exo.weight ?? null,
    rest: exo.rest ?? 60,
    notes: exo.notes ?? ''
  }

  editingIndex.value = index
  currentStep.value = 'config'
}

function confirmExercise() {
  if (!activeExo.value) return

  const data = {
    id: activeExo.value.id,
    name: activeExo.value.name,
    muscle: activeExo.value.muscle,
    category: activeExo.value.category,
    equipment: activeExo.value.equipment,
    description: activeExo.value.description,
    mediaType: activeExo.value.mediaType,
    mediaUrl: activeExo.value.mediaUrl,
    sets: activeConfig.value.sets,
    reps: activeConfig.value.reps,
    weight: activeConfig.value.weight,
    rest: activeConfig.value.rest,
    notes: activeConfig.value.notes
  }

  if (editingIndex.value !== null) {
    sessionData.value.exercises[editingIndex.value] = data
  } else {
    sessionData.value.exercises.push(data)
  }

  editingIndex.value = null
  currentStep.value = 'main'
}

function removeExercise(index: number) {
  sessionData.value.exercises.splice(index, 1)
}

function saveSession() {
  if (!sessionData.value.title?.trim()) {
    sessionData.value.title = 'Nouvelle séance'
  }

  emit('save', {
    type: 'sport',
    data: {
      title: sessionData.value.title,
      category: sessionData.value.category,
      notes: sessionData.value.notes,
      exercises: sessionData.value.exercises
    }
  })
}

function increase(field: 'sets' | 'reps' | 'rest') {
  activeConfig.value[field] = Number(activeConfig.value[field] || 0) + 1
}

function decrease(field: 'sets' | 'reps' | 'rest', min = 1) {
  const value = Number(activeConfig.value[field] || 0) - 1
  activeConfig.value[field] = Math.max(min, value)
}

function isVideo(mediaType: string, mediaUrl: string) {
  if (mediaType === 'video') return true
  if (!mediaUrl) return false
  const lower = mediaUrl.toLowerCase()
  return lower.endsWith('.mp4') || lower.endsWith('.webm') || lower.includes('.mp4?') || lower.includes('.webm?')
}

function onImageError(event: Event) {
  const target = event.target as HTMLImageElement
  target.src = 'https://placehold.co/600x600/0f172a/94a3b8?text=Image+Indisponible'
}
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateX(30px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateX(-30px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}
</style>