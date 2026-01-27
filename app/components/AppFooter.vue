<template>
  <nav class="md:hidden fixed bottom-0 left-0 right-0 z-50 flex justify-around p-2 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
    <NuxtLink to="/" active-class="text-green-600" class="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-green-500">
      <UIcon name="i-heroicons-calendar" class="text-2xl" />
      <span class="text-[10px] font-bold">Agenda</span>
    </NuxtLink>

    <NuxtLink to="/videos" active-class="text-green-600" class="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-green-500">
      <UIcon name="i-heroicons-play-circle" class="text-2xl" />
      <span class="text-[10px] font-bold">Vidéos</span>
    </NuxtLink>

    <NuxtLink :to="store.currentUser ? `/utilisateur/${store.currentUser}` : '/login'" active-class="text-green-600" class="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-green-500">
      <UIcon name="i-heroicons-user" class="text-2xl" />
      <span class="text-[10px] font-bold">Profil</span>
    </NuxtLink>
  </nav>
</template>

<script setup>
import { useSportStore } from '~/stores/sport'
const store = useSportStore()
</script>
