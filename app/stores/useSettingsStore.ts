export type LayoutMode = "grid" | "list";
export type GameCategory = "all" | "new" | "slots" | "crash";

export const useSettingsStore = defineStore(
  "settings",
  () => {
    const layoutMode = ref<LayoutMode>("grid");
    const lobbyOpen = ref(true);
    const activeCategory = ref<GameCategory>("all");
    const activeGameId = ref<string | null>(null);

    function setLayoutMode(mode: LayoutMode) {
      layoutMode.value = mode;
    }

    function setActiveCategory(category: GameCategory) {
      activeCategory.value = category;
      lobbyOpen.value = true;
    }

    function openLobby() {
      lobbyOpen.value = true;
    }

    function closeLobby() {
      lobbyOpen.value = false;
    }

    function toggleLobby() {
      lobbyOpen.value = !lobbyOpen.value;
    }

    function openGame(gameId: string) {
      activeGameId.value = gameId;
    }

    function closeGame() {
      activeGameId.value = null;
    }

    return {
      layoutMode,
      lobbyOpen,
      activeCategory,
      activeGameId,
      setLayoutMode,
      setActiveCategory,
      openLobby,
      closeLobby,
      toggleLobby,
      openGame,
      closeGame,
    };
  },
  {
    persist: {
      pick: ["layoutMode"],
    },
  },
);
