<template>
  <div class="flex items-center justify-center min-h-screen bg-black p-4">
    <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-green-500/10 via-transparent to-transparent pointer-events-none"></div>

    <div class="w-full max-w-sm bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden relative z-10 p-10">
      <div class="flex justify-center mb-8">
        <div class="p-3 bg-white rounded-3xl shadow-xl border border-gray-50">
          <img src="/images/logo.jpg" alt="Logo" class="h-16 w-auto rounded-2xl" />
        </div>
      </div>

      <div class="text-center mb-8">
        <h2 class="text-3xl font-[1000] tracking-tighter text-slate-900">Nouveau mot de passe</h2>
        <p class="text-slate-400 text-sm font-medium mt-1">Choisis un nouveau mot de passe</p>
      </div>

      <div v-if="done" class="text-center space-y-4">
        <div class="bg-green-50 border border-green-200 rounded-2xl p-5">
          <p class="text-green-700 font-bold">Mot de passe mis à jour !</p>
        </div>
        <NuxtLink to="/login" class="block w-full bg-slate-900 text-white font-black py-4 rounded-2xl text-center hover:bg-black transition">
          Se connecter
        </NuxtLink>
      </div>

      <form v-else @submit.prevent="handleReset" class="space-y-5">
        <div class="relative group">
          <UIcon name="i-heroicons-lock-closed" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" />
          <input v-model="password" type="password" placeholder="Nouveau mot de passe" minlength="6"
            class="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all font-semibold text-slate-900" required />
        </div>

        <div class="relative group">
          <UIcon name="i-heroicons-lock-closed" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors" />
          <input v-model="confirm" type="password" placeholder="Confirmer le mot de passe"
            class="w-full pl-12 pr-4 py-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-500 transition-all font-semibold text-slate-900" required />
        </div>

        <p v-if="error" class="text-red-500 text-sm font-bold text-center">{{ error }}</p>

        <button type="submit" :disabled="loading"
          class="w-full bg-slate-900 text-white font-black py-5 rounded-2xl shadow-xl hover:bg-black active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
          <UIcon v-if="loading" name="i-heroicons-arrow-path" class="animate-spin" />
          {{ loading ? 'Mise à jour...' : 'Confirmer' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const supabase = useSupabaseClient()
const password = ref('')
const confirm = ref('')
const loading = ref(false)
const error = ref('')
const done = ref(false)

async function handleReset() {
  error.value = ''
  if (password.value !== confirm.value) {
    error.value = 'Les mots de passe ne correspondent pas.'
    return
  }
  if (password.value.length < 6) {
    error.value = 'Minimum 6 caractères.'
    return
  }
  loading.value = true
  const { error: err } = await supabase.auth.updateUser({ password: password.value })
  loading.value = false
  if (err) error.value = err.message
  else done.value = true
}
</script>
