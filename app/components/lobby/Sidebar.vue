<script setup lang="ts">
import type { GameCategory } from "~/stores/useSettingsStore";
import { sidebarNavItems } from "~/data/games";

const settings = useSettingsStore();

const walletBalance = "₺ 38,763.30";
const navItems = sidebarNavItems;

function isActive(category: GameCategory) {
  return settings.activeCategory === category && settings.lobbyOpen;
}

function onNavClick(category: GameCategory) {
  settings.setActiveCategory(category);
  settings.closeGame();
}
</script>

<template>
  <!-- Desktop / large tablet sidebar -->
  <aside
    class="hidden h-full w-[220px] shrink-0 flex-col border-r border-zinc-800/80 bg-[#1a1a1a] lg:flex"
    aria-label="Lobby navigation"
  >
    <div class="px-5 pb-4 pt-6">
      <img src="/logo.svg" alt="Logo" class="h-7 w-auto" />
    </div>

    <nav class="flex flex-1 flex-col gap-0.5 px-3">
      <button
        v-for="item in navItems"
        :key="item.id"
        type="button"
        class="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm font-medium transition"
        :class="
          isActive(item.id)
            ? 'text-amber-400'
            : 'text-zinc-300 hover:bg-zinc-800/60 hover:text-white'
        "
        @click="onNavClick(item.id)"
      >
        <Icon
          :name="item.icon"
          class="shrink-0"
          :class="isActive(item.id) ? 'text-amber-400' : 'text-white'"
        />
        <span>{{ item.label }}</span>
      </button>
    </nav>

    <div class="mt-auto border-t border-zinc-800/80 px-3 py-4">
      <div
        class="flex items-center justify-between gap-2 rounded-xl bg-zinc-900/80 px-3 py-3 ring-1 ring-zinc-800"
      >
        <span
          class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400/15"
        >
          <Icon name="mdi:wallet-outline" size="16" class="text-amber-400" />
        </span>
        <span
          class="min-w-0 truncate font-mono text-sm font-semibold tabular-nums text-white"
        >
          {{ walletBalance }}
        </span>
      </div>
    </div>
  </aside>

  <!-- Mobile / tablet bottom navigation -->
  <nav
    class="fixed inset-x-0 bottom-0 z-50 flex items-center gap-1 border-t border-zinc-800/80 bg-[#1a1a1a]/95 px-2 py-2 backdrop-blur-md pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden"
    aria-label="Lobby navigation"
  >
    <button
      v-for="item in navItems"
      :key="item.id"
      type="button"
      class="flex min-w-0 flex-1 flex-col items-center gap-0.5 rounded-lg px-1 py-1.5 text-[10px] font-medium transition sm:text-xs"
      :class="isActive(item.id) ? 'text-amber-400' : 'text-zinc-400'"
      @click="onNavClick(item.id)"
    >
      <Icon
        :name="item.icon"
        size="20"
        :class="isActive(item.id) ? 'text-amber-400' : 'text-white'"
      />
      <span class="truncate">{{ item.label }}</span>
    </button>

    <div
      class="ml-1 flex shrink-0 items-center gap-1.5 rounded-xl bg-zinc-900/80 px-2.5 py-2 ring-1 ring-zinc-800 sm:gap-2 sm:px-3"
    >
      <Icon
        name="mdi:wallet-outline"
        size="16"
        class="shrink-0 text-amber-400"
      />
      <span
        class="max-w-[5.5rem] truncate font-mono text-[10px] font-semibold tabular-nums text-white sm:max-w-none sm:text-xs"
      >
        {{ walletBalance }}
      </span>
    </div>
  </nav>
</template>
