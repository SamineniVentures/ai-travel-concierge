import React, { useContext, useState } from 'react';
import { BookingContext } from '../context/BookingContext';

export default function Itinerary() {
  const { bookings } = useContext(BookingContext);
  const [open, setOpen] = useState({});

  const toggle = (i) => setOpen((o) => ({ ...o, [i]: !o[i] }));

  if (!bookings.length) return <div className="p-4">No bookings yet.</div>;

  return (
    <div className="p-4 space-y-4">
      {bookings.map((b, i) => (
        <div key={i} className="border rounded">
          <button
            onClick={() => toggle(i)}
            className="w-full text-left p-2 bg-gray-100 dark:bg-gray-700"
          >
            Day {i + 1}: {b.title}
          </button>
          {open[i] && (
            <div className="p-2">
              <p>Location: {b.location}</p>
              <p>Price: ${b.price}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
