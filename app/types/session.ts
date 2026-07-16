export interface PlayerSession {
  operator: string
  balance: number
  currency: string
  active_game: string | null
}

export type PlayerResponse = PlayerSession

export interface LaunchRequest {
  session_id: string
  game_id: string
}

export interface LaunchResponse {
  url: string
  session_id: string
}
