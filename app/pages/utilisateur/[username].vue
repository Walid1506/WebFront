<template>
  <div class="p-4 max-w-6xl mx-auto space-y-6">
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="flex flex-col gap-4">
        <ProfilInfo :user="infosUtilisateur" :is-current-user="isMyProfile" />
        <Classement :users="leaderboard" :current-username="pseudoActuel" />
      </div>

      <div class="md:col-span-2">
        <ProfilStat :user="infosUtilisateur" :badges="listeBadges" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSportStore } from "~/stores/sport"
import ProfilInfo from "~/components/custom/profilinfo.vue"
import Classement from "~/components/custom/classement.vue"
import ProfilStat from "~/components/custom/profilstat.vue"

const route = useRoute()
const store = useSportStore()

const pseudoActuel = computed(() => {
  return route.params.username || ""
})

const isMyProfile = computed(() => {
  if (!store.currentUser) return false
  return store.currentUser.toLowerCase() === pseudoActuel.value.toLowerCase()
})

const leaderboard = computed(() => {
  if (!store.users) return []

  return store.users.map(user => {
    const sessions = store.allSessions.filter(
      s => s.username === user.username
    )
    return {
      name: user.username,
      sessions: sessions.length
    }
  }).sort((a, b) => {
    return b.sessions - a.sessions
  })
})

const infosUtilisateur = computed(() => {
  const user = leaderboard.value.find(
    u => u.name.toLowerCase() === pseudoActuel.value.toLowerCase()
  )
  if (user) return user
  return {
    name: pseudoActuel.value,
    sessions: 0
  }
})

const listeBadges = computed(() => {
  const badges = [
    { name: "Débutant", req: 1, icon: "i-heroicons-sparkles" },
    { name: "Lève-tôt", req: 10, icon: "i-heroicons-sun" },
    { name: "Machine", req: 20, icon: "i-heroicons-fire" }
  ]

  return badges.map(badge => {
    return {
      ...badge,
      unlocked: infosUtilisateur.value.sessions >= badge.req
    }
  })
})
</script>
