"use client"

import type React from "react"
import { useState } from "react"

export default function HeroSearchForm() {
  const [location, setLocation] = useState("")
  const [checkInDate, setCheckInDate] = useState("")
  const [checkOutDate, setCheckOutDate] = useState("")
  const [guests, setGuests] = useState(1)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission logic here
    console.log("Form submitted:", { location, checkInDate, checkOutDate, guests })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4">
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="date"
        placeholder="Check-in Date"
        value={checkInDate}
        onChange={(e) => setCheckInDate(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="date"
        placeholder="Check-out Date"
        value={checkOutDate}
        onChange={(e) => setCheckOutDate(e.target.value)}
        className="p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Guests"
        value={guests}
        onChange={(e) => setGuests(Number.parseInt(e.target.value))}
        className="p-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
        Search
      </button>
    </form>
  )
}
