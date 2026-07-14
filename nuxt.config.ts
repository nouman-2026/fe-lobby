// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  devServer: {
    port: 4500,
  },
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
  ],
  app: {
    head: {
      link: [{ rel: 'preconnect', href: 'https://cdn.ninjagaming.org' }],
    },
  },
  icon: {
    serverBundle: {
      collections: ['mdi'],
    },
  },
  image: {
    domains: ['cdn.ninjagaming.org'],
    quality: 80,
    presets: {
      gameCard: {
        modifiers: {
          fit: 'inside',
          quality: 80,
        },
      },
    },
  },
})
