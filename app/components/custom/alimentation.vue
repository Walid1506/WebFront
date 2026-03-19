<template>
  <div class="w-full max-w-7xl mx-auto space-y-6 pb-20 pt-4 px-4 min-h-screen bg-black text-white font-sans">
    
    <Transition name="slide" mode="out-in">
      
      <div v-if="currentScreen === 'main'" key="main" class="flex flex-col gap-6">
        
        <div class="bg-black/80 backdrop-blur-xl sticky top-0 z-40 py-4 border-b border-white/5 space-y-4">
          <div class="flex justify-between items-center">
            <h1 class="text-4xl font-[1000] tracking-tighter text-white">Nutrition</h1>
            <div class="flex gap-4">
              <button @click="currentScreen = 'scanner'" class="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-colors border border-white/5 group">
                <UIcon name="i-heroicons-qr-code" class="text-2xl text-slate-400 group-hover:text-white" />
              </button>
              <button @click="currentScreen = 'cart'" class="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center hover:bg-slate-800 transition-colors border border-white/5 relative group">
                <UIcon name="i-heroicons-shopping-cart" class="text-2xl text-slate-400 group-hover:text-white" />
                <span v-if="shoppingList.length > 0" class="absolute -top-2 -right-2 bg-blue-500 text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center shadow-lg">{{ shoppingList.length }}</span>
              </button>
            </div>
          </div>

          <div class="flex items-center justify-between bg-slate-900/50 p-2 rounded-2xl border border-white/5 w-full max-w-md mx-auto">
            <button @click="changeDay(-1)" class="p-3 bg-slate-800 rounded-xl hover:bg-slate-700 transition"><UIcon name="i-heroicons-chevron-left" class="text-white" /></button>
            <div class="text-center">
              <p class="font-[1000] text-lg text-white" :class="isToday ? 'text-blue-500' : ''">{{ isToday ? "Aujourd'hui" : formattedSelectedDate }}</p>
            </div>
            <button @click="changeDay(1)" :disabled="isToday" class="p-3 bg-slate-800 rounded-xl transition" :class="isToday ? 'opacity-30 cursor-not-allowed' : 'hover:bg-slate-700'"><UIcon name="i-heroicons-chevron-right" class="text-white" /></button>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div class="lg:col-span-5 space-y-8">
            <div class="bg-[#0a0a0a] rounded-[35px] p-6 border border-white/5 shadow-2xl relative overflow-hidden">
              <div class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>
              <div class="flex justify-between items-center mb-6">
                <h2 class="text-xl font-[1000] text-white flex items-center gap-2">
                  <UIcon name="i-heroicons-adjustments-horizontal" class="text-blue-500" /> Profil & Métabolisme
                </h2>
                <button @click="isSettingsOpen = !isSettingsOpen" class="text-slate-400 hover:text-white text-sm font-bold bg-slate-900 px-3 py-1 rounded-full border border-white/5">{{ isSettingsOpen ? 'Masquer' : 'Modifier' }}</button>
              </div>
              
              <div v-if="isSettingsOpen" class="grid grid-cols-2 gap-4 mb-6 animate-in fade-in zoom-in-95">
                <div class="bg-slate-900 rounded-2xl p-3 border border-white/5">
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Poids (kg)</label>
                  <input v-model.number="profil.poids" @change="saveGlobals" type="number" class="w-full bg-transparent text-white font-bold text-lg outline-none" />
                </div>
                <div class="bg-slate-900 rounded-2xl p-3 border border-white/5">
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Taille (cm)</label>
                  <input v-model.number="profil.taille" @change="saveGlobals" type="number" class="w-full bg-transparent text-white font-bold text-lg outline-none" />
                </div>
                <div class="bg-slate-900 rounded-2xl p-3 border border-white/5">
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Âge</label>
                  <input v-model.number="profil.age" @change="saveGlobals" type="number" class="w-full bg-transparent text-white font-bold text-lg outline-none" />
                </div>
                <div class="bg-slate-900 rounded-2xl p-3 border border-white/5">
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Genre</label>
                  <select v-model="profil.genre" @change="saveGlobals" class="w-full bg-transparent text-white font-bold outline-none text-sm appearance-none">
                    <option value="homme" class="bg-slate-900">Homme</option>
                    <option value="femme" class="bg-slate-900">Femme</option>
                  </select>
                </div>
                <div class="bg-slate-900 rounded-2xl p-3 border border-white/5">
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Activité</label>
                  <select v-model.number="profil.activite" @change="saveGlobals" class="w-full bg-transparent text-white font-bold outline-none text-[13px] appearance-none">
                    <option :value="1.2">Sédentaire</option>
                    <option :value="1.375">Léger (1-3x)</option>
                    <option :value="1.55">Modéré (3-5x)</option>
                    <option :value="1.725">Intense (6-7x)</option>
                  </select>
                </div>
                <div class="bg-slate-900 rounded-2xl p-3 border border-white/5">
                  <label class="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Objectif</label>
                  <select v-model="profil.objectif" @change="saveGlobals" class="w-full bg-transparent text-white font-bold outline-none text-sm appearance-none">
                    <option value="seche">Sèche</option>
                    <option value="maintien">Maintien</option>
                    <option value="masse">Prise de masse</option>
                  </select>
                </div>
              </div>

              <div class="flex items-center justify-between bg-blue-500/10 border border-blue-500/20 p-4 rounded-2xl">
                <div>
                  <p class="text-[10px] font-black text-blue-400 uppercase tracking-widest">Ton IMC</p>
                  <p class="text-white font-[1000] text-2xl">{{ imc }}</p>
                </div>
                <div class="text-right">
                  <p class="text-[10px] font-black text-blue-400 uppercase tracking-widest">Cible Journalière</p>
                  <p class="text-white font-[1000] text-2xl">{{ activeBesoins.kcal }} <span class="text-sm font-bold text-slate-400">kcal</span></p>
                </div>
              </div>
              <p v-if="!isToday" class="text-center text-[10px] font-bold text-orange-500 mt-3 flex items-center justify-center gap-1"><UIcon name="i-heroicons-lock-closed" /> Cibles métaboliques figées pour cette date.</p>
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
                    <button @click="adjustWater(-0.1)" class="w-8 h-8 rounded-full bg-slate-800 text-white font-black">-</button>
                    <UIcon name="i-heroicons-beaker" class="text-blue-500" />
                    <button @click="adjustWater(0.1)" class="w-8 h-8 rounded-full bg-slate-800 text-white font-black">+</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-7 space-y-8">
            <button @click="currentScreen = 'library'" class="w-full bg-[#2F6BFF] text-white font-black text-xl py-6 rounded-[30px] shadow-lg hover:bg-blue-600 transition-all flex items-center justify-center gap-3">
              <UIcon name="i-heroicons-plus-circle" class="text-3xl" /> Ajouter un aliment
            </button>

            <div class="bg-[#111111] p-8 rounded-[35px] border border-white/5 space-y-6">
              <div v-for="macro in [['Glucides', total.carbs, activeBesoins.carbs, '#FF9500', progressCarbs], ['Protéines', total.prot, activeBesoins.prot, '#2F6BFF', progressProt], ['Lipides', total.fats, activeBesoins.fats, '#9DFF00', progressFats]]" :key="macro[0]">
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
                <h3 class="text-white font-bold text-xl flex items-center gap-3"><UIcon name="i-heroicons-shopping-bag" /> Journal</h3>
                <span class="bg-slate-800 px-4 py-1.5 rounded-full text-sm font-black">{{ consumed.length }}</span>
              </div>
              <div class="p-4 space-y-2">
                <div v-if="consumed.length === 0" class="text-center text-slate-500 font-bold py-10">Journal vide pour ce jour.</div>
                <div v-for="(item, index) in consumed" :key="index" class="flex justify-between items-center group p-4 rounded-2xl hover:bg-slate-900 border border-transparent hover:border-white/5 transition-all">
                  <div class="flex items-center gap-4 text-left">
                    <img :src="item.img" class="w-14 h-14 rounded-xl object-cover bg-white shrink-0" @error="onImageError" referrerpolicy="no-referrer" />
                    <div>
                      <p class="text-white font-bold text-lg leading-tight">{{ item.name }}</p>
                      <p class="text-[#2F6BFF] font-black text-xs mt-1">{{ item.amount }} g • {{ item.kcal }} kcal</p>
                    </div>
                  </div>
                  <button @click="removeItem(index)" class="text-red-500/50 hover:text-red-500 p-3 bg-red-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all"><UIcon name="i-heroicons-trash" class="text-xl" /></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="currentScreen === 'library'" key="library" class="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl">
        <div class="w-full max-w-7xl mx-auto flex flex-col h-full">
          <div class="sticky top-0 z-30 bg-black/95 backdrop-blur-xl px-4 sm:px-8 pt-4 sm:pt-8 pb-4 border-b border-white/10">
            <div class="flex items-center justify-between mb-4 gap-4">
              <button @click="currentScreen = 'main'" class="flex items-center gap-2 text-slate-400 hover:text-white transition shrink-0">
                <UIcon name="i-heroicons-arrow-left" class="text-3xl" />
              </button>
              <div class="relative w-full max-w-2xl">
                <UIcon name="i-heroicons-magnifying-glass" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 text-2xl" />
                <input v-model="searchQuery" type="text" placeholder="Rechercher un aliment..." class="w-full bg-[#1A1A1A] text-white font-bold text-lg rounded-2xl py-4 pl-14 pr-6 outline-none focus:ring-2 focus:ring-[#2F6BFF] transition-all" />
              </div>
            </div>
            <div class="overflow-x-auto no-scrollbar">
              <div class="flex gap-3 min-w-max pb-1">
                <button v-for="cat in catFilters" :key="cat" @click="activeCatFilter = cat" :class="activeCatFilter === cat ? 'bg-[#2F6BFF] text-white' : 'bg-slate-900 text-slate-400 hover:bg-slate-800'" class="px-6 py-3 rounded-full font-black text-sm uppercase whitespace-nowrap transition-colors shrink-0">
                  {{ cat }}
                </button>
              </div>
            </div>
          </div>
          <div class="flex-1 overflow-y-auto px-4 sm:px-8 py-6">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
              <div v-for="food in filteredDb" :key="food.id" @click="selectFood(food)" class="bg-[#111111] p-5 rounded-[30px] flex flex-col cursor-pointer border border-white/5 hover:border-[#2F6BFF]/30 transition-all group">
                <div class="flex items-start gap-4 mb-4">
                  <img :src="food.img" class="w-20 h-20 rounded-2xl object-cover bg-white shrink-0" @error="onImageError" referrerpolicy="no-referrer" />
                  <div class="flex-1 min-w-0 text-left">
                    <h4 class="text-white font-black text-lg leading-tight group-hover:text-[#2F6BFF] transition-colors">{{ food.name }}</h4>
                    <p class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">{{ food.cat }}</p>
                  </div>
                  <button @click.stop="addFoodToCartFromLibrary(food)" class="p-2 rounded-xl transition-colors bg-slate-800 text-slate-400 hover:bg-blue-500 hover:text-white shrink-0">
                    <UIcon name="i-heroicons-shopping-cart-solid" class="text-lg" />
                  </button>
                </div>
                <div class="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <div class="flex gap-3 text-xs font-black">
                    <span class="text-blue-500">P:{{ food.p }}</span><span class="text-orange-500">G:{{ food.c }}</span><span class="text-[#9DFF00]">L:{{ food.f }}</span>
                  </div>
                  <span class="text-white font-black text-sm bg-white/10 px-3 py-1 rounded-lg">{{ food.k }} kcal</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="currentScreen === 'quantity' && selectedFood" key="quantity" class="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
        <button @click="currentScreen = 'library'" class="absolute top-8 left-8 text-slate-400 hover:text-white transition"><UIcon name="i-heroicons-arrow-left" class="text-4xl" /></button>
        <img :src="selectedFood.img" class="w-48 h-48 rounded-full object-cover border-4 border-[#2F6BFF] mb-8 shadow-2xl" @error="onImageError" referrerpolicy="no-referrer" />
        <h3 class="text-4xl font-[1000] text-white mb-8 text-center">{{ selectedFood.name }}</h3>
        <div class="bg-[#111111] border border-white/10 p-8 rounded-[40px] mb-8 w-full max-w-md text-center">
          <input v-model.number="amount" type="number" class="bg-transparent text-white font-[1000] text-7xl text-center w-full outline-none mb-4" placeholder="0" />
          <p class="text-blue-500 font-black">Grammes</p>
          <div class="flex justify-between border-t border-white/5 mt-6 pt-6 text-center">
            <div><p class="text-slate-500 text-[10px] font-black uppercase">Calories</p><p class="text-white font-bold text-xl">{{ calculatedMacros.kcal }}</p></div>
            <div><p class="text-blue-500 text-[10px] font-black uppercase">Prot</p><p class="text-white font-bold text-xl">{{ calculatedMacros.prot }}g</p></div>
            <div><p class="text-orange-500 text-[10px] font-black uppercase">Gluc</p><p class="text-white font-bold text-xl">{{ calculatedMacros.carbs }}g</p></div>
          </div>
        </div>
        <button @click="addFood" class="w-full max-w-md bg-[#2F6BFF] text-white font-black text-2xl py-6 rounded-[30px] shadow-lg hover:bg-blue-600 transition-all">Ajouter au journal</button>
      </div>

      <div v-else-if="currentScreen === 'cart'" key="cart" class="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex flex-col items-center p-6">
        <div class="w-full max-w-3xl bg-[#111111] rounded-[40px] border border-white/10 flex flex-col h-full overflow-hidden">
          <div class="p-8 flex justify-between items-center border-b border-white/5 bg-black/50">
            <div class="flex items-center gap-6">
              <button @click="currentScreen = 'main'" class="text-slate-400 hover:text-white transition"><UIcon name="i-heroicons-arrow-left" class="text-3xl" /></button>
              <h2 class="text-3xl font-[1000] text-white">Courses</h2>
            </div>
            <button v-if="shoppingList.length > 0" @click="clearCart" class="text-red-500 font-bold bg-red-500/10 px-4 py-2 rounded-xl">Vider tout</button>
          </div>
          <div class="p-8 flex gap-4 border-b border-white/5">
            <input v-model="newCartItem" @keyup.enter="addCustomCartItem" type="text" placeholder="Ajouter produit..." class="flex-1 bg-slate-900 border border-white/10 text-white font-bold py-4 px-6 rounded-2xl outline-none focus:border-blue-500" />
            <button @click="addCustomCartItem" class="bg-blue-600 text-white font-black px-8 rounded-2xl">Ajouter</button>
          </div>
          <div class="flex-1 overflow-y-auto p-8 space-y-3 custom-scrollbar">
            <div v-for="(item, index) in shoppingList" :key="index" class="flex justify-between items-center p-5 bg-[#0a0a0a] rounded-3xl border border-white/5 transition-all" :class="item.checked ? 'opacity-40' : ''">
              <div class="flex items-center gap-4 flex-1 text-left">
                <button @click="toggleCheck(index)" class="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors shrink-0" :class="item.checked ? 'bg-green-500 border-green-500 text-black' : 'border-slate-600'">
                  <UIcon v-if="item.checked" name="i-heroicons-check" class="font-black" />
                </button>
                <h4 class="font-black text-xl flex-1" :class="item.checked ? 'line-through' : ''">{{ item.name }}</h4>
              </div>
              <button @click="removeCartItem(index)" class="text-red-500/50 hover:text-red-500 ml-4"><UIcon name="i-heroicons-trash" class="text-2xl" /></button>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="currentScreen === 'scanner'" key="scanner" class="fixed inset-0 z-[110] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center p-6">
        <button @click="currentScreen = 'main'" class="absolute top-8 left-8 text-slate-400 bg-slate-900 p-4 rounded-full"><UIcon name="i-heroicons-x-mark" class="text-2xl" /></button>
        <div class="w-full max-w-md flex flex-col items-center">
          <div class="w-72 h-72 border-4 border-[#2F6BFF] rounded-[40px] relative flex items-center justify-center mb-10 bg-slate-900/50">
            <div class="absolute w-full h-1 bg-[#2F6BFF] animate-[scan_2s_ease-in-out_infinite]"></div>
            <UIcon name="i-heroicons-qr-code" class="text-8xl text-slate-700" />
          </div>
          <button @click="simulateScan" class="w-full bg-white text-black font-[1000] py-5 rounded-[24px] shadow-xl mb-8">Simuler Scan</button>
          <div v-if="scanResult" class="p-6 rounded-[30px] w-full border-2 animate-in slide-in-from-bottom-10" :class="scanResult.compatible ? 'bg-green-500/10 border-green-500 text-green-400' : 'bg-red-500/10 border-red-500 text-red-400'">
            <h4 class="font-[1000] text-2xl text-white">{{ scanResult.nom }}</h4>
            <p class="text-sm font-bold">{{ scanResult.message }}</p>
          </div>
        </div>
      </div>

    </Transition>
  </div>
</template>

<script setup>
import { foodLibrary } from '~/data/foodLibrary'
const supabase = useSupabaseClient()

// --- ÉTATS ---
const currentScreen = ref('main')
const isSettingsOpen = ref(false)
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

const profil = reactive({ poids: 75, taille: 180, age: 25, genre: 'homme', activite: 1.55, objectif: 'masse' })

// --- DATES ---
const selectedDateStr = computed(() => {
  const d = selectedDateObj.value
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`
})
const isToday = computed(() => selectedDateStr.value === new Date().toISOString().split('T')[0])
const formattedSelectedDate = computed(() => selectedDateObj.value.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' }))

// --- LOGIQUE SUPABASE ---
onMounted(async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { data: globals } = await supabase.from('nutrition_globals').select('*').eq('user_id', user.id).maybeSingle()
  if (globals) {
    if (globals.profil) Object.assign(profil, globals.profil)
    if (globals.shopping_list) shoppingList.value = globals.shopping_list
  }
  await fetchDaily()
})

async function fetchDaily() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  consumed.value = []; eau.value = 0; frozenBesoins.value = null
  const { data: dailyList } = await supabase.from('nutrition_daily').select('*').eq('user_id', user.id).eq('date', selectedDateStr.value).limit(1)
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
  const payload = { user_id: user.id, profil: JSON.parse(JSON.stringify(profil)), shopping_list: JSON.parse(JSON.stringify(shoppingList.value)) }
  const { data: exists } = await supabase.from('nutrition_globals').select('id').eq('user_id', user.id).maybeSingle()
  if (exists) await supabase.from('nutrition_globals').update(payload).eq('id', exists.id)
  else await supabase.from('nutrition_globals').insert(payload)
}

async function saveDaily() {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const payload = { eau: Number(eau.value), repas: JSON.parse(JSON.stringify(consumed.value)), cibles: JSON.parse(JSON.stringify(liveBesoins.value)) }
  const { data: exists } = await supabase.from('nutrition_daily').select('id').eq('user_id', user.id).eq('date', selectedDateStr.value).limit(1)
  if (exists?.length > 0) await supabase.from('nutrition_daily').update(payload).eq('id', exists[0].id)
  else await supabase.from('nutrition_daily').insert({ user_id: user.id, date: selectedDateStr.value, ...payload })
  frozenBesoins.value = liveBesoins.value
}

// --- CALCULS ---
const imc = computed(() => profil.poids && profil.taille ? (profil.poids / Math.pow(profil.taille / 100, 2)).toFixed(1) : 0)
const liveBesoins = computed(() => {
  let bmr = (10 * profil.poids) + (6.25 * profil.taille) - (5 * profil.age) + (profil.genre === 'homme' ? 5 : -161)
  let k = Math.round(bmr * profil.activite)
  if (profil.objectif === 'seche') k -= 400
  else if (profil.objectif === 'masse') k += 300
  const prot = Math.round(profil.poids * 2), fats = Math.round(profil.poids * 1)
  return { kcal: k, prot, fats, carbs: Math.round((k - (prot*4) - (fats*9)) / 4) }
})
const activeBesoins = computed(() => (!isToday.value && frozenBesoins.value) ? frozenBesoins.value : liveBesoins.value)
const total = computed(() => consumed.value.reduce((a, c) => ({ kcal: a.kcal + c.kcal, prot: a.prot + c.prot, carbs: a.carbs + c.carbs, fats: a.fats + c.fats }), { kcal: 0, prot: 0, carbs: 0, fats: 0 }))
const progressKcal = computed(() => Math.min(100, (total.value.kcal / activeBesoins.value.kcal) * 100) || 0)
const progressCarbs = computed(() => Math.min(100, (total.value.carbs / activeBesoins.value.carbs) * 100) || 0)
const progressProt = computed(() => Math.min(100, (total.value.prot / activeBesoins.value.prot) * 100) || 0)
const progressFats = computed(() => Math.min(100, (total.value.fats / activeBesoins.value.fats) * 100) || 0)
const progressEau = computed(() => Math.min(100, (eau.value / 3.0) * 100) || 0)

// --- ACTIONS ---
function changeDay(d) { const date = new Date(selectedDateObj.value); date.setDate(date.getDate() + d); selectedDateObj.value = date; fetchDaily() }
function adjustWater(v) { eau.value = Math.max(0, Math.min(3.0, Number((eau.value + v).toFixed(1)))); saveDaily() }
function selectFood(f) { selectedFood.value = f; amount.value = 100; currentScreen.value = 'quantity' }
function addFood() { consumed.value.push({ name: selectedFood.value.name, img: selectedFood.value.img, amount: amount.value, ...calculatedMacros.value }); selectedFood.value = null; currentScreen.value = 'main'; saveDaily() }
function removeItem(i) { consumed.value.splice(i, 1); saveDaily() }
function toggleCheck(i) { shoppingList.value[i].checked = !shoppingList.value[i].checked; saveGlobals() }
function removeCartItem(i) { shoppingList.value.splice(i, 1); saveGlobals() }
function addCustomCartItem() { if (newCartItem.value) { shoppingList.value.push({ name: newCartItem.value, checked: false }); newCartItem.value = ''; saveGlobals() } }
function addFoodToCartFromLibrary(f) { if (!shoppingList.value.some(x => x.name === f.name)) { shoppingList.value.push({ name: f.name, img: f.img, checked: false, cat: f.cat }); saveGlobals() } }
function clearCart() { if (confirm("Tout vider ?")) { shoppingList.value = []; saveGlobals() } }

const filteredDb = computed(() => foodLibrary.filter(f => (activeCatFilter.value === 'Tout' || f.cat === activeCatFilter.value) && f.name.toLowerCase().includes(searchQuery.value.toLowerCase())))
const calculatedMacros = computed(() => { 
  if (!selectedFood.value) return {}; 
  const r = amount.value / 100; 
  return { kcal: Math.round(selectedFood.value.k * r), prot: +(selectedFood.value.p * r).toFixed(1), carbs: +(selectedFood.value.c * r).toFixed(1), fats: +(selectedFood.value.f * r).toFixed(1) } 
})

function onImageError(e) { e.target.src = 'https://placehold.co/600x600/1e293b/94a3b8?text=Aliment' }
function simulateScan() { scanResult.value = null; setTimeout(() => { const r = foodLibrary[Math.floor(Math.random() * foodLibrary.length)]; const g = profil.objectif === 'masse' ? r.k > 150 : r.k < 150; scanResult.value = { nom: r.name, compatible: g, message: g ? "Idéal objectif !" : "Peu adapté objectif." } }, 800) }
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar { width: 0px; background: transparent; }
.no-scrollbar::-webkit-scrollbar { display: none; }
.slide-enter-active, .slide-leave-active { transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1); }
.slide-enter-from { opacity: 0; transform: translateX(30px) scale(0.98); }
.slide-leave-to { opacity: 0; transform: translateX(-30px) scale(0.98); }
@keyframes scan { 0% { top: 0; opacity: 0; } 10% { opacity: 1; } 90% { opacity: 1; } 100% { top: 100%; opacity: 0; } }
</style>