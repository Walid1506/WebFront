<template>
  <div class="p-4 max-w-6xl mx-auto space-y-6">
    <div class="flex items-center justify-between mb-4">
      <h1 class="text-2xl font-black text-slate-800 uppercase">{{ $t('profile.title') }}</h1>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="flex flex-col gap-4">
        <Card :title="$t('profile.my_profile')">
          <template #actions>
            <button v-if="!isEditingName" @click="openEditName" class="text-slate-300 hover:text-blue-500 transition">
              <UIcon name="i-heroicons-pencil-square" class="text-xl" />
            </button>
          </template>
          <div class="flex flex-col items-center text-center gap-4">
            <div class="w-20 h-20 bg-slate-900 text-white rounded-full flex items-center justify-center font-bold text-3xl uppercase shadow-md ring-4 ring-slate-50">
              {{ userInitial }}
            </div>
            <div class="w-full space-y-4">
              <div v-if="!isEditingName">
                <h2 class="font-black text-xl capitalize text-slate-900">{{ displayUserName }}</h2>
              </div>
              <div v-else class="animate-fade-in w-full">
                <Form @submit="onUpdateName" :validation-schema="validationSchema" v-slot="{ errors }">
                  <div class="flex flex-col gap-2">
                    <Field name="newUsername" type="text" class="w-full bg-slate-50 border-2 rounded-xl px-3 py-2 text-center font-bold text-slate-900 outline-none transition text-sm" :class="errors.newUsername ? 'border-red-500 bg-red-50' : 'border-green-500'" :placeholder="$t('profile.new_name_placeholder')" :value="store.currentUser" />
                    <ErrorMessage name="newUsername" class="text-[10px] font-bold text-red-500 uppercase" />
                    <div class="flex gap-2 justify-center mt-1">
                      <button type="submit" class="bg-green-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-green-600 shadow-sm">OK</button>
                      <button type="button" @click="closeEditName" class="bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-xs font-bold hover:bg-gray-200">X</button>
                    </div>
                  </div>
                </Form>
              </div>
              <div class="pt-4 border-t border-slate-100">
                <p class="text-[10px] font-black uppercase text-slate-400 mb-3 text-center">{{ $t('profile.system_language') }}</p>
                <div class="flex justify-center gap-4">
                  <button v-for="lang in availableLocales" :key="lang.code" @click="setLocale(lang.code)" class="w-12 h-12 rounded-full border-2 flex items-center justify-center text-2xl transition-all shadow-sm" :class="locale === lang.code ? 'border-green-500 bg-green-50 scale-110' : 'border-slate-100 bg-slate-50 opacity-60 hover:opacity-100'" :title="lang.name">
                    <span v-if="lang.code === 'fr'">🇫🇷</span>
                    <span v-else-if="lang.code === 'en'">🇬🇧</span>
                    <span v-else>{{ lang.code.toUpperCase() }}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Card>
        <Classement :users="leaderboard" :current-username="store.currentUser" />
      </div>
      <div class="md:col-span-2 space-y-4">
        <ProfilStat :user="userData" :badges="badgesList" />
      </div>
    </div>
  </div>
</template>
<script setup>
import { useSportStore } from "~/stores/sport"
import { Form, Field, ErrorMessage } from "vee-validate"
import * as yup from "yup"
import Classement from "~/components/custom/classement.vue"
import ProfilStat from "~/components/custom/profilstat.vue"
import Card from "~/components/core/ui/card/card.vue"

const { t, locale, setLocale, locales } = useI18n()
const availableLocales = computed(() => locales.value)

const store = useSportStore()
const route = useRoute()
const router = useRouter()

const isEditingName = ref(false)

const validationSchema = yup.object({
  newUsername: yup.string().required("Pseudo requis").min(3, "Trop court (3 min)").max(15, "Trop long (15 max)").matches(/^[a-zA-Z0-9_]+$/, "Caractères invalides")
})

const currentUrlUser = computed(() => String(route.params.username || ""))
const displayUserName = computed(() => store.currentUser || "Invité")
const userInitial = computed(() => store.currentUser ? store.currentUser.charAt(0).toUpperCase() : "?")

const leaderboard = computed(() => {
  const allUsers = new Set()
  store.users.forEach(u => allUsers.add(u.username))
  store.allSessions.forEach(s => allUsers.add(s.username))
  const scores = Array.from(allUsers).map(name => ({ name, sessions: store.allSessions.filter(s => s.username === name).length }))
  return scores.sort((a, b) => b.sessions - a.sessions)
})

const userData = computed(() => {
  const nameInUrl = currentUrlUser.value.toLowerCase()
  const found = leaderboard.value.find(u => u.name.toLowerCase() === nameInUrl)
  return found || { name: currentUrlUser.value, sessions: 0 }
})

const badgesList = computed(() => {
  const count = userData.value.sessions
  const levels = [
    { name: t('profile.badges.beginner'), req: 1, icon: "i-heroicons-sparkles" },
    { name: t('profile.badges.early_bird'), req: 10, icon: "i-heroicons-sun" },
    { name: t('profile.badges.machine'), req: 20, icon: "i-heroicons-fire" },
    { name: t('profile.badges.spartan'), req: 50, icon: "i-heroicons-trophy" }
  ]
  return levels.map(badge => ({ ...badge, unlocked: count >= badge.req }))
})

function openEditName() { isEditingName.value = true }
function closeEditName() { isEditingName.value = false }

function onUpdateName(values, { setErrors }) {
  const newName = values.newUsername
  if (!newName || newName === store.currentUser) {
    closeEditName()
    return
  }
  const isUpdated = store.updateUsername(newName)
  if (isUpdated) {
    closeEditName()
    router.push(`/utilisateur/${newName}`)
  } else {
    setErrors({ newUsername: "Déjà pris !" })
  }
}
</script>
