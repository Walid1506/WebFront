<template>
  <div class="p-4 max-w-6xl mx-auto space-y-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-black text-slate-800 uppercase">Profil</h1>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="flex flex-col gap-4">
        <Card title="Mon profil">
          <template #actions>
            <button v-if="!isEditingName" @click="openEditName" class="text-slate-300 hover:text-blue-500 transition"><UIcon name="i-heroicons-pencil-square" class="text-xl" /></button>
          </template>
          <div class="flex flex-col items-center text-center gap-4">
            <div class="w-20 h-20 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-3xl uppercase shadow-md ring-4 ring-slate-50">{{ firstLetter }}</div>
            <div class="w-full">
              <div v-if="!isEditingName">
                <h2 class="font-black text-xl capitalize text-slate-900">{{ currentUserName }}</h2>
              </div>
              <div v-else class="animate-fade-in w-full">
                <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ errors }">
                  <div class="flex flex-col gap-2">
                    <Field name="newUsername" type="text" class="w-full bg-slate-50 border-2 rounded-xl px-3 py-2 text-center font-bold text-slate-900 outline-none transition text-sm" :class="errors.newUsername ? 'border-red-500 bg-red-50' : 'border-green-500'" placeholder="Nouveau nom" :value="store.currentUser" />
                    <ErrorMessage name="newUsername" class="text-[10px] font-bold text-red-500 uppercase" />
                    <div class="flex gap-2 justify-center mt-1">
                      <button type="submit" class="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-600 shadow-sm">OK</button>
                      <button type="button" @click="closeEditName" class="bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-xs font-bold hover:bg-gray-200">X</button>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </Card>
        <Classement :users="leaderboard" :current-username="store.currentUser" />
      </div>
      <div class="md:col-span-2 space-y-4">
        <ProfilStat :user="infosUtilisateur" :badges="listeBadges" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSportStore } from "~/stores/sport"
import Classement from "~/components/custom/classement.vue"
import ProfilStat from "~/components/custom/profilstat.vue"
import Card from "~/components/core/ui/card/card.vue"
import { Form, Field, ErrorMessage } from "vee-validate"
import * as yup from "yup"

const route = useRoute()
const router = useRouter()
const store = useSportStore()

const isEditingName = ref(false)

const schema = yup.object({
  newUsername: yup.string().required("Pseudo requis").min(3, "Trop court (3 min)").max(15, "Trop long (15 max)").matches(/^[a-zA-Z0-9_]+$/, "Caractères invalides")
})

const pseudoActuel = computed(() => String(route.params.username || ""))

const currentUserName = computed(() => (store.currentUser ? store.currentUser : "Invité"))

const firstLetter = computed(() => (store.currentUser ? store.currentUser.charAt(0) : "?"))

const leaderboard = computed(() => buildLeaderboard(store.users, store.allSessions))

const infosUtilisateur = computed(() => getUserInfos(leaderboard.value, pseudoActuel.value))

const listeBadges = computed(() => buildBadges(infosUtilisateur.value.sessions))

function openEditName() {
  isEditingName.value = true
}

function closeEditName() {
  isEditingName.value = false
}

function onSubmit(values, { setErrors }) {
  const pseudoSaisi = values.newUsername
  if (!pseudoSaisi) return
  if (pseudoSaisi === store.currentUser) {
    closeEditName()
    return
  }
  const success = store.updateUsername(pseudoSaisi)
  if (success) {
    closeEditName()
    router.push(`/utilisateur/${pseudoSaisi}`)
    return
  }
  setErrors({ newUsername: "Déjà pris !" })
}

function buildLeaderboard(users, sessions) {
  const names = new Set()
  for (const user of users) names.add(user.username)
  for (const session of sessions) names.add(session.username)
  const ranking = []
  for (const username of names) {
    const sessionCount = sessions.filter(item => item.username === username).length
    ranking.push({ name: username, sessions: sessionCount })
  }
  return ranking.sort((a, b) => b.sessions - a.sessions)
}

function getUserInfos(leaderboard, pseudoActuel) {
  const pseudoLower = pseudoActuel.toLowerCase()
  const user = leaderboard.find(item => item.name.toLowerCase() === pseudoLower) || null
  if (user) return user
  return { name: pseudoActuel, sessions: 0 }
}

function buildBadges(sessionCount) {
  const badgesDefs = [
    { name: "Débutant", req: 1, icon: "i-heroicons-sparkles" },
    { name: "Lève-tôt", req: 10, icon: "i-heroicons-sun" },
    { name: "Machine", req: 20, icon: "i-heroicons-fire" },
    { name: "Spartiate", req: 50, icon: "i-heroicons-trophy" }
  ]
  return badgesDefs.map(badge => ({ ...badge, unlocked: sessionCount >= badge.req }))
}
</script>
