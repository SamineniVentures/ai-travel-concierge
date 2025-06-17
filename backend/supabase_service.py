import os
import json
import hashlib
from typing import List, Dict, Any, Optional
from datetime import datetime, timedelta
from supabase import create_client, Client
from config import settings
from models import User, UserCreate, TravelPlan, TravelPlanCreate, SearchAnalytics, FlightCache

class SupabaseService:
    """Service class for Supabase database operations"""
    
    def __init__(self):
        self.client: Optional[Client] = None
        self._initialize_client()
    
    def _initialize_client(self):
        """Initialize Supabase client"""
        try:
            if settings.supabase_url and settings.supabase_anon_key:
                self.client = create_client(settings.supabase_url, settings.supabase_anon_key)
                print("Supabase client initialized successfully")
            else:
                print("Supabase credentials not found - database features disabled")
                self.client = None
        except Exception as e:
            print(f"Failed to initialize Supabase client: {e}")
            self.client = None
    
    def is_connected(self) -> bool:
        """Check if Supabase client is connected"""
        return self.client is not None
    
    # User Management
    async def create_user(self, user_data: UserCreate) -> Optional[User]:
        """Create a new user"""
        if not self.client:
            return None
        
        try:
            # Hash password before storing
            hashed_password = hashlib.sha256(user_data.password.encode()).hexdigest()
            
            user_dict = user_data.dict()
            user_dict.pop('password')
            user_dict['hashed_password'] = hashed_password
            user_dict['created_at'] = datetime.utcnow().isoformat()
            user_dict['updated_at'] = datetime.utcnow().isoformat()
            
            result = self.client.table('users').insert(user_dict).execute()
            
            if result.data:
                return User(**result.data[0])
            return None
        except Exception as e:
            print(f"Error creating user: {e}")
            return None
    
    async def get_user_by_email(self, email: str) -> Optional[User]:
        """Get user by email"""
        if not self.client:
            return None
        
        try:
            result = self.client.table('users').select('*').eq('email', email).execute()
            if result.data:
                return User(**result.data[0])
            return None
        except Exception as e:
            print(f"Error getting user by email: {e}")
            return None
    
    async def update_user(self, user_id: str, update_data: Dict[str, Any]) -> Optional[User]:
        """Update user information"""
        if not self.client:
            return None
        
        try:
            update_data['updated_at'] = datetime.utcnow().isoformat()
            result = self.client.table('users').update(update_data).eq('id', user_id).execute()
            
            if result.data:
                return User(**result.data[0])
            return None
        except Exception as e:
            print(f"Error updating user: {e}")
            return None
    
    # Flight Cache Management
    async def get_cached_flights(self, search_params: Dict[str, Any]) -> Optional[List[Dict[str, Any]]]:
        """Get cached flight results"""
        if not self.client:
            return None
        
        try:
            cache_key = self._generate_cache_key(search_params)
            result = self.client.table('flight_cache').select('*').eq('cache_key', cache_key).execute()
            
            if result.data and result.data[0]['expires_at'] > datetime.utcnow().isoformat():
                return result.data[0]['flight_data']
            return None
        except Exception as e:
            print(f"Error getting cached flights: {e}")
            return None
    
    async def save_flight_cache(self, search_params: Dict[str, Any], flight_data: List[Dict[str, Any]]) -> bool:
        """Save flight results to cache"""
        if not self.client:
            return False
        
        try:
            cache_key = self._generate_cache_key(search_params)
            expires_at = (datetime.utcnow() + timedelta(hours=settings.cache_ttl_hours)).isoformat()
            
            cache_entry = {
                'cache_key': cache_key,
                'search_params': search_params,
                'flight_data': flight_data,
                'created_at': datetime.utcnow().isoformat(),
                'expires_at': expires_at
            }
            
            # Upsert cache entry
            self.client.table('flight_cache').upsert(cache_entry).execute()
            return True
        except Exception as e:
            print(f"Error saving flight data: {e}")
            return False
    
    def _generate_cache_key(self, search_params: Dict[str, Any]) -> str:
        """Generate a unique cache key for search parameters"""
        # Sort parameters to ensure consistent keys
        sorted_params = dict(sorted(search_params.items()))
        param_string = json.dumps(sorted_params, sort_keys=True)
        return hashlib.md5(param_string.encode()).hexdigest()
    
    # Search Analytics
    async def save_search_analytics(self, analytics: SearchAnalytics) -> bool:
        """Save search analytics"""
        if not self.client:
            return False
        
        try:
            analytics_dict = analytics.dict()
            analytics_dict['timestamp'] = analytics_dict['timestamp'].isoformat()
            
            self.client.table('search_analytics').insert(analytics_dict).execute()
            return True
        except Exception as e:
            print(f"Error saving search analytics: {e}")
            return False
    
    async def get_search_analytics(self, user_id: Optional[str] = None, limit: int = 100) -> List[SearchAnalytics]:
        """Get search analytics"""
        if not self.client:
            return []
        
        try:
            query = self.client.table('search_analytics').select('*').order('timestamp', desc=True).limit(limit)
            
            if user_id:
                query = query.eq('user_id', user_id)
            
            result = query.execute()
            
            analytics = []
            for item in result.data:
                item['timestamp'] = datetime.fromisoformat(item['timestamp'])
                analytics.append(SearchAnalytics(**item))
            
            return analytics
        except Exception as e:
            print(f"Error getting search analytics: {e}")
            return []
    
    # Travel Plans
    async def create_travel_plan(self, user_id: str, plan_data: TravelPlanCreate) -> Optional[TravelPlan]:
        """Create a new travel plan"""
        if not self.client:
            return None
        
        try:
            plan_dict = plan_data.dict()
            plan_dict['user_id'] = user_id
            plan_dict['created_at'] = datetime.utcnow().isoformat()
            plan_dict['updated_at'] = datetime.utcnow().isoformat()
            
            result = self.client.table('travel_plans').insert(plan_dict).execute()
            
            if result.data:
                return TravelPlan(**result.data[0])
            return None
        except Exception as e:
            print(f"Error creating travel plan: {e}")
            return None
    
    async def get_user_travel_plans(self, user_id: str) -> List[TravelPlan]:
        """Get all travel plans for a user"""
        if not self.client:
            return []
        
        try:
            result = self.client.table('travel_plans').select('*').eq('user_id', user_id).order('created_at', desc=True).execute()
            
            plans = []
            for item in result.data:
                item['created_at'] = datetime.fromisoformat(item['created_at'])
                item['updated_at'] = datetime.fromisoformat(item['updated_at'])
                plans.append(TravelPlan(**item))
            
            return plans
        except Exception as e:
            print(f"Error getting travel plans: {e}")
            return []
    
    async def update_travel_plan(self, plan_id: str, update_data: Dict[str, Any]) -> Optional[TravelPlan]:
        """Update a travel plan"""
        if not self.client:
            return None
        
        try:
            update_data['updated_at'] = datetime.utcnow().isoformat()
            result = self.client.table('travel_plans').update(update_data).eq('id', plan_id).execute()
            
            if result.data:
                return TravelPlan(**result.data[0])
            return None
        except Exception as e:
            print(f"Error updating travel plan: {e}")
            return None
    
    async def delete_travel_plan(self, plan_id: str) -> bool:
        """Delete a travel plan"""
        if not self.client:
            return False
        
        try:
            self.client.table('travel_plans').delete().eq('id', plan_id).execute()
            return True
        except Exception as e:
            print(f"Error deleting travel plan: {e}")
            return False

# Global Supabase service instance
supabase_service = SupabaseService()
