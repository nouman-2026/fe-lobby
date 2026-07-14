/**
 * Restore client-only state after hydration so SSR markup stays in sync.
 */
export default defineNuxtPlugin({
  name: 'game-session-restore',
  setup(nuxtApp) {
    nuxtApp.hook('app:mounted', () => {
      const settings = useSettingsStore()
      settings.initLobbyOrigin()
      settings.restoreLayoutPreference()
      settings.restoreGameSession()
      settings.finalizeClientHydration()
    })
  },
})
