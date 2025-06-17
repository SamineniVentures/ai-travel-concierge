import os
import uuid
import time
from datetime import datetime
from typing import List, Dict, Any, Optional
from fastapi import FastAPI, HTTPException, Depends, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel

# Import our services and models with absolute imports
from config import settings, validate_environment
from models import (
    FlightSearchRequest, FlightSearchResponse, FlightOption, FlightSegment,
    SearchAnalytics, AIInsightRequest, AIInsightResponse, HealthCheck,
    ErrorResponse, SuccessResponse
)
from supabase_service import supabase_service
from llm_service import llm_service

# Initialize FastAPI app
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description=settings.api_description,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event
@app.on_event("startup")
async def startup_event():
    """Initialize services on startup"""
    print("🚀 Starting AI Travel Concierge Backend...")
    print(f"📋 Version: {settings.api_version}")
    print(f"🌐 Host: {settings.host}:{settings.port}")
    
    # Validate environment
    env_status = validate_environment()
    if env_status["errors"]:
        print("❌ Environment validation failed:")
        for error in env_status["errors"]:
            print(f"   - {error}")
        return
    
    if env_status["warnings"]:
        print("⚠️  Environment warnings:")
        for warning in env_status["warnings"]:
            print(f"   - {warning}")
    
    print("✅ Environment validation passed!")
    print("🔗 API Documentation will be available at:")
    print(f"   - Swagger UI: http://{settings.host}:{settings.port}/docs")
    print(f"   - ReDoc: http://{settings.host}:{settings.port}/redoc")
    print(f"🏥 Health Check: http://{settings.host}:{settings.port}/api/health")

# Health check endpoint
@app.get("/api/health", response_model=HealthCheck)
async def health_check():
    """Health check endpoint"""
    services = {
        "api": "healthy",
        "supabase": "connected" if supabase_service.is_connected() else "disconnected",
        "openai": "available" if llm_service.is_available() else "unavailable"
    }
    
    return HealthCheck(
        status="healthy",
        version=settings.api_version,
        timestamp=datetime.utcnow(),
        services=services
    )

# Flight search endpoint using Supabase listings
@app.post("/api/search-flights", response_model=FlightSearchResponse)
async def search_flights_endpoint(
    request: FlightSearchRequest,
    background_tasks: BackgroundTasks,
    http_request: Request = None
):
    """Search for flights with AI-powered insights using Supabase listings"""
    
    search_start_time = time.time()
    search_id = str(uuid.uuid4())
    
    try:
        # Check cache first
        cached_flights = await supabase_service.get_cached_flights(request.dict())
        
        if cached_flights:
            print(f"📦 Using cached flight data for search {search_id}")
            flights = cached_flights
        else:
            print(f"🔍 Searching flights for {search_id}")
            # Get flights from Supabase listings
            flights = await get_flights_from_supabase(request)
            
            # Cache the results
            if flights:
                await supabase_service.save_flight_cache(request.dict(), [f.dict() for f in flights])
        
        # Calculate search duration
        search_duration_ms = int((time.time() - search_start_time) * 1000)
        
        # Prepare response
        search_metadata = {
            "search_id": search_id,
            "origin": request.origin,
            "destination": request.destination,
            "departure_date": request.departure_date,
            "return_date": request.return_date,
            "passengers": {
                "adults": request.adults,
                "children": request.children,
                "infants": request.infants
            },
            "cabin_class": request.cabin_class.value,
            "trip_type": request.trip_type.value,
            "currency": request.currency,
            "search_duration_ms": search_duration_ms,
            "results_count": len(flights),
            "cached": cached_flights is not None
        }
        
        # Get AI insights in background
        ai_insights = None
        if llm_service.is_available() and flights:
            background_tasks.add_task(
                get_ai_insights_background,
                search_id,
                flights,
                request.dict()
            )
        
        # Save analytics in background
        background_tasks.add_task(
            save_search_analytics_background,
            search_id,
            request.dict(),
            len(flights),
            search_duration_ms,
            http_request
        )
        
        return FlightSearchResponse(
            search_id=search_id,
            flights=flights,
            search_metadata=search_metadata,
            ai_insights=ai_insights
        )
        
    except Exception as e:
        print(f"❌ Error in flight search: {e}")
        raise HTTPException(status_code=500, detail=f"Flight search failed: {str(e)}")

async def get_flights_from_supabase(request: FlightSearchRequest) -> List[FlightOption]:
    """Get flights from Supabase listings"""
    try:
        if not supabase_service.is_connected():
            # Return mock data if Supabase is not connected
            return get_mock_flights(request)
        
        # Query Supabase for flight listings
        # This would typically query a 'flights' or 'listings' table
        # For now, we'll use mock data but structure it for Supabase integration
        
        # Mock flight data that would come from Supabase
        mock_flights = get_mock_flights(request)
        
        # In a real implementation, you would query Supabase like:
        # result = supabase_service.client.table('flights').select('*').eq('origin', request.origin).eq('destination', request.destination).execute()
        
        return mock_flights
        
    except Exception as e:
        print(f"Error getting flights from Supabase: {e}")
        return get_mock_flights(request)

def get_mock_flights(request: FlightSearchRequest) -> List[FlightOption]:
    """Generate mock flight data for testing"""
    mock_carriers = ["American Airlines", "Delta Airlines", "United Airlines", "Southwest Airlines", "JetBlue"]
    mock_prices = [299, 349, 399, 449, 499, 549, 599, 649]
    
    flights = []
    for i in range(8):  # Generate 8 mock flights
        # Create flight segments
        outbound_segments = [
            FlightSegment(
                origin=request.origin,
                destination=request.destination,
                departure_time=f"{request.departure_date}T{10 + (i % 8):02d}:00:00",
                arrival_time=f"{request.departure_date}T{14 + (i % 8):02d}:00:00",
                carrier=mock_carriers[i % len(mock_carriers)],
                flight_number=f"FL{i+1:03d}",
                duration="4h 0m",
                stops=0 if i < 5 else 1
            )
        ]
        
        # Add return segments for round trips
        inbound_segments = None
        if request.trip_type.value == "round_trip" and request.return_date:
            inbound_segments = [
                FlightSegment(
                    origin=request.destination,
                    destination=request.origin,
                    departure_time=f"{request.return_date}T{16 + (i % 8):02d}:00:00",
                    arrival_time=f"{request.return_date}T{20 + (i % 8):02d}:00:00",
                    carrier=mock_carriers[i % len(mock_carriers)],
                    flight_number=f"FL{i+1:03d}R",
                    duration="4h 0m",
                    stops=0 if i < 5 else 1
                )
            ]
        
        flight_option = FlightOption(
            id=str(uuid.uuid4()),
            price=mock_prices[i % len(mock_prices)],
            currency=request.currency,
            outbound_segments=outbound_segments,
            inbound_segments=inbound_segments,
            total_duration="4h 0m",
            stops=0 if i < 5 else 1,
            cabin_class=request.cabin_class,
            booking_link=f"https://example.com/book/{i+1}",
            airline_logo=None
        )
        flights.append(flight_option)
    
    return flights

async def get_ai_insights_background(search_id: str, flights: List[FlightOption], search_params: Dict[str, Any]):
    """Get AI insights in background"""
    try:
        ai_request = AIInsightRequest(
            search_id=search_id,
            flights=flights,
            user_preferences=None,  # Could be passed from user context
            context=f"Flight search from {search_params.get('origin')} to {search_params.get('destination')}"
        )
        
        ai_response = await llm_service.analyze_flight_search(ai_request)
        
        if ai_response:
            print(f"🤖 AI insights generated for search {search_id}")
            # Here you could store AI insights in database or cache
        else:
            print(f"⚠️  No AI insights generated for search {search_id}")
            
    except Exception as e:
        print(f"❌ Error generating AI insights: {e}")

async def save_search_analytics_background(
    search_id: str, 
    search_params: Dict[str, Any], 
    results_count: int, 
    search_duration_ms: int,
    http_request: Request
):
    """Save search analytics in background"""
    try:
        analytics = SearchAnalytics(
            search_id=search_id,
            user_id=None,  # Could be extracted from auth token
            search_params=search_params,
            results_count=results_count,
            search_duration_ms=search_duration_ms,
            timestamp=datetime.utcnow(),
            ip_address=http_request.client.host if http_request else None,
            user_agent=http_request.headers.get("user-agent") if http_request else None
        )
        
        await supabase_service.save_search_analytics(analytics)
        print(f"📊 Analytics saved for search {search_id}")
        
    except Exception as e:
        print(f"❌ Error saving search analytics: {e}")

# AI Insights endpoint
@app.get("/api/ai-insights/{search_id}", response_model=AIInsightResponse)
async def get_ai_insights(search_id: str):
    """Get AI insights for a specific search"""
    try:
        # This would typically fetch from cache or database
        # For now, return a mock response
        return AIInsightResponse(
            search_id=search_id,
            insights=[
                "Prices are currently competitive for this route",
                "Direct flights are available but at a premium",
                "Consider booking 2-3 weeks in advance for best prices"
            ],
            recommendations=[
                "Book the 10:00 AM flight for best value",
                "Consider flexible dates for 15% savings",
                "Check return flights separately for better deals"
            ],
            price_analysis={
                "price_range_quality": "good",
                "value_assessment": "Prices are within normal range for this route",
                "price_trends": "Prices have been stable over the past week"
            },
            timing_analysis={
                "best_booking_time": "Book within the next 7 days",
                "seasonal_factors": "Peak travel season approaching",
                "flexibility_benefits": "Flexible dates could save 20-30%"
            },
            generated_at=datetime.utcnow()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get AI insights: {str(e)}")

# Travel recommendations endpoint
@app.get("/api/travel-recommendations/{destination}")
async def get_travel_recommendations(destination: str):
    """Get AI-powered travel recommendations for a destination"""
    try:
        if not llm_service.is_available():
            raise HTTPException(status_code=503, detail="AI service unavailable")
        
        recommendations = await llm_service.generate_travel_recommendations(destination)
        
        return {
            "destination": destination,
            "recommendations": recommendations,
            "generated_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get recommendations: {str(e)}")

# Budget analysis endpoint
@app.post("/api/budget-analysis")
async def analyze_budget(destination: str, duration: int, budget: float):
    """Analyze travel budget with AI insights"""
    try:
        if not llm_service.is_available():
            raise HTTPException(status_code=503, detail="AI service unavailable")
        
        analysis = await llm_service.analyze_travel_budget(destination, duration, budget)
        
        return {
            "destination": destination,
            "duration": duration,
            "budget": budget,
            "analysis": analysis,
            "generated_at": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze budget: {str(e)}")

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Handle HTTP exceptions"""
    return JSONResponse(
        status_code=exc.status_code,
        content=ErrorResponse(
            error=exc.detail,
            message=exc.detail,
            details={"status_code": exc.status_code}
        ).dict()
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle general exceptions"""
    return JSONResponse(
        status_code=500,
        content=ErrorResponse(
            error="Internal Server Error",
            message="An unexpected error occurred",
            details={"error_type": type(exc).__name__}
        ).dict()
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )
