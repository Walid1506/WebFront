<template> 
<div class="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
      <div class="relative z-10">
        <h1 class="text-3xl font-black mb-2 flex items-center gap-3"><UIcon name="i-heroicons-play-circle" class="text-green-400" />Cours vidéo en ligne</h1>
        <p class="text-slate-300 font-medium">Besoin de faire votre sport à la maison ? Nous vous proponsons des cours videos.</p>
      </div>
    </div>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <UCard v-for="vid in videos" :key="vid.id" :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' } }">
      <div class="aspect-video w-full bg-black rounded-t-lg overflow-hidden">
        <iframe :src="vid.url" class="w-full h-full" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <div class="p-4 space-y-2">
        <div class="flex justify-between items-start">
          <h3 class="font-bold text-lg text-gray-900 leading-tight">{{ vid.title }}</h3>
          <UBadge color="green" variant="soft" size="s">{{ vid.cat }}</UBadge>
        </div>
        <p class="text-sm text-gray-500">Regarde cette séance pour progresser rapidement.</p>
      </div>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
const videos = [
  { id: 1, title: 'Abdos en feu', cat: 'Muscu', url: 'https://www.youtube.com/embed/i5VA9_lnHy0' },
  { id: 2, title: 'Cardio Maison', cat: 'Cardio', url: 'https://www.youtube.com/embed/Kw8ddXj0_fE' },
  { id: 3, title: 'Yoga Matin', cat: 'Yoga', url: 'https://www.youtube.com/embed/3_rUl32CPbA' }
]
</script>
