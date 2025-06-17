"use client"
import { useSearchStore } from "@/store/search-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { 
  Plane, 
  Clock, 
  MapPin, 
  DollarSign, 
  Star,
  ExternalLink,
  TrendingUp,
  Calendar,
  Users
} from "lucide-react"
import { format, parseISO, isValid } from "date-fns"

export default function FlightResults() {
  const { flights, loading, error, searchMetadata, aiInsights } = useSearchStore()

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-lg">Searching for flights...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2 text-red-600">
            <Star className="h-5 w-5" />
            <span className="font-medium">Search Error</span>
          </div>
          <p className="text-red-600 mt-2">{error}</p>
        </CardContent>
      </Card>
    )
  }

  if (flights.length === 0 && !loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center py-8">
            <Plane className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No flights found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or dates.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Summary */}
      {searchMetadata && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plane className="h-5 w-5" />
              <span>Search Results</span>
              <Badge variant="secondary">{flights.length} flights found</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">From:</span>
                <p className="font-medium">{searchMetadata.origin}</p>
              </div>
              <div>
                <span className="text-muted-foreground">To:</span>
                <p className="font-medium">{searchMetadata.destination}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Date:</span>
                <p className="font-medium">
                  {searchMetadata.departure_date ? 
                    format(parseISO(searchMetadata.departure_date), 'MMM dd, yyyy') : 
                    'N/A'
                  }
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Passengers:</span>
                <p className="font-medium">{searchMetadata.passengers.adults}</p>
              </div>
            </div>
            {searchMetadata.search_duration_ms && (
              <div className="mt-2 text-xs text-muted-foreground">
                Search completed in {searchMetadata.search_duration_ms}ms
                {searchMetadata.cached && <span className="ml-2">(cached results)</span>}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* AI Insights */}
      {aiInsights && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-800">
              <TrendingUp className="h-5 w-5" />
              <span>AI Travel Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Key Insights</h4>
                <ul className="space-y-1">
                  {aiInsights.insights.map((insight, index) => (
                    <li key={index} className="text-sm text-blue-700 flex items-start">
                      <span className="mr-2">•</span>
                      {insight}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Recommendations</h4>
                <ul className="space-y-1">
                  {aiInsights.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-blue-700 flex items-start">
                      <span className="mr-2">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Price Analysis</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Quality:</span> {aiInsights.price_analysis.price_range_quality}</p>
                  <p><span className="text-muted-foreground">Assessment:</span> {aiInsights.price_analysis.value_assessment}</p>
                  <p><span className="text-muted-foreground">Trends:</span> {aiInsights.price_analysis.price_trends}</p>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 mb-2">Timing Analysis</h4>
                <div className="space-y-1 text-sm">
                  <p><span className="text-muted-foreground">Best Time:</span> {aiInsights.timing_analysis.best_booking_time}</p>
                  <p><span className="text-muted-foreground">Seasonal:</span> {aiInsights.timing_analysis.seasonal_factors}</p>
                  <p><span className="text-muted-foreground">Flexibility:</span> {aiInsights.timing_analysis.flexibility_benefits}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Flight Results */}
      <div className="space-y-4">
        {flights.map((flight) => (
          <FlightCard key={flight.id} flight={flight} />
        ))}
      </div>
    </div>
  )
}

interface FlightCardProps {
  flight: any
}

function FlightCard({ flight }: FlightCardProps) {
  const formatTime = (timeString: string) => {
    try {
      const date = parseISO(timeString)
      if (isValid(date)) {
        return format(date, 'HH:mm')
      }
      return 'N/A'
    } catch (error) {
      console.warn('Invalid time string:', timeString)
      return 'N/A'
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = parseISO(dateString)
      if (isValid(date)) {
        return format(date, 'MMM dd')
      }
      return 'N/A'
    } catch (error) {
      console.warn('Invalid date string:', dateString)
      return 'N/A'
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Flight Details */}
          <div className="flex-1 space-y-4">
            {/* Outbound Flight */}
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatTime(flight.outbound_segments[0].departure_time)}</p>
                    <p className="text-sm text-muted-foreground">{flight.outbound_segments[0].origin}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(flight.outbound_segments[0].departure_time)}</p>
                  </div>
                  
                  <div className="flex-1 mx-4">
                    <div className="flex items-center justify-center">
                      <div className="flex-1 h-px bg-gray-300"></div>
                      <Plane className="h-4 w-4 mx-2 text-blue-600 rotate-90" />
                      <div className="flex-1 h-px bg-gray-300"></div>
                    </div>
                    <p className="text-center text-sm text-muted-foreground mt-1">
                      {flight.outbound_segments[0].duration}
                    </p>
                    <p className="text-center text-xs text-muted-foreground">
                      {flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <p className="text-2xl font-bold">{formatTime(flight.outbound_segments[0].arrival_time)}</p>
                    <p className="text-sm text-muted-foreground">{flight.outbound_segments[0].destination}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(flight.outbound_segments[0].arrival_time)}</p>
                  </div>
                </div>
                
                <div className="mt-2 text-center">
                  <p className="text-sm font-medium">{flight.outbound_segments[0].carrier}</p>
                  <p className="text-xs text-muted-foreground">Flight {flight.outbound_segments[0].flight_number}</p>
                </div>
              </div>
            </div>

            {/* Return Flight (if exists) */}
            {flight.inbound_segments && flight.inbound_segments.length > 0 && (
              <>
                <Separator />
                <div className="flex items-center space-x-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-center">
                        <p className="text-2xl font-bold">{formatTime(flight.inbound_segments[0].departure_time)}</p>
                        <p className="text-sm text-muted-foreground">{flight.inbound_segments[0].origin}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(flight.inbound_segments[0].departure_time)}</p>
                      </div>
                      
                      <div className="flex-1 mx-4">
                        <div className="flex items-center justify-center">
                          <div className="flex-1 h-px bg-gray-300"></div>
                          <Plane className="h-4 w-4 mx-2 text-blue-600 -rotate-90" />
                          <div className="flex-1 h-px bg-gray-300"></div>
                        </div>
                        <p className="text-center text-sm text-muted-foreground mt-1">
                          {flight.inbound_segments[0].duration}
                        </p>
                      </div>
                      
                      <div className="text-center">
                        <p className="text-2xl font-bold">{formatTime(flight.inbound_segments[0].arrival_time)}</p>
                        <p className="text-sm text-muted-foreground">{flight.inbound_segments[0].destination}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(flight.inbound_segments[0].arrival_time)}</p>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-center">
                      <p className="text-sm font-medium">{flight.inbound_segments[0].carrier}</p>
                      <p className="text-xs text-muted-foreground">Flight {flight.inbound_segments[0].flight_number}</p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Price and Actions */}
          <div className="flex flex-col items-end space-y-4 lg:ml-6">
            <div className="text-right">
              <p className="text-3xl font-bold text-green-600">
                ${flight.price}
              </p>
              <p className="text-sm text-muted-foreground">per passenger</p>
              <Badge variant="outline" className="mt-1">
                {flight.cabin_class}
              </Badge>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Star className="h-4 w-4 mr-1" />
                Save
              </Button>
              <Button size="sm" asChild>
                <a href={flight.booking_link} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4 mr-1" />
                  Book Now
                </a>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 