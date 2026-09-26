// Passe à true quand l'accueil a chargé ses données : l'écran de démarrage se masque alors
export const useAppReady = () => useState('app-ready', () => false)
