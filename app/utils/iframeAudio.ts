/**
 * Best-effort mute of audio inside a same-origin game iframe.
 * Cannot mute the browser tab itself — only media/Howler reachable on contentWindow.
 */
export function setIframeAudioMuted(
  iframe: HTMLIFrameElement | null | undefined,
  muted: boolean
) {
  if (!iframe) return

  let win: Window
  try {
    win = iframe.contentWindow as Window
    // Touching document throws if cross-origin.
    void win.document
  } catch {
    return
  }

  try {
    const howler = (
      win as Window & { Howler?: { mute?: (v: boolean) => void } }
    ).Howler
    howler?.mute?.(muted)
  } catch {
    // ignore
  }

  try {
    win.document.querySelectorAll('audio, video').forEach((node) => {
      const el = node as HTMLMediaElement
      el.muted = muted
      if (muted) el.pause()
    })
  } catch {
    // ignore
  }
}
