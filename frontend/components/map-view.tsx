"use client"
import { useSearchStore } from "@/store/search-store"
import { MapPinIcon, Plane } from "lucide-react"

export default function MapView() {
  const { flights, searchMetadata } = useSearchStore()

  return (
    <div className="bg-muted/50 border rounded-lg h-full flex flex-col items-center justify-center p-4">
      <MapPinIcon className="w-16 h-16 text-primary mb-4" />
      <h3 className="text-lg font-semibold mb-2">Flight Map</h3>
      
      {searchMetadata ? (
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Plane className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium">
              {searchMetadata.origin} → {searchMetadata.destination}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {flights.length} flights found
          </p>
          <div className="text-xs text-muted-foreground space-y-1">
            <p>Date: {searchMetadata.departure_date}</p>
            <p>Passengers: {searchMetadata.passengers.adults}</p>
            <p>Class: {searchMetadata.cabin_class}</p>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            Search for flights to see route information
          </p>
          <p className="text-xs text-muted-foreground">
            This would show an interactive map with flight routes
          </p>
        </div>
      )}
      
      <div className="mt-4 text-xs text-muted-foreground italic text-center">
        <p>Interactive map integration would show:</p>
        <p>• Flight routes and paths</p>
        <p>• Airport locations</p>
        <p>• Real-time flight tracking</p>
      </div>
    </div>
  )
}
