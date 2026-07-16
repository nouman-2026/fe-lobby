/**
 * Normalize API / persisted image values to a CDN-relative path (e.g. `games/foo.png`).
 * Absolute URLs from an older CDN base are reduced back to the storage path.
 */
export function toGameImagePath(backgroundImage: string) {
  if (!backgroundImage) return ''

  const trimmed = backgroundImage.trim()
  if (!trimmed) return ''

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const pathname = new URL(trimmed).pathname
      const gamesIdx = pathname.indexOf('/games/')
      if (gamesIdx !== -1) {
        return pathname.slice(gamesIdx + 1)
      }
      return pathname.replace(/^\//, '')
    } catch {
      return trimmed.replace(/^\//, '')
    }
  }

  return trimmed.replace(/^\//, '')
}

export function resolveGameImageUrl(backgroundImage: string) {
  const relativePath = toGameImagePath(backgroundImage)
  if (!relativePath) return ''

  const config = useRuntimeConfig()
  const cdnBase = String(config.public.nuxtPublicCdnUrl || '').replace(
    /\/$/,
    ''
  )
  if (!cdnBase) return `/${relativePath}`

  return `${cdnBase}/${relativePath}`
}
