<script setup lang="ts">
const settings = useSettingsStore()
</script>

<template>
  <div
    class="flex h-dvh flex-col overflow-hidden bg-[#121212] text-slate-100 lg:flex-row"
  >
    <!-- Mobile top bar with logo -->
    <header
      class="flex shrink-0 items-center justify-between gap-3 border-b border-zinc-800/80 bg-[#1a1a1a] px-4 py-3 lg:hidden"
    >
      <img src="/logo.svg" alt="Logo" class="h-6 w-auto shrink-0" />
      <LobbyUserProfile compact />
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
