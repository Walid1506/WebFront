import { useSportStore } from "~/stores/sport"

export default defineNuxtRouteMiddleware((to, from) => {
  const store = useSportStore()
  const pagesPubliques = ["/login", "/register"]

  if (pagesPubliques.includes(to.path)) {
    if (store.currentUser && to.path === "/login") {
      return navigateTo("/")
    }
    return
  }

  if (!store.currentUser) {
    return navigateTo("/login")
  }
})
