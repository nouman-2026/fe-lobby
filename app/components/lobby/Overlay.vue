<script setup lang="ts">
import { sidebarNavItems } from "~/data/games";

const settings = useSettingsStore();

const activeLabel = computed(
  () =>
    sidebarNavItems.find((item) => item.id === settings.activeCategory)
      ?.label ?? "All Games",
);

function onSelect(gameId: string) {
  settings.openGame(gameId);
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
      class="flex flex-col gap-3 border-b border-zinc-800/80 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4"
    >
      <div class="min-w-0">
        <h2
          class="truncate text-lg font-bold tracking-tight text-white sm:text-xl"
        >
          {{ activeLabel }}
        </h2>
        <p class="text-xs text-zinc-400 sm:text-sm">Select a title to launch</p>
      </div>

      <div
        class="flex shrink-0 rounded-lg border border-zinc-700 p-0.5 self-start sm:self-auto"
      >
        <button
          type="button"
          class="rounded-md px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition sm:px-3 sm:text-xs"
          :class="
            settings.layoutMode === 'grid'
              ? 'bg-zinc-700 text-white'
              : 'text-zinc-400 hover:text-white'
          "
          @click="settings.setLayoutMode('grid')"
        >
          Grid
        </button>
        <button
          type="button"
          class="rounded-md px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition sm:px-3 sm:text-xs"
          :class="
            settings.layoutMode === 'list'
              ? 'bg-zinc-700 text-white'
              : 'text-zinc-400 hover:text-white'
          "
          @click="settings.setLayoutMode('list')"
        >
          List
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
