<template>
  <div class="w-full max-w-7xl mx-auto space-y-6 pb-20 pt-4 px-4 min-h-screen text-white font-sans">
    <Transition name="slide" mode="out-in">
      <div v-if="currentScreen === 'main'" key="main" class="flex flex-col gap-6">
        <!-- Collant seulement sur grand écran (sous les barres de l'app) : sur téléphone il prenait un tiers de l'écran -->
        <div
          ref="headerEl"
          class="backdrop-blur-xl md:sticky md:top-[var(--app-header-h,0px)] z-40 py-4 border-b border-white/[0.06] space-y-4"
          style="background-color: color-mix(in srgb, var(--theme-bg, #060d1a) 88%, transparent)"
        >
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

          <p v-if="dailyLoadError" class="text-center text-red-400 text-sm font-bold">
            Impossible de charger ce jour.
            <button @click="fetchDaily" class="underline text-white ml-1">Réessayer</button>
          </p>
        </div>

        <!-- Sur mobile les colonnes s'effacent (contents) pour réordonner les cartes : le journal passe en haut -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="contents lg:block lg:col-span-5 lg:space-y-8">
            <div class="order-5 lg:order-none bg-white/[0.04] backdrop-blur-2xl rounded-[35px] p-6 border border-white/[0.08] shadow-2xl relative overflow-hidden">
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

                <button class="text-right" @click="openGoals">
                  <p class="text-[10px] font-black text-blue-400 uppercase tracking-widest">
                    Cible Journalière{{ profil.objectifsPerso ? ' · perso' : '' }}
                  </p>
                  <p class="text-white font-[1000] text-2xl">{{ activeBesoins.kcal }} <span class="text-sm font-bold text-slate-400">kcal</span></p>
                </button>
              </div>

              <!-- Suivi du poids -->
              <div class="mt-6">
                <Dashboard />
              </div>
            </div>

            <div class="order-1 lg:order-none bg-[#111111] rounded-[35px] p-6 border border-white/5">
              <div class="flex items-center justify-between mb-8 gap-3">
                <h2 class="text-lg font-black text-white">Objectifs du jour</h2>
                <button @click="scrollToJournal" class="text-xs font-black flex items-center gap-1 shrink-0" style="color: var(--accent-solid)">
                  Voir mon journal
                  <UIcon name="i-heroicons-chevron-right" class="text-sm" />
                </button>
              </div>

              <div class="flex justify-around items-end">
                <div class="relative w-40 h-40 flex items-center justify-center cursor-pointer active:scale-95 transition-transform" @click="scrollToJournal">
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

              <!-- Objectifs calculés par l'app, ou choisis par l'utilisateur -->
              <button
                @click="openGoals"
                class="mt-6 w-full flex items-center justify-center gap-2 text-xs font-black text-slate-300 bg-slate-900/70 hover:bg-slate-900 border border-white/5 rounded-2xl py-3 px-3 transition-colors"
              >
                <UIcon name="i-heroicons-adjustments-horizontal" class="text-base shrink-0" />
                <span class="truncate">{{ profil.objectifsPerso ? 'Mes objectifs perso' : 'Objectifs automatiques' }}</span>
                <span class="shrink-0" style="color: var(--accent-solid)">· Modifier</span>
              </button>
            </div>
          </div>

          <div class="contents lg:block lg:col-span-7 lg:space-y-8">
            <div class="order-4 lg:order-none bg-[#111111] p-8 rounded-[35px] border border-white/5 space-y-6">
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

            <div ref="journalEl" class="order-3 lg:order-none bg-[#111111] rounded-[35px] border border-white/5 overflow-hidden">
              <div class="flex items-center justify-between p-6 bg-white/5 gap-3">
                <h3 class="text-white font-bold text-xl flex items-center gap-3">
                  <UIcon name="i-heroicons-shopping-bag" />
                  Journal
                </h3>
                <div class="flex items-center gap-2 shrink-0">
                  <span v-if="consumed.length" class="text-slate-400 text-sm font-black">{{ total.kcal }} kcal</span>
                  <span class="bg-slate-800 px-4 py-1.5 rounded-full text-sm font-black">{{ consumed.length }}</span>
                </div>
              </div>

              <p v-if="dailySaveError" class="px-6 pt-4 text-red-400 text-sm font-bold">
                Pas encore sauvegardé.
                <button @click="retryDailyIfNeeded" class="underline text-white ml-1">Réessayer</button>
              </p>

              <div class="p-4">
                <div v-if="dailyLoadError" class="text-center py-10 space-y-3">
                  <p class="text-red-400 font-bold">Ton journal n'a pas pu être chargé.</p>
                  <button @click="fetchDaily" class="bg-slate-800 text-white font-black text-sm px-5 py-2.5 rounded-xl">Réessayer</button>
                </div>
                <div v-else-if="!dayLoaded" class="text-center text-slate-500 font-bold py-10">
                  Chargement du journal...
                </div>

                <!-- Rangé par repas, dans l'ordre de la journée ; chaque repas se déplie d'un appui -->
                <div v-else class="space-y-2">
                  <section
                    v-for="meal in mealGroups"
                    :key="meal.key"
                    class="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden"
                  >
                    <div class="flex items-center gap-3 p-3">
                      <button
                        @click="toggleMeal(meal.key)"
                        class="flex-1 min-w-0 flex items-center gap-3 text-left"
                        :aria-expanded="openMeals.has(meal.key)"
                      >
                        <span class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" :style="{ background: `color-mix(in srgb, ${meal.color} 15%, transparent)` }">
                          <UIcon :name="meal.icon" class="text-lg" :style="{ color: meal.color }" />
                        </span>
                        <span class="min-w-0">
                          <span class="block text-white font-black leading-tight">{{ meal.label }}</span>
                          <span class="block text-xs font-bold mt-0.5" :class="meal.entries.length ? 'text-slate-400' : 'text-slate-600'">
                            {{ meal.entries.length ? `${meal.kcal} kcal · ${meal.entries.length} aliment${meal.entries.length > 1 ? 's' : ''}` : "Rien pour l'instant" }}
                          </span>
                        </span>
                        <UIcon
                          name="i-heroicons-chevron-down"
                          class="ml-auto text-slate-500 text-lg shrink-0 transition-transform duration-200"
                          :class="openMeals.has(meal.key) ? 'rotate-180' : ''"
                        />
                      </button>
                      <button
                        v-if="meal.key !== 'autres'"
                        @click="openLibrary(meal.key)"
                        class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] active:scale-95 transition-transform"
                        :aria-label="`Ajouter au ${meal.lower}`"
                      >
                        <UIcon name="i-heroicons-plus" class="text-lg" />
                      </button>
                    </div>

                    <div v-if="openMeals.has(meal.key) && meal.entries.length" class="px-1 pb-1 space-y-1">
                      <div
                        v-for="{ item, index } in meal.entries"
                        :key="index"
                        class="flex flex-wrap items-center gap-3 group p-2.5 rounded-2xl hover:bg-slate-900 border border-transparent hover:border-white/5 transition-all"
                      >
                        <!-- flex-1 : un nom long passe à la ligne sans pousser la poubelle -->
                        <div class="flex-1 flex items-center gap-3 text-left min-w-0">
                          <img :src="item.img" loading="lazy" decoding="async" width="48" height="48" class="w-12 h-12 rounded-xl object-cover bg-white shrink-0 cursor-pointer" @click="toggleDetails(index)" @error="onImageError" />
                          <div class="min-w-0">
                            <p
                              class="text-white font-bold text-lg leading-tight break-words cursor-pointer"
                              :class="expandedIndex === index ? '' : 'line-clamp-2'"
                              @click="toggleDetails(index)"
                            >{{ item.name }}</p>
                            <button
                              @click="editingIndex === index ? cancelEdit() : startEdit(index)"
                              class="text-[#2F6BFF] font-black text-xs mt-1 -my-2 py-2 pr-1 flex items-center gap-1 max-w-full hover:text-white transition-colors"
                            >
                              <span class="truncate">{{ item.amount }} g • {{ item.kcal }} kcal</span>
                              <UIcon name="i-heroicons-pencil-square" class="text-sm shrink-0" />
                            </button>
                          </div>
                        </div>

                        <div v-if="expandedIndex === index && editingIndex !== index" class="order-last w-full mt-3 space-y-3">
                          <div class="grid grid-cols-3 gap-2 text-center">
                            <div class="bg-slate-900 rounded-xl py-2">
                              <p class="text-blue-400 font-black text-sm">{{ item.prot }} g</p>
                              <p class="text-[10px] text-slate-500 font-black uppercase">Prot</p>
                            </div>
                            <div class="bg-slate-900 rounded-xl py-2">
                              <p class="text-orange-400 font-black text-sm">{{ item.carbs }} g</p>
                              <p class="text-[10px] text-slate-500 font-black uppercase">Gluc</p>
                            </div>
                            <div class="bg-slate-900 rounded-xl py-2">
                              <p class="text-[#9DFF00] font-black text-sm">{{ item.fats }} g</p>
                              <p class="text-[10px] text-slate-500 font-black uppercase">Lip</p>
                            </div>
                          </div>
                          <!-- Changer de repas (utile pour les aliments ajoutés avant les repas, rangés dans "Autres") -->
                          <div class="flex flex-wrap items-center gap-1.5">
                            <span class="text-[10px] text-slate-500 font-black uppercase mr-1">Repas</span>
                            <button
                              v-for="m in MEALS"
                              :key="m.key"
                              @click="moveItem(index, m.key)"
                              class="px-3 py-1.5 rounded-full text-xs font-black transition-colors"
                              :class="item.meal === m.key ? 'bg-white text-black' : 'bg-slate-800 text-slate-300'"
                            >
                              {{ m.label }}
                            </button>
                          </div>
                        </div>

                        <div v-if="editingIndex === index" class="w-full flex items-center gap-2 mt-3">
                          <input
                            :ref="el => { if (el) editInputEl = el }"
                            v-model.number="editAmount"
                            type="number"
                            inputmode="decimal"
                            min="1"
                            class="min-w-0 flex-1 bg-slate-900 text-white font-black text-base rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-[color:var(--accent-solid)]"
                            @keydown.enter="confirmEdit(index)"
                            @keydown.esc="cancelEdit"
                          />
                          <span class="text-[#2F6BFF] font-black text-sm">g</span>
                          <button
                            @click="cancelEdit"
                            class="text-slate-400 hover:text-white p-3 bg-slate-800 rounded-xl transition-all shrink-0"
                          >
                            <UIcon name="i-heroicons-x-mark" class="text-xl" />
                          </button>
                          <button
                            @click="confirmEdit(index)"
                            class="text-white p-3 rounded-xl transition-all shrink-0"
                            style="background: linear-gradient(to right, var(--accent-from), var(--accent-to))"
                          >
                            <UIcon name="i-heroicons-check" class="text-xl" />
                          </button>
                        </div>
                        <button
                          v-else
                          @click="removeItem(index)"
                          class="text-red-400 hover:text-white p-2.5 bg-red-500/10 hover:bg-red-500 rounded-xl transition-all shrink-0"
                        >
                          <UIcon name="i-heroicons-trash" class="text-xl" />
                        </button>
                      </div>
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

      <div v-else-if="currentScreen === 'library'" key="library" class="fixed inset-0 z-[100] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] backdrop-blur-2xl">
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
                  inputmode="search"
                  enterkeyhint="search"
                  autocomplete="off"
                  autocorrect="off"
                  autocapitalize="off"
                  spellcheck="false"
                  placeholder="Rechercher un aliment..."
                  class="w-full bg-[#1A1A1A] text-white font-bold text-lg rounded-2xl py-4 pl-14 pr-14 outline-none focus:ring-2 focus:ring-[color:var(--accent-solid)] transition-all"
                  @keydown.enter="$event.target.blur()"
                />
                <button
                  v-if="searchQuery"
                  @click="searchQuery = ''"
                  class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-2"
                >
                  <UIcon name="i-heroicons-x-circle-solid" class="text-2xl" />
                </button>
              </div>
            </div>

            <p class="flex items-center gap-2 text-sm font-black text-slate-300 mb-3">
              <UIcon :name="targetMealInfo.icon" class="text-base" :style="{ color: targetMealInfo.color }" />
              Pour le {{ targetMealInfo.lower }}
            </p>

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
            <p v-if="filteredDb.length === 0" class="text-center text-slate-500 font-bold py-16">
              Aucun aliment trouvé pour « {{ searchQuery }} »
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              <div
                v-for="food in filteredDb"
                :key="food.key"
                @click="selectFood(food)"
                class="bg-[#111111] p-5 rounded-[30px] flex flex-col cursor-pointer border border-white/5 hover:border-white/15 transition-all group"
              >
                <div class="flex items-start gap-4 mb-4">
                  <img :src="food.img" loading="lazy" decoding="async" class="w-20 h-20 rounded-2xl object-cover bg-white shrink-0" @error="onImageError" />
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

      <div v-else-if="currentScreen === 'quantity' && selectedFood" key="quantity" class="fixed inset-0 z-[120] backdrop-blur-2xl overflow-y-auto">
        <!-- Centré quand tout tient dans l'écran, défilable sinon (petits iPhone) -->
        <div class="relative min-h-full flex flex-col items-center justify-center px-6 pt-[calc(5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <button @click="goBackFromQuantity" class="absolute top-[calc(2rem+env(safe-area-inset-top))] left-8 text-slate-400 hover:text-white transition">
            <UIcon name="i-heroicons-arrow-left" class="text-4xl" />
          </button>

          <img :src="selectedFood.img" class="w-36 h-36 sm:w-48 sm:h-48 rounded-full object-cover mb-6 sm:mb-8 shadow-2xl" style="border: 4px solid var(--accent-solid)" @error="onImageError" />
          <h3 class="text-3xl sm:text-4xl font-[1000] text-white mb-6 sm:mb-8 text-center">{{ selectedFood.name }}</h3>

          <div class="bg-[#111111] border border-white/10 p-6 sm:p-8 rounded-[40px] mb-6 w-full max-w-md text-center">
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

          <div class="w-full max-w-md grid grid-cols-4 gap-2 mb-6">
            <button
              v-for="m in MEALS"
              :key="m.key"
              @click="targetMeal = m.key"
              class="flex flex-col items-center gap-1 py-2.5 rounded-2xl border text-xs font-black transition-colors"
              :class="targetMeal === m.key ? 'bg-white text-black border-white' : 'bg-[#111111] text-slate-400 border-white/10'"
            >
              <UIcon :name="m.icon" class="text-lg" :style="targetMeal === m.key ? {} : { color: m.color }" />
              {{ m.label }}
            </button>
          </div>

          <button @click="addFood" class="w-full max-w-md bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black text-xl sm:text-2xl py-6 rounded-[30px] shadow-lg shadow-[color:var(--accent-solid)]/20 transition-all active:scale-95">
            Ajouter au {{ targetMealInfo.lower }}
          </button>
        </div>
      </div>

      <div v-else-if="currentScreen === 'scanner'" key="scanner" class="fixed inset-0 z-[110] backdrop-blur-2xl overflow-y-auto">
        <!-- Défilable : avec l'encadré "produit introuvable", tout ne tient pas sur un petit iPhone -->
        <div class="relative min-h-full flex flex-col items-center justify-center px-6 pt-[calc(6rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <button @click="closeScanner" class="absolute top-[calc(2rem+env(safe-area-inset-top))] left-8 text-slate-400 bg-slate-900 p-4 rounded-full">
            <UIcon name="i-heroicons-x-mark" class="text-2xl" />
          </button>

          <div class="w-full max-w-md flex flex-col items-center">
            <div id="reader" class="w-full h-64 rounded-[40px] relative overflow-hidden bg-slate-900/50 mb-6" style="border: 4px solid var(--accent-solid)"></div>

            <div class="w-full space-y-3 mb-6">
              <button
                v-if="!scannerRunning && !ocrLoading"
                @click="startScanner"
                class="w-full bg-slate-900 border border-white/10 text-white font-black py-3 rounded-2xl flex items-center justify-center gap-2"
              >
                <UIcon name="i-heroicons-arrow-path" class="text-xl" />
                Scanner à nouveau
              </button>

              <button
                @click="readDigitsFromCamera"
                :disabled="ocrLoading"
                class="w-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-60"
              >
                <UIcon :name="ocrLoading ? 'i-heroicons-arrow-path' : 'i-heroicons-camera'" class="text-xl" :class="ocrLoading ? 'animate-spin' : ''" />
                {{ ocrLoading ? 'Lecture des chiffres…' : (scannerRunning ? 'Lire les chiffres du code-barres' : 'Photographier les chiffres') }}
              </button>
              <input ref="ocrFileInput" type="file" accept="image/*" capture="environment" class="hidden" @change="onOcrFileSelect" />

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

            <div ref="scanOutcomeEl" class="w-full flex flex-col items-center">
              <template v-if="scanResult">
                <div
                  @click="addScannedFood"
                  class="p-6 rounded-[30px] w-full border-2 cursor-pointer animate-in slide-in-from-bottom-10 bg-green-500/10 border-green-500 text-green-400"
                >
                  <h4 class="font-[1000] text-2xl text-white">{{ scanResult.nom }}</h4>
                  <p class="text-sm font-bold">{{ scanResult.message }}</p>
                  <p class="mt-2 text-[10px] uppercase font-black text-white/50">Clique pour définir la quantité</p>
                </div>
                <button
                  v-if="scanResult.data?.barcode"
                  @click="openCustomFood(scanResult.data.barcode, scanResult.data)"
                  class="mt-4 text-slate-400 hover:text-white text-sm font-bold underline underline-offset-4"
                >
                  Infos manquantes ou fausses ? Les corriger
                </button>
              </template>

              <div v-else-if="notFoundBarcode" class="w-full p-5 rounded-[30px] border-2 border-orange-400/60 bg-orange-400/10 text-center space-y-3">
                <p class="text-white font-[1000] text-xl">Produit introuvable</p>
                <p class="text-slate-300 text-sm font-bold">
                  Le code {{ notFoundBarcode }} n'est dans aucune base. Ajoute ce produit toi-même : il sera reconnu au prochain scan.
                </p>
                <button
                  @click="openCustomFood(notFoundBarcode)"
                  class="w-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black py-3 rounded-2xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                >
                  <UIcon name="i-heroicons-pencil-square" class="text-xl" />
                  Remplir les infos du produit
                </button>
              </div>

              <p v-else-if="scanError" class="text-red-400 font-bold text-center max-w-md">
                {{ scanError }}
              </p>

              <p v-else class="text-slate-500 font-bold text-center">
                Place le code-barres devant la caméra
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── PRODUIT REMPLI À LA MAIN (code-barres introuvable ou valeurs manquantes) ── -->
      <div v-else-if="currentScreen === 'customFood'" key="customFood" class="fixed inset-0 z-[120] backdrop-blur-2xl overflow-y-auto">
        <div class="relative min-h-full flex flex-col items-center justify-center px-6 pt-[calc(5rem+env(safe-area-inset-top))] pb-[calc(1.5rem+env(safe-area-inset-bottom))]">
          <button @click="currentScreen = 'scanner'" class="absolute top-[calc(2rem+env(safe-area-inset-top))] left-8 text-slate-400 hover:text-white transition">
            <UIcon name="i-heroicons-arrow-left" class="text-4xl" />
          </button>

          <form class="w-full max-w-md space-y-4" @submit.prevent="submitCustomFood" @input="customFoodError = ''">
            <div class="text-center space-y-1">
              <h3 class="text-3xl font-[1000] text-white">{{ customFood.editing ? 'Corriger le produit' : 'Nouveau produit' }}</h3>
              <p class="text-slate-400 text-sm font-bold">Recopie les valeurs « pour 100 g » du tableau sur l'emballage.</p>
              <p v-if="customFood.barcode" class="text-slate-500 text-xs font-black">Code-barres {{ customFood.barcode }}</p>
            </div>

            <label class="block">
              <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nom du produit</span>
              <input
                v-model="customFood.name"
                type="text"
                maxlength="80"
                autocomplete="off"
                placeholder="Ex : Yaourt nature"
                class="mt-1 w-full bg-[#111111] border border-white/10 text-white font-bold text-base rounded-2xl px-4 py-3.5 outline-none focus:border-[color:var(--accent-solid)]"
              />
            </label>

            <div class="grid grid-cols-2 gap-3">
              <label v-for="field in CUSTOM_FIELDS" :key="field.key" class="block">
                <span class="text-[10px] font-black uppercase tracking-widest" :class="field.color">{{ field.label }}</span>
                <span class="relative block mt-1">
                  <input
                    v-model="customFood[field.key]"
                    type="text"
                    inputmode="decimal"
                    autocomplete="off"
                    placeholder="0"
                    class="w-full bg-[#111111] border border-white/10 text-white font-black text-lg rounded-2xl pl-4 pr-12 py-3 outline-none focus:border-[color:var(--accent-solid)]"
                  />
                  <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-black pointer-events-none">{{ field.unit }}</span>
                </span>
              </label>
            </div>

            <p v-if="customFoodError" class="text-red-400 text-sm font-bold text-center">{{ customFoodError }}</p>

            <button
              type="submit"
              :disabled="customFoodSaving"
              class="w-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black text-xl py-5 rounded-[26px] shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {{ customFoodSaving ? 'Enregistrement…' : 'Continuer' }}
            </button>
          </form>
        </div>
      </div>

      <!-- ── ÉCRAN ANALYSE IA ── -->
      <div v-else-if="currentScreen === 'camera'" key="camera" class="fixed inset-0 z-[110] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] bg-black flex flex-col">
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

      <div v-else-if="currentScreen === 'cart'" key="cart" class="fixed inset-0 z-[110] backdrop-blur-2xl flex flex-col items-center px-2 pb-2 sm:px-6 sm:pb-6 pt-[calc(0.5rem+env(safe-area-inset-top))] sm:pt-[calc(1.5rem+env(safe-area-inset-top))]">
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

    <!-- Objectifs du jour : ceux calculés par l'app, ou les siens -->
    <Teleport to="body">
      <Transition name="fade-quick">
        <div
          v-if="goalsOpen"
          class="fixed inset-0 z-[400] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-6"
          @click.self="goalsOpen = false"
        >
          <div class="w-full max-w-md bg-[#111111] border border-white/10 rounded-t-[32px] sm:rounded-[32px] p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] space-y-5 max-h-full overflow-y-auto">
            <div class="flex items-center justify-between">
              <h3 class="text-white text-xl font-black">Objectifs du jour</h3>
              <button @click="goalsOpen = false" class="text-slate-400 hover:text-white p-1" aria-label="Fermer">
                <UIcon name="i-heroicons-x-mark" class="text-2xl" />
              </button>
            </div>

            <div class="grid grid-cols-2 gap-1 bg-slate-900 p-1 rounded-2xl">
              <button
                @click="goalsForm.custom = false"
                class="py-2.5 rounded-xl font-black text-sm transition-colors"
                :class="!goalsForm.custom ? 'bg-white text-black' : 'text-slate-400'"
              >
                Calculés par l'app
              </button>
              <button
                @click="goalsForm.custom = true"
                class="py-2.5 rounded-xl font-black text-sm transition-colors"
                :class="goalsForm.custom ? 'bg-white text-black' : 'text-slate-400'"
              >
                Les miens
              </button>
            </div>

            <div v-if="!goalsForm.custom" class="space-y-2">
              <p class="text-slate-400 text-sm font-bold">D'après ton profil (poids, taille, âge, activité, objectif) :</p>
              <div class="grid grid-cols-4 gap-2 text-center">
                <div v-for="field in GOAL_FIELDS" :key="field.key" class="bg-slate-900 rounded-xl py-2">
                  <p class="text-white font-black text-sm">{{ autoBesoins[field.key] }}{{ field.unit === 'g' ? ' g' : '' }}</p>
                  <p class="text-[10px] font-black uppercase" :class="field.color">{{ field.short }}</p>
                </div>
              </div>
            </div>

            <form v-else class="space-y-3" @submit.prevent="saveGoals" @input="goalsError = ''">
              <div class="grid grid-cols-2 gap-3">
                <label v-for="field in GOAL_FIELDS" :key="field.key" class="block">
                  <span class="text-[10px] font-black uppercase tracking-widest" :class="field.color">{{ field.label }}</span>
                  <span class="relative block mt-1">
                    <input
                      v-model="goalsForm[field.key]"
                      type="text"
                      inputmode="decimal"
                      autocomplete="off"
                      class="w-full bg-slate-900 border border-white/10 text-white font-black text-lg rounded-2xl pl-4 pr-12 py-3 outline-none focus:border-[color:var(--accent-solid)]"
                    />
                    <span class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 text-sm font-black pointer-events-none">{{ field.unit }}</span>
                  </span>
                </label>
              </div>
              <p class="text-slate-500 text-xs font-bold">
                Tes macros font {{ goalsMacroKcal }} kcal (protéines et glucides 4 kcal/g, lipides 9 kcal/g).
              </p>
            </form>

            <p v-if="goalsError" class="text-red-400 text-sm font-bold">{{ goalsError }}</p>

            <button
              @click="saveGoals"
              class="w-full bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-white font-black text-lg py-4 rounded-2xl active:scale-95 transition-all"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { foodLibrary } from '~/data/foodLibrary'
// Graphique du poids (Chart.js) et scanner (html5-qrcode) : les deux plus grosses bibliothèques,
// chargées seulement quand elles servent pour que l'onglet s'ouvre vite
const Dashboard = defineAsyncComponent(() => import('~/components/custom/dashboard.vue'))
let qrLib = null
const loadQrLib = () => (qrLib ??= import('html5-qrcode'))

const props = defineProps({
  active: { type: Boolean, default: true }
})

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
// Image des produits sans photo (fichier local : s'affiche aussi hors ligne)
const CUSTOM_FOOD_IMG = '/images/aliment.svg'

// Repas (MEALS, groupByMeal, mealForNow : app/utils/meals.ts)
const targetMeal = ref(mealForNow())
const targetMealInfo = computed(() => MEALS.find(m => m.key === targetMeal.value) || MEALS[0])
const mealGroups = computed(() => groupByMeal(consumed.value))

// Repas repliés par défaut (sinon le journal affiche trop d'infos d'un coup)
const openMeals = ref(new Set())
function toggleMeal(key) {
  const next = new Set(openMeals.value)
  if (!next.delete(key)) next.add(key)
  openMeals.value = next
}
function showMeal(key) {
  if (!openMeals.value.has(key)) openMeals.value = new Set([...openMeals.value, key])
}

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
  objectif: 'masse',
  // Objectifs du jour choisis par l'utilisateur ({ kcal, prot, carbs, fats }) ; null = calculés par l'app
  objectifsPerso: null
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

function toLocalDateStr(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const selectedDateStr = computed(() => toLocalDateStr(selectedDateObj.value))

// Date locale (et non UTC) du jour, mise à jour quand l'app revient au premier plan
const todayStr = ref(toLocalDateStr(new Date()))
const isToday = computed(() => selectedDateStr.value === todayStr.value)

function refreshToday() {
  const now = toLocalDateStr(new Date())
  if (now === todayStr.value) return
  const wasOnToday = selectedDateStr.value === todayStr.value
  todayStr.value = now
  if (wasOnToday) {
    selectedDateObj.value = new Date()
    fetchDaily()
  }
}

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
  // Les id de la base partagée peuvent recouper ceux de la bibliothèque : clé préfixée pour le v-for
  return [
    ...extras.map(f => ({ ...f, key: `s-${f.id}` })),
    ...base.map(f => ({ ...f, key: `l-${f.id}` }))
  ]
})

function normalizeSearch(s) {
  return String(s || '')
    .toLowerCase()
    .replace(/œ/g, 'oe')
    .replace(/æ/g, 'ae')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

function searchWords(s) {
  return normalizeSearch(s)
    .split(/[^a-z0-9%]+/)
    .filter(Boolean)
    .map(w => (w.length > 3 && w.endsWith('s') ? w.slice(0, -1) : w))
}

const searchIndex = computed(() =>
  mergedFoodLibrary.value.map(food => ({ food, words: searchWords(food.name), text: normalizeSearch(food.name) }))
)

function openLibrary(meal) {
  targetMeal.value = MEAL_KEYS.includes(meal) ? meal : mealForNow()
  searchQuery.value = ''
  currentScreen.value = 'library'
}

watch(searchQuery, (q, prev) => {
  if (q && !prev) activeCatFilter.value = 'Tout'
})

onMounted(async () => {
  // Le journal se charge tout de suite avec la session locale : l'ancien contrôle réseau pouvait
  // échouer au réveil de l'app, et le journal restait alors vide sans message
  fetchDaily()
  fetchSharedFoods()

  const userId = await getUserId()
  if (!userId) return

  const { data: globals } = await supabase
    .from('nutrition_globals')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (globals) {
    if (globals.profil) Object.assign(profil, globals.profil)
    if (globals.shopping_list) shoppingList.value = globals.shopping_list
  }
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
    img: item.img || CUSTOM_FOOD_IMG,
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

// Jour dont les données sont réellement chargées : tant que ce n'est pas le cas, on ne sauvegarde pas
// (sinon une liste vide écraserait les repas du jour en base)
const dailyLoadedFor = ref(null)
const dailyLoadError = ref(false)
const dailySaveError = ref(false)
const dayLoaded = computed(() => dailyLoadedFor.value === selectedDateStr.value)
let dailySaveChain = Promise.resolve()
let dailyLoad = null // chargement en cours : { date, promise }
let dailyLoadSeq = 0
let failedSave = null // dernière sauvegarde en échec, renvoyée plus tard : { date, payload, seq }
let saveSeq = 0
const latestSaveSeq = {} // date -> numéro de la dernière sauvegarde demandée pour ce jour

async function getUserId() {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user?.id || null
}

// D'anciennes versions de l'app pouvaient créer plusieurs lignes pour le même jour (taps rapides) :
// on les fusionne, un aliment présent dans plusieurs lignes n'étant compté qu'une fois
function mergeRepas(lists) {
  if (lists.length <= 1) return lists[0] || []
  const kept = new Map()
  const merged = []
  for (const list of lists) {
    const seen = new Map()
    for (const item of list) {
      const key = JSON.stringify([item.name, item.amount, item.kcal, item.meal])
      const n = (seen.get(key) || 0) + 1
      seen.set(key, n)
      if (n > (kept.get(key) || 0)) {
        kept.set(key, n)
        merged.push(item)
      }
    }
  }
  return merged
}

function fetchDaily() {
  const date = selectedDateStr.value
  // Déjà en cours pour ce jour : on attend le même chargement
  if (dailyLoad?.date === date) return dailyLoad.promise
  const promise = loadDaily(date).finally(() => {
    if (dailyLoad?.promise === promise) dailyLoad = null
  })
  dailyLoad = { date, promise }
  return promise
}

async function loadDaily(date) {
  const seq = ++dailyLoadSeq
  dailyLoadedFor.value = null
  dailyLoadError.value = false
  consumed.value = []
  eau.value = 0
  frozenBesoins.value = null

  await dailySaveChain
  const userId = await getUserId()
  // Un chargement plus récent (autre jour, nouvel essai) a pris le relais : ce résultat n'est plus le bon
  if (seq !== dailyLoadSeq || date !== selectedDateStr.value) return
  if (!userId) {
    dailyLoadError.value = true
    return
  }

  const { data: rows, error } = await supabase
    .from('nutrition_daily')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
    .order('id', { ascending: true })

  if (seq !== dailyLoadSeq || date !== selectedDateStr.value) return
  if (error) {
    console.error('Erreur fetchDaily:', error)
    dailyLoadError.value = true
    return
  }

  if (rows?.length > 0) {
    eau.value = Math.max(...rows.map(r => Number(r.eau) || 0))
    consumed.value = mergeRepas(rows.map(r => r.repas || []))
    frozenBesoins.value = [...rows].reverse().find(r => r.cibles)?.cibles || null
  }
  dailyLoadedFor.value = date
}

// Avant toute modification, le jour doit être chargé : sinon on modifierait une liste vide jamais
// sauvegardée (on ne verrait que les derniers ajouts, et ils disparaîtraient à la réouverture)
async function ensureDayLoaded() {
  if (dayLoaded.value) return true
  await fetchDaily()
  return dayLoaded.value
}

// Nouvel essai quand on revient sur l'app ou l'onglet, ou quand le réseau revient
function retryDailyIfNeeded() {
  if (dailyLoadError.value) fetchDaily()
  else if (failedSave) queueSave(failedSave.date, failedSave.payload, failedSave.seq)
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

function saveDaily() {
  // Instantané pris tout de suite : le jour affiché peut changer pendant les requêtes
  const date = selectedDateStr.value
  if (dailyLoadedFor.value !== date) return dailySaveChain
  const payload = {
    eau: Number(eau.value),
    repas: JSON.parse(JSON.stringify(consumed.value)),
    cibles: JSON.parse(JSON.stringify(liveBesoins.value))
  }

  const seq = ++saveSeq
  latestSaveSeq[date] = seq
  return queueSave(date, payload, seq)
}

// Sauvegardes en file : deux taps rapides ne créent pas deux lignes pour le même jour
function queueSave(date, payload, seq) {
  dailySaveChain = dailySaveChain
    .then(async () => {
      // Une sauvegarde plus récente du même jour suit dans la file : elle contient déjà tout
      if (latestSaveSeq[date] !== seq) return
      await persistDaily(date, payload)
      if (failedSave?.date === date) failedSave = null
    })
    .catch(err => {
      console.error('Erreur saveDaily:', err)
      if (latestSaveSeq[date] === seq) failedSave = { date, payload, seq }
    })
    .finally(() => { dailySaveError.value = !!failedSave })
  return dailySaveChain
}

async function persistDaily(date, payload) {
  const userId = await getUserId()
  if (!userId) throw new Error('Session introuvable')

  // Toutes les lignes du jour sont mises à jour (d'anciennes versions pouvaient en créer plusieurs)
  const { data: updated, error } = await supabase
    .from('nutrition_daily')
    .update(payload)
    .eq('user_id', userId)
    .eq('date', date)
    .select('id')
  if (error) throw error

  if (!updated?.length) {
    const { error: insertError } = await supabase
      .from('nutrition_daily')
      .insert({ user_id: userId, date, ...payload })
    if (insertError) throw insertError
  } else if (updated.length > 1) {
    // Les doublons ont maintenant le même contenu : on n'en garde qu'un
    const extraIds = updated.map(r => r.id).sort((a, b) => (a < b ? -1 : 1)).slice(1)
    const { error: deleteError } = await supabase.from('nutrition_daily').delete().in('id', extraIds)
    if (deleteError) console.error('Erreur nettoyage des doublons:', deleteError)
  }

  if (date === selectedDateStr.value) frozenBesoins.value = payload.cibles
}

const SCAN_FORMAT_NAMES = ['EAN_13', 'EAN_8', 'UPC_A', 'UPC_E', 'CODE_128', 'CODE_39']
const SCAN_CONFIG = { fps: 12, qrbox: { width: 280, height: 140 }, aspectRatio: 1.8, disableFlip: true }

// Incrémenté à chaque arrêt : un démarrage devenu obsolète (écran fermé entre-temps) s'annule
let scanSession = 0
let scannerStarting = null
let scanHandled = false
const scannerRunning = ref(false)

async function openScanner() {
  targetMeal.value = mealForNow()
  currentScreen.value = 'scanner'
  scanResult.value = null
  scanError.value = ''
  manualInputOpen.value = false
  manualBarcode.value = ''
  await startScanner()
}

async function waitForReader() {
  // La transition "out-in" n'insère #reader qu'après la sortie de l'écran précédent
  for (let i = 0; i < 60; i++) {
    if (document.getElementById('reader')) return true
    await new Promise(r => setTimeout(r, 25))
  }
  return false
}

async function startScanner() {
  await stopScanner()
  const session = scanSession
  scanHandled = false
  scanError.value = ''
  notFoundBarcode.value = ''

  if (!navigator.mediaDevices?.getUserMedia) {
    scanError.value = "La caméra n'est pas supportée sur cet appareil ou navigateur."
    return
  }
  const [readerReady, lib] = await Promise.all([waitForReader(), loadQrLib().catch(() => null)])
  if (!readerReady || session !== scanSession) return
  if (!lib) {
    qrLib = null
    scanError.value = 'Impossible de charger le scanner. Vérifie ta connexion puis réessaie.'
    return
  }

  const { Html5Qrcode, Html5QrcodeSupportedFormats } = lib
  const scanner = new Html5Qrcode('reader', {
    formatsToSupport: SCAN_FORMAT_NAMES.map(n => Html5QrcodeSupportedFormats[n]),
    useBarCodeDetectorIfSupported: true,
    verbose: false
  })
  html5QrcodeScanner = scanner

  scannerStarting = scanner
    .start({ facingMode: 'environment' }, SCAN_CONFIG, onScanSuccess, () => {})
    .catch(async (err) => {
      if (err?.name === 'NotAllowedError' || String(err).includes('NotAllowedError')) throw err
      const cameras = await Html5Qrcode.getCameras().catch(() => [])
      if (!cameras.length) throw err
      const back = cameras.find(c => /back|rear|arri[eè]re|environment/i.test(c.label)) || cameras[cameras.length - 1]
      return scanner.start(back.id, SCAN_CONFIG, onScanSuccess, () => {})
    })

  try {
    await scannerStarting
    if (session === scanSession) scannerRunning.value = true
  } catch (err) {
    console.error('Erreur ouverture caméra :', err)
    if (session === scanSession) {
      scanError.value = String(err).includes('NotAllowedError')
        ? "Permission caméra refusée. Autorise l'accès à la caméra dans les réglages."
        : "Impossible d'ouvrir la caméra. Réessaie ou entre le code à la main."
    }
  } finally {
    scannerStarting = null
  }
}

async function stopScanner() {
  scanSession++
  scannerRunning.value = false
  const scanner = html5QrcodeScanner
  html5QrcodeScanner = null
  if (!scanner) return

  if (scannerStarting) await scannerStarting.catch(() => {})

  try {
    const { Html5QrcodeScannerState } = await loadQrLib()
    const state = scanner.getState()
    if (state === Html5QrcodeScannerState.SCANNING || state === Html5QrcodeScannerState.PAUSED) {
      await scanner.stop()
    }
  } catch (err) {
    console.error('Erreur arrêt scanner :', err)
  }
  // Filet de sécurité iOS : si la caméra reste ouverte, les ouvertures suivantes échouent
  document.querySelectorAll('#reader video').forEach((v) => {
    v.srcObject?.getTracks?.().forEach(t => t.stop())
    v.srcObject = null
  })
  try {
    scanner.clear()
  } catch {}
}

async function closeScanner() {
  await stopScanner()
  currentScreen.value = 'main'
}

async function onScanSuccess(decodedText) {
  if (scanHandled) return
  scanHandled = true
  try {
    await stopScanner()
    await lookupBarcode(decodedText)
  } catch (e) {
    console.error('Erreur scan ou API :', e)
    scanError.value = 'Erreur pendant le scan ou la recherche du produit.'
  }
}

function isValidBarcode(code) {
  if (!/^(\d{8}|\d{12}|\d{13})$/.test(code)) return false
  const digits = code.split('').map(Number)
  const check = digits.pop()
  const sum = digits.reverse().reduce((s, d, i) => s + d * (i % 2 === 0 ? 3 : 1), 0)
  return (10 - (sum % 10)) % 10 === check
}

const ocrLoading = ref(false)
const ocrFileInput = ref(null)

async function readDigitsFromCamera() {
  const video = document.querySelector('#reader video')
  if (!video?.videoWidth) {
    ocrFileInput.value?.click()
    return
  }
  await readDigits(await toJpegBase64(video, 1600))
}

async function onOcrFileSelect(e) {
  const file = e.target.files?.[0]
  e.target.value = ''
  if (file) await readDigits(await toJpegBase64(file, 1600))
}

async function readDigits(imageBase64) {
  ocrLoading.value = true
  scanError.value = ''
  try {
    const { digits } = await $fetch('/api/read-barcode', {
      method: 'POST',
      body: { imageBase64, mimeType: 'image/jpeg' }
    })
    const code = String(digits || '')
    if (isValidBarcode(code)) {
      scanHandled = true
      await stopScanner()
      manualBarcode.value = code
      await lookupBarcode(code)
    } else if (code.length >= 8) {
      manualBarcode.value = code
      manualInputOpen.value = true
      scanError.value = `Numéro lu : ${code}. Il semble incomplet, vérifie-le puis valide.`
    } else {
      scanError.value = 'Aucun numéro lisible. Rapproche la caméra des chiffres sous le code-barres.'
    }
  } catch (e) {
    console.error('Erreur lecture chiffres :', e)
    scanError.value = e?.statusCode === 429
      ? 'Trop de lectures d’affilée, réessaie dans quelques secondes.'
      : 'Erreur pendant la lecture des chiffres. Réessaie.'
  } finally {
    ocrLoading.value = false
  }
}

watch(() => props.active, (active) => {
  if (!active && currentScreen.value === 'scanner') closeScanner()
  if (active) retryDailyIfNeeded()
})

function onVisibilityChange() {
  if (!document.hidden) {
    refreshToday()
    retryDailyIfNeeded()
  }
  if (currentScreen.value !== 'scanner') return
  // iOS coupe la caméra quand l'app passe en arrière-plan : on la relance au retour
  if (document.hidden) stopScanner()
  else if (!scanResult.value) startScanner()
}

onMounted(() => {
  document.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('online', retryDailyIfNeeded)
})
onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', onVisibilityChange)
  window.removeEventListener('online', retryDailyIfNeeded)
})

// Après chaque recherche (scan, photo des chiffres, saisie) : le résultat est amené à l'écran
// (sur petit iPhone, il tombait sous les boutons)
const scanOutcomeEl = ref(null)
async function lookupBarcode(barcode) {
  try {
    await searchBarcode(barcode)
  } finally {
    manualInputOpen.value = false
    nextTick(() => scanOutcomeEl.value?.scrollIntoView({ behavior: 'smooth', block: 'center' }))
  }
}

async function searchBarcode(barcode) {
  notFoundBarcode.value = ''
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
      img: existingShared.img || CUSTOM_FOOD_IMG,
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
      img: p.image_url || p.image_front_url || CUSTOM_FOOD_IMG,
      k: Math.round(p.nutriments?.['energy-kcal_100g'] || p.nutriments?.['energy-kcal'] || 0),
      p: Number(p.nutriments?.proteins_100g || 0),
      c: Number(p.nutriments?.carbohydrates_100g || 0),
      f: Number(p.nutriments?.fat_100g || 0),
      cat: 'Scannés'
    }

    await saveScannedFoodToSharedLibrary(barcode, food)

    // Fiche Open Food Facts parfois vide : on invite à compléter les valeurs
    const incomplete = !food.k && !food.p && !food.c && !food.f
    scanResult.value = {
      nom: food.name,
      message: incomplete
        ? 'Trouvé, mais sans valeurs nutritionnelles : corrige-les ci-dessous.'
        : 'Produit trouvé ! Ajouté à la base partagée, clique pour ajouter.',
      data: food
    }

    scanError.value = ''
  } else {
    scanResult.value = null
    notFoundBarcode.value = barcode
    scanError.value = `Produit introuvable pour le code ${barcode}`
  }
}

async function submitManualBarcode() {
  const code = manualBarcode.value.replace(/\D/g, '')
  if (!code) return
  scanError.value = ''
  scanResult.value = null

  try {
    scanHandled = true
    await stopScanner()
    await lookupBarcode(code)
  } catch (e) {
    console.error(e)
    scanError.value = 'Erreur pendant la recherche du produit.'
  }
}

function addScannedFood() {
  if (scanResult.value?.data) {
    stopScanner()
    lastScreenBeforeQuantity.value = 'scanner'
    selectedFood.value = scanResult.value.data
    amount.value = 100
    currentScreen.value = 'quantity'
  }
}

// Produit introuvable (ou valeurs manquantes) : on le remplit soi-même. Il est gardé dans la base partagée
// avec son code-barres, donc le prochain scan le trouve directement
const CUSTOM_FIELDS = [
  { key: 'k', label: 'Calories', unit: 'kcal', color: 'text-slate-400' },
  { key: 'p', label: 'Protéines', unit: 'g', color: 'text-blue-400' },
  { key: 'c', label: 'Glucides', unit: 'g', color: 'text-orange-400' },
  { key: 'f', label: 'Lipides', unit: 'g', color: 'text-[#9DFF00]' }
]
const notFoundBarcode = ref('')
const customFood = reactive({ barcode: '', name: '', img: '', k: '', p: '', c: '', f: '', editing: false })
const customFoodError = ref('')
const customFoodSaving = ref(false)

function openCustomFood(barcode, base = null) {
  const value = (n) => (Number(n) > 0 ? String(n) : '')
  Object.assign(customFood, {
    barcode,
    editing: !!base,
    name: base?.name && base.name !== 'Produit inconnu' ? base.name : '',
    // Anciennes fiches sans photo : image externe remplacée par l'image locale
    img: base?.img && !base.img.includes('placehold.co') ? base.img : '',
    k: value(base?.k),
    p: value(base?.p),
    c: value(base?.c),
    f: value(base?.f)
  })
  customFoodError.value = ''
  stopScanner()
  currentScreen.value = 'customFood'
}

// Accepte la virgule (clavier français) : "12,5" -> 12.5 ; champ vide -> 0
function parseNutrient(v) {
  const s = String(v ?? '').trim().replace(',', '.')
  return s === '' ? 0 : Number(s)
}

async function submitCustomFood() {
  if (customFoodSaving.value) return
  customFoodError.value = ''
  const name = customFood.name.trim()
  const [k, p, c, f] = ['k', 'p', 'c', 'f'].map(key => parseNutrient(customFood[key]))

  if (!name) {
    customFoodError.value = 'Donne un nom au produit.'
    return
  }
  if (!String(customFood.k).trim() || !Number.isFinite(k) || k < 0 || k > 900) {
    customFoodError.value = 'Indique les calories pour 100 g (entre 0 et 900).'
    return
  }
  if ([p, c, f].some(v => !Number.isFinite(v) || v < 0 || v > 100) || p + c + f > 100.5) {
    customFoodError.value = 'Protéines, glucides et lipides : en grammes pour 100 g (100 g au total maximum).'
    return
  }

  const round1 = n => Math.round(n * 10) / 10
  const food = {
    barcode: customFood.barcode,
    name,
    img: customFood.img || CUSTOM_FOOD_IMG,
    k: Math.round(k),
    p: round1(p),
    c: round1(c),
    f: round1(f),
    cat: 'Scannés'
  }

  customFoodSaving.value = true
  try {
    if (food.barcode) await saveScannedFoodToSharedLibrary(food.barcode, food)
  } finally {
    customFoodSaving.value = false
  }

  notFoundBarcode.value = ''
  lastScreenBeforeQuantity.value = 'customFood'
  selectedFood.value = food
  amount.value = 100
  currentScreen.value = 'quantity'
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

// Objectifs calculés avec le profil (poids, taille, âge, activité, objectif)
const autoBesoins = computed(() => {
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

// Les objectifs de l'utilisateur remplacent le calcul quand il en a choisi
const liveBesoins = computed(() => profil.objectifsPerso || autoBesoins.value)

const goalsOpen = ref(false)
const goalsForm = reactive({ custom: false, kcal: '', prot: '', carbs: '', fats: '' })
const goalsError = ref('')
const GOAL_FIELDS = [
  { key: 'kcal', label: 'Calories', short: 'kcal', unit: 'kcal', color: 'text-slate-400' },
  { key: 'prot', label: 'Protéines', short: 'Prot', unit: 'g', color: 'text-blue-400' },
  { key: 'carbs', label: 'Glucides', short: 'Gluc', unit: 'g', color: 'text-orange-400' },
  { key: 'fats', label: 'Lipides', short: 'Lip', unit: 'g', color: 'text-[#9DFF00]' }
]
// Calories apportées par les macros saisies (4 kcal/g protéines et glucides, 9 kcal/g lipides)
const goalsMacroKcal = computed(() => Math.round(
  (parseNutrient(goalsForm.prot) || 0) * 4 + (parseNutrient(goalsForm.carbs) || 0) * 4 + (parseNutrient(goalsForm.fats) || 0) * 9
))

function openGoals() {
  const g = profil.objectifsPerso || autoBesoins.value
  Object.assign(goalsForm, {
    custom: !!profil.objectifsPerso,
    kcal: String(g.kcal),
    prot: String(g.prot),
    carbs: String(g.carbs),
    fats: String(g.fats)
  })
  goalsError.value = ''
  goalsOpen.value = true
}

function saveGoals() {
  goalsError.value = ''
  if (goalsForm.custom) {
    const [kcal, prot, carbs, fats] = ['kcal', 'prot', 'carbs', 'fats'].map(k => parseNutrient(goalsForm[k]))
    if (!Number.isFinite(kcal) || kcal < 500 || kcal > 10000) {
      goalsError.value = 'Calories : entre 500 et 10 000 kcal.'
      return
    }
    if ([prot, carbs, fats].some(v => !Number.isFinite(v) || v < 0 || v > 2000)) {
      goalsError.value = 'Protéines, glucides et lipides : en grammes (0 à 2 000).'
      return
    }
    profil.objectifsPerso = { kcal: Math.round(kcal), prot: Math.round(prot), carbs: Math.round(carbs), fats: Math.round(fats) }
  } else {
    profil.objectifsPerso = null
  }
  goalsOpen.value = false
  // Le jour en cours garde une copie de ses objectifs (historique, médailles)
  if (isToday.value) saveDaily()
}

const activeBesoins = computed(() => (!isToday.value && frozenBesoins.value) ? frozenBesoins.value : liveBesoins.value)

const total = computed(() => {
  const t = consumed.value.reduce(
    (a, c) => ({
      kcal: a.kcal + (Number(c.kcal) || 0),
      prot: a.prot + (Number(c.prot) || 0),
      carbs: a.carbs + (Number(c.carbs) || 0),
      fats: a.fats + (Number(c.fats) || 0)
    }),
    { kcal: 0, prot: 0, carbs: 0, fats: 0 }
  )
  // Arrondi : la somme de décimales donnait des affichages comme 93.19999999999999 g
  const round1 = n => Math.round(n * 10) / 10
  return { kcal: Math.round(t.kcal), prot: round1(t.prot), carbs: round1(t.carbs), fats: round1(t.fats) }
})

const headerEl = ref(null)
const journalEl = ref(null)
const expandedIndex = ref(null)

function toggleDetails(i) {
  expandedIndex.value = expandedIndex.value === i ? null : i
}

function scrollToJournal() {
  if (!journalEl.value) return
  // Décalage des barres collantes (barre FitTrack, + en-tête Nutrition sur grand écran) pour ne pas cacher le journal
  const appHeader = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--app-header-h')) || 0
  const nutritionHeader = headerEl.value && getComputedStyle(headerEl.value).position === 'sticky' ? headerEl.value.offsetHeight : 0
  const stickyOffset = appHeader + nutritionHeader + 16
  const top = journalEl.value.getBoundingClientRect().top + window.scrollY - stickyOffset
  window.scrollTo({ top, behavior: 'smooth' })
}

const progressKcal = computed(() => Math.min(100, (total.value.kcal / activeBesoins.value.kcal) * 100) || 0)
const progressCarbs = computed(() => Math.min(100, (total.value.carbs / activeBesoins.value.carbs) * 100) || 0)
const progressProt = computed(() => Math.min(100, (total.value.prot / activeBesoins.value.prot) * 100) || 0)
const progressFats = computed(() => Math.min(100, (total.value.fats / activeBesoins.value.fats) * 100) || 0)
const progressEau = computed(() => Math.min(100, (eau.value / 3.0) * 100) || 0)

function changeDay(d) {
  cancelEdit()
  expandedIndex.value = null
  const date = new Date(selectedDateObj.value)
  date.setDate(date.getDate() + d)
  selectedDateObj.value = date
  fetchDaily()
}

async function adjustWater(v) {
  if (!(await ensureDayLoaded())) return
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
  const target = lastScreenBeforeQuantity.value || 'main'
  currentScreen.value = target
  if (target === 'scanner') startScanner()
}

let addingFood = false
async function addFood() {
  if (addingFood || !selectedFood.value) return
  const { name, img, k, p, c, f } = selectedFood.value
  const item = { name, img, amount: amount.value, meal: targetMeal.value, base: { k, p, c, f }, ...calculatedMacros.value }

  addingFood = true
  try {
    if (!(await ensureDayLoaded())) {
      alert("Ton journal n'a pas pu être chargé. Vérifie ta connexion puis réessaie.")
      return
    }
    consumed.value.push(item)
    showMeal(item.meal)
    selectedFood.value = null
    currentScreen.value = 'main'
    saveDaily()
  } finally {
    addingFood = false
  }
}

function removeItem(i) {
  cancelEdit()
  expandedIndex.value = null
  consumed.value.splice(i, 1)
  saveDaily()
}

function moveItem(i, meal) {
  const item = consumed.value[i]
  if (!item || item.meal === meal) return
  consumed.value[i] = { ...item, meal }
  showMeal(meal)
  saveDaily()
}

const editingIndex = ref(null)
const editAmount = ref(0)
const editInputEl = ref(null)

function startEdit(i) {
  editingIndex.value = i
  editAmount.value = consumed.value[i].amount
  nextTick(() => editInputEl.value?.select())
}

function cancelEdit() {
  editingIndex.value = null
  editInputEl.value = null
}

function confirmEdit(i) {
  const item = consumed.value[i]
  const grams = Number(editAmount.value)
  cancelEdit()
  if (!item || !(grams > 0) || grams === item.amount) return

  // Anciennes entrées sans `base` : valeurs exactes de la bibliothèque, sinon déduites des macros arrondies (non sauvegardées)
  const libFood = !item.base && mergedFoodLibrary.value.find(f => f.name === item.name)
  const base = item.base || (libFood && { k: libFood.k, p: libFood.p, c: libFood.c, f: libFood.f })
  const per100 = base || (item.amount > 0 && {
    k: item.kcal * 100 / item.amount,
    p: item.prot * 100 / item.amount,
    c: item.carbs * 100 / item.amount,
    f: item.fats * 100 / item.amount
  })
  if (!per100) return

  consumed.value[i] = { ...item, amount: grams, ...(base && { base }), ...macrosFor(per100, grams) }
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

const filteredDb = computed(() => {
  const entries = searchIndex.value.filter(e => activeCatFilter.value === 'Tout' || e.food.cat === activeCatFilter.value)
  const tokens = searchWords(searchQuery.value)
  if (!tokens.length) return entries.map(e => e.food)

  // Chaque mot tapé doit correspondre au début d'un mot du nom ("oeuf" ne remonte pas "Boeuf"),
  // sinon on retombe sur une recherche "contient"
  const rank = (prefixOnly) => entries
    .map(e => {
      let score = 0
      for (const t of tokens) {
        const i = e.words.findIndex(w => w.startsWith(t))
        if (i === 0) score += 3
        else if (i > 0) score += 2
        else if (!prefixOnly && t.length >= 4 && e.text.includes(t)) score += 1
        else return null
      }
      return { food: e.food, score }
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.food.name.length - b.food.name.length)
    .map(r => r.food)

  const strict = rank(true)
  return strict.length ? strict : rank(false)
})

function macrosFor(per100, grams) {
  const r = grams / 100
  return {
    kcal: Math.round(per100.k * r),
    prot: +(per100.p * r).toFixed(1),
    carbs: +(per100.c * r).toFixed(1),
    fats: +(per100.f * r).toFixed(1)
  }
}

const calculatedMacros = computed(() => selectedFood.value ? macrosFor(selectedFood.value, amount.value) : {})

function onImageError(e) {
  // Une seule tentative : hors ligne, l'image de secours échoue aussi et bouclerait
  if (e.target.dataset.fallback) return
  e.target.dataset.fallback = '1'
  e.target.src = CUSTOM_FOOD_IMG
}

// ── Analyse IA ──

function openCamera() {
  clearAiState()
  targetMeal.value = mealForNow()
  currentScreen.value = 'camera'
}

function triggerFileInput() {
  fileInputRef.value?.click()
}

// Redimensionne (photo ou image de la caméra) en JPEG base64 pour rester sous la limite de 4 Mo de Groq
async function toJpegBase64(source, maxSide = 1280) {
  let el = source
  let url = null
  if (source instanceof Blob) {
    url = URL.createObjectURL(source)
    el = new Image()
    el.src = url
    await el.decode()
  }
  const w = el.videoWidth || el.naturalWidth
  const h = el.videoHeight || el.naturalHeight
  const scale = Math.min(1, maxSide / Math.max(w, h))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(w * scale)
  canvas.height = Math.round(h * scale)
  canvas.getContext('2d').drawImage(el, 0, 0, canvas.width, canvas.height)
  if (url) URL.revokeObjectURL(url)
  return canvas.toDataURL('image/jpeg', 0.85).split(',')[1]
}

async function handleImageSelect(e) {
  const file = e.target.files?.[0]
  if (!file) return

  aiImageMime.value = 'image/jpeg'
  aiResult.value = null
  aiError.value = null

  try {
    const base64 = await toJpegBase64(file)
    aiImageBase64.value = base64
    aiImage.value = `data:image/jpeg;base64,${base64}`
  } catch (err) {
    console.error('Erreur lecture image :', err)
    aiError.value = "Impossible de lire cette image."
  }
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