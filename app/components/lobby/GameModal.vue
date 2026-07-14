<script setup lang="ts">
const settings = useSettingsStore()
const catalog = useCatalogStore()

const game = computed(() =>
  settings.activeGameId ? catalog.getGameById(settings.activeGameId) : null
)

const isVisible = computed(
  () =>
    !!game.value && !!settings.activeGameLaunchUrl && !settings.gameMinimized
)
</script>

<template>
  <!-- Keep iframe mounted while a session exists; only hide when minimized. -->
  <div
    v-if="settings.clientReady && game && settings.activeGameLaunchUrl"
    class="fixed inset-0 flex flex-col overflow-hidden bg-black"
    :class="isVisible ? 'z-[100]' : 'pointer-events-none invisible z-0'"
    role="dialog"
    aria-modal="true"
    :aria-hidden="!isVisible"
    :aria-label="game.title"
  >
    <LobbyGameFrame
      :src="settings.activeGameLaunchUrl"
      :title="game.title"
      :session-visible="isVisible"
    />
  </div>
</template>
