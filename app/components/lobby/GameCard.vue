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
    class="game-card group relative min-w-0 text-left transition duration-300 ease-out"
    :class="
      layoutMode === 'list'
        ? 'flex w-full items-center gap-3 rounded-xl p-2 sm:gap-4 sm:rounded-2xl sm:p-3'
        : 'flex w-full flex-col'
    "
    @click="onSelect"
  >
    <!-- Skeleton overlay -->
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
          <div class="aspect-[4/5] w-full shrink-0 rounded-2xl bg-zinc-800" />
          <div class="mt-2 px-1">
            <div class="h-2.5 w-3/4 rounded bg-zinc-700" />
          </div>
        </div>
      </template>
    </div>

    <template v-if="layoutMode === 'list'">
      <div
        class="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 sm:w-20"
      >
        <img
          ref="imgRef"
          :src="game.thumbnail"
          :alt="game.title"
          width="128"
          height="160"
          class="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
          :loading="eager ? 'eager' : 'lazy'"
          decoding="async"
          @load="onLoaded"
          @error="onLoaded"
        />

        <div
          class="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:opacity-100"
        >
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full bg-amber-400 text-black shadow-lg shadow-amber-400/40"
          >
            <Icon name="mdi:play" size="16" class="ml-0.5" />
          </span>
        </div>
      </div>

      <div class="min-w-0 flex-1">
        <h3
          class="truncate text-sm font-semibold text-white sm:text-base"
          :title="game.title"
        >
          {{ game.title }}
        </h3>
        <p class="text-xs capitalize text-zinc-400">{{ game.category }}</p>
      </div>
    </template>

    <template v-else>
      <div
        class="card-art relative aspect-[4/5] w-full shrink-0 overflow-hidden rounded-2xl"
      >
        <img
          ref="imgRef"
          :src="game.thumbnail"
          :alt="game.title"
          width="512"
          height="640"
          class="absolute inset-0 h-full w-full object-cover object-center transition duration-500 ease-out group-hover:scale-[1.04]"
          :loading="eager ? 'eager' : 'lazy'"
          decoding="async"
          @load="onLoaded"
          @error="onLoaded"
        />

        <div
          class="pointer-events-none absolute inset-0 z-[2] ring-1 ring-inset ring-white/10 transition duration-300 group-hover:ring-amber-400/30"
        />

        <div
          class="card-shine pointer-events-none absolute inset-0 z-[3] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          aria-hidden="true"
        />

        <div
          class="absolute inset-0 z-[4] flex flex-col items-center justify-center gap-2 bg-black/20 opacity-0 transition-all duration-300 group-hover:bg-black/35 group-hover:opacity-100 group-hover:backdrop-blur-[2px]"
        >
          <span
            class="play-pulse flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-amber-300 to-amber-500 text-black shadow-xl shadow-amber-400/50 ring-4 ring-amber-400/25 transition-transform duration-300 group-hover:scale-110"
          >
            <Icon name="mdi:play" size="24" class="ml-0.5" />
          </span>
          <span
            class="rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm sm:text-xs"
          >
            Play Now
          </span>
        </div>
      </div>

      <div class="card-caption min-w-0 px-0.5 pt-2">
        <h3
          class="truncate text-xs font-bold leading-tight text-white sm:text-sm md:text-base"
          :title="game.title"
        >
          {{ game.title }}
        </h3>
      </div>
    </template>
  </button>
</template>

<style scoped>
.game-card {
  border-radius: 1rem;
}

.game-card:not(:has(.card-art)) {
  border: 1px solid rgb(30 41 59 / 0.8);
  background: linear-gradient(145deg, rgb(24 24 27) 0%, rgb(15 15 18) 100%);
}

.game-card:not(:has(.card-art)):hover {
  border-color: rgb(251 191 36 / 0.25);
  box-shadow:
    0 8px 32px -8px rgb(251 191 36 / 0.15),
    0 0 0 1px rgb(251 191 36 / 0.08);
}

.card-art {
  background: linear-gradient(160deg, rgb(30 30 35) 0%, rgb(18 18 22) 100%);
  box-shadow:
    0 4px 24px -4px rgb(0 0 0 / 0.5),
    0 0 0 1px rgb(255 255 255 / 0.06);
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
}

.group:hover .card-art {
  box-shadow:
    0 12px 40px -8px rgb(251 191 36 / 0.2),
    0 0 0 1px rgb(251 191 36 / 0.2),
    0 0 60px -12px rgb(251 191 36 / 0.15);
  transform: translateY(-2px);
}

.card-shine {
  background: linear-gradient(
    105deg,
    transparent 40%,
    rgb(255 255 255 / 0.08) 45%,
    rgb(255 255 255 / 0.15) 50%,
    rgb(255 255 255 / 0.08) 55%,
    transparent 60%
  );
  background-size: 200% 100%;
  animation: card-shine-sweep 0.8s ease-out forwards;
}

.group:hover .play-pulse {
  animation: play-glow 2s ease-in-out infinite;
}

@keyframes card-shine-sweep {
  from {
    background-position: 200% 0;
  }

  to {
    background-position: -100% 0;
  }
}

@keyframes play-glow {
  0%,
  100% {
    box-shadow:
      0 0 0 0 rgb(251 191 36 / 0.35),
      0 10px 25px -5px rgb(251 191 36 / 0.4);
  }

  50% {
    box-shadow:
      0 0 0 8px rgb(251 191 36 / 0),
      0 10px 30px -5px rgb(251 191 36 / 0.55);
  }
}
</style>
