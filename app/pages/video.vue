<template>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <UCard v-for="vid in videos" :key="vid.id" :ui="{ body: { padding: 'p-0' }, header: { padding: 'p-0' } }">
      <div class="aspect-video w-full bg-black rounded-t-lg overflow-hidden">
        <iframe :src="vid.url" class="w-full h-full" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
      </div>
      <div class="p-4 space-y-2">
        <div class="flex justify-between items-start">
          <h3 class="font-bold text-lg text-gray-900 leading-tight">{{ vid.title }}</h3>
          <UBadge color="green" variant="soft" size="xs">{{ vid.cat }}</UBadge>
        </div>
        <p class="text-sm text-gray-500">Regarde cette séance pour progresser rapidement.</p>
      </div>
    </UCard>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'default' })
const videos = [
  { id: 1, title: 'Abdos en feu', cat: 'Muscu', url: 'https://www.youtube.com/embed/Snhn9wB-z1w' },
  { id: 2, title: 'Cardio Maison', cat: 'Cardio', url: 'https://www.youtube.com/embed/My9c9i_tJNs' },
  { id: 3, title: 'Yoga Matin', cat: 'Yoga', url: 'https://www.youtube.com/embed/TXU591OYOTH' }
]
</script>
