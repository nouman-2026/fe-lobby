const PRODUCTION_API_PATH = '/lobby/api'

const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1', 'local.ninjagaming.com'])

export function normalizeApiBase(base: string): string {
  return base.replace(/\/$/, '')
}

function isLocalHost(hostname: string) {
  return LOCAL_HOSTS.has(hostname)
}

/**
 * Resolve the API root used for catalog, player, and launch requests.
 * - Local dev fixed base from `NUXT_PUBLIC_API_BASE`
 * - Production: `${window.location.origin}/lobby/api`
 */
export function resolveApiBase(configuredBase?: string): string {
  if (import.meta.client && !isLocalHost(window.location.hostname)) {
    return normalizeApiBase(`${window.location.origin}${PRODUCTION_API_PATH}`)
  }

  const envBase = configuredBase?.trim()
  if (!envBase) {
    throw new Error('Network error: check configs')
  }

  return normalizeApiBase(envBase)
}
