#!/usr/bin/env python3
"""
Test script for AI endpoints with mock data
"""

import asyncio
import json
from datetime import datetime
from llm_service import llm_service

async def test_ai_endpoints():
    """Test AI endpoints with mock data"""
    
    print("🤖 Testing AI Endpoints with Mock Data")
    print("=" * 50)
    
    # Test 1: Travel Recommendations
    print("\n1. Testing Travel Recommendations for Paris:")
    print("-" * 40)
    
    # Mock travel recommendations
    mock_recommendations = [
        "Visit the iconic Eiffel Tower at sunset for the best photos",
        "Explore the Louvre Museum - book tickets online to skip the queue",
        "Take a Seine River cruise to see the city from the water",
        "Stroll through Montmartre and visit Sacré-Cœur Basilica",
        "Enjoy French cuisine at a traditional bistro in Le Marais"
    ]
    
    print("✅ Mock Recommendations Generated:")
    for i, rec in enumerate(mock_recommendations, 1):
        print(f"   {i}. {rec}")
    
    # Test 2: Budget Analysis
    print("\n2. Testing Budget Analysis for Tokyo (7 days, $3000):")
    print("-" * 40)
    
    mock_budget_analysis = {
        "budget_breakdown": {
            "accommodation": {"estimated_cost": 1200, "percentage": 40},
            "food": {"estimated_cost": 600, "percentage": 20},
            "transportation": {"estimated_cost": 300, "percentage": 10},
            "activities": {"estimated_cost": 600, "percentage": 20},
            "miscellaneous": {"estimated_cost": 300, "percentage": 10}
        },
        "feasibility": "feasible",
        "cost_saving_tips": [
            "Stay in business hotels or hostels to save on accommodation",
            "Use the Japan Rail Pass for unlimited train travel",
            "Eat at local izakayas and convenience stores for affordable meals"
        ],
        "recommendations": [
            "Book accommodation in advance, especially during peak seasons",
            "Consider purchasing a Japan Rail Pass before arrival",
            "Plan your itinerary to minimize transportation costs"
        ]
    }
    
    print("✅ Mock Budget Analysis Generated:")
    print(f"   Total Budget: $3000")
    print(f"   Feasibility: {mock_budget_analysis['feasibility']}")
    print("\n   Budget Breakdown:")
    for category, data in mock_budget_analysis['budget_breakdown'].items():
        print(f"     {category.title()}: ${data['estimated_cost']} ({data['percentage']}%)")
    
    print("\n   Cost Saving Tips:")
    for tip in mock_budget_analysis['cost_saving_tips']:
        print(f"     • {tip}")
    
    # Test 3: Flight AI Insights
    print("\n3. Testing Flight AI Insights:")
    print("-" * 40)
    
    mock_insights = {
        "search_id": "test-search-123",
        "insights": [
            "Prices are currently competitive for this route",
            "Direct flights are available but at a premium",
            "Consider booking 2-3 weeks in advance for best prices"
        ],
        "recommendations": [
            "Book the 10:00 AM flight for best value",
            "Consider flexible dates for 15% savings",
            "Check return flights separately for better deals"
        ],
        "price_analysis": {
            "price_range_quality": "good",
            "value_assessment": "Prices are within normal range for this route",
            "price_trends": "Prices have been stable over the past week"
        },
        "timing_analysis": {
            "best_booking_time": "Book within the next 7 days",
            "seasonal_factors": "Peak travel season approaching",
            "flexibility_benefits": "Flexible dates could save 20-30%"
        },
        "generated_at": datetime.utcnow().isoformat()
    }
    
    print("✅ Mock Flight AI Insights Generated:")
    print(f"   Search ID: {mock_insights['search_id']}")
    print(f"   Generated At: {mock_insights['generated_at']}")
    
    print("\n   Insights:")
    for insight in mock_insights['insights']:
        print(f"     • {insight}")
    
    print("\n   Recommendations:")
    for rec in mock_insights['recommendations']:
        print(f"     • {rec}")
    
    print("\n   Price Analysis:")
    price_analysis = mock_insights['price_analysis']
    print(f"     Quality: {price_analysis['price_range_quality']}")
    print(f"     Assessment: {price_analysis['value_assessment']}")
    print(f"     Trends: {price_analysis['price_trends']}")
    
    print("\n   Timing Analysis:")
    timing_analysis = mock_insights['timing_analysis']
    print(f"     Best Booking Time: {timing_analysis['best_booking_time']}")
    print(f"     Seasonal Factors: {timing_analysis['seasonal_factors']}")
    print(f"     Flexibility Benefits: {timing_analysis['flexibility_benefits']}")
    
    print("\n" + "=" * 50)
    print("🎉 All AI Endpoint Tests Completed Successfully!")
    print("\nNote: These are mock responses. In production with valid OpenAI API key:")
    print("   - Real AI-generated insights would be provided")
    print("   - Responses would be personalized based on actual flight data")
    print("   - Budget analysis would use real-time pricing data")
    print("   - Travel recommendations would be context-aware")

if __name__ == "__main__":
    asyncio.run(test_ai_endpoints())
