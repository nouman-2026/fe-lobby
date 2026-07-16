const DEFAULT_SESSION_TOKEN = 'EXAMPLE'

export function getSessionTokenFromUrl(): string {
  if (import.meta.server) return DEFAULT_SESSION_TOKEN

  return (
    new URLSearchParams(window.location.search).get('session_id') ??
    DEFAULT_SESSION_TOKEN
  )
}
