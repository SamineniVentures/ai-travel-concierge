import { create } from "zustand"
import type { SearchParams } from "@/types"
import { 
  apiService, 
  type FlightSearchResponse, 
  type FlightOption,
  type AIInsightResponse,
  convertSearchParamsToAPI 
} from "@/lib/api"

interface SearchState {
  searchParams: SearchParams | null
  flights: FlightOption[]
  aiInsights: AIInsightResponse | null
  loading: boolean
  error: string | null
  searchId: string | null
  searchMetadata: any | null
  
  // Actions
  setSearchParams: (params: SearchParams) => void
  searchFlights: (params: SearchParams) => Promise<void>
  getAIInsights: (searchId: string) => Promise<void>
  clearResults: () => void
  setError: (error: string | null) => void
}

export const useSearchStore = create<SearchState>((set, get) => ({
  searchParams: null,
  flights: [],
  aiInsights: null,
  loading: false,
  error: null,
  searchId: null,
  searchMetadata: null,

  setSearchParams: (params) => set({ searchParams: params }),

  searchFlights: async (params) => {
    set({ loading: true, error: null });
    
    try {
      // Convert frontend params to API format
      const apiParams = convertSearchParamsToAPI(params);
      
      // Call backend API
      const response: FlightSearchResponse = await apiService.searchFlights(apiParams);
      
      set({
        flights: response.flights,
        searchId: response.search_id,
        searchMetadata: response.search_metadata,
        aiInsights: response.ai_insights || null,
        loading: false,
      });

      // If no AI insights in response, fetch them separately
      if (!response.ai_insights && response.search_id) {
        get().getAIInsights(response.search_id);
      }

    } catch (error) {
      console.error('Flight search failed:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Search failed', 
        loading: false 
      });
    }
  },

  getAIInsights: async (searchId) => {
    try {
      const insights = await apiService.getAIInsights(searchId);
      set({ aiInsights: insights });
    } catch (error) {
      console.error('Failed to fetch AI insights:', error);
      // Don't set error state for AI insights failure as it's not critical
    }
  },

  clearResults: () => set({ 
    flights: [], 
    aiInsights: null, 
    searchId: null, 
    searchMetadata: null,
    error: null 
  }),

  setError: (error) => set({ error }),
}))
