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
              <button @click="profil.genre='homme'" class="flex-1 py-2 rounded-xl font-bold border-2 transition text-sm" :class="profil.genre==='homme'?'border-slate-900 bg-slate-900 text-white':'border-gray-200 text-gray-400'">Homme</button>
              <button @click="profil.genre='femme'" class="flex-1 py-2 rounded-xl font-bold border-2 transition text-sm" :class="profil.genre==='femme'?'border-slate-900 bg-slate-900 text-white':'border-gray-200 text-gray-400'">Femme</button>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div><label class="block text-xs font-bold text-gray-500 uppercase mb-1">Poids (kg)</label><input v-model="profil.poids" type="number" :class="inputClass" /></div>
              <div><label class="block text-xs font-bold text-gray-500 uppercase mb-1">Taille (cm)</label><input v-model="profil.taille" type="number" :class="inputClass" /></div>
            </div>
            <div><label class="block text-xs font-bold text-gray-500 uppercase mb-1">Âge</label><input v-model="profil.age" type="number" :class="inputClass" /></div>
            <div>
              <label class="block text-xs font-bold text-gray-500 uppercase mb-1">Activité</label>
              <select v-model="profil.activite" class="w-full p-2 bg-gray-50 rounded-xl font-bold text-slate-900 border border-gray-200 outline-none text-sm"><option v-for="niv in niveauxActivite" :key="niv.value" :value="niv.value">{{ niv.label }}</option></select>
            </div>
          </div>
        </div>
        <div class="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
          <h2 class="text-xl font-bold text-slate-900 mb-4">Objectif</h2>
          <div class="grid grid-cols-1 gap-2">
            <button v-for="obj in objectifs" :key="obj.id" @click="profil.objectif=obj.id" class="flex items-center gap-3 p-3 rounded-xl border-2 transition" :class="profil.objectif===obj.id?`border-current ${obj.bg} ${obj.color}`:'border-gray-100 text-gray-400 hover:bg-gray-50'">
              <UIcon :name="obj.icon" class="text-xl" /><span class="text-xs font-black uppercase">{{ obj.label }}</span>
            </button>
          </div>
        </div>
      </div>
      <div class="lg:col-span-8 space-y-6">
        <div v-if="besoins" class="bg-slate-900 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
          <div class="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div class="flex justify-between items-end mb-2"><span class="text-sm font-bold uppercase text-slate-400">Calories</span><span class="font-black text-xl">{{ totalConsomme.kcal }} / <span class="text-green-400">{{ besoins.calories }}</span></span></div>
              <div class="w-full h-4 bg-slate-700 rounded-full overflow-hidden"><div class="h-full rounded-full transition-all duration-500 ease-out" :class="restant.kcal<0?'bg-red-500':'bg-gradient-to-r from-green-400 to-emerald-600'" :style="{width:progress.kcal+'%'}"></div></div>
              <p class="text-xs mt-2 font-bold" :class="restant.kcal<0?'text-red-400':'text-slate-400'">{{ restant.kcal>=0?`Il te reste ${restant.kcal} kcal`:`Dépassement de ${Math.abs(restant.kcal)} kcal !` }}</p>
            </div>
            <div>
              <div class="flex justify-between items-end mb-2"><span class="text-sm font-bold uppercase text-slate-400">Protéines</span><span class="font-black text-xl">{{ totalConsomme.prot }} / <span class="text-blue-400">{{ besoins.proteines }}g</span></span></div>
              <div class="w-full h-4 bg-slate-700 rounded-full overflow-hidden"><div class="h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-500 ease-out" :style="{width:progress.prot+'%'}"></div></div>
              <p class="text-xs mt-2 font-bold text-slate-400">Encore {{ restant.prot>0?restant.prot:0 }}g à manger</p>
            </div>
          </div>
        </div>
        <div v-else class="bg-gray-100 p-8 rounded-3xl text-center text-gray-500">Remplis tes informations à gauche pour débloquer le tracker.</div>
        <div v-if="besoins" class="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
          <h3 class="text-lg font-bold text-slate-900 mb-4">Ajouter un aliment</h3>
          <div class="flex flex-col md:flex-row gap-3 items-end">
            <div class="flex-1 w-full">
              <label class="text-xs font-bold text-gray-400 uppercase ml-1">Qu'as-tu mangé ?</label>
              <select v-model="saisie.alimentID" :class="mealInputClass">
                <option :value="null" disabled>Choisir un aliment...</option>
                <optgroup label="Protéines"><option v-for="a in alimentsFiltres('prot')" :key="a.id" :value="a.id">{{ a.nom }}</option></optgroup>
                <optgroup label="Glucides"><option v-for="a in alimentsFiltres('carb')" :key="a.id" :value="a.id">{{ a.nom }}</option></optgroup>
                <optgroup label="Autres"><option v-for="a in alimentsFiltres('autre')" :key="a.id" :value="a.id">{{ a.nom }}</option></optgroup>
              </select>
            </div>
            <div class="w-32">
              <label class="text-xs font-bold text-gray-400 uppercase ml-1">Quantité (g)</label>
              <input v-model="saisie.grammes" type="number" placeholder="100" :class="mealInputClass" @keyup.enter="ajouterAliment" />
            </div>
            <div class="w-full md:w-auto flex flex-col justify-end pb-2 px-2">
              <div v-if="previsu" class="text-xs font-bold text-slate-500">= <span class="text-slate-900">{{ previsu.kcal }}</span> kcal / <span class="text-blue-600">{{ previsu.prot }}g</span> prot</div>
              <div v-else class="text-xs text-gray-300 font-medium pb-1">--</div>
            </div>
            <button @click="ajouterAliment" class="p-3 bg-slate-900 text-white rounded-xl hover:bg-green-600 transition shadow-lg shrink-0" :disabled="!previsu"><UIcon name="i-heroicons-plus" class="text-xl" /></button>
          </div>
        </div>
        <div v-if="besoins&&listeRepas.length" class="space-y-3">
          <h3 class="text-lg font-bold text-slate-900 px-2">Aujourd'hui</h3>
          <div v-for="(item,index) in listeRepas" :key="item.id" class="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 group hover:border-green-200 transition">
            <div class="flex items-center gap-3">
              <div class="bg-green-50 text-green-600 p-2 rounded-lg"><UIcon name="i-heroicons-fire" /></div>
              <div>
                <p class="font-bold text-slate-900">{{ item.nom }} <span class="text-gray-400 font-normal text-xs">({{ item.grammes }}g)</span></p>
                <p class="text-xs text-gray-400 font-medium">{{ item.kcal }} kcal • {{ item.prot }}g prot</p>
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
const inputClass="w-full p-2 bg-gray-50 rounded-xl font-bold text-slate-900 border border-gray-200 focus:border-green-500 outline-none",mealInputClass="w-full p-3 bg-gray-50 rounded-xl font-bold text-slate-900 border border-gray-200 focus:border-green-500 outline-none"
const profil=reactive({poids:null,taille:null,age:25,genre:"homme",activite:1.375,objectif:"maintien"})
const niveauxActivite=[{label:"Sédentaire",value:1.2},{label:"Léger (1-3x)",value:1.375},{label:"Modéré (3-5x)",value:1.55},{label:"Intense (6-7x)",value:1.725}]
const objectifs=[{id:"seche",label:"Sèche",icon:"i-heroicons-arrow-trending-down",color:"text-orange-500",bg:"bg-orange-50 border-orange-200"},{id:"maintien",label:"Maintien",icon:"i-heroicons-minus",color:"text-blue-500",bg:"bg-blue-50 border-blue-200"},{id:"masse",label:"Masse",icon:"i-heroicons-arrow-trending-up",color:"text-green-500",bg:"bg-green-50 border-green-200"}]
const alimentsBase=[{id:1,nom:"Poulet (Blanc)",kcal:120,prot:23,cat:"prot"},{id:2,nom:"Boeuf (5% mg)",kcal:130,prot:21,cat:"prot"},{id:3,nom:"Oeuf (Entier)",kcal:155,prot:13,cat:"prot"},{id:4,nom:"Thon (Boîte)",kcal:110,prot:25,cat:"prot"},{id:5,nom:"Whey Protein",kcal:370,prot:80,cat:"prot"},{id:6,nom:"Skyr / Fromage blanc 0%",kcal:57,prot:10,cat:"prot"},{id:7,nom:"Riz Basmati (Cuit)",kcal:145,prot:3,cat:"carb"},{id:8,nom:"Pâtes (Cuites)",kcal:150,prot:5,cat:"carb"},{id:9,nom:"Flocons d'Avoine",kcal:360,prot:13,cat:"carb"},{id:10,nom:"Pomme de Terre",kcal:85,prot:2,cat:"carb"},{id:11,nom:"Banane",kcal:89,prot:1,cat:"carb"},{id:12,nom:"Avocat",kcal:160,prot:2,cat:"autre"},{id:13,nom:"Amandes",kcal:575,prot:21,cat:"autre"},{id:14,nom:"Huile d'Olive",kcal:884,prot:0,cat:"autre"}]
const alimentsFiltres=(categorie)=>alimentsBase.filter(a=>a.cat===categorie)
const clamp100=(n)=>Math.min(Math.max(n,0),100)
const calcMacros=(aliment,grammes)=>{const r=grammes/100;return{nom:aliment.nom,kcal:Math.round(aliment.kcal*r),prot:Math.round(aliment.prot*r)}}
const besoins=computed(()=>{if(!profil.poids||!profil.taille||!profil.age)return null;const bmr=10*profil.poids+6.25*profil.taille-5*profil.age+(profil.genre==="homme"?5:-161),tdee=bmr*profil.activite;let calories=Math.round(tdee),proteines=Math.round(profil.poids*1.8);if(profil.objectif==="seche"){calories-=400;proteines=Math.round(profil.poids*2.2)}if(profil.objectif==="masse"){calories+=300;proteines=Math.round(profil.poids*2)}return{calories,proteines}})
const saisie=reactive({alimentID:null,grammes:100})
const listeRepas=ref([])
const previsu=computed(()=>{if(!saisie.alimentID||!saisie.grammes)return null;const aliment=alimentsBase.find(a=>a.id===saisie.alimentID);if(!aliment)return null;return calcMacros(aliment,Number(saisie.grammes))})
function ajouterAliment(){if(!previsu.value)return;listeRepas.value.push({id:Date.now(),nom:previsu.value.nom,grammes:Number(saisie.grammes),kcal:previsu.value.kcal,prot:previsu.value.prot});saisie.grammes=100}
function supprimerAliment(index){listeRepas.value.splice(index,1)}
const totalConsomme=computed(()=>{let kcal=0,prot=0;for(const item of listeRepas.value){kcal+=item.kcal;prot+=item.prot}return{kcal,prot}})
const progress=computed(()=>{if(!besoins.value)return{kcal:0,prot:0};return{kcal:clamp100(totalConsomme.value.kcal/besoins.value.calories*100),prot:clamp100(totalConsomme.value.prot/besoins.value.proteines*100)}})
const restant=computed(()=>{if(!besoins.value)return{kcal:0,prot:0};return{kcal:besoins.value.calories-totalConsomme.value.kcal,prot:besoins.value.proteines-totalConsomme.value.prot}})
</script>
