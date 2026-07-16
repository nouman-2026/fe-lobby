<script setup lang="ts">
const settings = useSettingsStore()
const catalog = useCatalogStore()

const game = computed(() =>
  settings.activeGameId ? catalog.getGameById(settings.activeGameId) : null
)

const thumbFailed = ref(false)

watch(
  () => game.value?.thumbnail,
  () => {
    thumbFailed.value = false
  }
)

function onResume() {
  settings.resumeGame()
}

function onClose(event: Event) {
  event.stopPropagation()
  settings.closeGame()
}
</script>

<template>
  <Transition name="running-card">
    <div
      v-if="settings.clientReady && settings.hasRunningGame && game"
      class="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom)+1rem)] right-4 z-[90] w-[min(100%-2rem,20rem)] lg:bottom-4"
    >
      <div
        class="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-amber-400/20 bg-[#1a1a1a]/95 p-2.5 pr-10 shadow-xl shadow-black/40 ring-1 ring-zinc-800/80 backdrop-blur-md transition hover:border-amber-400/40 hover:ring-amber-400/20"
      >
        <button
          type="button"
          class="absolute inset-0 z-0 rounded-2xl text-left"
          :aria-label="`Back to ${game.title}`"
          @click="onResume"
        />

        <div
          class="relative z-[1] pointer-events-none flex min-w-0 flex-1 items-center gap-3"
        >
          <span
            class="relative h-14 w-11 shrink-0 overflow-hidden rounded-lg bg-zinc-900 ring-1 ring-zinc-800"
          >
            <img
              v-if="!thumbFailed"
              :src="game.thumbnail"
              :alt="game.title"
              class="h-full w-full object-cover"
              loading="lazy"
              @error="thumbFailed = true"
            />
            <span
              v-else
              class="flex h-full w-full items-center justify-center bg-zinc-900 px-0.5 text-center text-[7px] font-medium leading-tight text-zinc-500"
            >
              Preview not available
            </span>
            <span
              class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"
            />
          </span>

          <span class="min-w-0 flex-1">
            <span class="block truncate text-sm font-semibold text-white">
              {{ game.title }}
            </span>
            <span class="mt-0.5 block text-xs text-amber-400/90">
              Back to game
            </span>
          </span>
        </div>

        <button
          type="button"
          class="absolute right-2 top-2 z-[2] flex h-7 w-7 items-center justify-center rounded-full bg-zinc-800/90 text-zinc-400 ring-1 ring-zinc-700 transition hover:bg-zinc-700 hover:text-white"
          aria-label="Close game"
          @click="onClose"
        >
          <Icon name="mdi:close" size="16" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.running-card-enter-active,
.running-card-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.running-card-enter-from,
.running-card-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}
</style>
