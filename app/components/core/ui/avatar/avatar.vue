<template>
  <div class="bg-slate-200 rounded-full flex items-center justify-center font-black text-slate-600 uppercase shrink-0 shadow-inner" :class="tailleClass">
    {{ initiale }}
  </div>
</template>

<script setup>
const props = defineProps(["name", "size"])

const tailleClass = computed(() => {
  if (props.size === "grand") return "w-32 h-32 text-5xl"
  if (props.size === "moyen") return "w-12 h-12 text-lg"
  return "w-10 h-10 text-sm"
})

const initiale = computed(() => (props.name ? props.name.charAt(0) : "?"))
</script>
