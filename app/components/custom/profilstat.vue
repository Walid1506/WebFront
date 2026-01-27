<template>
  <div class="border border-gray-300 bg-white rounded-lg overflow-hidden h-fit">
    <div class="h-32 bg-slate-800 flex items-center justify-center">
      <h1 class="text-white text-3xl font-bold uppercase">{{ user.name }}</h1>
    </div>

    <div class="p-6 text-center">
      <div class="-mt-12 mb-4">
        <div class="inline-flex items-center justify-center w-24 h-24 bg-white rounded-full border-4 border-white shadow-md text-3xl font-bold text-slate-800 uppercase">
          {{ user.name?.charAt(0) }}
        </div>
      </div>

      <p class="text-gray-500 font-bold mb-6">Membre FitTrack</p>

      <div class="flex justify-center gap-4 mb-8">
        <div class="border border-gray-200 p-4 rounded-lg w-40">
          <span class="block text-3xl font-bold text-slate-800">{{ user.sessions }}</span>
          <span class="text-xs uppercase text-gray-500">Séances</span>
        </div>
        <div class="border border-gray-200 p-4 rounded-lg w-40">
          <span class="block text-3xl font-bold text-orange-500">{{ user.streak }}</span>
          <span class="text-xs uppercase text-gray-500">Jours suite</span>
        </div>
      </div>

      <div class="text-left border-t border-gray-200 pt-6">
        <h3 class="font-bold text-lg mb-4">Badges</h3>
        <div class="grid grid-cols-3 gap-4">
          <div v-for="badge in badges" :key="badge.id" class="border rounded p-3 flex flex-col items-center text-center" :class="badge.unlocked ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'">
            <span class="text-2xl mb-1">{{ badge.unlocked ? '🏆' : '🔒' }}</span>
            <span class="text-sm font-bold">{{ badge.name }}</span>
            <span class="text-xs mt-1" :class="badge.unlocked ? 'text-green-600' : 'text-gray-400'">{{ badge.unlocked ? 'Obtenu' : 'Bloqué' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  user: Object,
  badges: Array
})
</script>
