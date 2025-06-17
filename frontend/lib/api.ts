// API service for backend integration

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface FlightSearchRequest {
  origin: string;
  destination: string;
  departure_date: string;
  return_date?: string;
  adults: number;
  children: number;
  infants: number;
  cabin_class: 'economy' | 'business' | 'first';
  trip_type: 'one_way' | 'round_trip';
  currency: string;
}

export interface FlightSegment {
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  carrier: string;
  flight_number: string;
  duration: string;
  stops: number;
}

export interface FlightOption {
  id: string;
  price: number;
  currency: string;
  outbound_segments: FlightSegment[];
  inbound_segments?: FlightSegment[];
  total_duration: string;
  stops: number;
  cabin_class: string;
  booking_link: string;
  airline_logo?: string;
}

export interface FlightSearchResponse {
  search_id: string;
  flights: FlightOption[];
  search_metadata: {
    search_id: string;
    origin: string;
    destination: string;
    departure_date: string;
    return_date?: string;
    passengers: {
      adults: number;
      children: number;
      infants: number;
    };
    cabin_class: string;
    trip_type: string;
    currency: string;
    search_duration_ms: number;
    results_count: number;
    cached: boolean;
  };
  ai_insights?: AIInsightResponse;
}

export interface AIInsightResponse {
  search_id: string;
  insights: string[];
  recommendations: string[];
  price_analysis: {
    price_range_quality: string;
    value_assessment: string;
    price_trends: string;
  };
  timing_analysis: {
    best_booking_time: string;
    seasonal_factors: string;
    flexibility_benefits: string;
  };
  generated_at: string;
}

export interface TravelRecommendation {
  destination: string;
  recommendations: string[];
  generated_at: string;
}

export interface BudgetAnalysis {
  destination: string;
  duration: number;
  budget: number;
  analysis: {
    budget_breakdown: {
      accommodation: { estimated_cost: number; percentage: number };
      food: { estimated_cost: number; percentage: number };
      transportation: { estimated_cost: number; percentage: number };
      activities: { estimated_cost: number; percentage: number };
      miscellaneous: { estimated_cost: number; percentage: number };
    };
    feasibility: string;
    cost_saving_tips: string[];
    recommendations: string[];
  };
  generated_at: string;
}

export interface HealthCheck {
  status: string;
  version: string;
  timestamp: string;
  services: {
    api: string;
    supabase: string;
    openai: string;
  };
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Health check
  async getHealth(): Promise<HealthCheck> {
    return this.request<HealthCheck>('/api/health');
  }

  // Flight search
  async searchFlights(params: FlightSearchRequest): Promise<FlightSearchResponse> {
    return this.request<FlightSearchResponse>('/api/search-flights', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  }

  // Get AI insights for a search
  async getAIInsights(searchId: string): Promise<AIInsightResponse> {
    return this.request<AIInsightResponse>(`/api/ai-insights/${searchId}`);
  }

  // Get travel recommendations
  async getTravelRecommendations(destination: string): Promise<TravelRecommendation> {
    return this.request<TravelRecommendation>(`/api/travel-recommendations/${destination}`);
  }

  // Analyze travel budget
  async analyzeBudget(destination: string, duration: number, budget: number): Promise<BudgetAnalysis> {
    const params = new URLSearchParams({
      destination,
      duration: duration.toString(),
      budget: budget.toString(),
    });
    
    return this.request<BudgetAnalysis>(`/api/budget-analysis?${params}`);
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Helper function to convert frontend search params to API format
export function convertSearchParamsToAPI(
  searchParams: any,
  cabinClass: 'economy' | 'business' | 'first' = 'economy',
  tripType: 'one_way' | 'round_trip' = 'round_trip'
): FlightSearchRequest {
  const travellers = parseInt(searchParams.travellers || '1');
  
  return {
    origin: searchParams.origin || 'NYC', // Default fallback
    destination: searchParams.destination,
    departure_date: searchParams.departureDate,
    return_date: searchParams.returnDate,
    adults: travellers,
    children: 0,
    infants: 0,
    cabin_class: cabinClass,
    trip_type: tripType,
    currency: 'USD',
  };
} 