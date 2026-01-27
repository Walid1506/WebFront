<template>
  <div class="p-4 max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="flex flex-col gap-4">
        <ProfilInfo :user="infosUtilisateur" :is-current-user="isMyProfile" />
        <Classement :users="store.leaderboard" :current-username="pseudoActuel" />
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

const pseudoActuel = computed(() => route.params.username)

const infosUtilisateur = computed(() => {
  const user = store.leaderboard.find(u => u.name.toLowerCase() === pseudoActuel.value.toLowerCase())
  if (user) return user
  return { name: pseudoActuel.value, sessions: 0, streak: 0 }
})

const isMyProfile = computed(() => store.currentUser?.toLowerCase() === pseudoActuel.value.toLowerCase())

const listeBadges = computed(() => {
  return store.badges.map(badge => {
    let estDebloque = false
    if (isMyProfile.value && badge.unlocked) {
      estDebloque = true
    } else {
      if (badge.name === "Débutant" && infosUtilisateur.value.sessions >= 1) estDebloque = true
      if (badge.name === "Lève-tôt" && infosUtilisateur.value.sessions >= 10) estDebloque = true
      if (badge.name === "Machine" && infosUtilisateur.value.sessions >= 20) estDebloque = true
    }
    return { ...badge, unlocked: estDebloque }
  })
})
</script>
