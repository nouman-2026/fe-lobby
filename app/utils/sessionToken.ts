/**
 * Read `session_id` from the page URL. Empty when missing (no placeholder fallback).
 */
export function getSessionTokenFromUrl(): string {
  if (import.meta.server) return ''

  return (
    new URLSearchParams(window.location.search).get('session_id')?.trim() ?? ''
  )
}

export function hasSessionToken(token: string | null | undefined): boolean {
  return Boolean(token?.trim())
}
