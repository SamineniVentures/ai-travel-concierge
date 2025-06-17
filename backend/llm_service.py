import os
import json
import time
from typing import List, Dict, Any, Optional
from datetime import datetime
from openai import OpenAI
from langchain_openai import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.schema import HumanMessage, SystemMessage
from config import settings
from models import FlightOption, AIInsightRequest, AIInsightResponse

class LLMService:
    """Service class for OpenAI LLM operations using LangChain"""
    
    def __init__(self):
        self.openai_client: Optional[OpenAI] = None
        self.langchain_llm: Optional[ChatOpenAI] = None
        self._initialize_clients()
    
    def _initialize_clients(self):
        """Initialize OpenAI and LangChain clients"""
        try:
            if settings.openai_api_key:
                self.openai_client = OpenAI(api_key=settings.openai_api_key)
                self.langchain_llm = ChatOpenAI(
                    openai_api_key=settings.openai_api_key,
                    model_name=settings.openai_model,
                    temperature=settings.openai_temperature,
                    max_tokens=settings.openai_max_tokens
                )
                print("OpenAI and LangChain clients initialized successfully")
            else:
                print("OpenAI API key not found - AI features disabled")
                self.openai_client = None
                self.langchain_llm = None
        except Exception as e:
            print(f"Failed to initialize OpenAI clients: {e}")
            self.openai_client = None
            self.langchain_llm = None
    
    def is_available(self) -> bool:
        """Check if LLM service is available"""
        return self.openai_client is not None and self.langchain_llm is not None
    
    async def analyze_flight_search(self, request: AIInsightRequest) -> Optional[AIInsightResponse]:
        """Analyze flight search results and provide AI insights"""
        if not self.is_available():
            return None
        
        try:
            # Prepare flight data for analysis
            flight_summary = self._prepare_flight_summary(request.flights)
            
            # Create analysis prompt
            analysis_prompt = self._create_analysis_prompt(
                flight_summary, 
                request.user_preferences, 
                request.context
            )
            
            # Get AI analysis
            analysis = await self._get_flight_analysis(analysis_prompt)
            
            if analysis:
                return AIInsightResponse(
                    search_id=request.search_id,
                    insights=analysis.get('insights', []),
                    recommendations=analysis.get('recommendations', []),
                    price_analysis=analysis.get('price_analysis'),
                    timing_analysis=analysis.get('timing_analysis'),
                    generated_at=datetime.utcnow()
                )
            
            return None
        except Exception as e:
            print(f"Error in flight analysis: {e}")
            return None
    
    def _prepare_flight_summary(self, flights: List[FlightOption]) -> Dict[str, Any]:
        """Prepare flight data summary for AI analysis"""
        if not flights:
            return {}
        
        # Calculate price statistics
        prices = [flight.price for flight in flights]
        min_price = min(prices)
        max_price = max(prices)
        avg_price = sum(prices) / len(prices)
        
        # Analyze flight characteristics
        direct_flights = [f for f in flights if f.stops == 0]
        multi_stop_flights = [f for f in flights if f.stops > 0]
        
        # Get unique airlines
        airlines = list(set([
            segment.carrier 
            for flight in flights 
            for segment in flight.outbound_segments
        ]))
        
        return {
            'total_flights': len(flights),
            'price_range': {
                'min': min_price,
                'max': max_price,
                'average': round(avg_price, 2)
            },
            'flight_types': {
                'direct': len(direct_flights),
                'multi_stop': len(multi_stop_flights)
            },
            'airlines': airlines,
            'sample_flights': [
                {
                    'price': flight.price,
                    'stops': flight.stops,
                    'duration': flight.total_duration,
                    'carriers': [s.carrier for s in flight.outbound_segments]
                }
                for flight in flights[:5]  # Top 5 flights for analysis
            ]
        }
    
    def _create_analysis_prompt(self, flight_summary: Dict[str, Any], 
                              user_preferences: Optional[Dict[str, Any]], 
                              context: Optional[str]) -> str:
        """Create a comprehensive prompt for flight analysis"""
        
        prompt = f"""
You are an expert travel advisor analyzing flight search results. Provide insights and recommendations based on the following data:

FLIGHT SEARCH SUMMARY:
{json.dumps(flight_summary, indent=2)}

USER PREFERENCES:
{json.dumps(user_preferences or {}, indent=2)}

ADDITIONAL CONTEXT:
{context or "No additional context provided"}

Please provide a comprehensive analysis including:

1. PRICE INSIGHTS:
- Price range analysis
- Value for money assessment
- Price trends and recommendations

2. FLIGHT OPTIONS ANALYSIS:
- Direct vs connecting flight analysis
- Airline diversity assessment
- Duration and convenience factors

3. RECOMMENDATIONS:
- Top 3 flight recommendations with reasoning
- Alternative suggestions
- Booking timing advice

4. TRAVEL TIPS:
- Best practices for this route
- Seasonal considerations
- Additional cost considerations

Format your response as a JSON object with the following structure:
{{
    "insights": ["insight1", "insight2", "insight3"],
    "recommendations": ["recommendation1", "recommendation2", "recommendation3"],
    "price_analysis": {{
        "price_range_quality": "good/average/poor",
        "value_assessment": "description",
        "price_trends": "description"
    }},
    "timing_analysis": {{
        "best_booking_time": "description",
        "seasonal_factors": "description",
        "flexibility_benefits": "description"
    }}
}}

Be concise, practical, and actionable in your advice.
"""
        return prompt
    
    async def _get_flight_analysis(self, prompt: str) -> Optional[Dict[str, Any]]:
        """Get AI analysis using LangChain"""
        try:
            # Create messages for LangChain
            messages = [
                SystemMessage(content="You are an expert travel advisor with deep knowledge of flight booking, pricing, and travel optimization."),
                HumanMessage(content=prompt)
            ]
            
            # Get response from LangChain
            response = await self.langchain_llm.ainvoke(messages)
            
            # Parse JSON response
            try:
                analysis = json.loads(response.content)
                return analysis
            except json.JSONDecodeError:
                # If JSON parsing fails, try to extract structured information
                return self._parse_text_response(response.content)
                
        except Exception as e:
            print(f"Error getting flight analysis: {e}")
            return None
    
    def _parse_text_response(self, text: str) -> Dict[str, Any]:
        """Parse text response when JSON parsing fails"""
        # Fallback parsing for non-JSON responses
        insights = []
        recommendations = []
        
        lines = text.split('\n')
        for line in lines:
            line = line.strip()
            if line.startswith('-') or line.startswith('•'):
                if 'recommend' in line.lower() or 'suggest' in line.lower():
                    recommendations.append(line[1:].strip())
                else:
                    insights.append(line[1:].strip())
        
        return {
            'insights': insights[:3],  # Top 3 insights
            'recommendations': recommendations[:3],  # Top 3 recommendations
            'price_analysis': {
                'price_range_quality': 'average',
                'value_assessment': 'Analysis available in text response',
                'price_trends': 'Check full response for details'
            },
            'timing_analysis': {
                'best_booking_time': 'Check full response for details',
                'seasonal_factors': 'Check full response for details',
                'flexibility_benefits': 'Check full response for details'
            }
        }
    
    async def generate_travel_recommendations(self, destination: str, 
                                           preferences: Optional[Dict[str, Any]] = None) -> List[str]:
        """Generate personalized travel recommendations for a destination"""
        if not self.is_available():
            return []
        
        try:
            prompt = f"""
You are a travel expert providing recommendations for {destination}.

USER PREFERENCES:
{json.dumps(preferences or {}, indent=2)}

Please provide 5 personalized recommendations for this destination, considering:
- Local attractions and activities
- Cultural experiences
- Food and dining
- Transportation tips
- Best times to visit

Format as a simple list of recommendations.
"""
            
            messages = [
                SystemMessage(content="You are an expert travel advisor specializing in destination recommendations."),
                HumanMessage(content=prompt)
            ]
            
            response = await self.langchain_llm.ainvoke(messages)
            
            # Parse recommendations from response
            recommendations = []
            lines = response.content.split('\n')
            for line in lines:
                line = line.strip()
                if line and (line.startswith('-') or line.startswith('•') or line[0].isdigit()):
                    recommendations.append(line.lstrip('-•123456789. '))
            
            return recommendations[:5]  # Return top 5 recommendations
            
        except Exception as e:
            print(f"Error generating travel recommendations: {e}")
            return []
    
    async def analyze_travel_budget(self, destination: str, duration: int, 
                                  budget: float) -> Dict[str, Any]:
        """Analyze travel budget and provide cost breakdown"""
        if not self.is_available():
            return {}
        
        try:
            prompt = f"""
You are a travel budget expert. Analyze the budget for a {duration}-day trip to {destination} with a budget of ${budget}.

Please provide a detailed budget breakdown including:
- Accommodation costs
- Food and dining
- Transportation
- Activities and attractions
- Miscellaneous expenses

Also provide:
- Budget feasibility assessment
- Cost-saving tips
- Recommended budget adjustments

Format as JSON with the following structure:
{{
    "budget_breakdown": {{
        "accommodation": {{"estimated_cost": 0, "percentage": 0}},
        "food": {{"estimated_cost": 0, "percentage": 0}},
        "transportation": {{"estimated_cost": 0, "percentage": 0}},
        "activities": {{"estimated_cost": 0, "percentage": 0}},
        "miscellaneous": {{"estimated_cost": 0, "percentage": 0}}
    }},
    "feasibility": "feasible/tight/insufficient",
    "cost_saving_tips": ["tip1", "tip2", "tip3"],
    "recommendations": ["recommendation1", "recommendation2"]
}}
"""
            
            messages = [
                SystemMessage(content="You are an expert travel budget analyst."),
                HumanMessage(content=prompt)
            ]
            
            response = await self.langchain_llm.ainvoke(messages)
            
            try:
                return json.loads(response.content)
            except json.JSONDecodeError:
                return {
                    'budget_breakdown': {},
                    'feasibility': 'analysis_available',
                    'cost_saving_tips': ['Check full response for detailed analysis'],
                    'recommendations': ['Review complete budget analysis in response']
                }
                
        except Exception as e:
            print(f"Error analyzing travel budget: {e}")
            return {}

# Global LLM service instance
llm_service = LLMService()
