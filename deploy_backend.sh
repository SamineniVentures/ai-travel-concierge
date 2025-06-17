#!/bin/bash

echo "🚀 Deploying AI Travel Concierge Backend..."

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "📦 Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment
echo "🔧 Activating virtual environment..."
source venv/bin/activate

# Install dependencies
echo "📥 Installing dependencies..."
pip install -r requirements.txt

# Navigate to backend directory
cd backend

# Check if .env file exists
if [ ! -f "../.env" ]; then
    echo "⚠️  Warning: .env file not found. Please create one with your API keys."
    echo "Required environment variables:"
    echo "  - OPENAI_API_KEY"
    echo "  - SUPABASE_URL"
    echo "  - SUPABASE_KEY"
fi

# Start the server
echo "🌐 Starting FastAPI server..."
echo "📋 API Documentation: http://localhost:8000/docs"
echo "🏥 Health Check: http://localhost:8000/api/health"
echo "🔍 Flight Search: http://localhost:8000/api/search-flights"
echo ""
echo "Press Ctrl+C to stop the server"

uvicorn main:app --host 0.0.0.0 --port 8000 --reload
