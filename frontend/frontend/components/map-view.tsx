"use client"
import { useSearchStore } from "@/store/search-store"
import { MapPinIcon } from "lucide-react"

export default function MapView() {
  const { selectedListingIdForMap, results } = useSearchStore()
  const selectedListing = results.find((item) => item.id === selectedListingIdForMap)

  return (
    <div className="bg-muted/50 border rounded-lg h-full flex flex-col items-center justify-center p-4">
      <MapPinIcon className="w-16 h-16 text-primary mb-4" />
      <h3 className="text-lg font-semibold mb-2">Map View</h3>
      {selectedListing ? (
        <div className="text-center">
          <p className="text-sm text-foreground">Showing location for:</p>
          <p className="font-medium text-primary">{selectedListing.name}</p>
          <p className="text-xs text-muted-foreground">{selectedListing.location?.address}</p>
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">Hover over or select a listing to see its (mock) location here.</p>
      )}
      <p className="mt-4 text-xs text-muted-foreground italic">(Actual map integration would go here)</p>
    </div>
  )
}
