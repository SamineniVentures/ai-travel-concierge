import { create } from "zustand"
import type { Listing, ListingType, SearchParams } from "@/types"
import { allDummyData } from "@/lib/dummy-data"

interface SearchState {
  searchParams: SearchParams | null
  results: Listing[]
  activeTab: ListingType
  selectedListingIdForMap: string | null
  setSearchParams: (params: SearchParams) => void
  fetchResults: (params: SearchParams) => void
  setActiveTab: (tab: ListingType) => void
  setSelectedListingIdForMap: (id: string | null) => void
}

export const useSearchStore = create<SearchState>((set) => ({
  searchParams: null,
  results: allDummyData,
  activeTab: "flight",
  selectedListingIdForMap: null,
  setSearchParams: (params) => set({ searchParams: params }),
  fetchResults: (params) => {
    let filtered = allDummyData
    if (params.origin && params.origin.trim() !== "") {
      const originTerm = params.origin.toLowerCase()
      filtered = filtered.filter((item) => {
        if (item.type === "flight" && item.location?.from) {
          return item.location.from.toLowerCase().includes(originTerm)
        }
        return item.type !== "flight"
      })
    }
    if (params.destination) {
      const searchTerm = params.destination.toLowerCase()
      const listToFilterByDestination = params.origin && params.origin.trim() !== "" ? filtered : allDummyData
      filtered = listToFilterByDestination.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm) ||
          (item.location?.address && item.location.address.toLowerCase().includes(searchTerm)) ||
          (item.type === "flight" && item.location?.to && item.location.to.toLowerCase().includes(searchTerm)),
      )
    }
    set({ results: filtered, searchParams: params })
  },
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedListingIdForMap: (id) => set({ selectedListingIdForMap: id }),
}))
