import { create } from "zustand"
import type { Listing } from "@/types"

interface ItineraryState {
  items: Listing[]
  isDrawerOpen: boolean
  addItem: (item: Listing) => void
  removeItem: (itemId: string) => void
  toggleDrawer: (open?: boolean) => void
}

export const useItineraryStore = create<ItineraryState>((set) => ({
  items: [],
  isDrawerOpen: false,
  addItem: (item) =>
    set((state) => {
      if (state.items.find((i) => i.id === item.id)) {
        return state
      }
      return { items: [...state.items, item] }
    }),
  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId),
    })),
  toggleDrawer: (open) => set((state) => ({ isDrawerOpen: open === undefined ? !state.isDrawerOpen : open })),
}))
