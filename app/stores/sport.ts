import { defineStore } from "pinia"

export const useSportStore = defineStore("sport", {
  state: () => ({
    users: [],
    currentUser: null,
    allSessions: []
  }),

  getters: {
    sessions(state) {
      if (state.currentUser === null) return []
      return state.allSessions.filter(
        session => session.username === state.currentUser
      )
    }
  },

  actions: {
    register(username, password) {
      const user = this.users.find(
        u => u.username === username
      )
      if (user) return false
      this.users.push({ username, password })
      this.currentUser = username
      return true
    },

    login(username, password) {
      const user = this.users.find(
        u => u.username === username && u.password === password
      )
      if (!user) return false
      this.currentUser = username
      return true
    },

    logout() {
      this.currentUser = null
    },

    saveSportSession(date, sport) {
      if (this.currentUser === null) return
      const session = this.allSessions.find(
        s => s.username === this.currentUser && s.date === date
      )
      if (session) {
        session.sport = sport
      } else {
        this.allSessions.push({
          username: this.currentUser,
          date: date,
          sport: sport
        })
      }
    },

    updateUsername(newPseudo) {
      if (this.currentUser === null) return false
      if (!newPseudo) return false
      const taken = this.users.find(
        u => u.username === newPseudo
      )
      if (taken) return false
      const user = this.users.find(
        u => u.username === this.currentUser
      )
      if (!user) return false
      for (const session of this.allSessions) {
        if (session.username === this.currentUser) {
          session.username = newPseudo
        }
      }
      user.username = newPseudo
      this.currentUser = newPseudo
      return true
    }
  },

  persist: true
})
