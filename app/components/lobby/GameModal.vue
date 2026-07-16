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

const showLaunchState = computed(
  () =>
    settings.clientReady &&
    !!settings.activeGameId &&
    !settings.gameMinimized &&
    !settings.activeGameLaunchUrl
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

  <div
    v-else-if="showLaunchState"
    class="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-4 bg-black"
    role="status"
    aria-live="polite"
    :aria-label="
      settings.gameLaunchError ? 'Game launch failed' : 'Launching game'
    "
  >
    <Icon
      v-if="settings.gameLaunchLoading"
      name="mdi:loading"
      size="40"
      class="animate-spin text-amber-400"
    />
    <p
      v-if="settings.gameLaunchError"
      class="max-w-sm px-6 text-center text-sm text-red-400"
    >
      {{ settings.gameLaunchError }}
    </p>
    <button
      v-if="settings.gameLaunchError"
      type="button"
      class="rounded-lg bg-zinc-800 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-700"
      @click="settings.closeGame()"
    >
      Back to lobby
    </button>
  </div>
</template>
