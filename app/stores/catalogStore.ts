import type { ApiGame, GamesResponse, Pagination } from '~/types/catalog'
import type { CatalogFilter, Game } from '~/data/games'
import { resolveGameImageUrl } from '~/utils/gameImageUrl'

const PAGE_SIZE = 12

interface CategoryCache {
  games: Game[]
  pagination: Pagination
  loading: boolean
  loadingMore: boolean
  error: string | null
  initialized: boolean
}

function createEmptyPagination(): Pagination {
  return {
    total_count: 0,
    total_pages: 0,
    page: 0,
    page_size: PAGE_SIZE,
  }
}

function createEmptyCategoryCache(): CategoryCache {
  return {
    games: [],
    pagination: createEmptyPagination(),
    loading: false,
    loadingMore: false,
    error: null,
    initialized: false,
  }
}

function toApiCategory(filter: CatalogFilter): string | undefined {
  switch (filter) {
    case 'all':
      return undefined
    case 'slots':
      return 'slot'
    case 'crash':
      return 'crash'
    case 'new':
      return 'new'
    default:
      return filter
  }
}

function toUiCategory(apiCategory: string): Game['category'] {
  if (apiCategory === 'slot') return 'slots'
  if (apiCategory === 'crash') return 'crash'
  return 'slots'
}

function mapApiGameToGame(apiGame: ApiGame): Game {
  return {
    id: apiGame.game_id,
    title: apiGame.name,
    slug: apiGame.game_id,
    thumbnail: resolveGameImageUrl(apiGame.background_image),
    category: toUiCategory(apiGame.category),
    isNew: apiGame.order >= 80,
    provider: '',
    status: 'active',
  }
}

function sanitizePersistedCaches(
  caches: Record<string, CategoryCache>
): Record<string, CategoryCache> {
  return Object.fromEntries(
    Object.entries(caches).map(([key, cache]) => [
      key,
      {
        ...cache,
        loading: false,
        loadingMore: false,
        error: null,
        initialized: cache.initialized || cache.games.length > 0,
      },
    ])
  )
}

export const useCatalogStore = defineStore(
  'catalog',
  () => {
    const gamesByCategory = ref<Record<string, CategoryCache>>({})
    const inflightFetches = new Map<CatalogFilter, Promise<void>>()

    function patchCategoryCache(
      filter: CatalogFilter,
      patch: Partial<CategoryCache>
    ) {
      const current = getCategoryCache(filter)
      gamesByCategory.value[filter] = { ...current, ...patch }
    }

    function getCategoryCache(filter: CatalogFilter): CategoryCache {
      if (!gamesByCategory.value[filter]) {
        gamesByCategory.value[filter] = createEmptyCategoryCache()
      }

      return gamesByCategory.value[filter]
    }

    const gamesById = computed(() => {
      const map = new Map<string, Game>()

      for (const cache of Object.values(gamesByCategory.value)) {
        for (const game of cache.games) {
          map.set(game.id, game)
        }
      }

      return map
    })

    function getGamesForCategory(filter: CatalogFilter) {
      return getCategoryCache(filter).games
    }

    function getPaginationForCategory(filter: CatalogFilter) {
      return getCategoryCache(filter).pagination
    }

    function isLoading(filter: CatalogFilter) {
      return getCategoryCache(filter).loading
    }

    function isLoadingMore(filter: CatalogFilter) {
      return getCategoryCache(filter).loadingMore
    }

    function getError(filter: CatalogFilter) {
      return getCategoryCache(filter).error
    }

    function hasMoreGames(filter: CatalogFilter) {
      const cache = getCategoryCache(filter)
      return cache.games.length < cache.pagination.total_count
    }

    function getGameById(id: string) {
      return gamesById.value.get(id)
    }

    async function fetchGames(filter: CatalogFilter, page: number) {
      if (import.meta.server) return

      const isLoadMore = page > 1

      patchCategoryCache(filter, {
        loading: !isLoadMore,
        loadingMore: isLoadMore,
        error: null,
      })

      try {
        const api = useApi()
        const apiCategory = toApiCategory(filter)
        const response = await api.get<GamesResponse>('/games', {
          page,
          page_size: PAGE_SIZE,
          ...(apiCategory ? { category: apiCategory } : {}),
        })

        const mappedGames = response.games.map(mapApiGameToGame)
        const latest = getCategoryCache(filter)

        patchCategoryCache(filter, {
          games: isLoadMore ? [...latest.games, ...mappedGames] : mappedGames,
          pagination: response.pagination,
          initialized: true,
          loading: false,
          loadingMore: false,
        })
      } catch (error: unknown) {
        patchCategoryCache(filter, {
          error:
            error instanceof Error ? error.message : 'Failed to load games',
          loading: false,
          loadingMore: false,
        })
      }
    }

    async function ensureCategory(filter: CatalogFilter) {
      if (import.meta.server) return

      const cache = getCategoryCache(filter)
      if (cache.initialized) return

      const inflight = inflightFetches.get(filter)
      if (inflight) {
        await inflight
        return
      }

      const request = fetchGames(filter, 1).finally(() => {
        inflightFetches.delete(filter)
      })

      inflightFetches.set(filter, request)
      await request
    }

    async function loadMore(filter: CatalogFilter) {
      const cache = getCategoryCache(filter)

      if (cache.loading || cache.loadingMore || !hasMoreGames(filter)) return

      const nextPage = cache.pagination.page + 1
      if (nextPage > cache.pagination.total_pages) return

      await fetchGames(filter, nextPage)
    }

    return {
      gamesByCategory,
      gamesById,
      getGamesForCategory,
      getPaginationForCategory,
      isLoading,
      isLoadingMore,
      getError,
      hasMoreGames,
      getGameById,
      fetchGames,
      ensureCategory,
      loadMore,
    }
  },
  {
    persist: {
      pick: ['gamesByCategory'],
      afterHydrate(ctx) {
        const store = ctx.store as unknown as {
          gamesByCategory: Record<string, CategoryCache>
        }

        if (!store.gamesByCategory) return

        store.gamesByCategory = sanitizePersistedCaches(store.gamesByCategory)
      },
    },
  }
)
