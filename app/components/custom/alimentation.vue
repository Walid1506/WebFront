<template>
  <div class="p-4 max-w-6xl mx-auto space-y-6">
    <div class="bg-slate-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
      <div class="relative z-10">
        <h1 class="text-3xl font-black mb-2 flex items-center gap-3"><UIcon name="i-heroicons-scale" class="text-green-400" />Nutrition & Suivi</h1>
        <p class="text-slate-300 font-medium">Calcule tes besoins et suis tes repas en temps réel.</p>
      </div>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-4 space-y-6">
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
          <h2 class="text-xl font-bold text-slate-900 mb-4">Tes infos</h2>
          <div class="space-y-4">
            <div class="flex gap-4">
              <button @click="setGenre('homme')" class="flex-1 py-2 rounded-xl font-bold border-2 transition text-sm" :class="profil.genre === 'homme' ? 'border-slate-900 bg-slate-900 text-white' : 'border-gray-200 text-gray-400'">Homme</button>
              <button @click="setGenre('femme')" class="flex-1 py-2 rounded-xl font-bold border-2 transition text-sm" :class="profil.genre === 'femme' ? 'border-slate-900 bg-slate-900 text-white' : 'border-gray-200 text-gray-400'">Femme</button>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Poids (kg)</label>
                <input v-model.number="profil.poids" type="number" :class="inputClass" />
              </div>
              <div>
                <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Taille (cm)</label>
                <input v-model.number="profil.taille" type="number" :class="inputClass" />
              </div>
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Âge</label>
              <input v-model.number="profil.age" type="number" :class="inputClass" />
            </div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Activité</label>
              <select v-model.number="profil.activite" class="w-full p-2 bg-gray-50 rounded-xl font-bold text-slate-900 border border-gray-200 outline-none text-sm">
                <option v-for="niveau in niveauxActivite" :key="niveau.value" :value="niveau.value">{{ niveau.label }}</option>
              </select>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
          <h2 class="text-xl font-bold text-slate-900 mb-4">Objectif</h2>
          <div class="grid grid-cols-1 gap-2">
            <button v-for="objectif in objectifs" :key="objectif.id" @click="setObjectif(objectif.id)" class="flex items-center gap-3 p-3 rounded-xl border-2 transition" :class="profil.objectif === objectif.id ? `border-current ${objectif.bg} ${objectif.color}` : 'border-gray-100 text-gray-400 hover:bg-gray-50'">
              <UIcon :name="objectif.icon" class="text-xl" />
              <span class="text-xs font-black uppercase">{{ objectif.label }}</span>
            </button>
          </div>
        </div>
      </div>
      <div class="lg:col-span-8 space-y-6">
        <div v-if="besoins" class="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
          <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div class="flex justify-between items-end mb-2">
                <span class="text-sm font-bold uppercase text-slate-400">Calories</span>
                <span class="font-black text-xl">{{ totalConsomme.kcal }} / <span class="text-green-400">{{ besoins.calories }}</span></span>
              </div>
              <div class="w-full h-4 bg-slate-700 rounded-full overflow-hidden">
                <div class="h-full rounded-full transition-all duration-500 ease-out" :class="restant.kcal < 0 ? 'bg-red-500' : 'bg-gradient-to-r from-green-400 to-emerald-600'" :style="{ width: progress.kcal + '%' }"></div>
              </div>
              <p class="text-xs mt-2 font-bold" :class="restant.kcal < 0 ? 'text-red-400' : 'text-slate-400'">{{ messageCalories }}</p>
            </div>
            <div>
              <div class="flex justify-between items-end mb-2">
                <span class="text-sm font-bold uppercase text-slate-400">Protéines</span>
                <span class="font-black text-xl">{{ totalConsomme.prot }} / <span class="text-blue-400">{{ besoins.proteines }}g</span></span>
              </div>
              <div class="w-full h-4 bg-slate-700 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500 ease-out" :style="{ width: progress.prot + '%' }"></div>
              </div>
              <p class="text-xs mt-2 font-bold text-slate-400">Encore {{ restantProtAffiche }}g à manger</p>
            </div>
          </div>
        </div>
        <div v-else class="bg-gray-100 p-8 rounded-3xl text-center text-gray-500">Remplis tes informations à gauche pour débloquer le tracker.</div>
        <div v-if="besoins" class="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
          <h3 class="text-lg font-bold text-slate-900 mb-4">Ajouter un aliment</h3>
          <div class="flex flex-col md:flex-row gap-3 items-end">
            <div class="flex-1 w-full">
              <label class="text-xs font-bold text-gray-400 uppercase ml-1">Qu'as-tu mangé ?</label>
              <select v-model.number="saisie.alimentId" :class="mealInputClass">
                <option :value="null" disabled>Choisir un aliment...</option>
                <optgroup v-for="groupe in groupesAliments" :key="groupe.id" :label="groupe.label">
                  <option v-for="aliment in alimentsParCategorie(groupe.id)" :key="aliment.id" :value="aliment.id">{{ aliment.nom }}</option>
                </optgroup>
              </select>
            </div>
            <div class="w-32">
              <label class="text-xs font-bold text-gray-400 uppercase ml-1">Quantité (g)</label>
              <input v-model.number="saisie.grammes" type="number" placeholder="100" :class="mealInputClass" @keyup.enter="ajouterAliment" />
            </div>
            <div class="w-full md:w-auto flex flex-col justify-end pb-2 px-2">
              <div v-if="previsu" class="text-xs font-bold text-slate-500">= <span class="text-slate-900">{{ previsu.kcal }}</span> kcal / <span class="text-blue-600">{{ previsu.prot }}g</span> prot</div>
              <div v-else class="text-xs text-gray-300 font-medium pb-1">--</div>
            </div>
            <button @click="ajouterAliment" class="p-3 bg-slate-900 text-white rounded-xl hover:bg-green-600 transition shadow-lg shrink-0" :disabled="!previsu">
              <UIcon name="i-heroicons-plus" class="text-xl" />
            </button>
          </div>
        </div>
        <div v-if="besoins && listeRepas.length" class="space-y-3">
          <h3 class="text-lg font-bold text-slate-900 px-2">Aujourd'hui</h3>
          <div v-for="(repas, index) in listeRepas" :key="repas.id" class="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 group hover:border-green-200 transition">
            <div class="flex items-center gap-3">
              <div class="bg-green-50 text-green-600 p-2 rounded-lg"><UIcon name="i-heroicons-fire" /></div>
              <div>
                <p class="font-bold text-slate-900">{{ repas.nom }} <span class="text-gray-400 font-normal text-xs">({{ repas.grammes }}g)</span></p>
                <p class="text-xs text-gray-400 font-medium">{{ repas.kcal }} kcal • {{ repas.prot }}g prot</p>
              </div>
            </div>
            <button @click="supprimerAliment(index)" class="text-gray-300 hover:text-red-500 p-2 transition"><UIcon name="i-heroicons-trash" class="text-xl" /></button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const inputClass = "w-full p-2 bg-gray-50 rounded-xl font-bold text-slate-900 border border-gray-200 focus:border-green-500 outline-none"
const mealInputClass = "w-full p-3 bg-gray-50 rounded-xl font-bold text-slate-900 border border-gray-200 focus:border-green-500 outline-none"

const profil = reactive({ poids: null, taille: null, age: 25, genre: "homme", activite: 1.375, objectif: "maintien" })

const niveauxActivite = [
  { label: "Sédentaire", value: 1.2 },
  { label: "Léger (1-3x)", value: 1.375 },
  { label: "Modéré (3-5x)", value: 1.55 },
  { label: "Intense (6-7x)", value: 1.725 }
]

const objectifs = [
  { id: "seche", label: "Sèche", icon: "i-heroicons-arrow-trending-down", color: "text-orange-500", bg: "bg-orange-50 border-orange-200" },
  { id: "maintien", label: "Maintien", icon: "i-heroicons-minus", color: "text-blue-500", bg: "bg-blue-50 border-blue-200" },
  { id: "masse", label: "Masse", icon: "i-heroicons-arrow-trending-up", color: "text-green-500", bg: "bg-green-50 border-green-200" }
]

const alimentsBase = [
  { id: 1, nom: "Poulet (Blanc)", kcal: 120, prot: 23, cat: "prot" },
  { id: 2, nom: "Boeuf (5% mg)", kcal: 130, prot: 21, cat: "prot" },
  { id: 3, nom: "Oeuf (Entier)", kcal: 155, prot: 13, cat: "prot" },
  { id: 4, nom: "Thon (Boîte)", kcal: 110, prot: 25, cat: "prot" },
  { id: 5, nom: "Whey Protein", kcal: 370, prot: 80, cat: "prot" },
  { id: 6, nom: "Skyr / Fromage blanc 0%", kcal: 57, prot: 10, cat: "prot" },
  { id: 7, nom: "Riz Basmati (Cuit)", kcal: 145, prot: 3, cat: "carb" },
  { id: 8, nom: "Pâtes (Cuites)", kcal: 150, prot: 5, cat: "carb" },
  { id: 9, nom: "Flocons d'Avoine", kcal: 360, prot: 13, cat: "carb" },
  { id: 10, nom: "Pomme de Terre", kcal: 85, prot: 2, cat: "carb" },
  { id: 11, nom: "Banane", kcal: 89, prot: 1, cat: "carb" },
  { id: 12, nom: "Avocat", kcal: 160, prot: 2, cat: "autre" },
  { id: 13, nom: "Amandes", kcal: 575, prot: 21, cat: "autre" },
  { id: 14, nom: "Huile d'Olive", kcal: 884, prot: 0, cat: "autre" }
]

const groupesAliments = [
  { id: "prot", label: "Protéines" },
  { id: "carb", label: "Glucides" },
  { id: "autre", label: "Autres" }
]

const saisie = reactive({ alimentId: null, grammes: 100 })
const listeRepas = ref([])

const besoins = computed(() => {
  if (!profil.poids || !profil.taille || !profil.age) return null
  return calculerBesoins(profil)
})

const previsu = computed(() => {
  if (!saisie.alimentId || !saisie.grammes) return null
  const aliment = trouverAliment(saisie.alimentId)
  if (!aliment) return null
  return calculerMacrosAliment(aliment, saisie.grammes)
})

const totalConsomme = computed(() => calculerTotal(listeRepas.value))

const restant = computed(() => {
  if (!besoins.value) return { kcal: 0, prot: 0 }
  return { kcal: besoins.value.calories - totalConsomme.value.kcal, prot: besoins.value.proteines - totalConsomme.value.prot }
})

const progress = computed(() => {
  if (!besoins.value) return { kcal: 0, prot: 0 }
  const kcal = pourcentage(totalConsomme.value.kcal, besoins.value.calories)
  const prot = pourcentage(totalConsomme.value.prot, besoins.value.proteines)
  return { kcal: limiterEntre0Et100(kcal), prot: limiterEntre0Et100(prot) }
})

const messageCalories = computed(() => {
  if (!besoins.value) return ""
  if (restant.value.kcal >= 0) return `Il te reste ${restant.value.kcal} kcal`
  return `Dépassement de ${Math.abs(restant.value.kcal)} kcal !`
})

const restantProtAffiche = computed(() => {
  if (!besoins.value) return 0
  if (restant.value.prot > 0) return restant.value.prot
  return 0
})

function setGenre(genre) {
  profil.genre = genre
}

function setObjectif(objectifId) {
  profil.objectif = objectifId
}

function alimentsParCategorie(categorie) {
  return alimentsBase.filter(aliment => aliment.cat === categorie)
}

function trouverAliment(alimentId) {
  return alimentsBase.find(aliment => aliment.id === alimentId) || null
}

function calculerMacrosAliment(aliment, grammes) {
  const ratio = Number(grammes) / 100
  return { nom: aliment.nom, kcal: Math.round(aliment.kcal * ratio), prot: Math.round(aliment.prot * ratio) }
}

function calculerBesoins(profil) {
  const bmr = calculerBmr(profil)
  const tdee = bmr * profil.activite
  const caloriesBase = Math.round(tdee)
  const proteinesBase = Math.round(profil.poids * 1.8)
  if (profil.objectif === "seche") return { calories: caloriesBase - 400, proteines: Math.round(profil.poids * 2.2) }
  if (profil.objectif === "masse") return { calories: caloriesBase + 300, proteines: Math.round(profil.poids * 2.0) }
  return { calories: caloriesBase, proteines: proteinesBase }
}

function calculerBmr(profil) {
  const poids = profil.poids
  const taille = profil.taille
  const age = profil.age
  const genre = profil.genre
  const base = 10 * poids + 6.25 * taille - 5 * age
  if (genre === "homme") return base + 5
  return base - 161
}

function calculerTotal(liste) {
  let kcal = 0
  let prot = 0
  for (const repas of liste) {
    kcal = kcal + repas.kcal
    prot = prot + repas.prot
  }
  return { kcal, prot }
}

function pourcentage(valeur, total) {
  if (!total) return 0
  return (valeur / total) * 100
}

function limiterEntre0Et100(valeur) {
  if (valeur < 0) return 0
  if (valeur > 100) return 100
  return valeur
}

function ajouterAliment() {
  if (!previsu.value) return
  const nouvelItem = creerRepas(previsu.value, saisie.grammes)
  listeRepas.value.push(nouvelItem)
  saisie.grammes = 100
}

function creerRepas(previsu, grammes) {
  return { id: Date.now(), nom: previsu.nom, grammes: Number(grammes), kcal: previsu.kcal, prot: previsu.prot }
}

function supprimerAliment(index) {
  listeRepas.value.splice(index, 1)
}
</script>
