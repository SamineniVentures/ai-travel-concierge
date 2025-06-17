# AI Travel Concierge - Frontend

A modern, responsive frontend for the AI Travel Concierge application built with Next.js, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Flight Search**: Comprehensive search form with autocomplete
- **Real-time Results**: Live flight results from backend API
- **AI Insights**: Intelligent travel recommendations and price analysis
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Beautiful interface with shadcn/ui components
- **Type Safety**: Full TypeScript support
- **State Management**: Zustand for efficient state management

## 🛠️ Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State Management**: Zustand
- **Forms**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Date Handling**: date-fns

## 📦 Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the frontend directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend Integration

Make sure your backend server is running on `http://localhost:8000` before using the frontend.

## 🎯 Usage

### Flight Search

1. **Enter Origin**: Type your departure city (autocomplete available)
2. **Enter Destination**: Type your arrival city (autocomplete available)
3. **Select Dates**: Choose departure and return dates
4. **Choose Trip Type**: Round trip or one-way
5. **Select Cabin Class**: Economy, Business, or First Class
6. **Set Passengers**: Number of travelers
7. **Search**: Click "Search Flights" to find results

### Features

- **Autocomplete**: City suggestions as you type
- **Date Validation**: Prevents selecting past dates
- **Loading States**: Visual feedback during search
- **Error Handling**: Clear error messages
- **AI Insights**: Intelligent recommendations
- **Flight Details**: Comprehensive flight information
- **Booking Links**: Direct links to book flights

## 📁 Project Structure

```
frontend/
├── app/                    # Next.js App Router
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── flight-results.tsx # Flight results display
│   ├── hero-search-form.tsx # Main search form
│   └── ...
├── lib/                  # Utility functions
│   ├── api.ts           # API service functions
│   ├── utils.ts         # Helper functions
│   └── us-cities.json   # City data for autocomplete
├── store/               # State management
│   └── search-store.ts  # Zustand store
└── types/               # TypeScript type definitions
    └── index.ts         # Shared types
```

## 🔌 API Integration

The frontend integrates with the following backend endpoints:

- `GET /api/health` - Health check
- `POST /api/search-flights` - Flight search
- `GET /api/ai-insights/{search_id}` - AI insights
- `GET /api/travel-recommendations/{destination}` - Travel recommendations
- `POST /api/budget-analysis` - Budget analysis

## 🎨 UI Components

### Search Form
- Autocomplete input fields
- Date pickers with validation
- Trip type and cabin class selection
- Passenger count selector
- Loading states and error handling

### Flight Results
- Search summary with metadata
- AI insights panel
- Individual flight cards
- Flight route visualization
- Price and booking information

### Responsive Design
- Mobile-first approach
- Adaptive layouts
- Touch-friendly interactions
- Optimized for all screen sizes

## 🚀 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for formatting
- Consistent component structure

## 🔗 Backend Requirements

The frontend requires the backend to be running with:

- FastAPI server on port 8000
- CORS enabled for localhost:3000
- All API endpoints functional
- Mock data or real flight data available

## 🎯 Next Steps

### Phase 2 Enhancements
- [ ] User authentication
- [ ] Saved searches
- [ ] Flight alerts
- [ ] Booking management
- [ ] Payment integration

### Phase 3 Features
- [ ] Hotel search
- [ ] Car rental
- [ ] Travel insurance
- [ ] Multi-language support
- [ ] PWA capabilities

## 🐛 Troubleshooting

### Common Issues

1. **CORS Errors**: Ensure backend CORS is configured for localhost:3000
2. **API Connection**: Verify backend is running on port 8000
3. **Build Errors**: Check TypeScript types and dependencies
4. **Styling Issues**: Ensure Tailwind CSS is properly configured

### Debug Mode

Enable debug logging by setting:
```env
NEXT_PUBLIC_DEBUG=true
```

## 📄 License

This project is part of the AI Travel Concierge application.

---

**Ready to explore amazing flights with AI-powered insights!** ✈️🤖
