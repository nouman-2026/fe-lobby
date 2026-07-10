<script setup lang="ts">
import type { GameCategory } from '~/stores/useSettingsStore'
import { sidebarNavItems } from '~/data/games'

const settings = useSettingsStore()

const walletBalance = '₺ 38,763.30'
const navItems = sidebarNavItems

function isActive(category: GameCategory) {
  return settings.activeCategory === category && settings.lobbyOpen
}

function onNavClick(category: GameCategory) {
  settings.setActiveCategory(category)
  settings.closeGame()
}
</script>

<template>
  <!-- Desktop / large tablet sidebar -->
  <aside
    class="hidden h-full w-[220px] shrink-0 flex-col border-r border-zinc-800/80 bg-[#1a1a1a] lg:flex"
    aria-label="Lobby navigation"
  >
    <div class="px-5 pb-3 pt-6">
      <img src="/logo.svg" alt="Logo" class="h-7 w-auto" />
    </div>

    <div class="px-3 pb-4">
      <LobbyUserProfile />
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
        class="wallet-card relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400/20 via-zinc-900 to-zinc-900 p-px shadow-lg shadow-amber-400/10"
      >
        <div
          class="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-amber-950/40 px-4 py-3.5"
        >
          <div
            class="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-amber-400/15 blur-2xl"
          />
          <div
            class="pointer-events-none absolute -bottom-8 left-1/2 h-16 w-32 -translate-x-1/2 rounded-full bg-amber-500/10 blur-2xl"
          />

          <p
            class="relative text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-400/90"
          >
            Wallet Balance
          </p>

          <div class="relative mt-1.5 flex items-center gap-2">
            <span
              class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-300 to-amber-500 shadow-md shadow-amber-400/30"
            >
              <Icon name="mdi:wallet" size="14" class="text-black" />
            </span>
            <span
              class="whitespace-nowrap bg-gradient-to-r from-white to-amber-100 bg-clip-text font-mono text-sm font-bold tabular-nums text-transparent"
            >
              {{ walletBalance }}
            </span>
          </div>
        </div>
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
      class="wallet-pill relative ml-0.5 flex shrink-0 items-center gap-1 overflow-hidden rounded-lg bg-gradient-to-r from-amber-400/15 to-zinc-900 px-1.5 py-1 ring-1 ring-amber-400/25 sm:ml-1 sm:gap-1.5 sm:rounded-xl sm:px-2 sm:py-1.5"
    >
      <span
        class="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-400/10 via-transparent to-transparent"
      />
      <span
        class="relative flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-amber-300 to-amber-500 shadow-sm shadow-amber-400/30 sm:h-6 sm:w-6"
      >
        <Icon name="mdi:wallet" size="12" class="text-black" />
      </span>
      <span
        class="relative whitespace-nowrap font-mono text-[9px] font-bold leading-none tabular-nums text-amber-50 sm:text-[10px]"
      >
        {{ walletBalance }}
      </span>
    </div>
  </nav>
</template>
