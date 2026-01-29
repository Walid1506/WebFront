import { defineStore } from "pinia"

export const useSportStore = defineStore("sport", {
  state: () => ({
    users: [],
    currentUser: null,
    allSessions: [],
    weightHistory: []
  }),
  getters: {
    sessions(state) {
      if (!state.currentUser) return []
      return state.allSessions.filter(session => session.username === state.currentUser)
    },
    myWeightHistory(state) {
      if (!state.currentUser) return []
      return state.weightHistory.filter(item => item.username === state.currentUser).sort((a, b) => new Date(a.date) - new Date(b.date))
    },
    currentWeight() {
      const history = this.myWeightHistory
      if (history.length === 0) return null
      return history[history.length - 1].weight
    },
    isUsernameTaken: state => username => {
      return state.users.some(user => user.username.toLowerCase() === String(username || "").toLowerCase())
    }
  },
  actions: {
    register(username, password) {
      if (!username) return false
      if (!password) return false
      if (this.isUsernameTaken(username)) return false
      this.users.push({ username, password })
      this.currentUser = username
      return true
    },
    login(username, password) {
      if (!username) return false
      if (!password) return false
      const user = this.users.find(item => item.username === username && item.password === password) || null
      if (!user) return false
      this.currentUser = username
      return true
    },
    logout() {
      this.currentUser = null
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
    addWeightEntry(weight) {
      if (!this.currentUser) return
      if (!isWeightValid(weight)) return
      const today = toFrCA(new Date())
      const existingEntry = this.weightHistory.find(item => item.username === this.currentUser && item.date === today) || null
      if (existingEntry) {
        existingEntry.weight = weight
        return
      }
      this.weightHistory.push({ username: this.currentUser, date: today, weight })
    },
    updateUsername(newPseudo) {
      if (!this.currentUser) return false
      if (!newPseudo) return false
      const oldPseudo = this.currentUser
      if (!canUseUsername(this.users, newPseudo, oldPseudo)) return false
      updateUserInList(this.users, oldPseudo, newPseudo)
      updateUsernameInSessions(this.allSessions, oldPseudo, newPseudo)
      updateUsernameInWeightHistory(this.weightHistory, oldPseudo, newPseudo)
      this.currentUser = newPseudo
      return true
    }
  },
  persist: true
})

function toFrCA(date) {
  return date.toLocaleDateString("fr-CA")
}

function isWeightValid(weight) {
  if (!weight) return false
  if (weight <= 0) return false
  return true
}

function canUseUsername(users, newPseudo, oldPseudo) {
  const next = String(newPseudo).toLowerCase()
  const current = String(oldPseudo).toLowerCase()
  return !users.some(user => user.username.toLowerCase() === next && user.username.toLowerCase() !== current)
}

function updateUserInList(users, oldPseudo, newPseudo) {
  const user = users.find(item => item.username === oldPseudo) || null
  if (user) user.username = newPseudo
}

function updateUsernameInSessions(sessions, oldPseudo, newPseudo) {
  for (const session of sessions) {
    if (session.username === oldPseudo) session.username = newPseudo
  }
}

function updateUsernameInWeightHistory(history, oldPseudo, newPseudo) {
  for (const entry of history) {
    if (entry.username === oldPseudo) entry.username = newPseudo
  }
}
