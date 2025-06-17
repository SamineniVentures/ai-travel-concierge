# AI Travel Concierge - System Architecture

## 🏗️ Overall Architecture

The AI Travel Concierge is a modern, scalable travel booking platform that combines traditional flight search with AI-powered insights and recommendations.

\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   External      │
│   (React/Next)  │◄──►│   (FastAPI)     │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                              │                        │
                              ▼                        ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Database      │    │   AI Services   │
                       │   (Supabase)    │    │   (OpenAI)      │
                       └─────────────────┘    └─────────────────┘
\`\`\`

## 🎯 Core Components

### 1. Backend API (FastAPI)
- **Framework**: FastAPI with Python 3.13
- **Architecture**: RESTful API with async/await support
- **Documentation**: Auto-generated Swagger/OpenAPI docs
- **Port**: 8000

### 2. Frontend (React/Next.js)
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: Zustand
- **Port**: 3000

### 3. Database (Supabase)
- **Type**: PostgreSQL with real-time subscriptions
- **Features**: Row-level security, real-time updates
- **Tables**: flights, users, search_analytics, flight_cache

### 4. AI Services (OpenAI)
- **LLM**: GPT-4 for travel insights
- **Framework**: LangChain for prompt engineering
- **Features**: Flight recommendations, price analysis, travel tips

## 📁 Project Structure

\`\`\`
ai-travel-concierge/
├── backend/                    # FastAPI Backend
│   ├── main.py                # Main FastAPI application
│   ├── config.py              # Configuration and environment
│   ├── models.py              # Pydantic data models
│   ├── llm_service.py         # OpenAI/LangChain integration
│   ├── supabase_service.py    # Database operations
│   ├── skyscanner.py          # Flight API integration
│   └── Agents/                # AI agent workflows
├── frontend/                   # Next.js Frontend
│   ├── app/                   # App router pages
│   ├── components/            # Reusable UI components
│   ├── store/                 # Zustand state management
│   ├── lib/                   # Utility functions
│   └── types/                 # TypeScript type definitions
├── requirements.txt           # Python dependencies
├── package.json              # Node.js dependencies
└── deploy_backend.sh         # Deployment script
\`\`\`

## 🔧 Backend Architecture

### Service Layer Pattern
\`\`\`
┌─────────────────────────────────────────────────────────────┐
│                    FastAPI Application                      │
├─────────────────────────────────────────────────────────────┤
│  API Routes Layer                                           │
│  ├── /api/health           # Health monitoring             │
│  ├── /api/search-flights   # Flight search                 │
│  ├── /api/ai-insights      # AI recommendations            │
│  └── /api/travel-recommendations # Travel tips             │
├─────────────────────────────────────────────────────────────┤
│  Service Layer                                              │
│  ├── LLMService            # OpenAI integration            │
│  ├── SupabaseService       # Database operations           │
│  └── FlightService         # Flight data management        │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  ├── Pydantic Models       # Data validation               │
│  ├── Database Models       # ORM entities                  │
│  └── External APIs         # Third-party integrations      │
└─────────────────────────────────────────────────────────────┘
\`\`\`

### Key Services

#### 1. LLM Service (`llm_service.py`)
- **Purpose**: AI-powered travel insights and recommendations
- **Features**:
  - Flight price analysis
  - Travel timing recommendations
  - Budget optimization suggestions
  - Destination insights
- **Technologies**: OpenAI GPT-4, LangChain

#### 2. Supabase Service (`supabase_service.py`)
- **Purpose**: Database operations and caching
- **Features**:
  - Flight data storage and retrieval
  - Search analytics tracking
  - User session management
  - Real-time data synchronization
- **Tables**:
  - `flights`: Flight listings and pricing
  - `search_analytics`: User search patterns
  - `flight_cache`: Cached search results
  - `users`: User profiles and preferences

#### 3. Flight Service (`skyscanner.py`)
- **Purpose**: External flight data integration
- **Features**:
  - Real-time flight search
  - Price comparison
  - Route optimization
  - Booking link generation

## 🎨 Frontend Architecture

### Component Hierarchy
\`\`\`
App
├── Layout
│   ├── Navbar
│   └── ThemeProvider
├── Pages
│   ├── Home (Search Form)
│   ├── Results
│   └── Itinerary
└── Components
    ├── HeroSearchForm
    ├── FlightCard
    ├── ResultsGrid
    └── AIInsights
\`\`\`

### State Management (Zustand)
\`\`\`typescript
// Search Store
interface SearchState {
  searchParams: SearchParams | null
  results: FlightOption[]
  loading: boolean
  error: string | null
}

// Itinerary Store
interface ItineraryState {
  selectedFlights: FlightOption[]
  totalPrice: number
  savedItineraries: Itinerary[]
}
\`\`\`

## 🔄 Data Flow

### Flight Search Flow
\`\`\`
1. User Input → Frontend Form
2. Form Validation → TypeScript/Pydantic
3. API Request → FastAPI Backend
4. Cache Check → Supabase Service
5. Flight Search → External APIs
6. AI Analysis → OpenAI Service
7. Response → Frontend Display
8. Analytics → Database Storage
\`\`\`

### AI Insights Flow
\`\`\`
1. Flight Data → LLM Service
2. Prompt Engineering → LangChain
3. AI Analysis → OpenAI GPT-4
4. Structured Response → JSON
5. Frontend Display → User Interface
\`\`\`

## 🛡️ Security & Performance

### Security Features
- **CORS**: Configured for frontend-backend communication
- **Input Validation**: Pydantic models for all API inputs
- **Rate Limiting**: API request throttling
- **Environment Variables**: Secure configuration management

### Performance Optimizations
- **Caching**: Flight search results cached in Supabase
- **Background Tasks**: AI analysis runs asynchronously
- **Connection Pooling**: Database connection optimization
- **CDN**: Static assets served via CDN

### Monitoring & Analytics
- **Health Checks**: Real-time service monitoring
- **Search Analytics**: User behavior tracking
- **Error Logging**: Comprehensive error handling
- **Performance Metrics**: Response time tracking

## 🚀 Deployment Architecture

### Development Environment
\`\`\`
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │
│   localhost:3000│    │   localhost:8000│
└─────────────────┘    └─────────────────┘
\`\`\`

### Production Environment
\`\`\`
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   Vercel/Netlify│    │   Railway/Heroku│    │   Supabase      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
\`\`\`

## 🔮 Future Enhancements

### Phase 2 Features
- **Real-time Notifications**: Price drop alerts
- **Multi-modal Search**: Hotels, cars, activities
- **Social Features**: Trip sharing and recommendations
- **Mobile App**: React Native implementation

### Phase 3 Features
- **AI Chatbot**: Conversational booking assistant
- **Predictive Pricing**: ML-based price forecasting
- **Personalization**: User preference learning
- **Voice Interface**: Voice-activated search

## 📊 Technology Stack

### Backend
- **Framework**: FastAPI 0.104+
- **Language**: Python 3.13
- **Database**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-4, LangChain
- **Caching**: Redis (planned)
- **Testing**: pytest, httpx

### Frontend
- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: shadcn/ui
- **State**: Zustand
- **Testing**: Jest, React Testing Library

### DevOps
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **Monitoring**: Sentry
- **Documentation**: Swagger/OpenAPI
