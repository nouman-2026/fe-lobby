/**
 * Same-origin game shell for local iframe testing.
 * Proxies game HTML from the current request origin and injects the web-lobby bridge.
 */
export default defineEventHandler(async (event) => {
  const requestUrl = getRequestURL(event)
  const gameOrigin = requestUrl.origin

  const query = getQuery(event)
  const qs = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value == null) continue
    if (Array.isArray(value)) {
      for (const item of value) qs.append(key, String(item))
    } else {
      qs.set(key, String(value))
    }
  }

  const target = `${gameOrigin}/${qs.size ? `?${qs.toString()}` : ''}`

  let html: string
  try {
    html = await $fetch<string>(target, { responseType: 'text' })
  } catch (error) {
    throw createError({
      statusCode: 502,
      statusMessage: `Game unreachable at ${gameOrigin}`,
      data: error,
    })
  }

  const bridge = `
<script>
  try { delete window.__NINJA_MOBILE_LOBBY__; delete window.ninjaShell; } catch (e) {}
  window.__NINJA_WEB_LOBBY__ = {
    embedded: true,
    minimizeGame: function () {
      try { window.parent.postMessage({ type: 'NINJA_LOBBY_MINIMIZE' }, '*'); } catch (e) {}
    },
    resumeGame: function () {
      try { window.parent.postMessage({ type: 'NINJA_LOBBY_RESUME' }, '*'); } catch (e) {}
    },
    closeGame: function () {
      try { window.parent.postMessage({ type: 'NINJA_LOBBY_CLOSE' }, '*'); } catch (e) {}
    },
  };
</script>`

  let out = html.replace(/<head([^>]*)>/i, `<head$1>${bridge}`)

  out = out.replace(/(src|href)=(["'])\//g, `$1=$2${gameOrigin}/`)
  out = out.replace(/(from\s*)(["'])\//g, `$1$2${gameOrigin}/`)
  out = out.replace(/(import\s*\(\s*)(["'])\//g, `$1$2${gameOrigin}/`)

  setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-store')
  return out
})
