export type GameCategory = 'slots' | 'crash'
/** Sidebar tab ids — `all` is the default tab and omits the API category param. */
export type CatalogFilter = 'all' | 'slots' | 'crash'
export type GameStatus = 'active' | 'inactive'

/** UI-facing game model mapped from API responses. */
export interface Game {
  id: string
  title: string
  slug: string
  thumbnail: string
  category: GameCategory
  provider: string
  status: GameStatus
}

export const sidebarNavItems: {
  id: CatalogFilter
  label: string
  icon: string
}[] = [
  { id: 'all', label: 'All Games', icon: 'mdi:diamond-stone' },
  { id: 'slots', label: 'Slots', icon: 'mdi:slot-machine-outline' },
  { id: 'crash', label: 'Crash', icon: 'mdi:rocket-launch-outline' },
]
