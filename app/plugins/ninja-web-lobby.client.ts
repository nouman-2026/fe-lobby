export interface NinjaWebLobbyBridge {
  /** Marks this shell as the web catalog lobby (not the mobile in-app lobby). */
  embedded: boolean
  /** Hide the game iframe and return to the lobby UI (keeps session alive). */
  minimizeGame: () => void
  /** Show the hidden game iframe again. */
  resumeGame: () => void
  /** Fully terminate the game session and unmount the iframe. */
  closeGame: () => void
}

declare global {
  interface Window {
    __NINJA_WEB_LOBBY__?: NinjaWebLobbyBridge
    /** Intentionally unset — do not enable mobile-app lobby behavior in game-ui. */
    __NINJA_MOBILE_LOBBY__?: undefined
  }
}

export default defineNuxtPlugin(() => {
  const settings = useSettingsStore()

  try {
    delete window.__NINJA_MOBILE_LOBBY__
    delete window.ninjaShell
  } catch {
    // ignore
  }

  window.__NINJA_WEB_LOBBY__ = {
    embedded: true,
    minimizeGame: () => settings.minimizeGame(),
    resumeGame: () => settings.resumeGame(),
    closeGame: () => settings.closeGame(),
  }

  function onMessage(event: MessageEvent) {
    const data = event.data
    if (data == null || typeof data !== 'object') return

    switch (data.type) {
      case 'NINJA_LOBBY_MINIMIZE':
        settings.minimizeGame()
        break
      case 'CLOSE_WEB_LOBBY_GAME':
      case 'EXIT_WEB_LOBBY':
      case 'NINJA_LOBBY_CLOSE':
        settings.closeGame()
        break
      case 'NINJA_LOBBY_RESUME':
        settings.resumeGame()
        break
    }
  }

  window.addEventListener('message', onMessage)

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      window.removeEventListener('message', onMessage)
    })
  }
})
