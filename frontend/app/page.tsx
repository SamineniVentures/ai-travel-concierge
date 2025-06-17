import HeroSearchForm from "@/components/hero-search-form"
import FlightResults from "@/components/flight-results"
import MapView from "@/components/map-view"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section
        className="relative py-20 md:py-32 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?q=80&w=2070&auto=format&fit=crop')",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              AI-Powered Travel Concierge
            </h1>
            <p className="text-lg md:text-xl text-gray-200 mb-8">
              Discover amazing flights with intelligent insights and personalized recommendations.
            </p>
          </div>
          <HeroSearchForm />
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-3/5 xl:w-2/3">
            <FlightResults />
          </div>
          <aside className="lg:w-2/5 xl:w-1/3 lg:sticky lg:top-24 h-[calc(100vh-10rem)]">
            <MapView />
          </aside>
        </div>
      </div>
      
      <footer className="py-8 bg-muted text-muted-foreground text-center mt-16">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} AI Travel Concierge. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
