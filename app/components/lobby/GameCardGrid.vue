<script setup lang="ts">
import { filterGamesByCategory } from '~/data/games'

const props = defineProps<{
  layoutMode: 'grid' | 'list'
  category: string
}>()

const emit = defineEmits<{
  select: [gameId: string]
}>()

const filteredGames = computed(() =>
  filterGamesByCategory(props.category as 'all' | 'new' | 'slots' | 'crash')
)

const gridClass = computed(() =>
  props.layoutMode === 'grid'
    ? 'grid w-full grid-cols-3 justify-center gap-x-2 gap-y-2 min-[868px]:grid-cols-4 min-[1024px]:grid-cols-4 min-[1124px]:gap-3 min-[1300px]:grid-cols-5 min-[1600px]:grid-cols-6 md:items-start'
    : 'flex flex-col gap-2'
)

function thumbnailFormat(url: string) {
  return url.endsWith('.gif') ? 'gif' : 'webp'
}

function launch(gameId: string) {
  emit('select', gameId)
}
</script>

<template>
  <div :class="gridClass">
    <button
      v-for="game in filteredGames"
      :key="game.id"
      type="button"
      class="group relative overflow-hidden rounded-xl border border-slate-800 bg-zinc-900 text-left transition duration-300 hover:border-amber-400/30 hover:shadow-lg hover:shadow-amber-400/10"
      :class="
        layoutMode === 'list'
          ? 'flex items-center gap-3 rounded-lg p-2 sm:gap-4 sm:rounded-xl sm:p-3'
          : 'aspect-[4/5]'
      "
      @click="launch(game.id)"
    >
      <template v-if="layoutMode === 'list'">
        <div
          class="relative aspect-[4/5] w-16 shrink-0 overflow-hidden rounded-lg sm:w-20"
        >
          <NuxtImg
            preset="gameCard"
            :src="game.thumbnail"
            :alt="game.title"
            :format="thumbnailFormat(game.thumbnail)"
            width="128"
            height="160"
            class="h-full w-full object-contain transition duration-500 group-hover:scale-105"
            loading="lazy"
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
          <h3 class="truncate text-sm font-bold text-white sm:text-base">
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
        <NuxtImg
          preset="gameCard"
          :src="game.thumbnail"
          :alt="game.title"
          :format="thumbnailFormat(game.thumbnail)"
          width="512"
          height="640"
          class="absolute inset-0 h-full w-full object-contain transition duration-500 group-hover:scale-105"
          sizes="(max-width: 867px) 33vw, (max-width: 1299px) 25vw, (max-width: 1599px) 20vw, 16vw"
          loading="lazy"
        />

        <div
          class="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-300 group-hover:from-black/70 group-hover:via-black/40"
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
            class="rounded-full bg-black/40 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-sm sm:text-xs"
          >
            Play Now
          </span>
        </div>

        <div class="relative z-[1] flex h-full flex-col justify-end p-3 sm:p-4">
          <span
            v-if="game.isNew"
            class="mb-auto inline-flex w-fit rounded-full bg-black/50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-400"
          >
            New
          </span>

          <h3 class="text-xs font-bold text-white sm:text-sm md:text-base">
            {{ game.title }}
          </h3>
          <p class="text-[10px] capitalize text-white/70 sm:text-xs">
            {{ game.provider }}
          </p>
        </div>
      </template>
    </button>
  </div>
</template>

<style scoped>
.play-pulse {
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
