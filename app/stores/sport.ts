import { defineStore } from "pinia"

export const useSportStore = defineStore("sport", {
  state: () => ({
    users: [],
    currentUser: null,
    allSessions: [],
    userGoals: { weight: null, targetCal: null, targetProt: null, consumedCal: 0, consumedProt: 0 }
  }),
  getters: {
    sessions(state) {
      if (!state.currentUser) return []
      return state.allSessions.filter(session => session.username === state.currentUser)
    },
    caloriesBurnedToday(state) {
      if (!state.currentUser) return 0
      const today = toFrCA(new Date())
      const session = state.allSessions.find(item => item.username === state.currentUser && item.date === today) || null
      if (!session) return 0
      if (!session.sport) return 0
      return estimateCaloriesBurned(session.sport.type)
    }
  },
  actions: {
    register(username, password) {
      if (!username) return false
      if (!password) return false
      if (this.users.find(user => user.username === username)) return false
      const goals = createEmptyGoals()
      this.users.push({ username, password, goals })
      this.currentUser = username
      this.userGoals = createEmptyGoals()
      return true
    },
    login(username, password) {
      if (!username) return false
      if (!password) return false
      const user = this.users.find(item => item.username === username && item.password === password) || null
      if (!user) return false
      this.currentUser = username
      this.userGoals = normalizeGoals(user.goals)
      return true
    },
    logout() {
      this.currentUser = null
      this.userGoals = createEmptyGoals()
    },
    saveSportSession(date, sport) {
      if (!this.currentUser) return
      if (!date) return
      const session = this.allSessions.find(item => item.username === this.currentUser && item.date === date) || null
      if (session) {
        session.sport = sport
        return
      }
      this.allSessions.push({ username: this.currentUser, date, sport })
    },
    updateUsername(newPseudo) {
      if (!this.currentUser) return false
      if (!newPseudo) return false
      if (this.users.find(user => user.username === newPseudo)) return false
      const user = this.users.find(item => item.username === this.currentUser) || null
      if (!user) return false
      for (const session of this.allSessions) {
        if (session.username === this.currentUser) session.username = newPseudo
      }
      user.username = newPseudo
      this.currentUser = newPseudo
      return true
    },
    updateGoals(newGoals) {
      if (!this.currentUser) return
      this.userGoals = mergeGoals(this.userGoals, newGoals)
      const user = this.users.find(item => item.username === this.currentUser) || null
      if (!user) return
      user.goals = mergeGoals(normalizeGoals(user.goals), newGoals)
    }
  },
  persist: true
})

function createEmptyGoals() {
  return { weight: null, targetCal: null, targetProt: null, consumedCal: 0, consumedProt: 0 }
}

function normalizeGoals(goals) {
  return mergeGoals(createEmptyGoals(), goals || {})
}

function mergeGoals(baseGoals, newGoals) {
  return { ...baseGoals, ...(newGoals || {}) }
}

function toFrCA(date) {
  return date.toLocaleDateString("fr-CA")
}

function estimateCaloriesBurned(type) {
  const value = typeof type === "string" ? type.toLowerCase() : ""
  if (value.includes("muscu") || value.includes("gym")) return 300
  if (value.includes("cardio") || value.includes("course") || value.includes("running")) return 500
  if (value.includes("crossfit") || value.includes("hiit")) return 600
  if (value.includes("yoga") || value.includes("pilates")) return 150
  if (value.includes("natation")) return 400
  if (value.includes("foot") || value.includes("basket") || value.includes("tennis")) return 450
  return 250
}
