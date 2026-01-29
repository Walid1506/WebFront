<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <CoreCard class="w-full max-w-md">
      <div class="bg-slate-900 p-6 text-center border-b border-gray-300">
        <h1 class="text-white text-xl font-bold uppercase">Modifier mon profil</h1>
      </div>
      <form @submit="sauvegarder" class="p-8 flex flex-col items-center gap-6">
        <div class="shadow-xl rounded-full">
          <CoreAvatar :name="pseudo" size="grand" />
        </div>
        <div class="w-full">
          <label class="block text-xs font-bold text-gray-500 uppercase mb-2">Ton Pseudo</label>
          <input v-model="pseudo" v-bind="pseudoAttrs" type="text" class="w-full border rounded-lg p-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent transition" :class="errors.pseudo ? 'border-red-500 bg-red-50' : 'border-gray-300'" placeholder="Entre ton nouveau pseudo" />
          <p v-if="errors.pseudo" class="text-red-500 text-xs font-bold mt-1 ml-1">{{ errors.pseudo }}</p>
        </div>
        <div class="flex gap-3 w-full mt-2">
          <button type="button" @click="annuler" class="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition">Annuler</button>
          <button type="submit" class="flex-1 py-3 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 shadow-md hover:shadow-lg transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="hasErrors">Enregistrer</button>
        </div>
      </form>
    </CoreCard>
  </div>
</template>

<script setup>
import { useSportStore } from "~/stores/sport"
import { useForm } from "vee-validate"
import * as yup from "yup"

const store = useSportStore()
const router = useRouter()

const schema = yup.object({
  pseudo: yup.string().required("Le pseudo est requis").min(3, "Le pseudo doit faire 3 caractères minimum")
})

const { defineField, handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: { pseudo: getInitialPseudo() }
})

const [pseudo, pseudoAttrs] = defineField("pseudo")

const hasErrors = computed(() => Object.keys(errors.value).length > 0)

const sauvegarder = handleSubmit(values => enregistrerPseudo(values))

function getInitialPseudo() {
  return store.currentUser ? store.currentUser : ""
}

function enregistrerPseudo(values) {
  store.currentUser = values.pseudo
  router.push(`/utilisateur/${values.pseudo}`)
}

function annuler() {
  router.back()
}
</script>
