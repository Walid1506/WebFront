import { defineStore } from 'pinia'

export const useSportStore = defineStore('sport', {
  state: () => ({
    currentUser: null,
    sessions: [],
    leaderboard: [
      { name: 'Walid', sessions: 42, streak: 12 },
      { name: 'Sarah', sessions: 38, streak: 5 },
      { name: 'Thomas', sessions: 35, streak: 8 },
      { name: 'Julie', sessions: 29, streak: 2 },
      { name: 'Karim', sessions: 22, streak: 0 },
      { name: 'Lucas', sessions: 18, streak: 3 },
      { name: 'Emma', sessions: 15, streak: 1 },
      { name: 'Paul', sessions: 10, streak: 0 },
      { name: 'Sofia', sessions: 8, streak: 4 },
      { name: 'Marc', sessions: 2, streak: 0 },
    ],
    badges: [
      { id: 1, name: 'Débutant', icon: 'i-heroicons-star', unlocked: false },
      { id: 2, name: 'Lève-tôt', icon: 'i-heroicons-sun', unlocked: false },
      { id: 3, name: 'Machine', icon: 'i-heroicons-fire', unlocked: false },
    ]
  }),

  getters: {
    isAuthenticated: (state) => !!state.currentUser,
    totalSessions: (state) => state.sessions.filter(s => s.sport?.done).length,
    getDayByDate: (state) => (dateStr) => state.sessions.find(s => s.date === dateStr) || {}
  },

  actions: {
    login(username) {
      this.currentUser = username
    },

    logout() {
      this.currentUser = null
    },

    saveSportSession(date, data) {
      let day = this.sessions.find(s => s.date === date)
      
      if (!day) {
        day = { date, sport: {}, nutrition: {} }
        this.sessions.push(day)
      }

      day.sport = {
        done: true,
        type: data.type,
        exercises: data.exercises
      }

      this.checkBadges()
    },

    saveNutrition(date, data) {
      let day = this.sessions.find(s => s.date === date)
      
      if (!day) {
        day = { date, sport: {}, nutrition: {} }
        this.sessions.push(day)
      }
      
      day.nutrition = data
    },

    checkBadges() {
      if (this.totalSessions >= 1) this.badges[0].unlocked = true
      if (this.totalSessions >= 5) this.badges[2].unlocked = true
    },

    calculerBadges(nombreSeances) {
      let badgesMerites = []

      if (nombreSeances >= 1) {
        badgesMerites.push({ name: 'Débutant', icon: 'i-heroicons-star' })
      }

      if (nombreSeances >= 10) {
        badgesMerites.push({ name: 'Lève-tôt', icon: 'i-heroicons-sun' })
      }

      if (nombreSeances >= 20) {
        badgesMerites.push({ name: 'Machine', icon: 'i-heroicons-fire' })
      }

      return badgesMerites
    }
  }
})