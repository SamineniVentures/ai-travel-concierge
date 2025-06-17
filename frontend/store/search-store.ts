import { create } from "zustand"
import type { Listing, ListingType, SearchParams } from "@/types"
import { allDummyData } from "@/lib/dummy-data" // Assuming combined data for easier filtering

interface SearchState {
  searchParams: SearchParams | null
  results: Listing[]
  activeTab: ListingType
  selectedListingIdForMap: string | null
  setSearchParams: (params: SearchParams) => void
  fetchResults: (params: SearchParams) => void // Will simulate filtering
  setActiveTab: (tab: ListingType) => void
  setSelectedListingIdForMap: (id: string | null) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  searchParams: null,
  results: allDummyData, // Initially show all, or could be empty
  activeTab: "flight", // Default tab
  selectedListingIdForMap: null,
  setSearchParams: (params) => set({ searchParams: params }),
  fetchResults: (params) => {
    // Simulate filtering based on params.
    // This is a very basic filter. A real app would have more complex logic.
    let filtered = allDummyData

    // Filter by Origin (primarily for flights)
    if (params.origin && params.origin.trim() !== "") {
      const originTerm = params.origin.toLowerCase()
      filtered = filtered.filter((item) => {
        if (item.type === "flight" && item.location?.from) {
          return item.location.from.toLowerCase().includes(originTerm)
        }
        // For other types, origin might not be directly applicable in this simple model
        // or you might want to include them if origin matches general location.
        // For now, we only strictly filter flights by origin.
        return item.type !== "flight" // Keep non-flight items if origin is specified
        // or adjust this logic if origin should filter them too.
      })
    }

    // Filter by Destination
    if (params.destination) {
      const searchTerm = params.destination.toLowerCase()
      // If origin was specified, filter the already origin-filtered list.
      // Otherwise, filter the full list.
      const listToFilterByDestination = params.origin && params.origin.trim() !== "" ? filtered : allDummyData

      filtered = listToFilterByDestination.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          (item.location?.address && item.location.address.toLowerCase().includes(searchTerm)) ||
          (item.type === "flight" && item.location?.to && item.location.to.toLowerCase().includes(searchTerm)),
      )
    }
    // Add date filtering if params.departureDate / params.returnDate exist
    // Add travellers filtering if params.travellers exists
    set({ results: filtered, searchParams: params })
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedListingIdForMap: (id) => set({ selectedListingIdForMap: id }),
}))
