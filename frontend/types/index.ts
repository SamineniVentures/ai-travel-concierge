export type ListingType = "flight" | "hotel" | "experience"

export interface LocationInfo {
  address?: string
  lat?: number
  lng?: number
  from?: string
  to?: string
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
  airline?: string
  departureTime?: string
  arrivalTime?: string
  date?: string
}

export interface SearchParams {
  origin?: string
  destination: string
  departureDate?: string
  returnDate?: string
  travellers: string
}
