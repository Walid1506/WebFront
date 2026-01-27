<template>
  <Card title="Mon profil">
    <template #actions v-if="isCurrentUser">
      <NuxtLink to="/profil" class="flex items-center gap-1 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-blue-600 transition text-xs font-bold uppercase">
        <span>Modifier</span>
        <UIcon name="i-heroicons-pencil-square" />
      </NuxtLink>
    </template>

    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-lg uppercase shrink-0">
          {{ user.name?.charAt(0) || '?' }}
        </div>
        <div>
          <p class="font-bold text-lg capitalize text-slate-900">{{ user.name }}</p>
          
        </div>
      </div>

      <button v-if="isCurrentUser" @click="logout" class="w-full py-2 mt-2 rounded-lg border border-red-200 text-red-500 font-bold text-xs hover:bg-red-50 hover:border-red-300 transition flex justify-center items-center gap-2">
        <UIcon name="i-heroicons-arrow-left-on-rectangle" />
        Se déconnecter
      </button>
    </div>
  </Card>
</template>

<script setup>
import Card from "~/components/core/ui/card/card.vue"
import { useSportStore } from "~/stores/sport"

defineProps({
  user: Object,
  isCurrentUser: Boolean
})

const store = useSportStore()
const router = useRouter()

function logout() {
  store.currentUser = null
  router.push("/login")
}
</script>
