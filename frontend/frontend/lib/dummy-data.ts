import type { Listing } from "@/types" // @/ resolves to frontend/

export const dummyFlights: Listing[] = [
  {
    id: "flight-001",
    type: "flight",
    name: "New York to London",
    airline: "British Airways",
    departureTime: "2024-09-15T18:00:00Z",
    arrivalTime: "2024-09-16T06:00:00Z",
    price: 550.0,
    rating: 4.5,
    reviews: 120,
    imageUrl: "https://images.unsplash.com/photo-1569154941061-e231b4725914?q=80&w=400&auto=format&fit=crop",
    freeCancellation: true,
    location: { from: "JFK", to: "LHR", address: "JFK Airport, New York" },
    date: "2024-09-15",
  },
  {
    id: "flight-002",
    type: "flight",
    name: "Paris to Rome",
    airline: "Air France",
    departureTime: "2024-10-10T10:00:00Z",
    arrivalTime: "2024-10-10T12:00:00Z",
    price: 180.0,
    rating: 4.2,
    reviews: 85,
    imageUrl: "https://images.unsplash.com/photo-1530521954074-e64f6810b32d?q=80&w=400&auto=format&fit=crop",
    freeCancellation: false,
    location: { from: "CDG", to: "FCO", address: "CDG Airport, Paris" },
    date: "2024-10-10",
  },
]

export const dummyHotels: Listing[] = [
  {
    id: "hotel-001",
    type: "hotel",
    name: "The Plaza Hotel",
    price: 750.0,
    rating: 4.8,
    reviews: 350,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=400&auto=format&fit=crop",
    freeCancellation: true,
    location: { address: "768 5th Ave, New York, NY 10019", lat: 40.7644, lng: -73.9747 },
    date: "2024-09-20",
  },
  {
    id: "hotel-002",
    type: "hotel",
    name: "Hotel de Crillon",
    price: 1200.0,
    rating: 4.9,
    reviews: 280,
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=400&auto=format&fit=crop",
    freeCancellation: true,
    location: { address: "10 Place de la Concorde, 75008 Paris, France", lat: 48.8659, lng: 2.3213 },
    date: "2024-10-15",
  },
]

export const dummyExperiences: Listing[] = [
  {
    id: "exp-001",
    type: "experience",
    name: "Eiffel Tower Summit Access",
    price: 75.0,
    rating: 4.7,
    reviews: 500,
    imageUrl: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?q=80&w=400&auto=format&fit=crop",
    freeCancellation: true,
    location: { address: "Champ de Mars, 5 Av. Anatole France, 75007 Paris", lat: 48.8584, lng: 2.2945 },
    date: "2024-10-16",
  },
  {
    id: "exp-002",
    type: "experience",
    name: "Statue of Liberty & Ellis Island Tour",
    price: 50.0,
    rating: 4.6,
    reviews: 420,
    imageUrl: "https://images.unsplash.com/photo-1590900504900-276530604903?q=80&w=400&auto=format&fit=crop",
    freeCancellation: false,
    location: { address: "Liberty Island, New York, NY 10004", lat: 40.6892, lng: -74.0445 },
    date: "2024-09-22",
  },
]

export const allDummyData = [...dummyFlights, ...dummyHotels, ...dummyExperiences]
