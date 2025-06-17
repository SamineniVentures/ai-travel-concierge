from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from .skyscanner import search_flights

app = FastAPI()

class FlightRequest(BaseModel):
    origin: str
    destination: str
    date: str  # ISO format YYYY-MM-DD

@app.post('/api/flights')
def flights(req: FlightRequest):
    try:
        flights = search_flights(req.origin, req.destination, req.date)
        return {'flights': flights}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
