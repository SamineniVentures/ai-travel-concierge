from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime, date
from enum import Enum

class UserRole(str, Enum):
    USER = "user"
    ADMIN = "admin"

class FlightClass(str, Enum):
    ECONOMY = "economy"
    BUSINESS = "business"
    FIRST = "first"

class TripType(str, Enum):
    ROUND_TRIP = "round_trip"
    ONE_WAY = "one_way"
    MULTI_CITY = "multi_city"

# User Models
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    role: UserRole = UserRole.USER

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

class User(UserBase):
    id: str
    created_at: datetime
    updated_at: datetime
    preferences: Optional[Dict[str, Any]] = None

# Flight Search Models
class FlightSearchRequest(BaseModel):
    origin: str = Field(..., description="Origin airport code (e.g., 'LAX')")
    destination: str = Field(..., description="Destination airport code (e.g., 'JFK')")
    departure_date: str = Field(..., description="Departure date in YYYY-MM-DD format")
    return_date: Optional[str] = Field(None, description="Return date in YYYY-MM-DD format")
    adults: int = Field(1, ge=1, le=9, description="Number of adult passengers")
    children: int = Field(0, ge=0, le=9, description="Number of child passengers")
    infants: int = Field(0, ge=0, le=9, description="Number of infant passengers")
    cabin_class: FlightClass = Field(FlightClass.ECONOMY, description="Cabin class")
    trip_type: TripType = Field(TripType.ROUND_TRIP, description="Trip type")
    currency: str = Field("USD", description="Currency code")
    locale: str = Field("en-US", description="Locale for results")

class FlightSegment(BaseModel):
    origin: str
    destination: str
    departure_time: str
    arrival_time: str
    carrier: str
    flight_number: str
    duration: Optional[str] = None
    stops: int = 0

class FlightOption(BaseModel):
    id: str
    price: float
    currency: str
    outbound_segments: List[FlightSegment]
    inbound_segments: Optional[List[FlightSegment]] = None
    total_duration: str
    stops: int
    cabin_class: FlightClass
    booking_link: Optional[str] = None
    airline_logo: Optional[str] = None

class FlightSearchResponse(BaseModel):
    search_id: str
    flights: List[FlightOption]
    search_metadata: Dict[str, Any]
    ai_insights: Optional[Dict[str, Any]] = None

# Travel Plan Models
class TravelPlanBase(BaseModel):
    title: str
    description: Optional[str] = None
    destination: str
    start_date: date
    end_date: date
    budget: Optional[float] = None
    preferences: Optional[Dict[str, Any]] = None

class TravelPlanCreate(TravelPlanBase):
    pass

class TravelPlanUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    destination: Optional[str] = None
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    budget: Optional[float] = None
    preferences: Optional[Dict[str, Any]] = None

class TravelPlan(TravelPlanBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    ai_generated: bool = False

# Analytics Models
class SearchAnalytics(BaseModel):
    search_id: str
    user_id: Optional[str] = None
    search_params: Dict[str, Any]
    results_count: int
    search_duration_ms: int
    timestamp: datetime
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class FlightCache(BaseModel):
    cache_key: str
    search_params: Dict[str, Any]
    flight_data: List[Dict[str, Any]]
    created_at: datetime
    expires_at: datetime

# AI Models
class AIInsightRequest(BaseModel):
    search_id: str
    flights: List[FlightOption]
    user_preferences: Optional[Dict[str, Any]] = None
    context: Optional[str] = None

class AIInsightResponse(BaseModel):
    search_id: str
    insights: List[str]
    recommendations: List[str]
    price_analysis: Optional[Dict[str, Any]] = None
    timing_analysis: Optional[Dict[str, Any]] = None
    generated_at: datetime

# Error Models
class ErrorResponse(BaseModel):
    error: str
    message: str
    details: Optional[Dict[str, Any]] = None

class SuccessResponse(BaseModel):
    message: str
    data: Optional[Dict[str, Any]] = None

# Health Check
class HealthCheck(BaseModel):
    status: str
    version: str
    timestamp: datetime
    services: Dict[str, str]
