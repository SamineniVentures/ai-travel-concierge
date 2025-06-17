import { Navbar } from "@/components/layout/navbar"
import { HeroSearchForm } from "@/components/hero-search-form"
import { ResultsSection } from "@/components/results-section"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/placeholder.svg?height=600&width=1200&text=Travel+Background')",
          }}
        />
        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 w-full max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">Find Your Perfect Trip</h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Discover amazing destinations, book flights, hotels, and experiences all in one place
            </p>
          </div>

          <HeroSearchForm />
        </div>
      </section>

      {/* Results Section */}
      <ResultsSection />
    </main>
  )
}
