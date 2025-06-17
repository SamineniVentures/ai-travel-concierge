from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
import random
from datetime import datetime

from models import FlightSearchRequest, Flight, FlightRecommendation, Airport
from data import get_flights_for_route, get_all_airports, search_airports
from llm_service import LLMService

app = FastAPI(title="AI Travel Concierge", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize LLM service
llm_service = LLMService()

@app.get("/")
async def root():
    return {"message": "AI Travel Concierge API", "version": "1.0.0"}

@app.post("/api/search-flights", response_model=FlightRecommendation)
async def search_flights(request: FlightSearchRequest):
    """Search for flights and get AI-powered recommendations"""
    
    # Create route key
    route = f"{request.source.upper()}-{request.destination.upper()}"
    
    # Get available flights
    available_flights = get_flights_for_route(route)
    
    if not available_flights:
        # Generate some random flights if none exist for the route
        available_flights = generate_random_flights(request)
    
    # Sort flights by price
    sorted_flights = sorted(available_flights, key=lambda x: x.price)
    
    # Get AI recommendation
    recommendation_reason = llm_service.analyze_flights(available_flights, request)
    
    # Calculate total price
    total_price = sum(flight.price for flight in sorted_flights[:request.passengers])
    
    # Get best deal (lowest price)
    best_deal = sorted_flights[0] if sorted_flights else None
    
    # Get alternative options (next 2 cheapest)
    alternative_options = sorted_flights[1:3] if len(sorted_flights) > 1 else []
    
    return FlightRecommendation(
        flights=sorted_flights,
        recommendation_reason=recommendation_reason,
        total_price=total_price,
        best_deal=best_deal,
        alternative_options=alternative_options
    )

@app.get("/api/airports")
async def get_airports():
    """Get list of available airports"""
    airports = get_all_airports()
    return {"airports": [airport.dict() for airport in airports]}

@app.get("/api/airports/search")
async def search_airports_endpoint(query: str):
    """Search airports by query"""
    airports = search_airports(query)
    return {"airports": [airport.dict() for airport in airports]}

@app.get("/api/flight-insights")
async def get_flight_insights(source: str, destination: str, date: str, passengers: int = 1):
    """Get AI-powered travel insights"""
    route = f"{source.upper()}-{destination.upper()}"
    flights = get_flights_for_route(route)
    
    if not flights:
        flights = generate_random_flights(FlightSearchRequest(
            source=source,
            destination=destination,
            departure_date=date,
            passengers=passengers
        ))
    
    insights = llm_service.generate_travel_insights(
        flights, 
        FlightSearchRequest(
            source=source,
            destination=destination,
            departure_date=date,
            passengers=passengers
        )
    )
    
    return insights

@app.get("/api/popular-routes")
async def get_popular_routes():
    """Get popular travel routes"""
    return {
        "popular_routes": [
            {"source": "NYC", "destination": "LON", "name": "New York to London"},
            {"source": "NYC", "destination": "PAR", "name": "New York to Paris"},
            {"source": "NYC", "destination": "LAX", "name": "New York to Los Angeles"},
            {"source": "LON", "destination": "PAR", "name": "London to Paris"},
            {"source": "LAX", "destination": "SFO", "name": "Los Angeles to San Francisco"},
        ]
    }

def generate_random_flights(request: FlightSearchRequest) -> List[Flight]:
    """Generate random flights for demonstration"""
    airlines = ["United Airlines", "American Airlines", "Delta Airlines", "Southwest Airlines", "JetBlue"]
    aircraft = ["Boeing 737", "Boeing 777", "Airbus A320", "Airbus A350", "Boeing 787"]
    amenities = ["WiFi", "Entertainment", "Meal", "USB Charging", "Power Outlet", "Premium Service"]
    
    flights = []
    for i in range(5):
        flight = Flight(
            id=f"FL{i+1:03d}",
            airline=random.choice(airlines),
            flight_number=f"{random.choice(airlines)[:2].upper()}{random.randint(100, 999)}",
            departure_time=f"{random.randint(6, 22):02d}:{random.choice(['00', '15', '30', '45'])}",
            arrival_time=f"{random.randint(6, 22):02d}:{random.choice(['00', '15', '30', '45'])}",
            duration=f"{random.randint(2, 8)}h {random.randint(0, 59)}m",
            price=random.uniform(200, 1200),
            stops=random.choice([0, 1, 2]),
            cabin_class=request.cabin_class,
            source_airport=request.source.upper()[:3],
            destination_airport=request.destination.upper()[:3],
            aircraft=random.choice(aircraft),
            amenities=random.sample(amenities, random.randint(2, 4))
        )
        flights.append(flight)
    
    return flights

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 