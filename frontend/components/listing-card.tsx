"use client"
import Image from "next/image"
import { StarIcon, PlusCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useItineraryStore } from "@/store/itinerary-store"
import { useSearchStore } from "@/store/search-store"
import type { Listing } from "@/types"
import { cn } from "@/lib/utils"

interface ListingCardProps {
  listing: Listing
}

export default function ListingCard({ listing }: ListingCardProps) {
  const { addItem, toggleDrawer } = useItineraryStore()
  const { setSelectedListingIdForMap } = useSearchStore()

  const handleAddToItinerary = () => {
    addItem(listing)
    toggleDrawer(true) // Open drawer when item is added
  }

  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <StarIcon
          key={i}
          className={cn(
            "w-4 h-4",
            i <= Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300 dark:text-gray-600",
          )}
        />,
      )
    }
    return stars
  }

  return (
    <div
      className="bg-card border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-full cursor-pointer"
      onMouseEnter={() => setSelectedListingIdForMap(listing.id)}
      onMouseLeave={() => setSelectedListingIdForMap(null)}
      onClick={() => setSelectedListingIdForMap(listing.id)} // Also select on click for touch devices
    >
      <div className="relative w-full aspect-[16/9]">
        <Image
          src={listing.imageUrl || "https://via.placeholder.com/400x225.png?text=No+Image"}
          alt={listing.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover"
        />
        {listing.freeCancellation && (
          <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Free cancellation
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold mb-1 truncate" title={listing.name}>
          {listing.name}
        </h3>
        <p className="text-sm text-muted-foreground mb-2 truncate">
          {listing.location?.address || "Location not specified"}
        </p>
        <div className="flex items-center mb-2">
          {renderStars(listing.rating)}
          <span className="text-xs text-muted-foreground ml-1.5">({listing.reviews} reviews)</span>
        </div>
        <div className="mt-auto flex justify-between items-center pt-2">
          <p className="text-xl font-bold text-primary">
            ${listing.price.toFixed(2)}
            {listing.type === "hotel" && <span className="text-xs font-normal text-muted-foreground">/night</span>}
          </p>
          <Button variant="outline" size="sm" onClick={handleAddToItinerary} className="flex items-center gap-1.5">
            <PlusCircleIcon className="w-4 h-4" />
            Add
          </Button>
        </div>
      </div>
    </div>
  )
}
