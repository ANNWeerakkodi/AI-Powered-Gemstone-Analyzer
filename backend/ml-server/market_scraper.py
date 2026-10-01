import requests
from bs4 import BeautifulSoup
import logging
from typing import Tuple, Optional

logger = logging.getLogger(__name__)

# Mock cache to prevent excessive requests
_price_cache = {}

def scrape_gemval_price_range(gemstone_name: str) -> Optional[Tuple[float, float]]:
    """
    Scrapes real market values for a given gemstone from Gemval or similar sources.
    Returns a tuple of (min_price, max_price) in USD per carat.
    Returns None if scraping fails.
    """
    gem_key = gemstone_name.lower().replace(' ', '-')
    
    if gem_key in _price_cache:
        return _price_cache[gem_key]

    # Note: Gemval heavily restricts scraping without a session/subscription.
    # This acts as a best-effort structural scraper or placeholder logic.
    url = f"https://www.gemval.com/chart/{gem_key}/"
    
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
    
    try:
        response = requests.get(url, headers=headers, timeout=5)
        response.raise_for_status()
        
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Hypothetical DOM traversal - highly dependent on Gemval's actual DOM
        # We would look for value ranges. As a fallback, we parse the text for $ signs.
        price_elements = soup.find_all(string=lambda t: t and '$' in t)
        
        prices = []
        for p in price_elements:
            try:
                # Clean and extract numbers like $1,200
                val_str = p.replace('$', '').replace(',', '').strip()
                # Find digits
                import re
                match = re.search(r'\d+(?:\.\d+)?', val_str)
                if match:
                    prices.append(float(match.group()))
            except ValueError:
                continue
                
        if prices:
            prices.sort()
            # Filter outliers if needed, or take reasonable min/max
            min_p = prices[0]
            max_p = prices[-1]
            
            # Sanity check
            if max_p > min_p and max_p < 100000:
                _price_cache[gem_key] = (min_p, max_p)
                return (min_p, max_p)
                
    except Exception as e:
        logger.warning(f"Failed to scrape market data for {gemstone_name}: {str(e)}")
        
    return None
