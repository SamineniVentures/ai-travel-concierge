import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css" // Path relative to frontend/app/
import { ThemeProvider } from "@/components/theme-provider" // @/ resolves to frontend/
import Navbar from "@/components/layout/navbar"
import ItineraryDrawer from "@/components/itinerary-drawer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Travel Booking Pro",
  description: "Find your next adventure",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <Navbar />
          <main className="pt-16">{children}</main>
          <ItineraryDrawer />
        </ThemeProvider>
      </body>
    </html>
  )
}
