/**
 * Restore client-only state after hydration so SSR markup stays in sync.
 */
export default defineNuxtPlugin({
  name: 'game-session-restore',
  setup(nuxtApp) {
    nuxtApp.hook('app:mounted', async () => {
      const session = useSessionStore()
      const settings = useSettingsStore()

      session.initFromUrl()
      settings.restoreLayoutPreference()

      await Promise.all([session.fetchPlayer(), settings.restoreGameSession()])

      settings.finalizeClientHydration()
    })
  },
})
