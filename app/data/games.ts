export type GameCategory = 'slots' | 'crash'
/** Sidebar tab ids — `all` is the default tab and omits the API category param. */
export type CatalogFilter = 'all' | 'new' | 'slots' | 'crash'
export type GameStatus = 'active' | 'inactive'

/** UI-facing game model mapped from API responses. */
export interface Game {
  id: string
  title: string
  slug: string
  thumbnail: string
  category: GameCategory
  isNew: boolean
  provider: string
  status: GameStatus
  /** Optional hardcoded iframe URL for local testing */
  launchUrl?: string
}

export const sidebarNavItems: {
  id: CatalogFilter
  label: string
  icon: string
}[] = [
  { id: 'all', label: 'All Games', icon: 'mdi:diamond-stone' },
  { id: 'new', label: 'New', icon: 'mdi:star-four-points' },
  { id: 'slots', label: 'Slots', icon: 'mdi:slot-machine-outline' },
  { id: 'crash', label: 'Crash', icon: 'mdi:rocket-launch-outline' },
]
