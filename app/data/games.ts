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
}

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

export function filterGamesByCategory(category: SidebarCategory) {
  switch (category) {
    case 'new':
      return games.filter((game) => game.isNew)
    case 'slots':
      return games.filter((game) => game.category === 'slots')
    case 'crash':
      return games.filter((game) => game.category === 'crash')
    default:
      return games
  }
}

export function getGameById(id: string) {
  return games.find((game) => game.id === id)
}
