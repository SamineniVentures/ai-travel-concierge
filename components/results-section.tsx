"use client"

export function ResultsSection() {
  return (
    <section className="py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover trending destinations and amazing deals for your next adventure
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div
                className="h-48 bg-cover bg-center"
                style={{
                  backgroundImage: `url('/placeholder.svg?height=200&width=300')`,
                }}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Destination {item}</h3>
                <p className="text-gray-600 mb-4">
                  Explore amazing attractions and experiences in this beautiful location.
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-blue-600">${299 + item * 50}</span>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
