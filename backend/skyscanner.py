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
        raise RuntimeError(f"Environment variable {API_KEY_ENV} is not set")

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
