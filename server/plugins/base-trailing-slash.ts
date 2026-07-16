/**
 * Redirect `/lobby` → `/lobby/` (preserve query). Production/node serve-static can
 * mishandle the base path without a trailing slash when a query string is present.
 * @see https://github.com/nuxt/nuxt/issues/21872
 */
export default defineNitroPlugin((nitroApp) => {
  const baseURL = useRuntimeConfig().app.baseURL || '/lobby/'
  const basePath = baseURL.replace(/\/$/, '') || '/'

  nitroApp.h3App.stack.unshift({
    route: '/',
    handler: defineEventHandler((event) => {
      const url = getRequestURL(event)
      if (url.pathname === basePath) {
        return sendRedirect(event, `${baseURL}${url.search}`, 308)
      }
    }),
  })
})
