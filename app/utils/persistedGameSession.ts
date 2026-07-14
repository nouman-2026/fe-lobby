export type PersistedGameSession = {
  gameId: string
  minimized: boolean
}

const STORAGE_KEY = 'lobby-game-session'

export function readPersistedGameSession(): PersistedGameSession | null {
  if (import.meta.server) return null

  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null

    const parsed = JSON.parse(raw) as Partial<
      PersistedGameSession & { activeGameId?: string; gameMinimized?: boolean }
    >

    const gameId = parsed.gameId ?? parsed.activeGameId
    if (typeof gameId !== 'string' || !gameId) return null

    return {
      gameId,
      minimized: Boolean(parsed.minimized ?? parsed.gameMinimized),
    }
  } catch {
    return null
  }
}

export function writePersistedGameSession(
  session: PersistedGameSession | null
): void {
  if (import.meta.server) return

  try {
    if (!session) {
      sessionStorage.removeItem(STORAGE_KEY)
      return
    }

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
  } catch {
    // Private mode / quota — session restore is best-effort.
  }
}
