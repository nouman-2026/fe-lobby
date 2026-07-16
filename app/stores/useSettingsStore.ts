import {
  readPersistedGameSession,
  writePersistedGameSession,
} from '~/utils/persistedGameSession'
import type { CatalogFilter } from '~/data/games'

export type LayoutMode = 'grid' | 'list'
export type GameCategory = CatalogFilter

export const useSettingsStore = defineStore('settings', () => {
  const layoutMode = ref<LayoutMode>('grid')
  const lobbyOpen = ref(true)
  const activeCategory = ref<GameCategory>('all')
  const activeGameId = ref<string | null>(null)
  /** Prepared on openGame — single source of truth for the iframe src. */
  const activeGameLaunchUrl = ref<string | null>(null)
  const gameLaunchLoading = ref(false)
  const gameLaunchError = ref<string | null>(null)
  /** Game iframe stays mounted but hidden while browsing the lobby. */
  const gameMinimized = ref(false)
  /** False until client mount finishes — keeps SSR and first client render in sync. */
  const clientReady = ref(false)
  /** Mobile left drawer — same sidebar content as desktop. */
  const mobileSidebarOpen = ref(false)

  const hasRunningGame = computed(
    () => activeGameId.value != null && gameMinimized.value
  )

  const gameFullscreen = computed(
    () =>
      clientReady.value &&
      activeGameId.value != null &&
      !gameMinimized.value &&
      !!activeGameLaunchUrl.value
  )

  function syncPersistedGameSession() {
    if (import.meta.server) return

    if (!activeGameId.value) {
      writePersistedGameSession(null)
      return
    }

    writePersistedGameSession({
      gameId: activeGameId.value,
      minimized: gameMinimized.value,
    })
  }

  function setLayoutMode(mode: LayoutMode) {
    layoutMode.value = mode
    syncPersistedLayoutMode()
  }

  function syncPersistedLayoutMode() {
    if (import.meta.server) return

    try {
      localStorage.setItem(
        'settings',
        JSON.stringify({ layoutMode: layoutMode.value })
      )
    } catch {
      // ignore
    }
  }

  function restoreLayoutPreference() {
    if (import.meta.server) return

    try {
      const raw = localStorage.getItem('settings')
      if (!raw) return

      const parsed = JSON.parse(raw) as { layoutMode?: LayoutMode }
      if (parsed.layoutMode === 'grid' || parsed.layoutMode === 'list') {
        layoutMode.value = parsed.layoutMode
      }
    } catch {
      // ignore
    }
  }

  function finalizeClientHydration() {
    clientReady.value = true
  }

  function openMobileSidebar() {
    mobileSidebarOpen.value = true
  }

  function closeMobileSidebar() {
    mobileSidebarOpen.value = false
  }

  function toggleMobileSidebar() {
    mobileSidebarOpen.value = !mobileSidebarOpen.value
  }

  function setActiveCategory(category: GameCategory) {
    activeCategory.value = category
    lobbyOpen.value = true
    closeMobileSidebar()
  }

  function showAllGames() {
    setActiveCategory('all')
  }

  function openLobby() {
    lobbyOpen.value = true
  }

  function closeLobby() {
    lobbyOpen.value = false
  }

  function toggleLobby() {
    lobbyOpen.value = !lobbyOpen.value
  }

  async function resolveLaunchUrl(gameId: string): Promise<string | null> {
    const session = useSessionStore()

    gameLaunchLoading.value = true
    gameLaunchError.value = null
    activeGameLaunchUrl.value = null

    try {
      const launchUrl = await session.requestLaunchUrl(gameId)
      activeGameLaunchUrl.value = launchUrl
      return launchUrl
    } catch (error: unknown) {
      gameLaunchError.value =
        error instanceof Error ? error.message : 'Failed to launch game'
      return null
    } finally {
      gameLaunchLoading.value = false
    }
  }

  async function openGame(gameId: string) {
    const catalog = useCatalogStore()
    const game = catalog.getGameById(gameId)
    if (!game) return

    activeGameId.value = gameId
    gameMinimized.value = false
    closeMobileSidebar()

    const launchUrl = await resolveLaunchUrl(gameId)
    if (!launchUrl) {
      activeGameId.value = null
      syncPersistedGameSession()
      return
    }

    syncPersistedGameSession()
  }

  /**
   * Re-apply a tab-refreshed game session. Reads sessionStorage directly so
   * SSR-hydrated Pinia defaults cannot wipe an in-progress game.
   */
  async function restoreGameSession() {
    if (import.meta.server) return

    const persisted = readPersistedGameSession()
    if (!persisted) {
      activeGameId.value = null
      activeGameLaunchUrl.value = null
      gameMinimized.value = false
      gameLaunchError.value = null
      return
    }

    const catalog = useCatalogStore()
    const game = catalog.getGameById(persisted.gameId)
    if (!game) {
      closeGame()
      return
    }

    activeGameId.value = persisted.gameId
    gameMinimized.value = persisted.minimized

    const launchUrl = await resolveLaunchUrl(persisted.gameId)
    if (!launchUrl) {
      closeGame()
    }
  }

  function minimizeGame() {
    if (!activeGameId.value) return
    gameMinimized.value = true
    lobbyOpen.value = true
    syncPersistedGameSession()
  }

  function resumeGame() {
    if (!activeGameId.value) return
    gameMinimized.value = false
    syncPersistedGameSession()
  }

  function closeGame() {
    activeGameId.value = null
    activeGameLaunchUrl.value = null
    gameMinimized.value = false
    gameLaunchLoading.value = false
    gameLaunchError.value = null
    lobbyOpen.value = true
    syncPersistedGameSession()
  }

  return {
    layoutMode,
    lobbyOpen,
    activeCategory,
    activeGameId,
    activeGameLaunchUrl,
    gameLaunchLoading,
    gameLaunchError,
    gameMinimized,
    clientReady,
    mobileSidebarOpen,
    hasRunningGame,
    gameFullscreen,
    setLayoutMode,
    restoreLayoutPreference,
    finalizeClientHydration,
    openMobileSidebar,
    closeMobileSidebar,
    toggleMobileSidebar,
    setActiveCategory,
    showAllGames,
    openLobby,
    closeLobby,
    toggleLobby,
    openGame,
    restoreGameSession,
    minimizeGame,
    resumeGame,
    closeGame,
  }
})
