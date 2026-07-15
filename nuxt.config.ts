/// <reference types="node" />
// https://nuxt.com/docs/api/configuration/nuxt-config

import mkcert from 'vite-plugin-mkcert'
import path from 'path'

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
      nuxtPublicBaseUrl: process.env.NUXT_PUBLIC_BASE_URL,
      nuxtPublicCdnUrl: cdnUrl,
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
