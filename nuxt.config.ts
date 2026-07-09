// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: false },
  modules: [
    "@pinia/nuxt",
    "@nuxtjs/tailwindcss",
    "@nuxt/eslint",
    "@nuxt/icon",
    "@nuxt/image",
  ],
  icon: {
    serverBundle: {
      collections: ["mdi"],
    },
  },
  image: {
    domains: ["cdn.ninjagaming.org"],
    quality: 80,
    presets: {
      gameCard: {
        modifiers: {
          fit: "cover",
          quality: 80,
        },
      },
    },
  },
});
