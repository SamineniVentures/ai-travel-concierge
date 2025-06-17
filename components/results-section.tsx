"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, MapPin } from "lucide-react"

export function ResultsSection() {
  const popularDestinations = [
    {
      id: 1,
      name: "Paris, France",
      image: "/placeholder.svg?height=200&width=300&text=Paris",
      price: "$599",
      rating: 4.8,
      reviews: 1234,
      description: "City of Light and romance",
    },
    {
      id: 2,
      name: "Tokyo, Japan",
      image: "/placeholder.svg?height=200&width=300&text=Tokyo",
      price: "$899",
      rating: 4.9,
      reviews: 987,
      description: "Modern metropolis meets tradition",
    },
    {
      id: 3,
      name: "Bali, Indonesia",
      image: "/placeholder.svg?height=200&width=300&text=Bali",
      price: "$449",
      rating: 4.7,
      reviews: 756,
      description: "Tropical paradise and culture",
    },
  ]

  const featuredHotels = [
    {
      id: 1,
      name: "Grand Plaza Hotel",
      location: "New York, NY",
      image: "/placeholder.svg?height=200&width=300&text=Hotel",
      price: "$299",
      rating: 4.6,
      amenities: ["Wifi", "Pool", "Gym", "Parking"],
    },
    {
      id: 2,
      name: "Seaside Resort",
      location: "Miami, FL",
      image: "/placeholder.svg?height=200&width=300&text=Resort",
      price: "$199",
      rating: 4.4,
      amenities: ["Beach", "Spa", "Restaurant", "Bar"],
    },
  ]

  return (
    <div className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Popular Destinations */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popular Destinations</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the world's most amazing places with our curated selection of top destinations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {popularDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    className="w-full h-48 object-cover"
                  />
                  <Badge className="absolute top-4 left-4 bg-blue-600">From {destination.price}</Badge>
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{destination.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{destination.rating}</span>
                      <span className="text-sm text-gray-500">({destination.reviews})</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{destination.description}</p>
                  <Button className="w-full">Explore Deals</Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Featured Hotels */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Hotels</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Stay at the best hotels with amazing amenities and unbeatable prices
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {featuredHotels.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/2">
                    <img
                      src={hotel.image || "/placeholder.svg"}
                      alt={hotel.name}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  <div className="md:w-1/2 p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">{hotel.name}</h3>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{hotel.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-gray-600 mb-4">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm">{hotel.location}</span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {hotel.amenities.map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-blue-600">{hotel.price}</span>
                        <span className="text-gray-500 text-sm">/night</span>
                      </div>
                      <Button>Book Now</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
