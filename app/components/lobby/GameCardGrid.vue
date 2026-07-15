<script setup lang="ts">
import type { CatalogFilter } from '~/data/games'

const props = defineProps<{
  layoutMode: 'grid' | 'list'
  category: CatalogFilter
}>()

const emit = defineEmits<{
  select: [gameId: string]
}>()

const catalog = useCatalogStore()
const catalogFilter = computed(() => props.category)

const games = computed(() => catalog.getGamesForCategory(catalogFilter.value))

const pagination = computed(() =>
  catalog.getPaginationForCategory(catalogFilter.value)
)

const loading = computed(() => catalog.isLoading(catalogFilter.value))
const loadingMore = computed(() => catalog.isLoadingMore(catalogFilter.value))
const error = computed(() => catalog.getError(catalogFilter.value))
const hasMore = computed(() => catalog.hasMoreGames(catalogFilter.value))

const progressPercent = computed(() => {
  const total = pagination.value.total_count
  if (!total) return 0

  return Math.min(100, Math.round((games.value.length / total) * 100))
})

const gridClass = computed(() =>
  props.layoutMode === 'grid'
    ? 'grid w-full grid-cols-3 justify-center gap-x-2.5 gap-y-3 min-[868px]:grid-cols-4 min-[1024px]:grid-cols-4 min-[1124px]:gap-x-3 min-[1124px]:gap-y-4 min-[1300px]:grid-cols-5 min-[1600px]:grid-cols-6 md:items-start'
    : 'flex flex-col gap-2.5'
)

watch(
  catalogFilter,
  (filter) => {
    if (import.meta.client) {
      catalog.ensureCategory(filter)
    }
  },
  { immediate: true }
)

onMounted(() => {
  catalog.ensureCategory(catalogFilter.value)
})

function onSelect(gameId: string) {
  emit('select', gameId)
}

function onLoadMore() {
  catalog.loadMore(catalogFilter.value)
}
</script>

<template>
  <div class="flex w-full flex-col">
    <div
      v-if="loading && games.length === 0"
      :class="gridClass"
      aria-busy="true"
      aria-label="Loading games"
    >
      <div
        v-for="index in 12"
        :key="index"
        class="animate-pulse overflow-hidden rounded-2xl bg-zinc-900"
        :class="
          layoutMode === 'list'
            ? 'flex h-24 items-center gap-3 border border-slate-800 p-2 sm:p-3'
            : 'flex flex-col'
        "
      >
        <div
          class="bg-zinc-800"
          :class="
            layoutMode === 'list'
              ? 'aspect-[4/5] w-16 shrink-0 rounded-xl sm:w-20'
              : 'aspect-[4/5] w-full rounded-2xl'
          "
        />
        <div
          v-if="layoutMode === 'list'"
          class="h-3 flex-1 rounded bg-zinc-700"
        />
        <div v-else class="mt-2 px-1">
          <div class="h-2.5 w-3/4 rounded bg-zinc-700" />
        </div>
      </div>
    </div>

    <p
      v-else-if="error && games.length === 0"
      class="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-6 text-center text-sm text-red-300"
    >
      {{ error }}
    </p>

    <p
      v-else-if="!loading && games.length === 0"
      class="rounded-xl border border-zinc-800 bg-zinc-900/50 px-4 py-10 text-center text-sm text-zinc-400"
    >
      No games found in this category.
    </p>

    <div v-else :class="gridClass">
      <LobbyGameCard
        v-for="game in games"
        :key="game.id"
        :game="game"
        :layout-mode="layoutMode"
        :eager="layoutMode === 'grid'"
        @select="onSelect"
      />
    </div>

    <div
      v-if="games.length > 0 && pagination.total_count > 0"
      class="mt-6 w-full"
    >
      <div
        class="h-1 w-full overflow-hidden rounded-full bg-slate-800"
        role="progressbar"
        :aria-valuenow="games.length"
        :aria-valuemin="0"
        :aria-valuemax="pagination.total_count"
        :aria-label="`Showing ${games.length} of ${pagination.total_count} games`"
      >
        <div
          class="h-full rounded-full bg-cyan-400 transition-all duration-500 ease-out"
          :style="{ width: `${progressPercent}%` }"
        />
      </div>

      <p class="my-2 text-center text-sm text-white">
        Showing {{ games.length }} of {{ pagination.total_count }} games
      </p>

      <button
        v-if="hasMore"
        type="button"
        class="flex w-full items-center justify-between rounded-lg border border-slate-700 bg-[#001529] px-6 py-3 text-white transition hover:border-cyan-400/40 hover:bg-[#001a33] disabled:cursor-not-allowed disabled:opacity-70"
        :disabled="loadingMore"
        @click="onLoadMore"
      >
        <Icon
          name="material-symbols:arrow-cool-down"
          size="18"
          class="shrink-0 text-white/80"
        />

        <span class="flex items-center gap-2 font-semibold">
          <Icon
            v-if="loadingMore"
            name="mdi:loading"
            size="18"
            class="animate-spin"
          />
          View More
        </span>

        <Icon
          name="material-symbols:arrow-cool-down"
          size="18"
          class="shrink-0 text-white/80"
        />
      </button>
    </div>
  </div>
</template>
