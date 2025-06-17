"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, X, Plane } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white/95 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Plane className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TravelBook</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/flights" className="text-gray-700 hover:text-blue-600 transition-colors">
              Flights
            </Link>
            <Link href="/hotels" className="text-gray-700 hover:text-blue-600 transition-colors">
              Hotels
            </Link>
            <Link href="/experiences" className="text-gray-700 hover:text-blue-600 transition-colors">
              Experiences
            </Link>
            <Link href="/deals" className="text-gray-700 hover:text-blue-600 transition-colors">
              Deals
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button variant="ghost">Sign In</Button>
            <Button>Sign Up</Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <Link href="/flights" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                Flights
              </Link>
              <Link href="/hotels" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                Hotels
              </Link>
              <Link href="/experiences" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                Experiences
              </Link>
              <Link href="/deals" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors">
                Deals
              </Link>
              <div className="px-3 py-2 space-y-2">
                <Button variant="ghost" className="w-full">
                  Sign In
                </Button>
                <Button className="w-full">Sign Up</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
