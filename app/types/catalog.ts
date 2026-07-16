/** API game object — shape derived from `app/data/catalog.json`. */
export interface ApiGame {
  name: string
  game_id: string
  background_image: string
  category: string
  order: number
}

/** Pagination metadata — shape derived from `app/data/catalog.json`. */
export interface Pagination {
  total_count: number
  total_pages: number
  page: number
  page_size: number
}

/** Games list API response — shape derived from `app/data/catalog.json`. */
export interface GamesResponse {
  games: ApiGame[]
  pagination: Pagination
}
