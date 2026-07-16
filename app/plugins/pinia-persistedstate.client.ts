import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin({
  name: 'pinia-plugin-persistedstate',
  dependsOn: ['pinia'],
  setup() {
    usePinia().use(piniaPluginPersistedstate)
  },
})
