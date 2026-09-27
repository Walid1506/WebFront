<template>
  <section class="bg-white/[0.04] backdrop-blur-2xl rounded-[24px] border border-white/[0.08] overflow-hidden">
    <button
      type="button"
      class="w-full flex items-center gap-3 p-4 text-left"
      :aria-expanded="open"
      @click="open = !open"
    >
      <span
        v-if="icon"
        class="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
        :style="{ background: `color-mix(in srgb, ${iconColor} 14%, transparent)`, border: `1px solid color-mix(in srgb, ${iconColor} 22%, transparent)` }"
      >
        <UIcon :name="icon" class="text-lg" :style="{ color: iconColor }" />
      </span>
      <span class="flex-1 min-w-0">
        <span class="block text-white font-black leading-tight">{{ title }}</span>
        <span v-if="subtitle" class="block text-xs font-bold text-slate-500 mt-0.5 truncate">{{ subtitle }}</span>
      </span>
      <UIcon
        name="i-heroicons-chevron-down"
        class="text-slate-500 text-lg shrink-0 transition-transform duration-300"
        :class="open ? 'rotate-180' : ''"
      />
    </button>

    <!-- Hauteur animée de 0 à la taille du contenu (grille 0fr → 1fr) -->
    <div class="grid transition-[grid-template-rows] duration-300 ease-out" :style="{ gridTemplateRows: open ? '1fr' : '0fr' }">
      <div class="overflow-hidden min-h-0" :inert="open ? null : true">
        <div class="px-4 pb-4">
          <slot />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
const props = defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  icon: { type: String, default: '' },
  iconColor: { type: String, default: 'var(--accent-solid)' },
  defaultOpen: { type: Boolean, default: false }
})

const open = ref(props.defaultOpen)
</script>
