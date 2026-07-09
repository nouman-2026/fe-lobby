<script setup lang="ts">
import { getGameById } from "~/data/games";

const settings = useSettingsStore();

const game = computed(() =>
  settings.activeGameId ? getGameById(settings.activeGameId) : null,
);
</script>

<template>
  <Transition name="game-modal">
    <div
      v-if="game"
      class="fixed inset-0 z-[100] flex flex-col overflow-hidden bg-black"
      role="dialog"
      aria-modal="true"
      :aria-label="game.title"
    >
      <LobbyGameFrame :src="game.launchUrl" :title="game.title" />
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
