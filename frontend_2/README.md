# Travel Booking Pro

A comprehensive travel booking interface built with Next.js, React, Tailwind CSS, TypeScript, Headless UI, React Hook Form, and Zustand.

## Features

- Sticky top navigation with logo, dark mode toggle, and sign-in link.
- Hero search bar with destination input, custom date pickers, and travellers selector.
- Tabbed results grid (Flights, Hotels, Experiences).
- Expedia-like listing cards with image, name, price, rating, and free cancellation badge.
- Mock map view that "pans" to the selected card.
- Itinerary drawer (collapsible by day) to add and manage selected items.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS 3
- **UI Primitives**: Headless UI (for custom Date Picker, Tabs, Dialog, Disclosure)
- **Form Management**: React Hook Form (with Zod for validation)
- **State Management**: Zustand
- **Language**: TypeScript
- **Icons**: Lucide React
- **Date Utilities**: date-fns

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm or yarn

### Installation

1.  **Clone the repository (or download the code):**
    \`\`\`bash
    # If you pushed this to GitHub:
    # git clone <your-repo-url>
    # cd travel-booking-pro
    \`\`\`

2.  **Install dependencies:**
    \`\`\`bash
    npm install
    # or
    # yarn install
    \`\`\`

3.  **Run the development server:**
    \`\`\`bash
    npm run dev
    # or
    # yarn dev
    \`\`\`
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

-   `app/`: Next.js App Router pages and layouts.
-   `components/`: Reusable UI components.
    -   `layout/`: Navbar, etc.
    -   `ui/`: Generic UI elements like Button, Input (shadcn/ui style).
    -   Other specific components like `HeroSearchForm`, `ListingCard`, etc.
-   `lib/`: Utility functions and dummy data.
-   `store/`: Zustand state management stores.
-   `types/`: TypeScript type definitions.
-   `public/`: Static assets.

## Key Components & Logic

-   **Custom Date Picker (`components/custom-date-picker.tsx`)**: Built using Headless UI primitives. This is a simplified version; a production-ready date picker is more complex.
-   **State Management**:
    -   `searchStore.ts`: Manages search parameters, results, active tab, and selected item for the map.
    -   `itineraryStore.ts`: Manages items added to the itinerary and drawer visibility.
-   **Dummy Data**: `lib/dummy-data.ts` provides seed data for flights, hotels, and experiences. The search functionality filters this data.
-   **Map View**: `components/map-view.tsx` is a placeholder. A real map would require a library like Leaflet, Mapbox GL JS, or Google Maps API.

## Further Development

-   Implement real API calls for search and autocomplete.
-   Integrate a fully functional map component.
-   Add user authentication.
-   Expand date picker functionality (e.g., range selection, better styling).
-   Implement proper form validation and error handling.
-   Add more sophisticated filtering and sorting for results.
-   Unit and integration tests.
