<template>
  <Card title="Mon profil">
    <template #actions>
      <NuxtLink to="/profil" class="flex items-center gap-1 p-1 rounded hover:bg-gray-200 text-gray-400 hover:text-blue-600 transition text-xs font-bold uppercase">
        <span>Modifier</span>
        <UIcon name="i-heroicons-pencil-square" />
      </NuxtLink>
    </template>

    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-lg uppercase shrink-0">
          {{ initial }}
        </div>

        <div>
          <p class="font-bold text-lg capitalize text-slate-900">
            {{ username }}
          </p>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup>
import Card from "~/components/core/ui/card/card.vue"
import { useSportStore } from "~/stores/sport"

const store = useSportStore()

const username = computed(() => {
  return store.currentUser || "Non connecté"
})

const initial = computed(() => {
  return store.currentUser ? store.currentUser.charAt(0) : "?"
})
</script>
