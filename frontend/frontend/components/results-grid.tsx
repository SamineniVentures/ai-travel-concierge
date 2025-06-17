import ListingCard from "./listing-card"
import type { Listing } from "@/types"

interface ResultsGridProps {
  items: Listing[]
}

export default function ResultsGrid({ items }: ResultsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
      {items.map((item) => (
        <ListingCard key={item.id} listing={item} />
      ))}
    </div>
  )
}
