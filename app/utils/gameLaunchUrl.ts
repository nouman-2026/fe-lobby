export function getGameSessionId() {
  if (import.meta.server) return 'EXAMPLE'

  return new URLSearchParams(window.location.search).get('session') ?? 'EXAMPLE'
}

export function buildGameLaunchUrl(
  gameId: string,
  session = getGameSessionId()
) {
  if (import.meta.server) return ''

  const url = new URL(window.location.origin)
  url.searchParams.set('session', session)
  url.searchParams.set('gameid', gameId)

  return url.toString()
}
