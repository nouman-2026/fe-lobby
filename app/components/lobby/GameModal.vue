<script setup lang="ts">
import { buildGameLaunchUrl } from '~/utils/gameLaunchUrl'
import { getGameById } from '~/data/games'

const settings = useSettingsStore()

const game = computed(() =>
  settings.activeGameId ? getGameById(settings.activeGameId) : null
)

const launchUrl = computed(() =>
  game.value ? buildGameLaunchUrl(game.value.id) : ''
)
</script>

<template>
  <Transition name="game-modal">
    <div
      v-if="game && launchUrl"
      class="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-black"
      role="dialog"
      aria-modal="true"
      :aria-label="game.title"
    >
      <LobbyGameFrame :src="launchUrl" :title="game.title" />
    </div>
  </Transition>
</template>

<style scoped>
.game-modal-enter-active,
.game-modal-leave-active {
  transition: opacity 0.25s ease;
}

.game-modal-enter-from,
.game-modal-leave-to {
  opacity: 0;
}
</style>
