<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <CoreCard class="w-full max-w-md">
      <div class="bg-slate-900 p-6 text-center border-b border-gray-300">
        <h1 class="text-white text-xl font-bold uppercase">Créer un compte</h1>
        <p class="text-slate-400 text-xs mt-1">Rejoins l'équipe FitTrack</p>
      </div>

      <form @submit="sInscrire" class="p-8 flex flex-col gap-5">
        <div class="flex justify-center mb-2">
          <div class="p-2 bg-white rounded-full shadow-lg">
            <CoreAvatar :name="pseudo || '?'" size="grand" />
          </div>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Pseudo</label>
          <input v-model="pseudo" v-bind="pseudoAttrs" type="text" class="w-full border rounded-lg p-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-400 transition" :class="errors.pseudo ? 'border-red-500 bg-red-50' : 'border-gray-300'" placeholder="Pseudo" />
          <p v-if="errors.pseudo" class="text-red-500 text-xs font-bold mt-1">{{ errors.pseudo }}</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Email</label>
          <input v-model="email" v-bind="emailAttrs" type="email" class="w-full border rounded-lg p-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-400 transition" :class="errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'" placeholder="exemple@mail.com" />
          <p v-if="errors.email" class="text-red-500 text-xs font-bold mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Mot de passe</label>
          <input v-model="password" v-bind="passwordAttrs" type="password" class="w-full border rounded-lg p-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-400 transition" :class="errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'" placeholder="••••••••" />
          <p v-if="errors.password" class="text-red-500 text-xs font-bold mt-1">{{ errors.password }}</p>
        </div>

        <div>
          <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Confirmer mot de passe</label>
          <input v-model="confirmPassword" v-bind="confirmPasswordAttrs" type="password" class="w-full border rounded-lg p-3 font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-400 transition" :class="errors.confirmPassword ? 'border-red-500 bg-red-50' : 'border-gray-300'" placeholder="••••••••" />
          <p v-if="errors.confirmPassword" class="text-red-500 text-xs font-bold mt-1">{{ errors.confirmPassword }}</p>
        </div>

        <button type="submit" class="mt-4 w-full py-3 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 shadow-md hover:shadow-lg transition transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" :disabled="Object.keys(errors).length > 0">S'inscrire</button>

        <div class="text-center mt-2">
          <p class="text-xs text-gray-500">Déjà un compte ? <NuxtLink to="/login" class="text-blue-600 font-bold hover:underline">Se connecter</NuxtLink></p>
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
  pseudo: yup.string().required("Le pseudo est requis").min(3, "3 caractères minimum"),
  email: yup.string().required("L'email est requis").email("L'email n'est pas valide"),
  password: yup.string().required("Le mot de passe est requis").min(6, "6 caractères minimum"),
  confirmPassword: yup.string().required("La confirmation est requise").oneOf([yup.ref('password')], "Les mots de passe ne correspondent pas")
})

const { defineField, handleSubmit, errors } = useForm({ validationSchema: schema })

const [pseudo, pseudoAttrs] = defineField("pseudo")
const [email, emailAttrs] = defineField("email")
const [password, passwordAttrs] = defineField("password")
const [confirmPassword, confirmPasswordAttrs] = defineField("confirmPassword")

const sInscrire = handleSubmit(values => {
  store.currentUser = values.pseudo
  router.push('/')
})
</script>
