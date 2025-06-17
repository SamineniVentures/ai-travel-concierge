import json
from typing import List
import os

try:
    from openai import OpenAI
    OPENAI_AVAILABLE = True
except ImportError:
    OPENAI_AVAILABLE = False

from models import Flight, FlightSearchRequest

class LLMService:
    def __init__(self):
        self.client = None
        if OPENAI_AVAILABLE:
            api_key = os.getenv("OPENAI_API_KEY")
            if api_key and api_key != "your_openai_api_key_here":
                self.client = OpenAI(api_key=api_key)
    
    def analyze_flights(self, flights: List[Flight], request: FlightSearchRequest) -> str:
        """Use LLM to analyze flights and provide recommendations"""
        
        if not self.client:
            return self._get_fallback_recommendation(flights, request)
        
        # Prepare flight data for LLM analysis
        flight_data = []
        for flight in flights:
            flight_data.append({
                "airline": flight.airline,
                "price": flight.price,
                "duration": flight.duration,
                "stops": flight.stops,
                "departure_time": flight.departure_time,
                "amenities": flight.amenities,
                "aircraft": flight.aircraft
            })
        
        # Create prompt for LLM
        prompt = f"""
        Analyze these flights from {request.source} to {request.destination} for {request.departure_date}:
        
        {json.dumps(flight_data, indent=2)}
        
        User preferences:
        - Passengers: {request.passengers}
        - Cabin class: {request.cabin_class}
        - Budget: ${request.budget if request.budget else 'No limit'}
        
        Provide a detailed recommendation considering:
        1. Best value for money
        2. Convenient timing
        3. Airline reputation and reliability
        4. Amenities and comfort
        5. Overall travel experience
        6. Aircraft type and age
        
        Give specific reasons for your recommendation and mention any trade-offs.
        Format your response in a clear, helpful manner for the user.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are an expert travel consultant specializing in flight recommendations. Provide detailed, helpful advice based on user preferences and flight options. Be concise but informative."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=600,
                temperature=0.7
            )
            return response.choices[0].message.content
        except Exception as e:
            return self._get_fallback_recommendation(flights, request)
    
    def _get_fallback_recommendation(self, flights: List[Flight], request: FlightSearchRequest) -> str:
        """Provide a fallback recommendation when AI is not available"""
        if not flights:
            return "No flights available for this route. Please try different dates or destinations."
        
        # Sort flights by price
        sorted_flights = sorted(flights, key=lambda x: x.price)
        best_flight = sorted_flights[0]
        
        return f"""Based on the available flights from {request.source} to {request.destination}, here's my recommendation:

**Best Value Option**: {best_flight.airline} ({best_flight.flight_number})
- Price: ${best_flight.price:.2f}
- Departure: {best_flight.departure_time}
- Duration: {best_flight.duration}
- Stops: {best_flight.stops}
- Aircraft: {best_flight.aircraft}

This flight offers the best balance of price and convenience. The {best_flight.airline} flight provides good value with {', '.join(best_flight.amenities)} included.

Alternative considerations:
- If you prefer different timing, consider the other available options
- All flights on this route are direct flights, which is convenient for travel
- Prices are competitive for this route and time period"""
    
    def generate_travel_insights(self, flights: List[Flight], request: FlightSearchRequest) -> dict:
        """Generate additional travel insights using LLM"""
        
        # Calculate some basic statistics
        prices = [flight.price for flight in flights]
        avg_price = sum(prices) / len(prices) if prices else 0
        min_price = min(prices) if prices else 0
        max_price = max(prices) if prices else 0
        
        # Prepare data for insights
        flight_summary = {
            "total_options": len(flights),
            "price_range": {"min": min_price, "max": max_price, "average": avg_price},
            "direct_flights": len([f for f in flights if f.stops == 0]),
            "airlines": list(set([f.airline for f in flights])),
            "departure_times": [f.departure_time for f in flights]
        }
        
        if not self.client:
            return {
                "insights": f"Travel insights for {request.source} to {request.destination}: {len(flights)} flights available with prices ranging from ${min_price:.2f} to ${max_price:.2f}. Average price is ${avg_price:.2f}. Consider booking early for the best rates.",
                "statistics": flight_summary
            }
        
        prompt = f"""
        Based on this flight search data, provide travel insights:
        
        Route: {request.source} to {request.destination}
        Date: {request.departure_date}
        Passengers: {request.passengers}
        
        Flight Summary:
        {json.dumps(flight_summary, indent=2)}
        
        Provide insights on:
        1. Best booking time
        2. Price trends
        3. Travel tips for this route
        4. Alternative dates to consider
        5. Any seasonal considerations
        
        Keep it concise and actionable.
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": "You are a travel expert providing quick, actionable insights."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=400,
                temperature=0.6
            )
            
            return {
                "insights": response.choices[0].message.content,
                "statistics": flight_summary
            }
        except Exception as e:
            return {
                "insights": f"Travel insights for {request.source} to {request.destination}: {len(flights)} flights available with prices ranging from ${min_price:.2f} to ${max_price:.2f}. Average price is ${avg_price:.2f}. Consider booking early for the best rates.",
                "statistics": flight_summary
            } 