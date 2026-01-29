<template>
  <div class="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative">
    <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-400 rounded-full opacity-20 blur-xl pointer-events-none"></div>
    <div class="px-8 pt-10 pb-6 text-center relative z-10">
      <div class="flex justify-center mb-6">
        <div class="bg-white p-2 rounded-2xl shadow-lg shadow-green-900/10"><img src="/images/logo.jpg" alt="Logo" class="h-16 w-auto rounded-xl" /></div>
      </div>
      <h2 class="text-3xl font-black text-slate-900 tracking-tight">Inscription</h2>
      <p class="text-sm font-medium text-gray-400 mt-2">Rejoins la communauté FitTrack !</p>
    </div>
    <form @submit="onSubmit" class="px-8 pb-10 space-y-5">
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">Choisis un Pseudo</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><UIcon name="i-heroicons-user" class="text-gray-400 group-hover:text-green-500 transition-colors text-xl" /></div>
          <input v-model="pseudo" v-bind="pseudoAttrs" type="text" placeholder="Ex: Walid" class="block w-full pl-11 pr-4 py-4 border-2 rounded-2xl text-gray-900 placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-green-500 transition duration-300 font-medium" :class="errors.pseudo ? 'border-red-500 bg-red-50' : 'border-gray-100'" />
        </div>
        <p v-if="errors.pseudo" class="text-red-500 text-xs font-bold mt-1 pl-1">{{ errors.pseudo }}</p>
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">Mot de passe</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><UIcon name="i-heroicons-lock-closed" class="text-gray-400 group-hover:text-green-500 transition-colors text-xl" /></div>
          <input v-model="password" v-bind="passwordAttrs" type="password" placeholder="••••••••" class="block w-full pl-11 pr-4 py-4 border-2 rounded-2xl text-gray-900 placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-green-500 transition duration-300 font-medium" :class="errors.password ? 'border-red-500 bg-red-50' : 'border-gray-100'" />
        </div>
        <p v-if="errors.password" class="text-red-500 text-xs font-bold mt-1 pl-1">{{ errors.password }}</p>
      </div>
      <div>
        <label class="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2 pl-1">Confirmer le mot de passe</label>
        <div class="relative group">
          <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><UIcon name="i-heroicons-shield-check" class="text-gray-400 group-hover:text-green-500 transition-colors text-xl" /></div>
          <input v-model="confirmPassword" v-bind="confirmPasswordAttrs" type="password" placeholder="••••••••" class="block w-full pl-11 pr-4 py-4 border-2 rounded-2xl text-gray-900 placeholder-gray-400 bg-gray-50/50 focus:bg-white focus:outline-none focus:border-green-500 transition duration-300 font-medium" :class="errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-100'" />
        </div>
        <p v-if="errors.confirmPassword" class="text-red-500 text-xs font-bold mt-1 pl-1">{{ errors.confirmPassword }}</p>
      </div>
      <button type="submit" class="w-full bg-green-500 text-white font-bold py-4 px-4 rounded-2xl shadow-lg hover:bg-green-600 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="isDisabled">Créer mon compte</button>
      <div class="text-center mt-6 pt-4 border-t border-gray-100">
        <p class="text-xs text-gray-400 font-medium mb-2">Tu as déjà un compte ?</p>
        <NuxtLink to="/login" class="text-sm font-black text-slate-900 hover:text-green-600 transition">Se connecter</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useSportStore } from "~/stores/sport"
import { useForm } from "vee-validate"
import * as yup from "yup"

definePageMeta({ layout: "auth" })

const store = useSportStore()
const router = useRouter()

const schema = yup.object({
  pseudo: yup.string().required("Le pseudo est requis").min(3, "3 caractères minimum"),
  password: yup.string().required("Le mot de passe est requis").min(4, "4 caractères minimum"),
  confirmPassword: yup.string().required("La confirmation est requise").oneOf([yup.ref("password")], "Les mots de passe ne correspondent pas")
})

const { defineField, handleSubmit, errors, setErrors } = useForm({ validationSchema: schema })

const [pseudo, pseudoAttrs] = defineField("pseudo")
const [password, passwordAttrs] = defineField("password")
const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword")

const isDisabled = computed(() => Object.keys(errors.value).length > 0)

const onSubmit = handleSubmit(values => handleRegister(values))

function handleRegister(values) {
  const ok = store.register(values.pseudo, values.password)
  if (ok) {
    router.push("/")
    return
  }
  setErrors({ pseudo: "Ce pseudo est déjà utilisé." })
}
</script>
