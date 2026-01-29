<template>
  <div class="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
      
      <div class="flex justify-between items-center p-4 border-b bg-gray-50">
        <div>
          <h3 class="font-black text-lg text-slate-900 uppercase">{{ props.initialData ? 'Modifier la séance' : 'Nouvelle Séance' }}</h3>
          <p class="text-xs text-slate-700 font-bold uppercase">{{ date }}</p> </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-red-500 transition"><UIcon name="i-heroicons-x-mark" class="text-2xl" /></button>
      </div>

      <div class="p-4 space-y-4">
        
        <div>
          <label class="block text-xs font-bold text-slate-900 uppercase mb-1">Type de sport</label>
          <select v-model="sportForm.type" class="w-full p-2 border border-gray-300 rounded-lg bg-white font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition">
            <option>Musculation</option>
            <option>Cardio</option>
            <option>Crossfit</option>
            <option>Yoga</option>
          </select>
        </div>

        <div class="space-y-3">
          
          <div class="flex justify-between items-end">
            <label class="block text-xs font-bold text-slate-900 uppercase">Exercices</label>
            <span class="text-[10px] text-slate-600 font-bold uppercase">Nom / Séries / Reps</span> </div>

          <div v-for="(ex, i) in sportForm.exercises" :key="i" class="flex gap-2 items-center group">
            <input v-model="ex.name" placeholder="Nom de l'exo" class="flex-1 p-2 border border-gray-300 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition placeholder-gray-400" />
            <input v-model="ex.sets" type="number" placeholder="S" class="w-14 p-2 border border-gray-300 rounded-lg text-sm text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition placeholder-gray-400" />
            <input v-model="ex.reps" type="number" placeholder="R" class="w-14 p-2 border border-gray-300 rounded-lg text-sm text-center font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition placeholder-gray-400" />
            <button @click="removeExercise(i)" class="text-gray-300 hover:text-red-500 transition p-1" title="Supprimer"><UIcon name="i-heroicons-trash" /></button>
          </div>
        </div>

        <button @click="addExercise" class="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-xs text-slate-700 font-bold hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition flex justify-center items-center gap-2">
          <UIcon name="i-heroicons-plus-circle" class="text-lg" /> Ajouter un exercice
        </button>
      </div>

      <div class="p-4 bg-gray-50 border-t flex justify-end gap-3">
        <button @click="$emit('close')" class="px-4 py-2 text-slate-700 font-bold text-sm hover:bg-gray-200 rounded-lg transition">Annuler</button>
        <button @click="handleSave" class="px-6 py-2 bg-slate-900 text-white font-bold text-sm rounded-lg hover:bg-slate-800 shadow-lg transform active:scale-95 transition">{{ props.initialData ? 'Mettre à jour' : 'Enregistrer' }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from "vue"

const props = defineProps(["date", "initialData"])
const emit = defineEmits(["close", "save"])

const sportForm = reactive({
  type: "Musculation",
  exercises: [{ name: "", sets: 3, reps: 10 }]
})

watch(() => props.initialData, newData => {
  if (newData) {
    sportForm.type = newData.type || "Musculation"
    if (newData.exercises && newData.exercises.length > 0) {
      sportForm.exercises = newData.exercises.map(exo => ({ ...exo }))
    } else {
      sportForm.exercises = [{ name: "", sets: 3, reps: 10 }]
    }
  } else {
    sportForm.type = "Musculation"
    sportForm.exercises = [{ name: "", sets: 3, reps: 10 }]
  }
}, { immediate: true })

function addExercise() {
  sportForm.exercises.push({ name: "", sets: 0, reps: 0 })
}

function removeExercise(index) {
  sportForm.exercises.splice(index, 1)
}

function handleSave() {
  emit("save", { type: "sport", data: { type: sportForm.type, exercises: sportForm.exercises.map(e => ({ ...e })) } })
}
</script>
