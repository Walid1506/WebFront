<template>
  <div class="min-h-screen flex flex-col bg-white">
    
    <header class="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 h-16 shadow-md">
      <div class="container mx-auto px-4 h-full flex items-center justify-between">
        
        <div class="flex-1 flex justify-start items-center gap-2">
          <NuxtLink v-if="$route.path === '/profil'" to="/" class="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs font-bold text-gray-200 hover:bg-slate-700 transition flex items-center gap-1">
            <span>←</span> Retour
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
          <span class="text-sm font-medium text-gray-300 hidden sm:block">{{ store.currentUser || 'Invité' }}</span>
          
          <NuxtLink to="/profil" class="block rounded-full ring-2 ring-slate-700 overflow-hidden w-8 h-8 bg-slate-800 text-green-400 flex items-center justify-center font-bold hover:ring-green-500 transition cursor-pointer">
            {{ store.currentUser ? store.currentUser.charAt(0).toUpperCase() : '?' }}
          </NuxtLink>
        </div>

      </div>
    </header>

    <main class="flex-1">
      <slot />
    </main>

  </div>
</template>

<script setup>
import { useSportStore } from '~/stores/sport'
const store = useSportStore()
</script>