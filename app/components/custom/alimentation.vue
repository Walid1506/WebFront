<template>
  <div class="w-full max-w-7xl mx-auto space-y-6 pb-20 pt-4 px-4 min-h-screen text-white font-sans">
    <Transition name="slide" mode="out-in">
      <div v-if="currentScreen === 'main'" key="main" class="flex flex-col gap-6">
        <div class="backdrop-blur-xl sticky top-0 z-40 py-4 border-b border-white/[0.06] space-y-4">
          <div class="flex justify-between items-center">
            <h1 class="text-4xl font-[1000] tracking-tighter text-white">Nutrition</h1>
            <div class="flex gap-4">
              <button
                @click="openCamera"
                class="w-12 h-12 rounded-2xl flex items-center justify-center hover:opacity-90 transition-colors group" style="background: color-mix(in srgb, var(--accent-solid) 15%, transparent); border: 1px solid color-mix(in srgb, var(--accent-solid) 30%, transparent)"
                title="Analyser un plat avec l'IA"
              >
                <UIcon name="i-heroicons-sparkles" class="text-2xl group-hover:text-white transition-colors" style="color: var(--accent-solid)" />
              </button>

              <button
                @click="openScanner"
                class="w-12 h-12 bg-white/[0.08] rounded-2xl flex items-center justify-center hover:bg-white/[0.12] transition-colors border border-white/[0.08] group"
              >
                <UIcon name="i-heroicons-qr-code" class="text-2xl text-slate-400 group-hover:text-white" />
              </button>

              <button
                @click="currentScreen = 'cart'"
                class="w-12 h-12 bg-white/[0.08] rounded-2xl flex items-center justify-center hover:bg-white/[0.12] transition-colors border border-white/[0.08] relative group"
              >
                <UIcon name="i-heroicons-shopping-cart" class="text-2xl text-slate-400 group-hover:text-white" />
                <span
                  v-if="shoppingList.length > 0"
                  class="absolute -top-2 -right-2 bg-blue-500 text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg"
                >
                  {{ shoppingList.length }}
                </span>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between bg-white/[0.06] p-2 rounded-2xl border border-white/[0.08] w-full max-w-md mx-auto">
            <button @click="changeDay(-1)" class="p-3 bg-white/[0.08] rounded-xl hover:bg-white/[0.14] transition">
              <UIcon name="i-heroicons-chevron-left" class="text-white" />
            </button>

            <div class="text-center">
              <p class="font-[1000] text-lg text-white" :class="isToday ? 'text-blue-500' : ''">
                {{ isToday ? "Aujourd'hui" : formattedSelectedDate }}
              </p>
            </div>

            <button
              @click="changeDay(1)"
              :disabled="isToday"
              class="p-3 bg-white/[0.08] rounded-xl transition"
              :class="isToday ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/[0.14]'"
            >
              <UIcon name="i-heroicons-chevron-right" class="text-white" />
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-5 space-y-8">
            <div class="bg-white/[0.04] backdrop-blur-2xl rounded-[35px] p-6 border border-white/[0.08] shadow-2xl relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--accent-from)] via-[var(--accent-to)] to-[var(--accent-from)]"></div>

              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-[1000] text-white flex items-center gap-2">
                  <UIcon name="i-heroicons-adjustments-horizontal" class="text-blue-500" />
                  Profil & Métabolisme
                </h2>

                <div class="flex items-center gap-2">
                  <Transition name="fade-quick">
                    <span v-if="savedIndicator" class="text-emerald-400 text-xs font-black flex items-center gap-1">
                      <UIcon name="i-heroicons-check-circle" class="text-sm" /> Sauvegardé
                    </span>
                  </Transition>
                  <button
                    @click="isSettingsOpen = !isSettingsOpen"
                    class="text-slate-400 hover:text-white text-sm font-bold bg-slate-900 px-3 py-1 rounded-full border border-white/5"
                  >
                    {{ isSettingsOpen ? 'Masquer' : 'Modifier' }}
                  </button>
                </div>
              </div>

              <div v-if="isSettingsOpen" class="grid grid-cols-2 gap-4 mb-6 animate-in fade-in zoom-in-95">
                <div class="bg-slate-900 rounded-2xl p-3 border border-white/5">
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Poids (kg)</label>
                  <input v-model.number="profil.poids"  type="number" class="w-full bg-transparent text-white font-bold text-lg outline-none" />
                </div>

                <div class="bg-slate-900 rounded-2xl p-3 border border-white/5">
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Taille (cm)</label>
                  <input v-model.number="profil.taille"  type="number" class="w-full bg-transparent text-white font-bold text-lg outline-none" />
                </div>

                <div class="bg-slate-900 rounded-2xl p-3 border border-white/5">
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Âge</label>
                  <input v-model.number="profil.age"  type="number" class="w-full bg-transparent text-white font-bold text-lg outline-none" />
                </div>

                <div class="bg-slate-900 rounded-2xl p-3 border border-white/5">
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Genre</label>
                  <select v-model="profil.genre"  class="w-full bg-transparent text-white font-bold outline-none text-sm appearance-none">
                    <option value="homme" class="bg-slate-900">Homme</option>
                    <option value="femme" class="bg-slate-900">Femme</option>
                  </select>
                </div>

                <div class="bg-slate-900 rounded-2xl p-3 border border-white/5">
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Activité</label>
                  <select v-model.number="profil.activite"  class="w-full bg-transparent text-white font-bold outline-none text-[13px] appearance-none">
                    <option :value="1.2">Sédentaire</option>
                    <option :value="1.375">Léger (1-3x)</option>
                    <option :value="1.55">Modéré (3-5x)</option>
                    <option :value="1.725">Intense (6-7x)</option>
                  </select>
                </div>

                <div class="bg-slate-900 rounded-2xl p-3 border border-white/5">
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Objectif</label>
                  <select v-model="profil.objectif"  class="w-full bg-transparent text-white font-bold outline-none text-sm appearance-none">
                    <option value="seche">Sèche</option>
                    <option value="maintien">Maintien</option>
                    <option value="masse">Prise de masse</option>
                  </select>
                </div>
              </div>

              <div class="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
                <div>
                  <p class="text-[10px] font-black text-blue-400 uppercase tracking-widest">Ton IMC</p>
                  <p class="font-[1000] text-2xl" :class="imcColor">{{ imc }}</p>
                  <p class="text-[10px] font-black uppercase tracking-widest mt-0.5" :class="imcColor">{{ imcLabel }}</p>
                </div>

                <div class="text-right">
                  <p class="text-[10px] font-black text-blue-400 uppercase tracking-widest">Cible Journalière</p>
                  <p class="text-white font-[1000] text-2xl">{{ activeBesoins.kcal }} <span class="text-sm font-bold text-slate-400">kcal</span></p>
                </div>
              </div>

              <!-- Suivi du poids -->
              <div class="mt-6">
                <Dashboard />
              </div>
            </div>

            <div class="bg-[#111111] rounded-[35px] p-6 border border-white/5">
              <h2 class="text-lg font-black text-white mb-8">Objectifs du jour</h2>

              <div class="flex justify-around items-end">
                <div class="relative w-40 h-40 flex items-center justify-center">
                  <svg viewBox="0 0 36 36" class="absolute inset-0 w-full h-full -rotate-90">
                    <path class="text-slate-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path class="text-[#FF2A5F] transition-all duration-1000" :stroke-dasharray="`${progressKcal}, 100`" stroke-width="3" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>

                  <div class="text-center z-10">
                    <p class="text-white font-[1000] text-2xl leading-none">{{ total.kcal }}</p>
                    <p class="text-slate-400 text-xs font-bold mt-1">sur {{ activeBesoins.kcal }}</p>
                  </div>
                </div>

                <div class="flex flex-col items-center">
                  <div class="relative w-40 h-40 flex items-center justify-center mb-4">
                    <svg viewBox="0 0 36 36" class="absolute inset-0 w-full h-full -rotate-90">
                      <path class="text-slate-800" stroke-width="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                      <path class="text-[#00A3FF] transition-all duration-500" :stroke-dasharray="`${progressEau}, 100`" stroke-width="3" stroke-linecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    </svg>
                    <div class="text-center z-10">
                      <p class="text-white font-[1000] text-2xl leading-none">{{ eau.toFixed(1) }} <span class="text-sm">L</span></p>
                    </div>
                  </div>
                  <div class="flex items-center gap-4 bg-slate-900 rounded-full p-2 border border-white/5">
                    <button @click="addWater(-0.1)" class="w-8 h-8 rounded-full bg-slate-800 text-white font-black">-</button>
                    <UIcon name="i-heroicons-beaker" class="text-blue-500" />
                    <button @click="addWater(0.1)" class="w-8 h-8 rounded-full bg-slate-800 text-white font-black">+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-7 space-y-8">
            <button
              @click="currentScreen = 'library'"
              class="w-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black text-xl py-6 rounded-[30px] shadow-lg shadow-[color:var(--accent-solid)]/20 transition-all active:scale-95 flex items-center justify-center gap-3"
            >
              <UIcon name="i-heroicons-plus-circle" class="text-3xl" />
              Ajouter un aliment
            </button>

            <div class="bg-[#111111] p-8 rounded-[35px] border border-white/5 space-y-6">
              <div
                v-for="macro in [['Glucides', total.carbs, activeBesoins.carbs, '#FF9500', progressCarbs], ['Protéines', total.prot, activeBesoins.prot, '#2F6BFF', progressProt], ['Lipides', total.fats, activeBesoins.fats, '#9DFF00', progressFats]]"
                :key="macro[0]"
              >
                <div class="flex justify-between items-end mb-2">
                  <span class="text-white font-black text-base">{{ macro[0] }}</span>
                  <span class="text-white font-bold text-base">{{ macro[1] }} g</span>
                </div>

                <div class="h-3 w-full bg-slate-800 rounded-full overflow-hidden">
                  <div class="h-full transition-all duration-1000" :style="`width: ${macro[4]}%; background-color: ${macro[3]}`"></div>
                </div>

                <p class="text-slate-500 text-xs font-bold mt-2">Objectif: {{ macro[2] }} g</p>
              </div>
            </div>

            <div class="bg-[#111111] rounded-[35px] border border-white/5 overflow-hidden">
              <div class="flex items-center justify-between p-6 bg-white/5">
                <h3 class="text-white font-bold text-xl flex items-center gap-3">
                  <UIcon name="i-heroicons-shopping-bag" />
                  Journal
                </h3>
                <span class="bg-slate-800 px-4 py-1.5 rounded-full text-sm font-black">{{ consumed.length }}</span>
              </div>

              <div class="p-4 space-y-2">
                <div v-if="consumed.length === 0" class="text-center text-slate-500 font-bold py-10">
                  Journal vide pour ce jour.
                </div>

                <div
                  v-for="(item, index) in consumed"
                  :key="index"
                  class="flex justify-between items-center group p-4 rounded-2xl hover:bg-slate-900 border border-transparent hover:border-white/5 transition-all"
                >
                  <div class="flex items-center gap-4 text-left">
                    <img :src="item.img" class="w-14 h-14 rounded-xl object-cover bg-white shrink-0" @error="onImageError" />
                    <div>
                      <p class="text-white font-bold text-lg leading-tight">{{ item.name }}</p>
                      <p class="text-[#2F6BFF] font-black text-xs mt-1">{{ item.amount }} g • {{ item.kcal }} kcal</p>
                    </div>
                  </div>

                  <button
                    @click="removeItem(index)"
                    class="text-red-400 hover:text-white p-3 bg-red-500/10 hover:bg-red-500 rounded-xl transition-all shrink-0"
                  >
                    <UIcon name="i-heroicons-trash" class="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div v-else-if="currentScreen === 'library'" key="library" class="fixed inset-0 z-[100] backdrop-blur-2xl">
        <div class="w-full max-w-7xl mx-auto flex flex-col h-full">
          <div class="sticky top-0 z-30 backdrop-blur-2xl px-4 sm:px-8 pt-4 sm:pt-8 pb-4 border-b border-white/10">
            <div class="flex items-center justify-between mb-4 gap-4">
              <button @click="currentScreen = 'main'" class="flex items-center gap-2 text-slate-400 hover:text-white transition shrink-0">
                <UIcon name="i-heroicons-arrow-left" class="text-3xl" />
              </button>

              <div class="relative w-full max-w-2xl">
                <UIcon name="i-heroicons-magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-2xl" />
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="Rechercher un aliment..."
                  class="w-full bg-[#1A1A1A] text-white font-bold text-lg rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-[color:var(--accent-solid)] transition-all"
                />
              </div>
            </div>

            <div class="overflow-x-auto no-scrollbar">
              <div class="flex gap-3 min-w-max pb-1">
                <button
                  v-for="cat in allCatFilters"
                  :key="cat"
                  @click="activeCatFilter = cat"
                  :class="activeCatFilter === cat ? 'text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'"
                  :style="activeCatFilter === cat ? { background: 'linear-gradient(to right, var(--accent-from), var(--accent-to))' } : {}"
                  class="px-6 py-3 rounded-full font-black text-sm uppercase whitespace-nowrap transition-colors shrink-0"
                >
                  {{ cat }}
                </button>
              </div>
            </div>
          </div>

          <div class="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              <div
                v-for="food in filteredDb"
                :key="food.id"
                @click="selectFood(food)"
                class="bg-[#111111] p-5 rounded-[30px] flex flex-col cursor-pointer border border-white/5 hover:border-white/15 transition-all group"
              >
                <div class="flex items-start gap-4 mb-4">
                  <img :src="food.img" class="w-20 h-20 rounded-2xl object-cover bg-white shrink-0" @error="onImageError" />
                  <div class="flex-1 min-w-0 text-left">
                    <h4 class="food-name text-white font-black text-lg leading-tight transition-colors">{{ food.name }}</h4>
                    <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">{{ food.cat }}</p>
                  </div>
                </div>

                <div class="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div class="flex gap-3 text-xs font-black">
                    <span class="text-blue-500">P:{{ food.p }}</span>
                    <span class="text-orange-500">G:{{ food.c }}</span>
                    <span class="text-[#9DFF00]">L:{{ food.f }}</span>
                  </div>
                  <span class="text-white font-black text-sm bg-white/10 px-3 py-1 rounded-lg">{{ food.k }} kcal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="currentScreen === 'quantity' && selectedFood" key="quantity" class="fixed inset-0 z-[120] backdrop-blur-2xl flex flex-col items-center justify-center p-6">
        <button @click="goBackFromQuantity" class="absolute top-8 left-8 text-slate-400 hover:text-white transition">
          <UIcon name="i-heroicons-arrow-left" class="text-4xl" />
        </button>

        <img :src="selectedFood.img" class="w-48 h-48 rounded-full object-cover mb-8 shadow-2xl" style="border: 4px solid var(--accent-solid)" @error="onImageError" />
        <h3 class="text-4xl font-[1000] text-white mb-8 text-center">{{ selectedFood.name }}</h3>

        <div class="bg-[#111111] border border-white/10 p-8 rounded-[40px] mb-8 w-full max-w-md text-center">
          <input
            v-model.number="amount"
            type="number"
            class="bg-transparent text-white font-[1000] text-7xl text-center w-full outline-none mb-4"
            placeholder="0"
          />
          <p class="text-blue-500 font-black">Grammes</p>

          <div class="flex justify-between border-t border-white/5 mt-6 pt-6 text-center">
            <div>
              <p class="text-slate-500 text-[10px] font-black uppercase">Calories</p>
              <p class="text-white font-bold text-xl">{{ calculatedMacros.kcal }}</p>
            </div>
            <div>
              <p class="text-blue-500 text-[10px] font-black uppercase">Prot</p>
              <p class="text-white font-bold text-xl">{{ calculatedMacros.prot }}g</p>
            </div>
            <div>
              <p class="text-orange-500 text-[10px] font-black uppercase">Gluc</p>
              <p class="text-white font-bold text-xl">{{ calculatedMacros.carbs }}g</p>
            </div>
          </div>
        </div>

        <button @click="addFood" class="w-full max-w-md bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black text-2xl py-6 rounded-[30px] shadow-lg shadow-[color:var(--accent-solid)]/20 transition-all active:scale-95">
          Ajouter au journal
        </button>
      </div>

      <div v-else-if="currentScreen === 'scanner'" key="scanner" class="fixed inset-0 z-[110] backdrop-blur-2xl flex flex-col items-center justify-center p-6">
        <button @click="closeScanner" class="absolute top-8 left-8 text-slate-400 bg-slate-900 p-4 rounded-full">
          <UIcon name="i-heroicons-x-mark" class="text-2xl" />
        </button>

        <div class="w-full max-w-md flex flex-col items-center">
          <div id="reader" class="w-full h-64 rounded-[40px] relative overflow-hidden bg-slate-900/50 mb-6" style="border: 4px solid var(--accent-solid)"></div>

          <div class="w-full space-y-3 mb-6">
            <button
              @click="manualInputOpen = !manualInputOpen"
              class="w-full bg-slate-900 border border-white/10 text-white font-black py-3 rounded-2xl"
            >
              {{ manualInputOpen ? 'Masquer la saisie manuelle' : 'Saisir le code-barres à la main' }}
            </button>

            <div v-if="manualInputOpen" class="space-y-3">
              <input
                v-model="manualBarcode"
                type="text"
                inputmode="numeric"
                placeholder="Ex: 3017620422003"
                class="w-full bg-[#111111] border border-white/10 rounded-2xl px-4 py-3 text-white font-bold outline-none"
              />
              <button
                @click="submitManualBarcode"
                class="w-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black py-3 rounded-2xl active:scale-95 transition-all"
              >
                Rechercher ce code
              </button>
            </div>
          </div>

          <div
            v-if="scanResult"
            @click="addScannedFood"
            class="p-6 rounded-[30px] w-full border-2 cursor-pointer animate-in slide-in-from-bottom-10 bg-green-500/10 border-green-500 text-green-400"
          >
            <h4 class="font-[1000] text-2xl text-white">{{ scanResult.nom }}</h4>
            <p class="text-sm font-bold">{{ scanResult.message }}</p>
            <p class="mt-2 text-[10px] uppercase font-black text-white/50">Clique pour définir la quantité</p>
          </div>

          <p v-else-if="scanError" class="text-red-400 font-bold text-center max-w-md">
            {{ scanError }}
          </p>

          <p v-else class="text-slate-500 font-bold text-center">
            Place le code-barres devant la caméra
          </p>
        </div>
      </div>

      <!-- ── ÉCRAN ANALYSE IA ── -->
      <div v-else-if="currentScreen === 'camera'" key="camera" class="fixed inset-0 z-[110] bg-black flex flex-col">
        <div class="flex items-center gap-4 px-6 py-5 border-b border-white/10 backdrop-blur-2xl">
          <button @click="currentScreen = 'main'" class="text-slate-400 hover:text-white transition">
            <UIcon name="i-heroicons-arrow-left" class="text-3xl" />
          </button>
          <div>
            <h2 class="text-2xl font-black leading-none">Analyse IA</h2>
            <p class="text-slate-500 text-xs font-bold mt-0.5">Photo → macros estimés</p>
          </div>
          <div class="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full" style="background: color-mix(in srgb, var(--accent-solid) 10%, transparent); border: 1px solid color-mix(in srgb, var(--accent-solid) 30%, transparent)">
            <div class="w-2 h-2 rounded-full animate-pulse" style="background: var(--accent-solid)"></div>
            <span class="text-xs font-black uppercase tracking-widest" style="color: var(--accent-solid)">IA</span>
          </div>
        </div>

        <div class="flex-1 overflow-y-auto flex flex-col items-center p-6 gap-6 max-w-xl w-full mx-auto">
          <!-- Zone d'upload -->
          <div
            v-if="!aiImage"
            @click="triggerFileInput"
            class="upload-zone w-full aspect-square max-h-80 rounded-[40px] border-2 border-dashed border-white/15 flex flex-col items-center justify-center gap-5 cursor-pointer transition-all"
          >
            <UIcon name="i-heroicons-camera" class="text-6xl text-slate-700" />
            <div class="text-center">
              <p class="text-white font-bold">Prends une photo de ton plat</p>
              <p class="text-slate-600 text-sm mt-1">ou sélectionne depuis ta galerie</p>
            </div>
            <span class="text-white font-black px-8 py-3 rounded-2xl transition-colors" style="background: linear-gradient(to right, var(--accent-from), var(--accent-to))">
              Choisir une photo
            </span>
          </div>

          <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handleImageSelect" />

          <!-- Aperçu image -->
          <div v-if="aiImage" class="w-full">
            <div class="relative rounded-[30px] overflow-hidden bg-slate-900">
              <img :src="aiImage" class="w-full max-h-72 object-cover" />
              <button
                @click="clearAiState"
                class="absolute top-3 right-3 bg-black/70 backdrop-blur-sm p-2 rounded-full text-white hover:bg-black transition"
              >
                <UIcon name="i-heroicons-x-mark" class="text-lg" />
              </button>
            </div>

            <!-- Bouton analyser -->
            <button
              v-if="!aiResult && !aiLoading"
              @click="analyzeImage"
              class="w-full mt-4 bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black text-xl py-5 rounded-[25px] shadow-xl shadow-[color:var(--accent-solid)]/20 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-3"
            >
              <UIcon name="i-heroicons-sparkles" class="text-2xl" />
              Analyser avec l'IA
            </button>
          </div>

          <!-- Loading -->
          <div v-if="aiLoading" class="flex flex-col items-center gap-4 py-8">
            <div class="w-16 h-16 rounded-full border-4 border-purple-500/30 border-t-purple-500 animate-spin"></div>
            <p class="text-white font-bold">Analyse de ton plat en cours...</p>
            <p class="text-slate-500 text-sm">estimation des macros en cours</p>
          </div>

          <!-- Résultats IA -->
          <div v-if="aiResult && !aiLoading" class="w-full space-y-4">
            <div class="flex justify-between items-start gap-3">
              <h3 class="text-2xl font-black text-white leading-tight flex-1">{{ aiResult.name }}</h3>
              <span
                class="shrink-0 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest"
                :class="{
                  'bg-green-500/20 text-green-400 border border-green-500/30': aiResult.confidence === 'haute',
                  'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30': aiResult.confidence === 'moyenne',
                  'bg-red-500/20 text-red-400 border border-red-500/30': aiResult.confidence === 'basse'
                }"
              >
                {{ aiResult.confidence === 'haute' ? 'Fiable' : aiResult.confidence === 'moyenne' ? 'Approximatif' : 'Incertain' }}
              </span>
            </div>

            <!-- Macros -->
            <div class="bg-[#111] rounded-[28px] p-6 border border-white/10 grid grid-cols-4 gap-3 text-center">
              <div>
                <p class="text-[#FF2A5F] font-[1000] text-2xl leading-none">{{ aiResult.calories }}</p>
                <p class="text-slate-500 text-[10px] font-black uppercase mt-1">kcal</p>
              </div>
              <div>
                <p class="text-[#2F6BFF] font-[1000] text-2xl leading-none">{{ aiResult.proteins }}g</p>
                <p class="text-slate-500 text-[10px] font-black uppercase mt-1">prot</p>
              </div>
              <div>
                <p class="text-orange-400 font-[1000] text-2xl leading-none">{{ aiResult.carbs }}g</p>
                <p class="text-slate-500 text-[10px] font-black uppercase mt-1">gluc</p>
              </div>
              <div>
                <p class="text-[#9DFF00] font-[1000] text-2xl leading-none">{{ aiResult.fats }}g</p>
                <p class="text-slate-500 text-[10px] font-black uppercase mt-1">lip</p>
              </div>
            </div>

            <p class="text-slate-500 text-sm text-center">Portion estimée : ~{{ aiResult.portion }}g • tu peux ajuster</p>

            <button
              @click="addAiResult"
              class="w-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black text-xl py-5 rounded-[25px] shadow-lg shadow-[color:var(--accent-solid)]/20 active:scale-95 transition-all"
            >
              Ajouter au journal
            </button>

            <button @click="clearAiState" class="w-full text-slate-500 font-bold py-2 hover:text-slate-300 transition">
              Analyser une autre photo
            </button>
          </div>

          <!-- Erreur -->
          <div v-if="aiError" class="w-full bg-red-500/10 border border-red-500/30 rounded-[25px] p-6 text-center">
            <UIcon name="i-heroicons-exclamation-triangle" class="text-3xl text-red-400 mb-3" />
            <p class="text-red-400 font-bold">{{ aiError }}</p>
            <button @click="aiError = null" class="text-slate-400 text-sm mt-3 hover:text-white transition">Réessayer</button>
          </div>
        </div>
      </div>

      <div v-else-if="currentScreen === 'cart'" key="cart" class="fixed inset-0 z-[110] backdrop-blur-2xl flex flex-col items-center p-2 sm:p-6">
        <div class="w-full max-w-3xl bg-[#111111] rounded-[28px] sm:rounded-[40px] border border-white/10 flex flex-col h-full overflow-hidden">
          <div class="px-4 py-4 sm:p-8 flex justify-between items-center border-b border-white/5 bg-black/50">
            <div class="flex items-center gap-3 sm:gap-6">
              <button @click="currentScreen = 'main'" class="text-slate-400 hover:text-white transition p-1">
                <UIcon name="i-heroicons-arrow-left" class="text-2xl sm:text-3xl" />
              </button>
              <h2 class="text-2xl sm:text-3xl font-[1000] text-white">Courses</h2>
            </div>
            <button v-if="shoppingList.length > 0" @click="clearCart" class="text-red-500 font-bold bg-red-500/10 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-sm sm:text-base">
              Vider tout
            </button>
          </div>

          <div class="px-3 py-3 sm:p-8 flex gap-2 sm:gap-4 border-b border-white/5">
            <input
              v-model="newCartItem"
              @keyup.enter="addCustomCartItem"
              type="text"
              placeholder="Ajouter produit..."
              class="flex-1 bg-slate-900 border border-white/10 text-white font-bold py-3 px-4 sm:py-4 sm:px-6 rounded-2xl outline-none focus:border-[color:var(--accent-solid)] text-sm sm:text-base"
            />
            <button @click="addCustomCartItem" class="bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black px-4 sm:px-8 rounded-2xl active:scale-95 transition-all text-sm sm:text-base whitespace-nowrap">Ajouter</button>
          </div>

          <div class="flex-1 overflow-y-auto p-3 sm:p-8 space-y-2 sm:space-y-3 custom-scrollbar">
            <div
              v-for="(item, index) in shoppingList"
              :key="index"
              class="flex justify-between items-center p-3 sm:p-5 bg-[#0a0a0a] rounded-2xl sm:rounded-3xl border border-white/5"
              :class="item.checked ? 'opacity-40' : ''"
            >
              <div class="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <button
                  @click="toggleCheck(index)"
                  class="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center shrink-0"
                  :class="item.checked ? 'bg-green-500 border-green-500 text-black' : 'border-slate-600'"
                >
                  <UIcon v-if="item.checked" name="i-heroicons-check" class="font-black text-sm" />
                </button>
                <h4 class="font-black text-base sm:text-xl flex-1 truncate" :class="item.checked ? 'line-through' : ''">
                  {{ item.name }}
                </h4>
              </div>
              <button @click="removeCartItem(index)" class="text-red-500/50 hover:text-red-500 ml-2 sm:ml-4 shrink-0">
                <UIcon name="i-heroicons-trash" class="text-xl sm:text-2xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { foodLibrary } from '~/data/foodLibrary'
import Dashboard from '~/components/custom/dashboard.vue'
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode'

const supabase = useSupabaseClient()

const currentScreen = ref('main')
const isSettingsOpen = ref(true)
const savedIndicator = ref(false)
const selectedDateObj = ref(new Date())
const searchQuery = ref('')
const activeCatFilter = ref('Tout')
const catFilters = ['Tout', 'Protéines', 'Glucides', 'Lipides', 'Fruits & Légumes', 'Snacks', 'Boissons']
const selectedFood = ref(null)
const amount = ref(100)
const eau = ref(0)
const shoppingList = ref([])
const consumed = ref([])
const frozenBesoins = ref(null)
const newCartItem = ref('')
const scanResult = ref(null)
const scanError = ref('')
const manualInputOpen = ref(false)
const manualBarcode = ref('')
const lastScreenBeforeQuantity = ref('main')
const sharedFoods = ref([])

// IA analyse photo
const fileInputRef = ref(null)
const aiImage = ref(null)
const aiImageBase64 = ref(null)
const aiImageMime = ref('image/jpeg')
const aiResult = ref(null)
const aiLoading = ref(false)
const aiError = ref(null)

const profil = reactive({
  poids: 75,
  taille: 180,
  age: 25,
  genre: 'homme',
  activite: 1.55,
  objectif: 'masse'
})

let html5QrcodeScanner = null
let saveTimer = null

// Auto-save avec debounce 800ms quand le profil change
watch(profil, () => {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(async () => {
    await saveGlobals()
    savedIndicator.value = true
    setTimeout(() => { savedIndicator.value = false }, 2000)
  }, 800)
}, { deep: true })

const selectedDateStr = computed(() => {
  const d = selectedDateObj.value
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
})

const isToday = computed(() => selectedDateStr.value === new Date().toISOString().split('T')[0])

const formattedSelectedDate = computed(() =>
  selectedDateObj.value.toLocaleDateString('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'long'
  })
)

const allCatFilters = computed(() => {
  const sharedCats = sharedFoods.value.map(f => f.cat).filter(Boolean)
  return [...new Set([...catFilters, ...sharedCats])]
})

const mergedFoodLibrary = computed(() => {
  const base = [...foodLibrary]
  const existingNames = new Set(base.map(f => String(f.name).toLowerCase().trim()))

  const extras = sharedFoods.value.filter(f => !existingNames.has(String(f.name).toLowerCase().trim()))
  return [...extras, ...base]
})

onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const { data: globals } = await supabase
    .from('nutrition_globals')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle()

  if (globals) {
    if (globals.profil) Object.assign(profil, globals.profil)
    if (globals.shopping_list) shoppingList.value = globals.shopping_list
  }

  await Promise.all([fetchDaily(), fetchSharedFoods()])
})

onBeforeUnmount(async () => {
  await stopScanner()
})

async function fetchSharedFoods() {
  const { data, error } = await supabase
    .from('food_library_shared')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Erreur fetchSharedFoods:', error)
    return
  }

  sharedFoods.value = (data || []).map(item => ({
    id: item.id,
    barcode: item.barcode,
    name: item.name,
    img: item.img || 'https://placehold.co/600x600/1e293b/94a3b8?text=Aliment',
    k: Number(item.k || 0),
    p: Number(item.p || 0),
    c: Number(item.c || 0),
    f: Number(item.f || 0),
    cat: item.cat || 'Scannés'
  }))
}

async function saveScannedFoodToSharedLibrary(barcode, food) {
  const payload = {
    barcode,
    name: food.name,
    img: food.img,
    k: Number(food.k || 0),
    p: Number(food.p || 0),
    c: Number(food.c || 0),
    f: Number(food.f || 0),
    cat: 'Scannés'
  }

  const { error } = await supabase
    .from('food_library_shared')
    .upsert(payload, { onConflict: 'barcode' })

  if (error) {
    console.error('Erreur saveScannedFoodToSharedLibrary:', error)
    return
  }

  await fetchSharedFoods()
}

async function fetchDaily() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  consumed.value = []
  eau.value = 0
  frozenBesoins.value = null

  const { data: dailyList } = await supabase
    .from('nutrition_daily')
    .select('*')
    .eq('user_id', user.id)
    .eq('date', selectedDateStr.value)
    .limit(1)

  if (dailyList?.length > 0) {
    const d = dailyList[0]
    eau.value = Number(d.eau) || 0
    consumed.value = d.repas || []
    frozenBesoins.value = d.cibles || null
  }
}

async function saveGlobals() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const payload = {
    user_id: user.id,
    profil: JSON.parse(JSON.stringify(profil)),
    shopping_list: JSON.parse(JSON.stringify(shoppingList.value))
  }

  const { data: exists } = await supabase
    .from('nutrition_globals')
    .select('id')
    .eq('user_id', user.id)
    .maybeSingle()

  if (exists) await supabase.from('nutrition_globals').update(payload).eq('id', exists.id)
  else await supabase.from('nutrition_globals').insert(payload)
}

async function saveDaily() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  const payload = {
    eau: Number(eau.value),
    repas: JSON.parse(JSON.stringify(consumed.value)),
    cibles: JSON.parse(JSON.stringify(liveBesoins.value))
  }

  const { data: exists } = await supabase
    .from('nutrition_daily')
    .select('id')
    .eq('user_id', user.id)
    .eq('date', selectedDateStr.value)
    .limit(1)

  if (exists?.length > 0) {
    await supabase.from('nutrition_daily').update(payload).eq('id', exists[0].id)
  } else {
    await supabase.from('nutrition_daily').insert({
      user_id: user.id,
      date: selectedDateStr.value,
      ...payload
    })
  }

  frozenBesoins.value = liveBesoins.value
}

async function openScanner() {
  currentScreen.value = 'scanner'
  scanResult.value = null
  scanError.value = ''
  manualInputOpen.value = false
  manualBarcode.value = ''

  await nextTick()

  try {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      scanError.value = "La caméra n'est pas supportée sur cet appareil ou navigateur."
      return
    }

    try {
      const tempStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' }
      })
      tempStream.getTracks().forEach(track => track.stop())
    } catch (permissionErr) {
      console.error('Permission caméra refusée :', permissionErr)
      scanError.value = "Permission caméra refusée. Autorise l’accès à la caméra dans ton navigateur."
      return
    }

    html5QrcodeScanner = new Html5Qrcode('reader', {
      formatsToSupport: [
        Html5QrcodeSupportedFormats.EAN_13,
        Html5QrcodeSupportedFormats.EAN_8,
        Html5QrcodeSupportedFormats.UPC_A,
        Html5QrcodeSupportedFormats.UPC_E,
        Html5QrcodeSupportedFormats.CODE_128,
        Html5QrcodeSupportedFormats.CODE_39
      ],
      verbose: false
    })

    await html5QrcodeScanner.start(
      { facingMode: { exact: 'environment' } },
      {
        fps: 12,
        qrbox: { width: 280, height: 140 },
        aspectRatio: 1.8,
        disableFlip: true
      },
      onScanSuccess,
      () => {}
    )
  } catch (err) {
    console.error('Erreur ouverture caméra :', err)

    try {
      html5QrcodeScanner = new Html5Qrcode('reader', {
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.EAN_8,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.UPC_E,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.CODE_39
        ],
        verbose: false
      })

      const cameras = await Html5Qrcode.getCameras()
      if (!cameras || cameras.length === 0) {
        scanError.value = "Aucune caméra détectée."
        return
      }

      await html5QrcodeScanner.start(
        cameras[0].id,
        {
          fps: 12,
          qrbox: { width: 280, height: 140 },
          aspectRatio: 1.8,
          disableFlip: true
        },
        onScanSuccess,
        () => {}
      )
    } catch (err2) {
      console.error('Erreur fallback caméra :', err2)
      scanError.value = "Impossible de scanner. Essaie avec plus de lumière ou entre le code à la main."
    }
  }
}

async function stopScanner() {
  if (!html5QrcodeScanner) return

  try {
    const state = html5QrcodeScanner.getState?.()
    if (state === 2 || state === 3) {
      await html5QrcodeScanner.stop()
    }
    await html5QrcodeScanner.clear()
  } catch (err) {
    console.error('Erreur fermeture scanner :', err)
  } finally {
    html5QrcodeScanner = null
  }
}

async function closeScanner() {
  await stopScanner()
  currentScreen.value = 'main'
}

async function onScanSuccess(decodedText) {
  try {
    await stopScanner()
    await lookupBarcode(decodedText)
  } catch (e) {
    console.error('Erreur scan ou API :', e)
    scanError.value = 'Erreur pendant le scan ou la recherche du produit.'
  }
}

async function lookupBarcode(barcode) {
  const localShared = sharedFoods.value.find(item => item.barcode === barcode)

  if (localShared) {
    scanResult.value = {
      nom: localShared.name,
      message: 'Produit trouvé dans la base partagée ! Clique pour ajouter.',
      data: localShared
    }
    scanError.value = ''
    return
  }

  const { data: existingShared } = await supabase
    .from('food_library_shared')
    .select('*')
    .eq('barcode', barcode)
    .maybeSingle()

  if (existingShared) {
    const food = {
      id: existingShared.id,
      barcode: existingShared.barcode,
      name: existingShared.name,
      img: existingShared.img || 'https://placehold.co/600x600/1e293b/94a3b8?text=Aliment',
      k: Number(existingShared.k || 0),
      p: Number(existingShared.p || 0),
      c: Number(existingShared.c || 0),
      f: Number(existingShared.f || 0),
      cat: existingShared.cat || 'Scannés'
    }

    scanResult.value = {
      nom: food.name,
      message: 'Produit trouvé dans la base partagée ! Clique pour ajouter.',
      data: food
    }
    scanError.value = ''
    await fetchSharedFoods()
    return
  }

  const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`)
  const data = await res.json()

  if (data.status === 1) {
    const p = data.product

    const food = {
      barcode,
      name: p.product_name || p.product_name_fr || 'Produit inconnu',
      img: p.image_url || p.image_front_url || 'https://placehold.co/600x600/1e293b/94a3b8?text=Aliment',
      k: Math.round(p.nutriments?.['energy-kcal_100g'] || p.nutriments?.['energy-kcal'] || 0),
      p: Number(p.nutriments?.proteins_100g || 0),
      c: Number(p.nutriments?.carbohydrates_100g || 0),
      f: Number(p.nutriments?.fat_100g || 0),
      cat: 'Scannés'
    }

    await saveScannedFoodToSharedLibrary(barcode, food)

    scanResult.value = {
      nom: food.name,
      message: 'Produit trouvé ! Ajouté à la base partagée, clique pour ajouter.',
      data: food
    }

    scanError.value = ''
  } else {
    scanResult.value = null
    scanError.value = `Produit introuvable pour le code ${barcode}`
  }
}

async function submitManualBarcode() {
  if (!manualBarcode.value.trim()) return
  scanError.value = ''
  scanResult.value = null

  try {
    await stopScanner()
    await lookupBarcode(manualBarcode.value.trim())
  } catch (e) {
    console.error(e)
    scanError.value = 'Erreur pendant la recherche du produit.'
  }
}

function addScannedFood() {
  if (scanResult.value?.data) {
    lastScreenBeforeQuantity.value = 'scanner'
    selectedFood.value = scanResult.value.data
    amount.value = 100
    currentScreen.value = 'quantity'
  }
}

const imc = computed(() => profil.poids && profil.taille ? (profil.poids / Math.pow(profil.taille / 100, 2)).toFixed(1) : 0)

const imcColor = computed(() => {
  const v = parseFloat(imc.value)
  if (!v) return 'text-white'
  if (v < 18.5) return 'text-orange-400'
  if (v < 25) return 'text-emerald-400'
  if (v < 30) return 'text-orange-400'
  return 'text-red-400'
})

const imcLabel = computed(() => {
  const v = parseFloat(imc.value)
  if (!v) return ''
  if (v < 18.5) return 'Sous-poids'
  if (v < 25) return 'Normal'
  if (v < 30) return 'Surpoids'
  return 'Obésité'
})

const liveBesoins = computed(() => {
  let bmr = (10 * profil.poids) + (6.25 * profil.taille) - (5 * profil.age) + (profil.genre === 'homme' ? 5 : -161)
  let k = Math.round(bmr * profil.activite)

  if (profil.objectif === 'seche') k -= 400
  else if (profil.objectif === 'masse') k += 300

  const prot = Math.round(profil.poids * 2)
  const fats = Math.round(profil.poids * 1)

  return {
    kcal: k,
    prot,
    fats,
    carbs: Math.round((k - (prot * 4) - (fats * 9)) / 4)
  }
})

const activeBesoins = computed(() => (!isToday.value && frozenBesoins.value) ? frozenBesoins.value : liveBesoins.value)

const total = computed(() =>
  consumed.value.reduce(
    (a, c) => ({
      kcal: a.kcal + c.kcal,
      prot: a.prot + c.prot,
      carbs: a.carbs + c.carbs,
      fats: a.fats + c.fats
    }),
    { kcal: 0, prot: 0, carbs: 0, fats: 0 }
  )
)

const progressKcal = computed(() => Math.min(100, (total.value.kcal / activeBesoins.value.kcal) * 100) || 0)
const progressCarbs = computed(() => Math.min(100, (total.value.carbs / activeBesoins.value.carbs) * 100) || 0)
const progressProt = computed(() => Math.min(100, (total.value.prot / activeBesoins.value.prot) * 100) || 0)
const progressFats = computed(() => Math.min(100, (total.value.fats / activeBesoins.value.fats) * 100) || 0)
const progressEau = computed(() => Math.min(100, (eau.value / 3.0) * 100) || 0)

function changeDay(d) {
  const date = new Date(selectedDateObj.value)
  date.setDate(date.getDate() + d)
  selectedDateObj.value = date
  fetchDaily()
}

function adjustWater(v) {
  eau.value = Math.max(0, Math.min(3.0, Number((eau.value + v).toFixed(1))))
  saveDaily()
}

let _waterAudio = null
function addWater(v) {
  adjustWater(v)
  try {
    if (!_waterAudio) { _waterAudio = new Audio('/eau-coule.mp3'); _waterAudio.load() }
    _waterAudio.currentTime = 0
    _waterAudio.volume = 1
    _waterAudio.play()
    setTimeout(() => {
      let step = 0
      const fade = setInterval(() => {
        step++
        _waterAudio.volume = Math.max(0, 1 - step / 20)
        if (step >= 20) { clearInterval(fade); _waterAudio.pause() }
      }, 5)
    }, 99)
  } catch {}
}

function selectFood(f) {
  lastScreenBeforeQuantity.value = 'library'
  selectedFood.value = f
  amount.value = 100
  currentScreen.value = 'quantity'
}

function goBackFromQuantity() {
  currentScreen.value = lastScreenBeforeQuantity.value || 'main'
}

function addFood() {
  consumed.value.push({
    name: selectedFood.value.name,
    img: selectedFood.value.img,
    amount: amount.value,
    ...calculatedMacros.value
  })

  selectedFood.value = null
  currentScreen.value = 'main'
  saveDaily()
}

function removeItem(i) {
  consumed.value.splice(i, 1)
  saveDaily()
}

function toggleCheck(i) {
  shoppingList.value[i].checked = !shoppingList.value[i].checked
  saveGlobals()
}

function removeCartItem(i) {
  shoppingList.value.splice(i, 1)
  saveGlobals()
}

function addCustomCartItem() {
  if (newCartItem.value) {
    shoppingList.value.push({ name: newCartItem.value, checked: false })
    newCartItem.value = ''
    saveGlobals()
  }
}

function clearCart() {
  if (confirm('Tout vider ?')) {
    shoppingList.value = []
    saveGlobals()
  }
}

const filteredDb = computed(() =>
  mergedFoodLibrary.value.filter(f =>
    (activeCatFilter.value === 'Tout' || f.cat === activeCatFilter.value) &&
    f.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
)

const calculatedMacros = computed(() => {
  if (!selectedFood.value) return {}
  const r = amount.value / 100
  return {
    kcal: Math.round(selectedFood.value.k * r),
    prot: +(selectedFood.value.p * r).toFixed(1),
    carbs: +(selectedFood.value.c * r).toFixed(1),
    fats: +(selectedFood.value.f * r).toFixed(1)
  }
})

function onImageError(e) {
  e.target.src = 'https://placehold.co/600x600/1e293b/94a3b8?text=Aliment'
}

// ── Analyse IA ──

function openCamera() {
  clearAiState()
  currentScreen.value = 'camera'
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

function handleImageSelect(e) {
  const file = e.target.files?.[0]
  if (!file) return

  aiImageMime.value = file.type || 'image/jpeg'
  aiResult.value = null
  aiError.value = null

  const reader = new FileReader()
  reader.onload = (ev) => {
    aiImage.value = ev.target.result
    aiImageBase64.value = ev.target.result.split(',')[1]
  }
  reader.readAsDataURL(file)
}

function clearAiState() {
  aiImage.value = null
  aiImageBase64.value = null
  aiResult.value = null
  aiError.value = null
  if (fileInputRef.value) fileInputRef.value.value = ''
}

async function analyzeImage() {
  if (!aiImageBase64.value) return

  aiLoading.value = true
  aiError.value = null
  aiResult.value = null

  try {
    const result = await $fetch('/api/analyze-food', {
      method: 'POST',
      body: { imageBase64: aiImageBase64.value, mimeType: aiImageMime.value }
    })
    aiResult.value = result
  } catch (e) {
    aiError.value = e?.data?.message || e?.message || "Impossible d'analyser l'image. Réessaie."
    console.error('Erreur analyse IA:', e)
  } finally {
    aiLoading.value = false
  }
}

function addAiResult() {
  if (!aiResult.value) return

  const per100 = aiResult.value.portion / 100
  lastScreenBeforeQuantity.value = 'camera'
  selectedFood.value = {
    name: aiResult.value.name,
    img: 'https://placehold.co/600x600/1e1b4b/818cf8?text=IA',
    k: Math.round(aiResult.value.calories / per100),
    p: parseFloat((aiResult.value.proteins / per100).toFixed(1)),
    c: parseFloat((aiResult.value.carbs / per100).toFixed(1)),
    f: parseFloat((aiResult.value.fats / per100).toFixed(1))
  }
  amount.value = aiResult.value.portion
  currentScreen.value = 'quantity'
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.slide-enter-active, .slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-enter-from { opacity: 0; transform: translateX(30px) scale(0.98); }
.slide-leave-to { opacity: 0; transform: translateX(-30px) scale(0.98); }
.fade-quick-enter-active, .fade-quick-leave-active { transition: opacity 0.3s; }
.fade-quick-enter-from, .fade-quick-leave-to { opacity: 0; }
.group:hover .food-name { color: var(--accent-solid); }
.upload-zone:hover { border-color: color-mix(in srgb, var(--accent-solid) 50%, transparent); background: color-mix(in srgb, var(--accent-solid) 5%, transparent); }
</style>