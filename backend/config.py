import os
from typing import Optional
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    """Application settings and configuration"""
    
    # API Configuration
    api_title: str = "AI Travel Concierge"
    api_version: str = "2.0.0"
    api_description: str = "AI-powered travel concierge with LangChain and Supabase integration"
    
    # Server Configuration
    host: str = "0.0.0.0"
    port: int = 8000
    debug: bool = False
    
    # CORS Configuration
    allowed_origins: list = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # OpenAI Configuration
    openai_api_key: Optional[str] = None
    openai_model: str = "gpt-3.5-turbo"
    openai_temperature: float = 0.7
    openai_max_tokens: int = 600
    
    # Supabase Configuration
    supabase_url: Optional[str] = None
    supabase_anon_key: Optional[str] = None
    supabase_service_role_key: Optional[str] = None
    
    # Database Configuration
    database_url: Optional[str] = None
    
    # Security Configuration
    secret_key: str = "your-secret-key-here"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # Cache Configuration
    cache_ttl_hours: int = 24
    max_cache_size: int = 1000
    
    # Rate Limiting
    rate_limit_requests: int = 100
    rate_limit_window: int = 3600  # 1 hour
    
    # Logging Configuration
    log_level: str = "INFO"
    log_format: str = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    
    # Feature Flags
    enable_langchain: bool = True
    enable_supabase: bool = True
    enable_caching: bool = True
    enable_analytics: bool = True
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

# Global settings instance
settings = Settings()

def get_settings() -> Settings:
    """Get application settings"""
    return settings

def validate_environment() -> dict:
    """Validate that all required environment variables are set"""
    errors = []
    warnings = []
    
    # Required for OpenAI
    if not settings.openai_api_key:
        errors.append("OPENAI_API_KEY is required for AI functionality")
    
    # Required for Supabase
    if not settings.supabase_url:
        warnings.append("SUPABASE_URL not set - database features will be disabled")
    
    if not settings.supabase_anon_key:
        warnings.append("SUPABASE_ANON_KEY not set - database features will be disabled")
    
    # Security
    if settings.secret_key == "your-secret-key-here":
        warnings.append("Using default secret key - change SECRET_KEY in production")
    
    return {
        "errors": errors,
        "warnings": warnings,
        "is_valid": len(errors) == 0
    }

def load_environment_variables():
    """Load environment variables from .env file"""
    env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
    
    if os.path.exists(env_file):
        from dotenv import load_dotenv
        load_dotenv(env_file)
        print(f"Loaded environment variables from {env_file}")
    else:
        print("No .env file found, using system environment variables")

# Load environment variables on import
load_environment_variables()
