import catalog from './catalog.json'

export type GameCategory = 'slots' | 'crash'
export type SidebarCategory = 'all' | 'new' | 'slots' | 'crash'
export type GameStatus = 'active' | 'inactive'

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

/** Static seed data — runtime access goes through `useCatalogStore`. */
export const games: Game[] = catalog.games.filter(
  (game) => game.status === 'active'
) as Game[]

export const sidebarNavItems: {
  id: SidebarCategory
  label: string
  icon: string
}[] = [
  { id: 'all', label: 'All Games', icon: 'mdi:diamond-stone' },
  { id: 'new', label: 'New', icon: 'mdi:star-four-points' },
  { id: 'slots', label: 'Slots', icon: 'mdi:slot-machine-outline' },
  { id: 'crash', label: 'Crash', icon: 'mdi:rocket-launch-outline' },
]
