import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { listings } from '../data/listings';
import { BookingContext } from '../context/BookingContext';

export default function BookingDetail() {
  const { id } = useParams();
  const item = listings.find((l) => l.id === Number(id));
  const [index, setIndex] = useState(0);
  const { addBooking } = useContext(BookingContext);

  if (!item) return <div className="p-4">Not found</div>;

  const next = () => setIndex((i) => (i + 1) % item.images.length);
  const prev = () => setIndex((i) => (i - 1 + item.images.length) % item.images.length);

  return (
    <div className="p-4 space-y-4">
      <div className="relative">
        <img
          src={item.images[index]}
          alt="slide"
          className="w-full h-60 object-cover rounded"
        />
        <button onClick={prev} className="absolute left-2 top-1/2 bg-white/70 px-2">{'<'}</button>
        <button onClick={next} className="absolute right-2 top-1/2 bg-white/70 px-2">{'>'}</button>
      </div>
      <h2 className="text-2xl font-bold">{item.title}</h2>
      <p>{item.location}</p>
      <p className="font-semibold">${item.price}</p>
      <p>Rating: {item.rating}</p>
      <button
        onClick={() => addBooking(item)}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Book Now
      </button>
      <div className="mt-4">
        <h3 className="font-semibold">Reviews</h3>
        <ul className="list-disc list-inside">
          {item.reviews.map((r, i) => (
            <li key={i}>{r.user}: {r.text}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
