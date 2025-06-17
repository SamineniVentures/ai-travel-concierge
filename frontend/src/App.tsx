import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Flight {
  id: string;
  airline: string;
  flight_number: string;
  departure_time: string;
  arrival_time: string;
  duration: string;
  price: number;
  stops: number;
  cabin_class: string;
  source_airport: string;
  destination_airport: string;
  aircraft: string;
  amenities: string[];
}

interface Recommendation {
  flights: Flight[];
  recommendation_reason: string;
  total_price: number;
  best_deal: Flight;
  alternative_options: Flight[];
}

const airports = [
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York' },
  { code: 'LHR', name: 'London Heathrow Airport', city: 'London' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles' },
  { code: 'SFO', name: 'San Francisco International Airport', city: 'San Francisco' },
  { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago' },
  { code: 'MIA', name: 'Miami International Airport', city: 'Miami' },
  { code: 'SEA', name: 'Seattle-Tacoma International Airport', city: 'Seattle' },
];

function App() {
  const [source, setSource] = useState('JFK');
  const [destination, setDestination] = useState('LHR');
  const [departureDate, setDepartureDate] = useState<Date | null>(new Date());
  const [returnDate, setReturnDate] = useState<Date | null>(null);
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('economy');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRecommendation(null);
    try {
      const res = await axios.post('/api/search-flights', {
        source,
        destination,
        departure_date: departureDate?.toISOString().slice(0, 10),
        return_date: returnDate?.toISOString().slice(0, 10) || undefined,
        passengers,
        cabin_class: cabinClass,
      });
      setRecommendation(res.data);
    } catch (err: any) {
      setError('Failed to fetch recommendations.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex flex-col items-center py-8">
      <div className="w-full max-w-2xl card mb-8">
        <h1 className="text-3xl font-bold mb-4 text-primary-700">AI Travel Concierge</h1>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleSearch}>
          <div>
            <label className="block mb-1 font-medium">From</label>
            <select className="input-field" value={source} onChange={e => setSource(e.target.value)}>
              {airports.map(a => (
                <option key={a.code} value={a.code}>{a.city} ({a.code})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">To</label>
            <select className="input-field" value={destination} onChange={e => setDestination(e.target.value)}>
              {airports.map(a => (
                <option key={a.code} value={a.code}>{a.city} ({a.code})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Departure Date</label>
            <DatePicker
              className="input-field"
              selected={departureDate}
              onChange={date => setDepartureDate(date)}
              dateFormat="yyyy-MM-dd"
              minDate={new Date()}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Return Date (optional)</label>
            <DatePicker
              className="input-field"
              selected={returnDate}
              onChange={date => setReturnDate(date)}
              dateFormat="yyyy-MM-dd"
              minDate={departureDate || new Date()}
              isClearable
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Passengers</label>
            <input
              type="number"
              className="input-field"
              min={1}
              max={9}
              value={passengers}
              onChange={e => setPassengers(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Cabin Class</label>
            <select className="input-field" value={cabinClass} onChange={e => setCabinClass(e.target.value)}>
              <option value="economy">Economy</option>
              <option value="premium">Premium Economy</option>
              <option value="business">Business</option>
              <option value="first">First</option>
            </select>
          </div>
          <div className="md:col-span-2 flex justify-end">
            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? 'Searching...' : 'Search Flights'}
            </button>
          </div>
        </form>
      </div>
      {error && <div className="text-red-600 mb-4">{error}</div>}
      {recommendation && (
        <div className="w-full max-w-3xl card">
          <h2 className="text-2xl font-semibold mb-2 text-primary-700">Best Recommendation</h2>
          <div className="mb-2 text-gray-700 whitespace-pre-line">{recommendation.recommendation_reason}</div>
          <div className="mb-4">
            <span className="font-bold">Total Price:</span> ${recommendation.total_price.toFixed(2)}
          </div>
          <div className="mb-4">
            <span className="font-bold">Best Deal:</span>
            <FlightCard flight={recommendation.best_deal} />
          </div>
          {recommendation.alternative_options.length > 0 && (
            <div>
              <span className="font-bold">Alternative Options:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {recommendation.alternative_options.map(f => (
                  <FlightCard key={f.id} flight={f} />
                ))}
              </div>
            </div>
          )}
          <div className="mt-6">
            <span className="font-bold">All Available Flights:</span>
            <div className="overflow-x-auto mt-2">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="bg-secondary-100">
                    <th className="px-2 py-1">Airline</th>
                    <th className="px-2 py-1">Flight #</th>
                    <th className="px-2 py-1">Departure</th>
                    <th className="px-2 py-1">Arrival</th>
                    <th className="px-2 py-1">Duration</th>
                    <th className="px-2 py-1">Stops</th>
                    <th className="px-2 py-1">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {recommendation.flights.map(f => (
                    <tr key={f.id} className="border-b">
                      <td className="px-2 py-1">{f.airline}</td>
                      <td className="px-2 py-1">{f.flight_number}</td>
                      <td className="px-2 py-1">{f.departure_time}</td>
                      <td className="px-2 py-1">{f.arrival_time}</td>
                      <td className="px-2 py-1">{f.duration}</td>
                      <td className="px-2 py-1">{f.stops}</td>
                      <td className="px-2 py-1">${f.price.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FlightCard({ flight }: { flight: Flight }) {
  return (
    <div className="card mb-2">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <div className="font-semibold text-primary-700">{flight.airline} ({flight.flight_number})</div>
          <div className="text-gray-600 text-sm">{flight.source_airport} → {flight.destination_airport}</div>
          <div className="text-gray-600 text-sm">{flight.departure_time} - {flight.arrival_time} ({flight.duration})</div>
        </div>
        <div className="mt-2 md:mt-0 text-right">
          <div className="font-bold text-lg text-primary-800">${flight.price.toFixed(2)}</div>
          <div className="text-xs text-gray-500">{flight.cabin_class.charAt(0).toUpperCase() + flight.cabin_class.slice(1)}</div>
          <div className="text-xs text-gray-500">Stops: {flight.stops}</div>
          <div className="text-xs text-gray-500">{flight.aircraft}</div>
          <div className="text-xs text-gray-500">{flight.amenities.join(', ')}</div>
        </div>
      </div>
    </div>
  );
}

export default App; 