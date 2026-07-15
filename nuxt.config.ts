/// <reference types="node" />
// https://nuxt.com/docs/api/configuration/nuxt-config

function resolveCdnOrigin(url: string) {
  if (!url) return ''

  try {
    return new URL(url).origin
  } catch {
    return ''
  }
}

function resolveCdnHostname(url: string) {
  if (!url) return ''

  try {
    return new URL(url).hostname
  } catch {
    return ''
  }
}

const cdnUrl = process.env.NUXT_PUBLIC_CDN_URL ?? ''
const cdnOrigin = resolveCdnOrigin(cdnUrl)
const cdnHostname = resolveCdnHostname(cdnUrl)

export default defineNuxtConfig({
  runtimeConfig: {
    public: {
      nuxtPublicBaseUrl:
        process.env.NUXT_PUBLIC_BASE_URL ||
        'https://demo.ninjagaming.com/lobby/api',
      nuxtPublicCdnUrl: cdnUrl,
    },
  },
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  devServer: {
    port: 4500,
  },
  css: ['~/assets/css/main.css'],
  modules: [
    '@pinia/nuxt',
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
    '@nuxt/icon',
    '@nuxt/image',
  ],
  tailwindcss: {
    config: {
      theme: {
        extend: {
          fontFamily: {
            sans: ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
          },
        },
      },
    },
  },
  app: {
    head: {
      link: cdnOrigin ? [{ rel: 'preconnect', href: cdnOrigin }] : [],
    },
  },
  icon: {
    serverBundle: {
      collections: ['mdi'],
    },
  },
  image: {
    domains: cdnHostname ? [cdnHostname] : [],
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
