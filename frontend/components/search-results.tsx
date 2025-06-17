import ListingCard, { type Listing } from "@/components/listing-card"

interface SearchResultsProps {
  listings: Listing[]
}

export default function SearchResults({ listings }: SearchResultsProps) {
  if (!listings || listings.length === 0) {
    return (
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">No Results Found</h2>
          <p className="text-muted-foreground">Try adjusting your search criteria.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 md:py-20 bg-muted/40 dark:bg-muted/20">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-center md:text-left">Popular Destinations</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </section>
  )
}
