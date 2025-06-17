"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Calendar, Users } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import usCities from "@/lib/us-cities.json"

interface SearchData {
  type: string
  origin: string
  destination: string
  departureDate: string
  returnDate?: string
  passengers: string
}

export function HeroSearchForm() {
  const [activeTab, setActiveTab] = useState("flights")
  const [origin, setOrigin] = useState("")
  const [destination, setDestination] = useState("")
  const [departureDate, setDepartureDate] = useState("")
  const [returnDate, setReturnDate] = useState("")
  const [passengers, setPassengers] = useState("1")
  const [isSearching, setIsSearching] = useState(false)

  const [originSuggestions, setOriginSuggestions] = useState<typeof usCities>([])
  const [destinationSuggestions, setDestinationSuggestions] = useState<typeof usCities>([])
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false)
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false)

  const handleOriginChange = (value: string) => {
    setOrigin(value)
    if (value.length > 0) {
      const filtered = usCities
        .filter(
          (city) =>
            city.name.toLowerCase().includes(value.toLowerCase()) ||
            city.state.toLowerCase().includes(value.toLowerCase()),
        )
        .slice(0, 5)
      setOriginSuggestions(filtered)
      setShowOriginSuggestions(true)
    } else {
      setShowOriginSuggestions(false)
    }
  }

  const handleDestinationChange = (value: string) => {
    setDestination(value)
    if (value.length > 0) {
      const filtered = usCities
        .filter(
          (city) =>
            city.name.toLowerCase().includes(value.toLowerCase()) ||
            city.state.toLowerCase().includes(value.toLowerCase()),
        )
        .slice(0, 5)
      setDestinationSuggestions(filtered)
      setShowDestinationSuggestions(true)
    } else {
      setShowDestinationSuggestions(false)
    }
  }

  const selectOrigin = (city: (typeof usCities)[0]) => {
    setOrigin(`${city.name}, ${city.state}`)
    setShowOriginSuggestions(false)
  }

  const selectDestination = (city: (typeof usCities)[0]) => {
    setDestination(`${city.name}, ${city.state}`)
    setShowDestinationSuggestions(false)
  }

  const validateForm = (): boolean => {
    if (!origin.trim()) {
      toast({
        title: "Origin Required",
        description: "Please select an origin city",
        variant: "destructive",
      })
      return false
    }

    if (!destination.trim()) {
      toast({
        title: "Destination Required",
        description: "Please select a destination city",
        variant: "destructive",
      })
      return false
    }

    if (!departureDate) {
      toast({
        title: "Departure Date Required",
        description: "Please select a departure date",
        variant: "destructive",
      })
      return false
    }

    if (activeTab === "flights" && !returnDate) {
      toast({
        title: "Return Date Required",
        description: "Please select a return date for flights",
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSearch = async () => {
    if (!validateForm()) return

    setIsSearching(true)

    const searchData: SearchData = {
      type: activeTab,
      origin,
      destination,
      departureDate,
      returnDate: activeTab === "flights" ? returnDate : undefined,
      passengers,
    }

    try {
      // Simulate API call
      console.log("Search Data:", searchData)

      // Mock API delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Show success message
      toast({
        title: "Search Complete!",
        description: `Found results for ${activeTab} from ${origin} to ${destination}`,
      })

      // Here you would typically:
      // 1. Call your API with searchData
      // 2. Navigate to results page
      // 3. Update global state with results

      // For now, we'll just log the data and show a success message
      alert(
        `Search submitted!\n\nType: ${searchData.type}\nFrom: ${searchData.origin}\nTo: ${searchData.destination}\nDeparture: ${searchData.departureDate}\nReturn: ${searchData.returnDate || "N/A"}\nPassengers: ${searchData.passengers}`,
      )
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSearching(false)
    }
  }

  const tabs = [
    { id: "flights", label: "Flights", icon: "✈️" },
    { id: "hotels", label: "Hotels", icon: "🏨" },
    { id: "experiences", label: "Experiences", icon: "🎯" },
  ]

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors ${
              activeTab === tab.id ? "bg-white text-blue-600 shadow-sm" : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <span>{tab.icon}</span>
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Search Form */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Origin */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
          <Popover open={showOriginSuggestions} onOpenChange={setShowOriginSuggestions}>
            <PopoverTrigger asChild>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Origin city"
                  value={origin}
                  onChange={(e) => handleOriginChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="max-h-60 overflow-auto">
                {originSuggestions.map((city, index) => (
                  <button
                    key={index}
                    onClick={() => selectOrigin(city)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>
                      {city.name}, {city.state}
                    </span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Destination */}
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
          <Popover open={showDestinationSuggestions} onOpenChange={setShowDestinationSuggestions}>
            <PopoverTrigger asChild>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Destination city"
                  value={destination}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="max-h-60 overflow-auto">
                {destinationSuggestions.map((city, index) => (
                  <button
                    key={index}
                    onClick={() => selectDestination(city)}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>
                      {city.name}, {city.state}
                    </span>
                  </button>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* Departure Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Departure</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="date"
              className="pl-10"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>

        {/* Return Date (only for flights) */}
        {activeTab === "flights" && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Return</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="date"
                className="pl-10"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                min={departureDate || new Date().toISOString().split("T")[0]}
              />
            </div>
          </div>
        )}

        {/* Passengers (only for flights and hotels) */}
        {(activeTab === "flights" || activeTab === "hotels") && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {activeTab === "flights" ? "Passengers" : "Guests"}
            </label>
            <Select value={passengers} onValueChange={setPassengers}>
              <SelectTrigger>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 {activeTab === "flights" ? "Passenger" : "Guest"}</SelectItem>
                <SelectItem value="2">2 {activeTab === "flights" ? "Passengers" : "Guests"}</SelectItem>
                <SelectItem value="3">3 {activeTab === "flights" ? "Passengers" : "Guests"}</SelectItem>
                <SelectItem value="4">4+ {activeTab === "flights" ? "Passengers" : "Guests"}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Search Button */}
      <div className="mt-6">
        <Button onClick={handleSearch} disabled={isSearching} className="w-full md:w-auto px-8 py-3 text-lg">
          <Search className="mr-2 h-5 w-5" />
          {isSearching ? "Searching..." : `Search ${activeTab}`}
        </Button>
      </div>
    </div>
  )
}
