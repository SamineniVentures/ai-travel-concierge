import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import LoadingSkeleton from '../components/LoadingSkeleton';
import { listings } from '../data/listings';

export default function SearchResults() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <LoadingSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
      {listings.map((l) => (
        <Card key={l.id} item={l} />
      ))}
    </div>
  );
}
