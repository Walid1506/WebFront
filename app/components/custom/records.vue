<template>
  <div class="bg-white/[0.04] backdrop-blur-2xl rounded-[28px] md:rounded-[40px] p-5 md:p-8 border border-white/[0.08] shadow-2xl relative overflow-hidden">
    <div class="absolute -top-10 -right-10 w-40 h-40 bg-violet-500/10 rounded-full blur-[70px] pointer-events-none"></div>
    <div class="absolute -bottom-10 -left-10 w-40 h-40 bg-amber-500/10 rounded-full blur-[70px] pointer-events-none"></div>
    <div>
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <div class="flex items-center gap-2 mb-1">
          <div class="w-2 h-2 bg-yellow-400 rounded-full shadow-[0_0_10px_rgba(250,204,21,0.8)]"></div>
          <h2 class="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Records personnels</h2>
        </div>
        <p class="text-2xl font-[1000] tracking-tighter text-white">{{ records.length }} PR{{ records.length !== 1 ? 's' : '' }}</p>
      </div>
      <button @click="openAdd" class="p-4 bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl hover:scale-105 active:scale-95 transition-all shadow-xl shadow-amber-500/20">
        <UIcon name="i-heroicons-plus-16-solid" class="text-white text-xl" />
      </button>
    </div>

    <!-- Empty state -->
    <div v-if="records.length === 0" class="text-center py-10 opacity-40">
      <UIcon name="i-heroicons-trophy" class="text-4xl text-slate-600 mb-2" />
      <p class="text-slate-500 text-xs font-black uppercase tracking-widest">Aucun record encore</p>
    </div>

    <!-- Records list -->
    <div v-else class="space-y-3">
      <div
        v-for="r in sortedRecords"
        :key="r.id"
        class="flex items-center justify-between bg-white/[0.04] rounded-2xl px-4 py-3 border border-white/[0.07] group hover:bg-white/[0.07] transition-colors"
      >
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
            <UIcon name="i-heroicons-trophy" class="text-yellow-400 text-lg" />
          </div>
          <div>
            <p class="font-black text-white text-sm">{{ r.exercise }}</p>
            <p class="text-slate-500 text-xs">{{ formatDate(r.created_at) }}</p>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right">
            <p class="font-[1000] text-yellow-400 text-lg tracking-tighter">{{ r.weight_kg }} <span class="text-xs text-yellow-600">kg</span></p>
            <p v-if="r.reps" class="text-slate-500 text-xs">{{ r.reps }} rép.</p>
          </div>
          <button @click="deleteRecord(r.id)" class="p-2 rounded-xl text-slate-500 hover:text-red-400 transition">
            <UIcon name="i-heroicons-trash" class="text-base" />
          </button>
        </div>
      </div>
    </div>

    <!-- Modal ajout -->
    <Transition name="fade">
      <div v-if="isModalOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <div class="w-full max-w-sm bg-white rounded-[40px] p-8 shadow-2xl relative">
          <button @click="isModalOpen = false" class="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition">
            <UIcon name="i-heroicons-x-mark" class="text-2xl" />
          </button>

          <h3 class="text-2xl font-[1000] tracking-tighter text-slate-900 mb-6">Nouveau record</h3>

          <div class="space-y-4">
            <!-- Exercice -->
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Exercice</label>
              <select v-model="form.exercise" class="w-full bg-slate-50 text-slate-900 py-3 px-4 rounded-2xl outline-none focus:ring-2 ring-yellow-200 font-bold">
                <option value="">Choisir...</option>
                <optgroup label="Force">
                  <option>Développé couché</option>
                  <option>Squat</option>
                  <option>Soulevé de terre</option>
                  <option>Développé militaire</option>
                  <option>Rowing barre</option>
                </optgroup>
                <optgroup label="Haltères">
                  <option>Curl biceps</option>
                  <option>Extension triceps</option>
                  <option>Élévations latérales</option>
                  <option>Développé haltères</option>
                </optgroup>
                <optgroup label="Poids de corps">
                  <option>Tractions</option>
                  <option>Dips</option>
                  <option>Pompes</option>
                </optgroup>
                <optgroup label="Cardio">
                  <option>5 km (temps)</option>
                  <option>10 km (temps)</option>
                </optgroup>
              </select>
            </div>

            <!-- Poids -->
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Poids (kg)</label>
              <input
                v-model.number="form.weight_kg"
                type="number" step="0.5" min="0"
                placeholder="ex: 100"
                class="w-full bg-slate-50 text-slate-900 text-center text-3xl py-5 rounded-2xl font-black outline-none focus:ring-2 ring-yellow-200"
              />
            </div>

            <!-- Répétitions -->
            <div>
              <label class="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">Répétitions <span class="text-slate-300">(optionnel)</span></label>
              <input
                v-model.number="form.reps"
                type="number" min="1"
                placeholder="ex: 5"
                class="w-full bg-slate-50 text-slate-900 text-center text-xl py-4 rounded-2xl font-black outline-none focus:ring-2 ring-yellow-200"
              />
            </div>
          </div>

          <button
            @click="saveRecord"
            :disabled="!form.exercise || !form.weight_kg || loading"
            class="mt-6 w-full bg-black text-white font-black py-5 rounded-2xl shadow-xl hover:bg-slate-800 active:scale-95 transition-all disabled:opacity-30"
          >
            {{ loading ? 'Enregistrement...' : 'Confirmer le PR' }}
          </button>
        </div>
      </div>
    </Transition>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const records = ref([])
const isModalOpen = ref(false)
const loading = ref(false)
const form = ref({ exercise: '', weight_kg: null, reps: null })

const sortedRecords = computed(() =>
  [...records.value].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
)

onMounted(fetchRecords)

async function fetchRecords() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { data } = await supabase
    .from('personal_records')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  records.value = data || []
}

function openAdd() {
  form.value = { exercise: '', weight_kg: null, reps: null }
  isModalOpen.value = true
}

async function saveRecord() {
  if (!form.value.exercise || !form.value.weight_kg) return
  loading.value = true
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { loading.value = false; return }

  const { error } = await supabase.from('personal_records').insert({
    user_id: user.id,
    exercise: form.value.exercise,
    weight_kg: form.value.weight_kg,
    reps: form.value.reps || null
  })

  if (!error) {
    await fetchRecords()
    isModalOpen.value = false
  }
  loading.value = false
}

async function deleteRecord(id) {
  await supabase.from('personal_records').delete().eq('id', id)
  records.value = records.value.filter(r => r.id !== id)
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
