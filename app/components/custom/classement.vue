<template>
  <div class="border border-gray-300 bg-white rounded-lg overflow-hidden flex flex-col h-[500px]">
    <div class="bg-gray-100 p-4 border-b border-gray-300">
      <h2 class="font-bold text-lg text-black">Classement</h2>
    </div>

    <div class="overflow-y-auto p-2 flex-1">
      <div v-for="(u, index) in users" :key="u.name" class="mb-2">
        <NuxtLink :to="'/utilisateur/' + u.name" class="flex items-center p-2 rounded hover:bg-gray-100 border border-transparent hover:border-gray-200" :class="currentUsername?.toLowerCase() === u.name.toLowerCase() ? 'bg-blue-50 border-blue-200' : ''">
          <span class="font-bold mr-3 text-gray-500">#{{ index + 1 }}</span>
          <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3 text-sm font-bold capitalize">{{ u.name.charAt(0) }}</div>
          <div>
            <p class="font-bold text-sm capitalize">{{ u.name }}</p>
            <p class="text-xs text-gray-500">{{ u.sessions }} séances</p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  users: Array,
  currentUsername: String
})
</script>
