import type {
  LaunchResponse,
  PlayerResponse,
  PlayerSession,
} from '~/types/session'
import { getSessionTokenFromUrl, hasSessionToken } from '~/utils/sessionToken'

export const useSessionStore = defineStore('session', () => {
  const sessionToken = ref<string>(getSessionTokenFromUrl())
  const session = ref<PlayerSession | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)
  const initialized = ref(false)

  const hasSession = computed(() => hasSessionToken(sessionToken.value))
  const operator = computed(() => session.value?.operator ?? '')
  const balance = computed(() => session.value?.balance ?? 0)
  const currency = computed(() => session.value?.currency ?? 'USD')
  const activeGame = computed(() => session.value?.active_game ?? null)

  function initFromUrl() {
    if (import.meta.server) return
    sessionToken.value = getSessionTokenFromUrl()
  }

  async function fetchPlayer() {
    if (import.meta.server) return

    if (!hasSessionToken(sessionToken.value)) {
      session.value = null
      error.value = null
      initialized.value = true
      loading.value = false
      return
    }

    loading.value = true
    error.value = null

    try {
      const api = useApi()
      const response = await api.get<PlayerResponse>(
        `/players/${encodeURIComponent(sessionToken.value)}`
      )
      session.value = response
      initialized.value = true
    } catch (err: unknown) {
      error.value =
        err instanceof Error ? err.message : 'Failed to load player session'
      session.value = null
    } finally {
      loading.value = false
    }
  }

  async function requestLaunchUrl(gameId: string): Promise<string> {
    if (!hasSessionToken(sessionToken.value)) {
      throw new Error(
        'Missing session_id — open the lobby with a valid session'
      )
    }

    const api = useApi()
    const response = await api.post<LaunchResponse>('/launch', {
      session_id: sessionToken.value,
      game_id: gameId,
    })

    if (!response.url) {
      throw new Error('Launch response did not include a game URL')
    }

    return response.url
  }

  return {
    sessionToken,
    session,
    loading,
    error,
    initialized,
    hasSession,
    operator,
    balance,
    currency,
    activeGame,
    initFromUrl,
    fetchPlayer,
    requestLaunchUrl,
  }
})
