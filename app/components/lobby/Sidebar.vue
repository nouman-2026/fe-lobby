<script setup lang="ts">
import type { GameCategory } from '~/stores/useSettingsStore'
import { sidebarNavItems } from '~/data/games'

const settings = useSettingsStore()

const navItems = sidebarNavItems

function isActive(category: GameCategory) {
  return settings.activeCategory === category && settings.lobbyOpen
}

function onNavClick(category: GameCategory) {
  settings.setActiveCategory(category)
  // Keep a minimized background session alive while browsing.
  if (!settings.gameMinimized) {
    settings.closeGame()
  }
}

function onBackdropClick() {
  settings.closeMobileSidebar()
}
</script>

<template>
  <!-- Shared panel content (desktop rail + mobile drawer) -->
  <Teleport to="body">
    <Transition name="sidebar-backdrop">
      <div
        v-if="settings.mobileSidebarOpen"
        class="fixed inset-0 z-[80] bg-black/55 backdrop-blur-[2px] lg:hidden"
        aria-hidden="true"
        @click="onBackdropClick"
      />
    </Transition>
  </Teleport>

  <aside
    class="fixed inset-y-0 left-0 z-[85] flex h-dvh w-[min(100%,260px)] shrink-0 flex-col border-r border-zinc-800/80 bg-[#1a1a1a] transition-transform duration-300 ease-out lg:static lg:z-auto lg:h-full lg:w-[220px] lg:translate-x-0"
    :class="
      settings.mobileSidebarOpen
        ? 'translate-x-0'
        : '-translate-x-full lg:translate-x-0'
    "
    aria-label="Lobby navigation"
  >
    <div class="flex items-center justify-between px-5 pb-3 pt-6">
      <button
        type="button"
        class="rounded-lg transition hover:opacity-80"
        aria-label="Show all games"
        @click="settings.showAllGames()"
      >
        <img src="/logo.svg" alt="Logo" class="h-7 w-auto" />
      </button>
      <button
        type="button"
        class="flex h-9 w-9 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-white lg:hidden"
        aria-label="Close menu"
        @click="settings.closeMobileSidebar()"
      >
        <Icon name="mdi:close" size="22" />
      </button>
    </div>

    <div class="px-3 pb-4">
      <LobbyUserProfile />
    </div>

    <nav class="flex flex-1 flex-col gap-1 overflow-y-auto px-2">
      <button
        v-for="item in navItems"
        :key="item.id"
        type="button"
        class="nav-item relative flex w-full items-center gap-3 rounded-xl py-2.5 pl-4 pr-3 text-left text-sm font-semibold transition duration-200"
        :class="
          isActive(item.id)
            ? 'nav-item--active text-white'
            : 'text-zinc-400 hover:bg-white/[0.03] hover:text-zinc-200'
        "
        :aria-current="isActive(item.id) ? 'page' : undefined"
        @click="onNavClick(item.id)"
      >
        <Icon
          :name="item.icon"
          class="relative z-[1] shrink-0 text-lg"
          :class="isActive(item.id) ? 'text-white' : 'text-zinc-300'"
        />
        <span class="relative z-[1]">{{ item.label }}</span>
      </button>
    </nav>

    <div class="mt-auto border-t border-zinc-800/80 px-3 py-4">
      <LobbyWalletBalance />
    </div>
  </aside>

  <!-- Mobile / tablet bottom navigation -->
  <nav
    class="fixed inset-x-0 bottom-0 z-50 flex items-center gap-1 border-t border-zinc-800/80 bg-[#1a1a1a]/95 px-2 py-2 backdrop-blur-md pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden"
    aria-label="Lobby categories"
  >
    <button
      v-for="item in navItems"
      :key="item.id"
      type="button"
      class="mobile-nav-item relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[10px] font-semibold transition duration-200 sm:text-xs"
      :class="
        isActive(item.id)
          ? 'mobile-nav-item--active text-white'
          : 'text-zinc-500'
      "
      :aria-current="isActive(item.id) ? 'page' : undefined"
      @click="onNavClick(item.id)"
    >
      <Icon
        :name="item.icon"
        size="20"
        class="relative z-[1]"
        :class="isActive(item.id) ? 'text-white' : 'text-zinc-300'"
      />
      <span class="relative z-[1] truncate">{{ item.label }}</span>
    </button>
  </nav>
</template>

<style scoped>
.nav-item--active {
  background: linear-gradient(
    90deg,
    rgba(251, 191, 36, 0.22) 0%,
    rgba(251, 191, 36, 0.08) 42%,
    transparent 100%
  );
}

.nav-item--active::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  width: 3px;
  height: 58%;
  min-height: 1.125rem;
  border-radius: 9999px;
  transform: translateY(-50%);
  background: linear-gradient(180deg, #fde68a 0%, #f59e0b 100%);
  box-shadow:
    0 0 10px rgba(251, 191, 36, 0.75),
    0 0 2px rgba(253, 230, 138, 0.95);
}

.mobile-nav-item--active {
  background: linear-gradient(
    180deg,
    rgba(251, 191, 36, 0.2) 0%,
    rgba(251, 191, 36, 0.06) 55%,
    transparent 100%
  );
}

.mobile-nav-item--active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  width: 36%;
  min-width: 1.75rem;
  height: 3px;
  border-radius: 9999px;
  transform: translateX(-50%);
  background: linear-gradient(90deg, #fde68a 0%, #f59e0b 100%);
  box-shadow:
    0 0 10px rgba(251, 191, 36, 0.75),
    0 0 2px rgba(253, 230, 138, 0.95);
}

.sidebar-backdrop-enter-active,
.sidebar-backdrop-leave-active {
  transition: opacity 0.25s ease;
}

.sidebar-backdrop-enter-from,
.sidebar-backdrop-leave-to {
  opacity: 0;
}
</style>
