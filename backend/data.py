from typing import List, Dict
from models import Flight, Airport

# Mock flight data
MOCK_FLIGHTS: Dict[str, List[Flight]] = {
    "NYC-LON": [
        Flight(
            id="BA001",
            airline="British Airways",
            flight_number="BA001",
            departure_time="09:00",
            arrival_time="21:00",
            duration="7h 0m",
            price=850.0,
            stops=0,
            cabin_class="economy",
            source_airport="JFK",
            destination_airport="LHR",
            aircraft="Boeing 777",
            amenities=["WiFi", "Entertainment", "Meal"]
        ),
        Flight(
            id="AA101",
            airline="American Airlines",
            flight_number="AA101",
            departure_time="14:30",
            arrival_time="02:30",
            duration="7h 0m",
            price=720.0,
            stops=0,
            cabin_class="economy",
            source_airport="JFK",
            destination_airport="LHR",
            aircraft="Boeing 787",
            amenities=["WiFi", "Entertainment", "Meal", "USB Charging"]
        ),
        Flight(
            id="DL201",
            airline="Delta Airlines",
            flight_number="DL201",
            departure_time="18:45",
            arrival_time="06:45",
            duration="7h 0m",
            price=680.0,
            stops=0,
            cabin_class="economy",
            source_airport="JFK",
            destination_airport="LHR",
            aircraft="Airbus A350",
            amenities=["WiFi", "Entertainment", "Meal", "USB Charging", "Power Outlet"]
        )
    ],
    "LON-NYC": [
        Flight(
            id="BA002",
            airline="British Airways",
            flight_number="BA002",
            departure_time="10:00",
            arrival_time="13:00",
            duration="7h 0m",
            price=820.0,
            stops=0,
            cabin_class="economy",
            source_airport="LHR",
            destination_airport="JFK",
            aircraft="Boeing 777",
            amenities=["WiFi", "Entertainment", "Meal"]
        ),
        Flight(
            id="AA102",
            airline="American Airlines",
            flight_number="AA102",
            departure_time="15:30",
            arrival_time="18:30",
            duration="7h 0m",
            price=750.0,
            stops=0,
            cabin_class="economy",
            source_airport="LHR",
            destination_airport="JFK",
            aircraft="Boeing 787",
            amenities=["WiFi", "Entertainment", "Meal", "USB Charging"]
        )
    ],
    "NYC-PAR": [
        Flight(
            id="AF301",
            airline="Air France",
            flight_number="AF301",
            departure_time="08:30",
            arrival_time="20:30",
            duration="7h 0m",
            price=920.0,
            stops=0,
            cabin_class="economy",
            source_airport="JFK",
            destination_airport="CDG",
            aircraft="Airbus A380",
            amenities=["WiFi", "Entertainment", "Meal", "Premium Service"]
        ),
        Flight(
            id="DL301",
            airline="Delta Airlines",
            flight_number="DL301",
            departure_time="16:00",
            arrival_time="04:00",
            duration="7h 0m",
            price=780.0,
            stops=0,
            cabin_class="economy",
            source_airport="JFK",
            destination_airport="CDG",
            aircraft="Airbus A350",
            amenities=["WiFi", "Entertainment", "Meal"]
        )
    ],
    "NYC-LAX": [
        Flight(
            id="UA401",
            airline="United Airlines",
            flight_number="UA401",
            departure_time="07:00",
            arrival_time="10:30",
            duration="6h 30m",
            price=450.0,
            stops=0,
            cabin_class="economy",
            source_airport="JFK",
            destination_airport="LAX",
            aircraft="Boeing 737",
            amenities=["WiFi", "Entertainment", "Snack"]
        ),
        Flight(
            id="AA401",
            airline="American Airlines",
            flight_number="AA401",
            departure_time="12:00",
            arrival_time="15:30",
            duration="6h 30m",
            price=520.0,
            stops=0,
            cabin_class="economy",
            source_airport="JFK",
            destination_airport="LAX",
            aircraft="Boeing 787",
            amenities=["WiFi", "Entertainment", "Meal", "USB Charging"]
        )
    ]
}

# Available airports
AIRPORTS: List[Airport] = [
    Airport(code="JFK", name="John F. Kennedy International Airport", city="New York"),
    Airport(code="LHR", name="London Heathrow Airport", city="London"),
    Airport(code="CDG", name="Charles de Gaulle Airport", city="Paris"),
    Airport(code="LAX", name="Los Angeles International Airport", city="Los Angeles"),
    Airport(code="SFO", name="San Francisco International Airport", city="San Francisco"),
    Airport(code="ORD", name="O'Hare International Airport", city="Chicago"),
    Airport(code="MIA", name="Miami International Airport", city="Miami"),
    Airport(code="SEA", name="Seattle-Tacoma International Airport", city="Seattle"),
    Airport(code="DFW", name="Dallas/Fort Worth International Airport", city="Dallas"),
    Airport(code="ATL", name="Hartsfield-Jackson Atlanta International Airport", city="Atlanta"),
    Airport(code="DEN", name="Denver International Airport", city="Denver"),
    Airport(code="LAS", name="McCarran International Airport", city="Las Vegas"),
    Airport(code="BOS", name="Boston Logan International Airport", city="Boston"),
    Airport(code="PHX", name="Phoenix Sky Harbor International Airport", city="Phoenix"),
    Airport(code="IAH", name="George Bush Intercontinental Airport", city="Houston"),
]

def get_flights_for_route(route: str) -> List[Flight]:
    """Get flights for a specific route"""
    return MOCK_FLIGHTS.get(route, [])

def get_all_airports() -> List[Airport]:
    """Get all available airports"""
    return AIRPORTS

def search_airports(query: str) -> List[Airport]:
    """Search airports by code, name, or city"""
    query = query.lower()
    return [
        airport for airport in AIRPORTS
        if query in airport.code.lower() or 
           query in airport.name.lower() or 
           query in airport.city.lower()
    ] 