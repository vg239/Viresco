import redis
from typing import Optional, Dict, Any
import json

class RedisClient:
    def __init__(self):
        try:
            self.redis_client = redis.Redis(
                host='localhost',
                port=6379,
                decode_responses=True
            )
            # Test connection
            self.redis_client.ping()
        except redis.ConnectionError as e:
            print(f"Failed to connect to Redis: {e}")
            raise

    def set_portfolio(self, wallet_address: str, portfolio_data: Dict[str, Any]) -> bool:
        try:
            if not wallet_address:
                raise ValueError("Wallet address cannot be empty")
            return self.redis_client.set(
                wallet_address,
                json.dumps(portfolio_data)
            )
        except Exception as e:
            print(f"Error setting portfolio: {e}")
            return False

    def get_portfolio(self, wallet_address: str) -> Optional[Dict[str, Any]]:
        try:
            if not wallet_address:
                raise ValueError("Wallet address cannot be empty")
            data = self.redis_client.get(wallet_address)
            return json.loads(data) if data else None
        except Exception as e:
            print(f"Error getting portfolio: {e}")
            return None

    def update_portfolio_section(self, wallet_address: str, section: str, section_data: list) -> bool:
        try:
            if not wallet_address:
                raise ValueError("Wallet address cannot be empty")
            
            # Get existing portfolio
            portfolio = self.get_portfolio(wallet_address)
            if not portfolio:
                return False
            
            # Update specific section
            portfolio[section] = section_data
            
            # Save updated portfolio
            return self.set_portfolio(wallet_address, portfolio)
        except Exception as e:
            print(f"Error updating portfolio section: {e}")
            return False

# Create a singleton instance
redis_client = RedisClient()
