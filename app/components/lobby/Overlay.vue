<script setup lang="ts">
import { sidebarNavItems } from '~/data/games'

const settings = useSettingsStore()

const activeLabel = computed(
  () =>
    sidebarNavItems.find((item) => item.id === settings.activeCategory)
      ?.label ?? 'All Games'
)

function onSelect(gameId: string) {
  settings.openGame(gameId)
}
</script>

<template>
  <aside
    class="absolute inset-0 z-40 flex flex-col bg-[#121212]/95 backdrop-blur-md transition duration-300"
    :class="settings.activeGameId ? 'pointer-events-none blur-md' : ''"
    role="dialog"
    aria-label="Game lobby"
  >
    <header
      class="flex items-center justify-between gap-3 border-b border-zinc-800/80 px-4 py-3 sm:px-6 sm:py-4"
    >
      <div class="min-w-0 flex-1">
        <h2
          class="truncate text-base font-bold tracking-tight text-white sm:text-xl"
        >
          {{ activeLabel }}
        </h2>
        <p class="truncate text-[11px] text-zinc-400 sm:text-sm">
          Select a title to launch
        </p>
      </div>

      <div
        class="flex shrink-0 rounded-lg border border-zinc-700 bg-zinc-900/50 p-0.5"
      >
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition sm:px-3 sm:text-xs"
          :class="
            settings.layoutMode === 'grid'
              ? 'bg-zinc-700 text-amber-400 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          "
          @click="settings.setLayoutMode('grid')"
        >
          <Icon name="mdi:view-grid-outline" size="14" />
          <span>Grid</span>
        </button>
        <button
          type="button"
          class="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition sm:px-3 sm:text-xs"
          :class="
            settings.layoutMode === 'list'
              ? 'bg-zinc-700 text-amber-400 shadow-sm'
              : 'text-zinc-400 hover:text-white'
          "
          @click="settings.setLayoutMode('list')"
        >
          <Icon name="mdi:view-list" size="14" />
          <span>List</span>
        </button>
      </div>
    </header>

    <div class="min-h-0 flex-1 overflow-y-auto px-4 py-3 sm:px-6 sm:py-4">
      <LobbyGameCardGrid
        :layout-mode="settings.layoutMode"
        :category="settings.activeCategory"
        @select="onSelect"
      />
    </div>
  </aside>
</template>
