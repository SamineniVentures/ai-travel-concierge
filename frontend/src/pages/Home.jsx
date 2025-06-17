import React from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';

export default function Home() {
  const navigate = useNavigate();

  const handleSearch = (params) => {
    navigate('/results');
  };

  return (
    <div className="flex flex-col items-center justify-center text-center gap-6 p-8 bg-gray-100 dark:bg-gray-900">
      <h1 className="text-4xl font-bold">Find your next adventure</h1>
      <SearchBar onSearch={handleSearch} />
    </div>
  );
}
