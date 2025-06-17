from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class FlightSearchRequest(BaseModel):
    source: str
    destination: str
    departure_date: str
    return_date: Optional[str] = None
    passengers: int = 1
    cabin_class: str = "economy"
    budget: Optional[float] = None

class Flight(BaseModel):
    id: str
    airline: str
    flight_number: str
    departure_time: str
    arrival_time: str
    duration: str
    price: float
    stops: int
    cabin_class: str
    source_airport: str
    destination_airport: str
    aircraft: str
    amenities: List[str]

class FlightRecommendation(BaseModel):
    flights: List[Flight]
    recommendation_reason: str
    total_price: float
    best_deal: Flight
    alternative_options: List[Flight]

class Airport(BaseModel):
    code: str
    name: str
    city: str

class TravelPlan(BaseModel):
    id: str
    user_id: str
    source: str
    destination: str
    departure_date: str
    return_date: Optional[str]
    passengers: int
    cabin_class: str
    selected_flights: List[Flight]
    total_cost: float
    created_at: datetime
    status: str = "pending" 