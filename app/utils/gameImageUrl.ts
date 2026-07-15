export function resolveGameImageUrl(backgroundImage: string) {
  if (!backgroundImage) return ''

  if (
    backgroundImage.startsWith('http://') ||
    backgroundImage.startsWith('https://')
  ) {
    return backgroundImage
  }

  const config = useRuntimeConfig()
  const cdnBase = String(config.public.nuxtPublicCdnUrl).replace(/\/$/, '')

  return `${cdnBase}/${backgroundImage.replace(/^\//, '')}`
}
