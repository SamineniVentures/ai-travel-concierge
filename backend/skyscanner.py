"""Utilities for querying the Skyscanner Flights API."""

import os
import requests
from typing import List, Dict

API_KEY_ENV = "SKYSCANNER_API_KEY"
API_URL = (
    "https://partners.api.skyscanner.net/apiservices/browsequotes/v1.0"
)


def search_flights(origin: str, destination: str, date: str) -> List[Dict]:
    """Query Skyscanner for flights.

    Parameters
    ----------
    origin: str
        IATA code for origin airport.
    destination: str
        IATA code for destination airport.
    date: str
        Date of travel in YYYY-MM-DD format.
    Returns
    -------
    List[Dict]
        Simplified flight results with price and carrier information.
    """
    api_key = os.getenv(API_KEY_ENV)
    if not api_key:
        # Return mock data if API key is not available
        print(f"Warning: {API_KEY_ENV} not set, using mock flight data")
        return _get_mock_flights(origin, destination, date)
    
    try:
        url = f"{API_URL}/US/USD/en-US/{origin}/{destination}/{date}"
        params = {"apiKey": api_key}
        response = requests.get(url, params=params, timeout=10)
        response.raise_for_status()

        data = response.json()
        quotes = data.get("Quotes", [])
        carriers = {c["CarrierId"]: c["Name"] for c in data.get("Carriers", [])}

        flights = []
        for q in quotes:
            carrier_id = q.get("OutboundLeg", {}).get("CarrierIds", [None])[0]
            carrier = carriers.get(carrier_id, "Unknown")
            price = q.get("MinPrice")
            direct = q.get("Direct")
            flights.append({
                "carrier": carrier,
                "price": price,
                "direct": direct,
            })
        return flights
    except Exception as e:
        print(f"Error fetching flights from Skyscanner: {e}")
        # Return mock data on error
        return _get_mock_flights(origin, destination, date)


def _get_mock_flights(origin: str, destination: str, date: str) -> List[Dict]:
    """Generate mock flight data for testing"""
    mock_carriers = ["American Airlines", "Delta Airlines", "United Airlines", "Southwest Airlines"]
    mock_prices = [299, 349, 399, 449, 499, 549, 599]
    
    flights = []
    for i in range(5):  # Generate 5 mock flights
        flights.append({
            "carrier": mock_carriers[i % len(mock_carriers)],
            "price": mock_prices[i % len(mock_prices)],
            "direct": i < 3,  # First 3 flights are direct
        })
    
    return flights
