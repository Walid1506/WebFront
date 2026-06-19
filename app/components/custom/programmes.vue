<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="w-2 h-6 bg-gradient-to-b from-violet-400 to-purple-600 rounded-full"></div>
        <h2 class="text-xl font-black uppercase tracking-tighter">Mes séances</h2>
      </div>
      <button @click="openCreate"
        class="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-black px-4 py-2 rounded-2xl text-sm shadow-lg shadow-violet-500/20 active:scale-95 transition-all">
        <UIcon name="i-heroicons-plus" />
        Créer
      </button>
    </div>

    <!-- Empty -->
    <div v-if="sessions.length === 0" class="bg-white/[0.04] backdrop-blur-2xl rounded-[28px] border border-white/[0.08] p-8 text-center">
      <div class="w-14 h-14 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-3">
        <UIcon name="i-heroicons-clipboard-document-list" class="text-2xl text-violet-400" />
      </div>
      <p class="text-white font-black">Aucune séance sauvegardée</p>
      <p class="text-slate-500 text-sm mt-1">Crée des séances type — Push, Pull, Legs... — puis assigne-les à tes jours.</p>
      <button @click="openCreate" class="mt-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-black px-6 py-3 rounded-2xl text-sm active:scale-95 transition-all">
        Créer ma première séance
      </button>
    </div>

    <!-- Liste -->
    <div v-else class="space-y-3">
      <div v-for="s in sessions" :key="s.id"
        class="bg-white/[0.04] backdrop-blur-2xl rounded-[24px] border border-white/[0.08] overflow-hidden group">
        <div class="flex items-center gap-4 p-4">
          <div class="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-lg font-black"
            :class="categoryBg(s.category)">
            {{ s.name.charAt(0).toUpperCase() }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white font-black truncate">{{ s.name }}</p>
            <p class="text-slate-500 text-xs mt-0.5 line-clamp-1">{{ s.notes || `${s.exercises?.length || 0} exercice${(s.exercises?.length || 0) > 1 ? 's' : ''}` }}</p>
          </div>
          <div class="flex items-center gap-1">
            <button @click="openEdit(s)" class="p-2 text-slate-600 hover:text-cyan-400 transition">
              <UIcon name="i-heroicons-pencil-square" class="text-base" />
            </button>
            <button @click="deleteSession(s.id)" class="p-2 text-slate-600 hover:text-red-400 transition">
              <UIcon name="i-heroicons-trash" class="text-base" />
            </button>
          </div>
        </div>
        <!-- Notes preview -->
        <div v-if="s.notes" class="px-4 pb-4">
          <p class="text-slate-500 text-xs bg-white/[0.03] rounded-xl p-3 border border-white/[0.05] whitespace-pre-wrap">{{ s.notes }}</p>
        </div>
      </div>
    </div>

    <!-- ── Modal créer/éditer ── -->
    <Transition name="slide-up">
      <div v-if="modalOpen" class="fixed inset-0 z-[200] bg-[#060d1a]/98 backdrop-blur-2xl flex flex-col">
        <div class="flex items-center gap-4 px-5 py-5 border-b border-white/[0.08]">
          <button @click="closeModal" class="p-2 rounded-xl bg-white/[0.06] text-slate-400 hover:text-white transition">
            <UIcon name="i-heroicons-arrow-left" class="text-xl" />
          </button>
          <h2 class="text-xl font-black">{{ editingId ? 'Modifier la séance' : 'Nouvelle séance' }}</h2>
        </div>

        <div class="flex-1 overflow-y-auto p-5 space-y-4">
          <!-- Nom -->
          <div class="bg-white/[0.04] rounded-[24px] border border-white/[0.08] p-5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Nom de la séance</label>
            <input v-model="form.name" type="text" placeholder="Ex: Push, Pull, Jambes lourdes..."
              class="w-full bg-transparent text-white font-black text-2xl outline-none placeholder:text-slate-700" />
          </div>

          <!-- Catégorie -->
          <div class="bg-white/[0.04] rounded-[24px] border border-white/[0.08] p-5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-3">Catégorie</label>
            <div class="flex flex-wrap gap-2">
              <button v-for="cat in categories" :key="cat.value" @click="form.category = cat.value"
                class="px-4 py-2 rounded-full text-xs font-black transition-all border"
                :class="form.category === cat.value ? cat.activeClass : 'bg-white/[0.04] border-white/[0.08] text-slate-400'">
                {{ cat.label }}
              </button>
            </div>
          </div>

          <!-- Notes -->
          <div class="bg-white/[0.04] rounded-[24px] border border-white/[0.08] p-5">
            <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-2">Notes / Exercices</label>
            <textarea v-model="form.notes" rows="8" placeholder="Ex :&#10;Développé couché 4x8 100kg&#10;Développé incliné 3x10 70kg&#10;Écarté poulie 3x15&#10;Dips 3xmax"
              class="w-full bg-transparent text-white font-medium text-sm outline-none placeholder:text-slate-700 resize-none leading-relaxed" />
          </div>
        </div>

        <div class="p-5 border-t border-white/[0.08]">
          <button @click="save" :disabled="!form.name.trim() || saving"
            class="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-black py-4 rounded-[20px] text-base shadow-xl active:scale-95 transition-all disabled:opacity-40">
            {{ saving ? 'Sauvegarde...' : 'Sauvegarder' }}
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

const sessions = ref([])
const modalOpen = ref(false)
const saving = ref(false)
const editingId = ref(null)
const form = ref({ name: '', category: '', notes: '' })

const categories = [
  { value: 'push', label: 'Push', activeClass: 'bg-orange-500/20 border-orange-500/30 text-orange-300' },
  { value: 'pull', label: 'Pull', activeClass: 'bg-blue-500/20 border-blue-500/30 text-blue-300' },
  { value: 'jambes', label: 'Jambes', activeClass: 'bg-emerald-500/20 border-emerald-500/30 text-emerald-300' },
  { value: 'full-body', label: 'Full Body', activeClass: 'bg-purple-500/20 border-purple-500/30 text-purple-300' },
  { value: 'cardio', label: 'Cardio', activeClass: 'bg-red-500/20 border-red-500/30 text-red-300' },
  { value: 'haut', label: 'Haut', activeClass: 'bg-cyan-500/20 border-cyan-500/30 text-cyan-300' },
  { value: 'bas', label: 'Bas', activeClass: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300' },
]

onMounted(fetchSessions)

async function fetchSessions() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { data } = await supabase.from('workout_templates').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
  sessions.value = data || []
}

function openCreate() {
  editingId.value = null
  form.value = { name: '', category: '', notes: '' }
  modalOpen.value = true
}

function openEdit(s) {
  editingId.value = s.id
  form.value = { name: s.name, category: s.category || '', notes: s.notes || '' }
  modalOpen.value = true
}

function closeModal() {
  modalOpen.value = false
  editingId.value = null
}

async function save() {
  if (!form.value.name.trim()) return
  saving.value = true
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) { saving.value = false; return }

  if (editingId.value) {
    await supabase.from('workout_templates').update({ name: form.value.name, category: form.value.category, notes: form.value.notes }).eq('id', editingId.value)
  } else {
    await supabase.from('workout_templates').insert({ user_id: user.id, name: form.value.name, category: form.value.category, notes: form.value.notes, exercises: [] })
  }

  await fetchSessions()
  saving.value = false
  closeModal()
}

async function deleteSession(id) {
  await supabase.from('workout_templates').delete().eq('id', id)
  sessions.value = sessions.value.filter(s => s.id !== id)
}

function categoryBg(cat) {
  const map = {
    push: 'bg-orange-500/10 text-orange-400',
    pull: 'bg-blue-500/10 text-blue-400',
    jambes: 'bg-emerald-500/10 text-emerald-400',
    'full-body': 'bg-purple-500/10 text-purple-400',
    cardio: 'bg-red-500/10 text-red-400',
    haut: 'bg-cyan-500/10 text-cyan-400',
    bas: 'bg-yellow-500/10 text-yellow-400',
  }
  return map[cat] || 'bg-violet-500/10 text-violet-400'
}
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1); }
.slide-up-enter-from, .slide-up-leave-to { opacity: 0; transform: translateY(30px); }
</style>
