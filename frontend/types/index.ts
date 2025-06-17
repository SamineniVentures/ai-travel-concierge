export type ListingType = "flight" | "hotel" | "experience"

export interface LocationInfo {
  address?: string
  lat?: number
  lng?: number
  from?: string // For flights
  to?: string // For flights
}

export interface Listing {
  id: string
  type: ListingType
  name: string
  price: number
  rating: number
  reviews: number
  imageUrl?: string
  freeCancellation?: boolean
  location?: LocationInfo
  // Flight specific
  airline?: string
  departureTime?: string // ISO date string
  arrivalTime?: string // ISO date string
  // Generic date for sorting/grouping in itinerary
  date?: string // ISO date string
}

export interface SearchParams {
  origin?: string // Ensure origin is here and optional
  destination: string
  departureDate?: string // yyyy-MM-dd
  returnDate?: string // yyyy-MM-dd
  travellers: string // Number of travellers as string
}
