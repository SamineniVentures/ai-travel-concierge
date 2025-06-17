import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ThemeContext } from '../context/ThemeContext';

export default function Navbar() {
  const { dark, toggle } = useContext(ThemeContext);
  return (
    <nav className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 shadow">
      <Link to="/" className="text-xl font-bold">
        Travel Concierge
      </Link>
      <div className="space-x-4">
        <Link to="/itinerary" className="hover:underline">
          Itinerary
        </Link>
        <Link to="/login" className="hover:underline">
          Login
        </Link>
        <button onClick={toggle} className="ml-2 px-2 py-1 border rounded">
          {dark ? 'Light' : 'Dark'}
        </button>
      </div>
    </nav>
  );
}
