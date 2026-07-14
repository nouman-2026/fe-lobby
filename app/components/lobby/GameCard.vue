<script setup lang="ts">
import type { Game } from '~/data/games'

const props = withDefaults(
  defineProps<{
    game: Game
    layoutMode?: 'grid' | 'list'
    eager?: boolean
  }>(),
  {
    layoutMode: 'grid',
    eager: false,
  }
)

const emit = defineEmits<{
  select: [gameId: string]
}>()

const loaded = ref(false)
const imgRef = ref<HTMLImageElement | null>(null)

function syncLoadedState() {
  const img = imgRef.value
  loaded.value = !!img?.complete && img.naturalWidth > 0
}

watch(
  () => props.game.thumbnail,
  () => {
    loaded.value = false
    nextTick(syncLoadedState)
  }
)

onMounted(() => {
  nextTick(syncLoadedState)
})

function onLoaded() {
  loaded.value = true
}

function onSelect() {
  emit('select', props.game.id)
}
</script>

<template>
  <button
    type="button"
    class="group relative min-w-0 overflow-hidden rounded-xl border border-slate-800 bg-zinc-900 text-left transition duration-300 hover:border-amber-400/30 hover:shadow-lg hover:shadow-amber-400/10"
    :class="
      layoutMode === 'list'
        ? 'flex w-full items-center gap-3 rounded-lg p-2 sm:gap-4 sm:rounded-xl sm:p-3'
        : 'flex w-full flex-col'
    "
    @click="onSelect"
  >
    <!-- Skeleton overlay — Tailwind pulse pattern, matched to card layout -->
    <div
      v-show="!loaded"
      class="absolute inset-0 z-20 overflow-hidden rounded-[inherit] bg-zinc-900"
      aria-hidden="true"
    >
      <template v-if="layoutMode === 'list'">
        <div class="flex h-full animate-pulse space-x-4 px-1 py-1 sm:px-0">
          <div
            class="aspect-[4/5] w-16 shrink-0 rounded-lg bg-zinc-800 sm:w-20"
          />
          <div class="min-w-0 flex-1 space-y-6 py-1">
            <div class="h-2 rounded bg-zinc-700" />
            <div class="space-y-3">
              <div class="grid grid-cols-3 gap-4">
                <div class="col-span-2 h-2 rounded bg-zinc-700" />
                <div class="col-span-1 h-2 rounded bg-zinc-700" />
              </div>
              <div class="h-2 rounded bg-zinc-800" />
            </div>
          </div>
        </div>
      </template>

      <template v-else>
        <div class="flex h-full animate-pulse flex-col">
          <div class="aspect-[4/5] w-full bg-zinc-800" />
          <div class="space-y-2 p-3 sm:p-4">
            <div class="h-2 w-2/3 rounded bg-zinc-700" />
          </div>
        </div>
      </template>
    </div>

    <template v-if="layoutMode === 'list'">
      <div
        class="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-lg sm:w-20"
      >
        <img
          ref="imgRef"
          :src="game.thumbnail"
          :alt="game.title"
          width="128"
          height="160"
          class="h-full w-full object-contain transition duration-500 group-hover:scale-110"
          :loading="eager ? 'eager' : 'lazy'"
          decoding="async"
          @load="onLoaded"
          @error="onLoaded"
        />

        <div
          class="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/50 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100 group-hover:backdrop-blur-md"
        >
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-black shadow-lg shadow-amber-400/40 ring-2 ring-amber-300/30 transition-transform duration-300 group-hover:scale-110"
          >
            <Icon name="mdi:play" size="16" class="ml-0.5" />
          </span>
          <span
            class="text-[9px] font-bold uppercase tracking-wider text-white"
          >
            Play Now
          </span>
        </div>
      </div>

      <div class="min-w-0 flex-1">
        <h3
          class="truncate text-sm font-bold text-white sm:text-base"
          :title="game.title"
        >
          {{ game.title }}
        </h3>
        <p class="text-xs capitalize text-zinc-400">{{ game.category }}</p>
      </div>

      <span
        v-if="game.isNew"
        class="shrink-0 rounded-full bg-amber-400/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400"
      >
        New
      </span>
    </template>

    <template v-else>
      <div class="relative aspect-[4/5] w-full overflow-hidden">
        <img
          ref="imgRef"
          :src="game.thumbnail"
          :alt="game.title"
          width="512"
          height="640"
          class="h-full w-full object-contain transition duration-500 group-hover:scale-110"
          :loading="eager ? 'eager' : 'lazy'"
          decoding="async"
          @load="onLoaded"
          @error="onLoaded"
        />

        <div
          class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-black/30 opacity-0 backdrop-blur-0 transition-all duration-300 group-hover:bg-black/40 group-hover:opacity-100 group-hover:backdrop-blur-md"
        >
          <span
            class="play-pulse flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-black shadow-xl shadow-amber-400/50 ring-4 ring-amber-400/25 transition-transform duration-300 group-hover:scale-110 sm:h-12 sm:w-12"
          >
            <Icon name="mdi:play" size="22" class="ml-0.5" />
          </span>
          <span
            class="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white sm:text-xs"
          >
            Play Now
          </span>
        </div>

        <span
          v-if="game.isNew"
          class="absolute left-3 top-3 z-[2] inline-flex w-fit rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400"
        >
          New
        </span>
      </div>

      <div class="px-3 py-2 sm:px-4 sm:py-3">
        <h3
          class="truncate text-xs font-bold text-white sm:text-sm md:text-base"
          :title="game.title"
        >
          {{ game.title }}
        </h3>
      </div>
    </template>
  </button>
</template>

<style scoped>
.group:hover .play-pulse {
  animation: play-glow 2s ease-in-out infinite;
}

@keyframes play-glow {
  0%,
  100% {
    box-shadow:
      0 0 0 0 rgba(251, 191, 36, 0.35),
      0 10px 25px -5px rgba(251, 191, 36, 0.4);
  }

  50% {
    box-shadow:
      0 0 0 8px rgba(251, 191, 36, 0),
      0 10px 30px -5px rgba(251, 191, 36, 0.55);
  }
}
</style>
