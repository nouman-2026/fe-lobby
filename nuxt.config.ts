/// <reference types="node" />
// https://nuxt.com/docs/api/configuration/nuxt-config

import mkcert from 'vite-plugin-mkcert'
import path from 'path'
import { version as appVersion } from './package.json'

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
  app: {
    baseURL: '/lobby/',
    head: {
      link: cdnOrigin ? [{ rel: 'preconnect', href: cdnOrigin }] : [],
    },
  },
  routeRules: {
    '/**': {
      headers: {
        'X-Frame-Options': 'ALLOWALL',
        'Content-Security-Policy': "frame-ancestors 'self' *",
      },
    },
  },
  runtimeConfig: {
    public: {
      /** Local fixed API base (`NUXT_PUBLIC_API_BASE`). Production uses the page host. */
      apiBase: process.env.NUXT_PUBLIC_API_BASE || '',
      nuxtPublicCdnUrl: cdnUrl,
      appVersion,
    },
  },
  devtools: { enabled: false },
  devServer: {
    port: 4500,
    https: true,
    host: 'local.ninjagaming.com',
  },
  vite: {
    plugins: [
      mkcert({
        savePath: path.resolve(__dirname, './.certs'),
        hosts: ['local.ninjagaming.com', 'localhost', '127.0.0.1'],
      }),
    ],
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
