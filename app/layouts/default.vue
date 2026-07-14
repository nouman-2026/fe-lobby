<script setup lang="ts">
const settings = useSettingsStore()
</script>

<template>
  <div
    class="flex h-dvh flex-col overflow-hidden bg-[#121212] text-slate-100 lg:flex-row"
  >
    <!-- Mobile top bar: menu | centered logo -->
    <header
      class="relative flex shrink-0 items-center border-b border-zinc-800/80 bg-[#1a1a1a] px-3 py-2.5 lg:hidden"
    >
      <button
        type="button"
        class="relative z-10 flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-zinc-800"
        aria-label="Open menu"
        :aria-expanded="settings.mobileSidebarOpen"
        @click="settings.openMobileSidebar()"
      >
        <Icon name="uis:list-ul" size="34" />
      </button>

      <img
        src="/logo.svg"
        alt="Logo"
        class="pointer-events-none absolute left-1/2 h-8 w-auto -translate-x-1/2"
      />
    </header>

    <LobbySidebar />

    <div
      class="relative flex min-h-0 min-w-0 flex-1 flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0"
    >
      <main class="relative min-h-0 flex-1">
        <NuxtPage />

        <Transition name="lobby-fade">
          <LobbyOverlay v-if="settings.lobbyOpen" />
        </Transition>
      </main>
    </div>

    <LobbyGameModal />
    <LobbyFloatingRunningGame />
  </div>
</template>

<style scoped>
.lobby-fade-enter-active,
.lobby-fade-leave-active {
  transition: opacity 0.2s ease;
}

.lobby-fade-enter-from,
.lobby-fade-leave-to {
  opacity: 0;
}
</style>
