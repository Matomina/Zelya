export interface ApiTag {
  id: string
  name: string
}

export interface ApiMedia {
  id: string
  storageKey: string
  type: 'PHOTO' | 'VIDEO'
  visibility: 'PUBLIC' | 'SUBSCRIBERS' | 'PRIVATE'
}

export interface ApiReview {
  id: string
  rating: number
  comment: string | null
  createdAt: string
  author?: { pseudo: string }
}

export interface ApiProfile {
  id: string
  alias: string
  bio: string | null
  gender: 'FEMALE' | 'MALE' | 'COUPLE' | 'TRANS' | 'OTHER'
  age: number
  city: string
  department: string
  region: string
  isOnline: boolean
  lastSeenAt: string
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'BANNED'
  isVerified: boolean
  isPremium: boolean
  avatarKey: string | null
  tags: ApiTag[]
  rating: number
  reviewCount: number
  createdAt: string
  reviews?: ApiReview[]
  media?: ApiMedia[]
}

export interface ApiUser {
  id: string
  email: string
  pseudo: string
  role: 'USER' | 'CREATOR' | 'MODERATOR' | 'ADMIN'
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface PaginatedProfiles {
  profiles: ApiProfile[]
  total: number
  page: number
  limit: number
  pages: number
}

export interface SearchResult {
  profiles: ApiProfile[]
  total: number
  page: number
  limit: number
  query: string
}
