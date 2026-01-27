<script setup>
const props = defineProps(['date'])
const emit = defineEmits(['close', 'save'])

const sportForm = reactive({
  type: 'Musculation',
  exercises: [{ name: '', sets: 3, reps: 10 }]
})

const addExercise = () => {
  sportForm.exercises.push({ name: '', sets: 0, reps: 0 })
}

const handleSave = () => {
  emit('save', { type: 'sport', data: { ...sportForm } })
}
</script>

<template>
  <div class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
      <div class="flex justify-between items-center p-4 border-b">
        <h3 class="font-bold text-lg">Séance du {{ date }}</h3>
        <button @click="$emit('close')" class="text-black-400 hover:text-red-500">
          <UIcon name="i-heroicons-x-mark" class="text-2xl" />
        </button>
      </div>

      <div class="p-4 space-y-4">
        <div>
          <label class="block text-xs font-bold text-black mb-1">Type de sport</label>
          <select v-model="sportForm.type" class="w-full p-2 border border-black-400 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 transition">
            <option>Musculation</option>
            <option>Cardio</option>
            <option>Crossfit</option>
            <option>Yoga</option>
          </select>
        </div>

        <div class="space-y-2">
          <label class="block text-xs font-bold text-gray-700">Exercices</label>
          <div v-for="(ex, i) in sportForm.exercises" :key="i" class="flex gap-2">
            <input v-model="ex.name" placeholder="Nom de l'exo" class="flex-1 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition" />
            <input v-model="ex.sets" type="number" placeholder="Séries" class="w-16 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition" />
            <input v-model="ex.reps" type="number" placeholder="Reps" class="w-16 p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition" />
          </div>
        </div>

        <button @click="addExercise" class="text-xs text-green-600 font-bold hover:underline flex items-center gap-1">
          <UIcon name="i-heroicons-plus-circle" /> Ajouter un exercice
        </button>
      </div>

      <div class="p-4 bg-gray-50 border-t flex justify-end gap-2">
        <button @click="$emit('close')" class="px-4 py-2 text-gray-600 font-bold text-sm hover:bg-gray-200 rounded-lg transition">Annuler</button>
        <button @click="handleSave" class="px-4 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-700 shadow-lg transform active:scale-95 transition">Enregistrer</button>
      </div>
    </div>
  </div>
</template>
