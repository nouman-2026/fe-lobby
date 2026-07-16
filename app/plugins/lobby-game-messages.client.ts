/**
 * Listens for minimize signals from a lobby-launched game iframe
 * (in-game settings → lobby button).
 */
export default defineNuxtPlugin(() => {
  const settings = useSettingsStore()

  function onMessage(event: MessageEvent) {
    const data = event.data
    if (data == null || typeof data !== 'object') return

    if (data.type === 'NINJA_LOBBY_MINIMIZE') {
      settings.minimizeGame()
    }
  }

  window.addEventListener('message', onMessage)

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      window.removeEventListener('message', onMessage)
    })
  }
})
