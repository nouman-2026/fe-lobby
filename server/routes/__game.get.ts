/**
 * Same-origin game shell for local iframe testing.
 * Proxies game HTML from the current request origin and rewrites root-relative URLs.
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

  let out = html.replace(/(src|href)=(["'])\//g, `$1=$2${gameOrigin}/`)
  out = out.replace(/(from\s*)(["'])\//g, `$1$2${gameOrigin}/`)
  out = out.replace(/(import\s*\(\s*)(["'])\//g, `$1$2${gameOrigin}/`)

  setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
  setHeader(event, 'Cache-Control', 'no-store')
  return out
})
