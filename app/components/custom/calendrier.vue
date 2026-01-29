<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between px-2">
      <h2 class="text-2xl font-black text-slate-900 capitalize">{{ formattedMonth }}</h2>
      <div class="flex gap-2">
        <button @click="changeMonth(-1)" class="p-2 rounded-full hover:bg-gray-200 transition"><UIcon name="i-heroicons-chevron-left" class="text-xl text-slate-700" /></button>
        <button @click="changeMonth(1)" class="p-2 rounded-full hover:bg-gray-200 transition"><UIcon name="i-heroicons-chevron-right" class="text-xl text-slate-700" /></button>
      </div>
    </div>
    <div class="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
      <div class="grid grid-cols-7 border-b border-gray-200 bg-gray-50">
        <div v-for="day in weekDays" :key="day" class="py-3 text-center text-xs font-bold text-gray-400 uppercase">{{ day }}</div>
      </div>
      <div class="grid grid-cols-7 auto-rows-[120px] divide-x divide-gray-100 bg-gray-100 gap-px border-b border-gray-200">
        <div v-for="(date,index) in calendarDays" :key="index" class="bg-white relative flex flex-col p-2 group transition hover:bg-gray-50" :class="{ 'bg-green-50/30': isToday(date) }">
          <template v-if="date">
            <div class="flex justify-between items-start pointer-events-none">
              <span class="text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full" :class="isToday(date)?'bg-green-500 text-white shadow-md':'text-gray-700'">{{ date.split('-')[2] }}</span>
            </div>
            <div class="flex-1 flex flex-col justify-center items-center mt-1 w-full h-full">
              <button v-if="sessionDone(date)" @click="handleDayClick(date)" class="w-full h-full transition transform hover:scale-105 active:scale-95 focus:outline-none flex items-center justify-center">
                <div class="bg-green-100 text-green-700 p-1.5 rounded-lg text-center w-full max-w-[80px] border border-green-200 hover:bg-green-200 hover:shadow-md transition">
                  <UIcon name="i-heroicons-check-circle" class="text-xl block mx-auto mb-1" />
                  <p class="text-[10px] font-bold truncate">{{ sessionType(date) }}</p>
                </div>
              </button>
              <button v-else @click="handleDayClick(date)" class="opacity-0 group-hover:opacity-100 w-full h-full flex items-center justify-center text-gray-300 hover:text-green-500 transition-all duration-200 focus:opacity-100"><UIcon name="i-heroicons-plus-circle" class="text-3xl" /></button>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSportStore } from "~/stores/sport"
const emit=defineEmits(["select-date"])
const store=useSportStore()
const currentMonth=ref(new Date())
const weekDays=["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"]
const toFrCA=(d)=>d.toLocaleDateString("fr-CA")
const formattedMonth=computed(()=>currentMonth.value.toLocaleDateString("fr-FR",{month:"long",year:"numeric"}))
const calendarDays=computed(()=>{const y=currentMonth.value.getFullYear(),m=currentMonth.value.getMonth(),first=new Date(y,m,1),daysInMonth=new Date(y,m+1,0).getDate();let start=first.getDay();start=start===0?6:start-1;const days=[];for(let i=0;i<start;i++)days.push(null);for(let i=1;i<=daysInMonth;i++)days.push(toFrCA(new Date(y,m,i)));const rest=days.length%7;if(rest)for(let i=0;i<7-rest;i++)days.push(null);return days})
function changeMonth(step){const d=new Date(currentMonth.value);d.setMonth(d.getMonth()+step);currentMonth.value=d}
function isToday(dateStr){return !!dateStr&&dateStr===toFrCA(new Date())}
function getSessionForDay(date){return date?store.sessions.find(s=>s.date===date)||null:null}
const sessionDone=(date)=>{const s=getSessionForDay(date);return !!(s&&s.sport&&s.sport.done)}
const sessionType=(date)=>{const s=getSessionForDay(date);return s&&s.sport?s.sport.type:""}
function handleDayClick(date){if(date)emit("select-date",date)}
</script>
