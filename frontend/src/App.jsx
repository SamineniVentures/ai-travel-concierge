import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SearchResults from './pages/SearchResults';
import BookingDetail from './pages/BookingDetail';
import Itinerary from './pages/Itinerary';
import Login from './pages/Login';
import { BookingProvider } from './context/BookingContext';
import { ThemeProvider } from './context/ThemeContext';
import { ErrorBoundary } from './components/ErrorBoundary';

export default function App() {
  return (
    <ThemeProvider>
      <BookingProvider>
        <Router>
          <Navbar />
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/results" element={<SearchResults />} />
              <Route path="/detail/:id" element={<BookingDetail />} />
              <Route path="/itinerary" element={<Itinerary />} />
              <Route path="/login" element={<Login />} />
            </Routes>
          </ErrorBoundary>
        </Router>
      </BookingProvider>
    </ThemeProvider>
  );
}
