<template>
  <div class="relative flex items-center justify-center min-h-screen p-4">
    <div class="arena-stripes absolute inset-0 pointer-events-none"></div>

    <div class="w-full max-w-sm relative z-10 p-2">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-[1000] tracking-tighter text-white">Nouveau mot de passe</h2>
        <p class="text-slate-400 text-sm font-medium mt-1">Choisis un nouveau mot de passe</p>
      </div>

      <!-- Lien invalide -->
      <div v-if="linkError" class="text-center space-y-4">
        <div class="bg-red-50 border border-red-200 rounded-2xl p-5">
          <p class="text-red-700 font-bold text-sm">{{ linkError }}</p>
        </div>
        <NuxtLink to="/login" class="block w-full arena-primary bg-[var(--accent-solid)] text-[var(--accent-ink)] py-4 rounded-2xl text-center hover:brightness-110 transition">
          Retour à la connexion
        </NuxtLink>
      </div>

      <!-- En attente -->
      <div v-else-if="!ready && !done" class="text-center py-6">
        <div class="w-10 h-10 rounded-full border-4 border-white/20 border-t-[var(--accent-solid)] animate-spin mx-auto mb-4"></div>
        <p class="text-slate-400 text-sm">Vérification du lien...</p>
      </div>

      <!-- Succès -->
      <div v-else-if="done" class="text-center space-y-4">
        <div class="bg-[var(--arena-surface-2)] border border-[var(--arena-line)] rounded-2xl p-5">
          <p class="text-[var(--accent-solid)] font-bold">Mot de passe mis à jour !</p>
        </div>
        <NuxtLink to="/login" class="block w-full arena-primary bg-[var(--accent-solid)] text-[var(--accent-ink)] py-4 rounded-2xl text-center hover:brightness-110 transition">
          Se connecter
        </NuxtLink>
      </div>

      <!-- Formulaire -->
      <form v-else @submit.prevent="handleReset" class="space-y-5">
        <div class="relative group">
          <UIcon name="i-heroicons-lock-closed" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--accent-solid)] transition-colors" />
          <input v-model="password" type="password" placeholder="Nouveau mot de passe" minlength="6"
            class="w-full pl-12 pr-4 py-4 bg-[#0e0e10] border-none rounded-2xl focus:ring-2 focus:ring-[var(--accent-solid)] transition-all font-semibold text-white" required />
        </div>

        <div class="relative group">
          <UIcon name="i-heroicons-lock-closed" class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[var(--accent-solid)] transition-colors" />
          <input v-model="confirm" type="password" placeholder="Confirmer le mot de passe"
            class="w-full pl-12 pr-4 py-4 bg-[#0e0e10] border-none rounded-2xl focus:ring-2 focus:ring-[var(--accent-solid)] transition-all font-semibold text-white" required />
        </div>

        <p v-if="formError" class="text-red-500 text-sm font-bold text-center">{{ formError }}</p>

        <button type="submit" :disabled="loading"
          class="w-full arena-primary bg-[var(--accent-solid)] text-[var(--accent-ink)] py-5 rounded-2xl shadow-xl hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50">
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
const formError = ref('')
const linkError = ref('')
const done = ref(false)
const ready = ref(false)

// Enregistré SYNCHRONEMENT (hors onMounted) pour capter PASSWORD_RECOVERY
// même si l'event fire avant que le composant soit monté
const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'PASSWORD_RECOVERY') {
    ready.value = true
  } else if (event === 'INITIAL_SESSION' && session) {
    ready.value = true
  }
})

onUnmounted(() => subscription.unsubscribe())

onMounted(async () => {
  if (ready.value) return

  // Détecter les erreurs dans le hash (ex: #error=access_denied) ou la query
  const hashParams = new URLSearchParams(window.location.hash.substring(1))
  const query = new URLSearchParams(window.location.search)
  if (hashParams.get('error') || query.get('error')) {
    linkError.value = 'Lien invalide ou expiré. Recommence depuis la connexion.'
    return
  }

  // Lien "token_hash" (modèle d'e-mail Supabase) : il fonctionne même quand le lien s'ouvre dans un autre
  // navigateur que celui qui a fait la demande (sur iPhone, l'app installée et Safari ne partagent rien)
  const tokenHash = query.get('token_hash')
  if (tokenHash) {
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type: 'recovery' })
    if (error) linkError.value = 'Lien invalide ou expiré. Recommence depuis la connexion.'
    else ready.value = true
    return
  }

  // Vérif session existante (si le module Supabase a déjà traité le token)
  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    ready.value = true
    return
  }

  // Timeout : si après 10s aucun event valide, lien expiré
  setTimeout(() => {
    if (!ready.value && !done.value) {
      linkError.value = 'Lien invalide ou expiré. Recommence depuis la connexion.'
    }
  }, 10000)
})

async function handleReset() {
  formError.value = ''
  if (password.value !== confirm.value) {
    formError.value = 'Les mots de passe ne correspondent pas.'
    return
  }
  if (password.value.length < 6) {
    formError.value = 'Minimum 6 caractères.'
    return
  }
  loading.value = true
  const { error } = await supabase.auth.updateUser({ password: password.value })
  loading.value = false
  if (error) formError.value = error.message
  else {
    done.value = true
    await supabase.auth.signOut()
  }
}
</script>
