<template>
  <div class="flex items-center justify-center min-h-screen bg-black p-4">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent pointer-events-none"></div>

    <div class="w-full max-w-sm bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden relative z-10 p-10">
      
      <div class="flex justify-center mb-8">
        <div class="p-3 bg-white rounded-3xl shadow-xl border border-gray-50">
          <img src="/images/logo.jpg" alt="Logo" class="h-16 w-auto rounded-2xl" />
        </div>
      </div>

      <div class="text-center mb-10">
        <h2 class="text-4xl font-[1000] tracking-tighter text-slate-900">
          Fit<span class="text-green-500">Track</span>
        </h2>
        <p class="text-slate-400 text-sm font-medium mt-1">Prêt à changer de vie ?</p>
      </div>

      <!-- Formulaire connexion -->
      <form v-if="!forgotMode" @submit.prevent="handleLogin" class="space-y-6">
        <div>
          <div class="relative group">
            <UIcon name="i-heroicons-envelope" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            <input v-model="email" type="email" placeholder="Email"
              class="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all font-semibold text-slate-900" required />
          </div>
        </div>

        <div>
          <div class="relative group">
            <UIcon name="i-heroicons-lock-closed" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" />
            <input v-model="password" type="password" placeholder="Mot de passe"
              class="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all font-semibold text-slate-900" required />
          </div>
        </div>

        <button type="submit" :disabled="loading"
          class="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-black hover:-translate-y-1 active:scale-95 transition-all flex items-center justify-center gap-3">
          <UIcon v-if="loading" name="i-heroicons-arrow-path" class="animate-spin" />
          {{ loading ? 'Connexion...' : 'Se connecter' }}
        </button>

        <div class="flex justify-between items-center">
          <button type="button" @click="forgotMode = true" class="text-sm font-bold text-slate-400 hover:text-slate-600 transition">
            Mot de passe oublié ?
          </button>
          <NuxtLink to="/register" class="text-sm font-bold text-green-600 hover:text-green-700 transition">
            Créer un compte
          </NuxtLink>
        </div>
      </form>

      <!-- Formulaire mot de passe oublié -->
      <div v-else class="space-y-6">
        <div class="text-center mb-2">
          <p class="text-slate-600 text-sm">Entre ton email pour recevoir un lien de réinitialisation.</p>
        </div>

        <div class="relative group">
          <UIcon name="i-heroicons-envelope" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" />
          <input v-model="email" type="email" placeholder="Email"
            class="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all font-semibold text-slate-900" />
        </div>

        <div v-if="resetSent" class="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
          <p class="text-green-700 font-bold text-sm">Email envoyé ! Vérifie ta boîte mail.</p>
        </div>

        <button @click="handleForgot" :disabled="loading || resetSent"
          class="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
          <UIcon v-if="loading" name="i-heroicons-arrow-path" class="animate-spin" />
          {{ loading ? 'Envoi...' : 'Envoyer le lien' }}
        </button>

        <div class="text-center">
          <button @click="forgotMode = false; resetSent = false" class="text-sm font-bold text-slate-400 hover:text-slate-600 transition">
            ← Retour à la connexion
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const config = useRuntimeConfig()
const email = ref('')
const password = ref('')
const loading = ref(false)
const forgotMode = ref(false)
const resetSent = ref(false)

// 1. SI L'UTILISATEUR EST DÉJÀ CONNECTÉ, ON LE REDIRIGE AUTO
// Ça évite de rester bloqué si la session s'active en retard
watch(user, (newUser) => {
  if (newUser) {
    navigateTo('/')
  }
}, { immediate: true })

async function handleForgot() {
  if (!email.value || loading.value) return
  loading.value = true
  const { error } = await supabase.auth.resetPasswordForEmail(email.value, {
    redirectTo: `${config.public.siteUrl}/reset-password`
  })
  loading.value = false
  if (error) alert('Erreur : ' + error.message)
  else resetSent.value = true
}

async function handleLogin() {
  if (loading.value) return
  loading.value = true
  
  try {
    const { error, data } = await supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) {
      alert("Erreur : " + error.message)
      loading.value = false
    } else if (data.user) {
      // 2. ON UTILISE NAVIGATETO AU LIEU DE WINDOW.LOCATION
      // C'est plus fluide et ça garde l'état de Nuxt vivant
      await navigateTo('/')
    }
  } catch (e) {
    console.error(e)
    loading.value = false
  }
}
</script>