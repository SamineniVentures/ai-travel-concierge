import React from 'react';
import { Link } from 'react-router-dom';

export default function Card({ item }) {
  return (
    <div className="border rounded shadow hover:shadow-lg overflow-hidden">
      <img src={item.images[0]} alt={item.title} className="h-40 w-full object-cover" />
      <div className="p-4 flex flex-col gap-1">
        <h3 className="font-semibold text-lg">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.location}</p>
        <p className="font-bold">${item.price}</p>
        <Link
          to={`/detail/${item.id}`}
          className="mt-2 inline-block bg-blue-600 text-white px-3 py-1 rounded"
        >
          View
        </Link>
      </div>
    </div>
  );
}
