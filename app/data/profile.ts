import profileData from './profile.json'

export interface UserProfile {
  id: string
  username: string
  balance: number
  currency: string
  is_active: boolean
  created_at: string
}

export const userProfile: UserProfile = profileData.data

export function getAvatarInitials(username: string) {
  const normalized = username.trim()
  if (!normalized) return '?'

  return normalized.slice(0, 2).toUpperCase()
}
