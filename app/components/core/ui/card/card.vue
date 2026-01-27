<template>
  <div
    class="border border-gray-300 bg-white rounded-lg overflow-hidden h-full flex flex-col"
  >
    <div
      v-if="title || $slots.header"
      class="bg-gray-100 p-4 border-b border-gray-300 flex justify-between items-center"
    >
      <h2 v-if="title" class="font-bold text-lg text-black">{{ title }}</h2>
      <div v-if="$slots.actions"><slot name="actions" /></div>
    </div>
    <div class="p-4 flex-1"><slot /></div>
  </div>
</template>

<script setup>
defineProps({
  title: String,
});
</script>
