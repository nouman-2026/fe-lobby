import type { Game } from '~/data/games'

export function getGameSessionId() {
  if (import.meta.server) return 'EXAMPLE'

  return new URLSearchParams(window.location.search).get('session') ?? 'EXAMPLE'
}

/**
 * Resolve a catalog launch path (or fallback) to a full iframe URL.
 * `origin` comes from the settings store (set once on page load).
 */
export function resolveGameLaunchUrl(
  game: Pick<Game, 'id' | 'slug' | 'launchUrl'>,
  origin: string,
  session = getGameSessionId()
) {
  if (!origin) return ''

  if (game.launchUrl) {
    return new URL(game.launchUrl, origin).href
  }

  const url = new URL(origin)
  url.searchParams.set('session', session)
  url.searchParams.set('gameid', game.id)
  return url.href
}
