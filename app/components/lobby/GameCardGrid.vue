<script setup lang="ts">
import type { SidebarCategory } from '~/data/games'

const props = defineProps<{
  layoutMode: 'grid' | 'list'
  category: string
}>()

const emit = defineEmits<{
  select: [gameId: string]
}>()

const catalog = useCatalogStore()

const filteredGames = computed(() =>
  catalog.gamesByCategory(props.category as SidebarCategory)
)

const gridClass = computed(() =>
  props.layoutMode === 'grid'
    ? 'grid w-full grid-cols-3 justify-center gap-x-2 gap-y-2 min-[868px]:grid-cols-4 min-[1024px]:grid-cols-4 min-[1124px]:gap-3 min-[1300px]:grid-cols-5 min-[1600px]:grid-cols-6 md:items-start'
    : 'flex flex-col gap-2'
)

function onSelect(gameId: string) {
  emit('select', gameId)
}
</script>

<template>
  <div :class="gridClass">
    <LobbyGameCard
      v-for="game in filteredGames"
      :key="game.id"
      :game="game"
      :layout-mode="layoutMode"
      :eager="layoutMode === 'grid'"
      @select="onSelect"
    />
  </div>
</template>
