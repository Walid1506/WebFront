<script setup>
definePageMeta({ layout: 'default' })

const videos = [
  { id: 1, title: 'Abdos en feu', cat: 'Muscu', url: 'https://www.youtube.com/embed/AnYl6HzRZvs' },
  { id: 2, title: 'Cardio Maison', cat: 'Cardio', url: 'https://www.youtube.com/embed/My9c9i_tJNs' },
  { id: 3, title: 'Yoga Matin', cat: 'Yoga', url: 'https://www.youtube.com/embed/TXU591OYOTH' }
]

const selectedVideo = ref(null)
const isOpen = ref(false)

const openVideo = (vid) => {
  selectedVideo.value = vid
  isOpen.value = true
}
</script>

<template>
  <div>
    <h1 class="text-2xl font-bold mb-6">Cours Vidéo</h1>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <UCard v-for="vid in videos" :key="vid.id" class="cursor-pointer hover:ring-2 hover:ring-primary-500 transition" :ui="{ body: { padding: 'p-0' } }" @click="openVideo(vid)">
        <div class="h-40 bg-gray-200 flex items-center justify-center rounded-t-lg">
          <UIcon name="i-heroicons-play-circle" class="text-5xl text-gray-400" />
        </div>
        <div class="p-4">
          <h3 class="font-bold">{{ vid.title }}</h3>
          <UBadge color="gray" variant="soft" size="xs">{{ vid.cat }}</UBadge>
        </div>
      </UCard>
    </div>

    <UModal v-model="isOpen" :ui="{ width: 'w-full sm:max-w-4xl' }">
      <div class="aspect-video w-full bg-black">
        <iframe v-if="selectedVideo" :src="selectedVideo.url" class="w-full h-full" allowfullscreen frameborder="0"></iframe>
      </div>
    </UModal>
  </div>
</template>
