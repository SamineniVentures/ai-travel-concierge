"use client"
import Link from "next/link"
import { PlaneTakeoffIcon, LogInIcon } from "lucide-react"
import { DarkModeToggle } from "@/components/dark-mode-toggle"
import { Button } from "@/components/ui/button" // Assuming you have a Button component

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <PlaneTakeoffIcon className="h-7 w-7 text-primary" />
          <span className="font-bold text-xl">TravelPro</span>
        </Link>
        <div className="flex items-center gap-4">
          <DarkModeToggle />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/signin" className="flex items-center gap-1.5">
              <LogInIcon className="h-4 w-4" />
              Sign In
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
