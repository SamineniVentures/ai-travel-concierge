import React, { useState } from 'react';

export default function SearchBar({ onSearch }) {
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState('');
  const [travelers, setTravelers] = useState(1);

  const handle = () => {
    onSearch({ location, dates, travelers });
  };

  return (
    <div className="flex flex-col md:flex-row gap-2 md:gap-4 items-center">
      <input
        className="border p-2 rounded w-full md:w-auto"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        className="border p-2 rounded w-full md:w-auto"
        type="text"
        placeholder="Dates"
        value={dates}
        onChange={(e) => setDates(e.target.value)}
      />
      <input
        className="border p-2 rounded w-full md:w-auto"
        type="number"
        min="1"
        placeholder="Travelers"
        value={travelers}
        onChange={(e) => setTravelers(e.target.value)}
      />
      <button onClick={handle} className="bg-blue-600 text-white px-4 py-2 rounded">
        Search
      </button>
    </div>
  );
}
