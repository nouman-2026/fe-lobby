import type { Game, SidebarCategory } from '~/data/games'
import { games as catalogGames } from '~/data/games'

export const useCatalogStore = defineStore('catalog', () => {
  const games = shallowRef<Game[]>(catalogGames)

  /** O(1) id lookup — avoids repeated Array.find across modal/card/floating UI. */
  const gamesById = computed(() => {
    const map = new Map<string, Game>()
    for (const game of games.value) {
      map.set(game.id, game)
    }
    return map
  })

  function getGameById(id: string) {
    return gamesById.value.get(id)
  }

  function gamesByCategory(category: SidebarCategory) {
    switch (category) {
      case 'new':
        return games.value.filter((game) => game.isNew)
      case 'slots':
        return games.value.filter((game) => game.category === 'slots')
      case 'crash':
        return games.value.filter((game) => game.category === 'crash')
      default:
        return games.value
    }
  }

  /** Replace catalog (e.g. future API fetch). Keeps one in-memory source of truth. */
  function setGames(next: Game[]) {
    games.value = next.filter((game) => game.status === 'active')
  }

  return {
    games,
    gamesById,
    getGameById,
    gamesByCategory,
    setGames,
  }
})
