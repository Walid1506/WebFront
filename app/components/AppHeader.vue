<template>
  <header class="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 h-16 shadow-md">
    <div class="container mx-auto px-4 h-full flex items-center justify-between">
      <div class="flex-1 flex justify-start items-center gap-2">
        <NuxtLink v-if="isUserPage" to="/" class="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-sm font-bold text-gray-200 hover:bg-slate-700 transition flex items-center gap-1">
          <span>←</span><span class="hidden sm:inline text-xs">RETOUR</span>
        </NuxtLink>
        <NuxtLink v-else to="/" class="flex items-center">
          <img src="/images/logo.jpg" alt="Logo" class="h-10 w-auto rounded-md" />
        </NuxtLink>
      </div>
      <div class="flex-1 flex justify-center">
        <h1 class="font-black text-lg tracking-widest uppercase text-white">
          Fit<span class="text-green-400">Track</span>
        </h1>
      </div>
      <div class="flex-1 flex justify-end items-center gap-3">
        <div class="flex items-center gap-3">
          <span class="text-sm font-medium text-gray-300 hidden sm:block">{{ userName }}</span>
          <NuxtLink :to="profilePath" class="block rounded-full ring-2 ring-slate-700 overflow-hidden w-8 h-8 bg-slate-800 text-green-400 flex items-center justify-center font-bold hover:ring-green-500 transition">
            {{ userInitial }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </header>
</template>
<script setup>
import { useSportStore } from "~/stores/sport"

const store = useSportStore()
const route = useRoute()

const isUserPage = computed(() => route.path.includes("/utilisateur"))
const userName = computed(() => store.currentUser || "Invité")
const userInitial = computed(() => store.currentUser ? store.currentUser.charAt(0).toUpperCase() : "?")
const profilePath = computed(() => store.currentUser ? `/utilisateur/${store.currentUser}` : "/login")
</script>
