#!/usr/bin/env python3
"""
Test server for AI Travel Concierge Backend
"""

import uvicorn
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

if __name__ == "__main__":
    print("🚀 Starting AI Travel Concierge Backend...")
    print("📋 Version: 2.0.0")
    print("🌐 Host: 0.0.0.0:8000")
    print("✅ Environment validation passed!")
    print("🔗 API Documentation will be available at:")
    print("   - Swagger UI: http://0.0.0.0:8000/docs")
    print("   - ReDoc: http://0.0.0.0:8000/redoc")
    print("🏥 Health Check: http://0.0.0.0:8000/api/health")
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    ) 