<template>
  <div class="flex items-center justify-center min-h-screen bg-black p-4 text-slate-900">
    <div class="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 relative">
      <div class="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-green-400 rounded-full opacity-20 blur-xl pointer-events-none"></div>
      
      <div class="px-8 pt-10 pb-6 text-center relative z-10">
        <div class="flex justify-center mb-6">
          <div class="bg-white p-2 rounded-2xl shadow-lg">
            <img src="/images/logo.jpg" alt="Logo" class="h-16 w-auto rounded-xl" />
          </div>
        </div>
        <h2 class="text-3xl font-black tracking-tight">Inscription</h2>
        <p class="text-sm font-medium text-gray-400 mt-2">Rejoins la communauté FitTrack</p>
      </div>

      <form @submit.prevent="onSubmit" class="px-8 pb-10 space-y-4">
        <div>
          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Ton Pseudo</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <UIcon name="i-heroicons-user" class="text-gray-400 group-focus-within:text-green-500 transition-colors text-xl" />
            </div>
            <input v-model="pseudo" type="text" placeholder="Ex: Walid15" 
              class="block w-full pl-11 pr-4 py-4 border-2 rounded-2xl bg-gray-50/50 focus:bg-white focus:outline-none focus:border-green-500 transition duration-300 font-medium border-gray-100" 
              required />
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Ton Email</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <UIcon name="i-heroicons-envelope" class="text-gray-400 group-focus-within:text-green-500 transition-colors text-xl" />
            </div>
            <input v-model="email" type="email" placeholder="walid@mail.com" 
              class="block w-full pl-11 pr-4 py-4 border-2 rounded-2xl bg-gray-50/50 focus:bg-white focus:outline-none focus:border-green-500 transition duration-300 font-medium border-gray-100" 
              required />
          </div>
        </div>

        <div>
          <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Mot de passe</label>
          <div class="relative group">
            <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <UIcon name="i-heroicons-lock-closed" class="text-gray-400 group-focus-within:text-green-500 transition-colors text-xl" />
            </div>
            <input v-model="password" type="password" placeholder="••••••••" 
              class="block w-full pl-11 pr-4 py-4 border-2 rounded-2xl bg-gray-50/50 focus:bg-white focus:outline-none focus:border-green-500 transition duration-300 font-medium border-gray-100" 
              required />
          </div>
        </div>

        <button type="submit" :disabled="loading"
          class="w-full bg-green-500 text-white font-bold py-4 rounded-2xl shadow-lg hover:bg-green-600 hover:-translate-y-1 transition-all duration-300 disabled:opacity-50">
          {{ loading ? 'Création...' : 'Créer mon compte' }}
        </button>

        <p v-if="serverError" class="text-red-500 text-xs font-bold text-center mt-2">{{ serverError }}</p>

        <div class="text-center mt-6 pt-4 border-t border-gray-100">
          <NuxtLink to="/login" class="text-sm font-black text-slate-900 hover:text-green-600 transition">Se connecter</NuxtLink>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()
const router = useRouter()

const pseudo = ref('')
const email = ref('')
const password = ref('')
const loading = ref(false)
const serverError = ref('')

async function onSubmit() {
  loading.value = true
  serverError.value = ''
  
  // 1. Inscription Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  })

  if (authError) {
    serverError.value = authError.message
    loading.value = false
    return
  }

  // 2. Création du profil avec le Pseudo
  if (authData.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { 
          id: authData.user.id, 
          username: pseudo.value,
          xp: 0,
          level: 1
        }
      ])

    if (profileError) {
      serverError.value = "Erreur profil"
      loading.value = false
    } else {
      router.push("/")
    }
  }
}
</script>