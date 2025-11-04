"""
Utility functions for IP geolocation and country detection
"""
import logging
from typing import Optional

logger = logging.getLogger(__name__)


def get_client_ip(request) -> Optional[str]:
    """
    Extract the client's IP address from the request.
    Handles proxy headers like X-Forwarded-For and CF-Connecting-IP.
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        # X-Forwarded-For can contain multiple IPs, take the first one
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        # Try Cloudflare header
        ip = request.META.get('HTTP_CF_CONNECTING_IP') or request.META.get('REMOTE_ADDR')
    return ip


def get_country_from_ip(ip_address: str) -> Optional[str]:
    """
    Get country code from IP address using a geolocation service.
    
    This uses ip-api.com (free tier) for geolocation.
    You can replace this with other services like:
    - ipapi.co
    - ipgeolocation.io
    - MaxMind GeoIP2
    
    Args:
        ip_address: The IP address to look up
        
    Returns:
        ISO 3166-1 alpha-2 country code (e.g., 'US', 'GB') or None if not found
    """
    if not ip_address or ip_address == '127.0.0.1' or ip_address.startswith('192.168.'):
        # Local/private IP, return None
        return None
    
    try:
        import requests
        from django.conf import settings
        
        # Use ip-api.com free tier (no API key required for basic usage)
        # Rate limit: 45 requests/minute
        url = f'http://ip-api.com/json/{ip_address}?fields=status,countryCode'
        
        response = requests.get(url, timeout=2)
        if response.status_code == 200:
            data = response.json()
            if data.get('status') == 'success':
                return data.get('countryCode')
    except Exception as e:
        logger.warning(f"Failed to get country from IP {ip_address}: {str(e)}")
    
    return None


def get_user_country(request) -> Optional[str]:
    """
    Get the user's country code from the request.
    
    This function tries multiple methods in order:
    1. Query parameter 'country' (allows user override)
    2. Session variable 'user_country'
    3. IP geolocation
    
    Args:
        request: Django request object
        
    Returns:
        ISO 3166-1 alpha-2 country code or None
    """
    # 1. Check query parameter (allows user to override)
    country_code = request.GET.get('country', '').upper()
    if country_code and len(country_code) == 2:
        return country_code
    
    # 2. Check session
    country_code = request.session.get('user_country')
    if country_code:
        return country_code.upper()
    
    # 3. Try IP geolocation
    ip_address = get_client_ip(request)
    if ip_address:
        country_code = get_country_from_ip(ip_address)
        if country_code:
            # Store in session for future requests
            request.session['user_country'] = country_code
            return country_code
    
    return None


def is_country_allowed(country_code: Optional[str], allowed_countries: list, restricted_regions: list = None) -> bool:
    """
    Check if a country code is in the allowed list.
    
    Args:
        country_code: ISO 3166-1 alpha-2 country code
        allowed_countries: List of allowed country codes
        restricted_regions: Optional list of region names (not currently used)
        
    Returns:
        True if country is allowed, False otherwise
        If allowed_countries is empty, returns True (visible to all)
        If country_code is None, returns False
    """
    # If no restrictions, allow all
    if not allowed_countries:
        return True
    
    # If no country code provided, deny access (conservative approach)
    if not country_code:
        return False
    
    # Check if country is in allowed list
    return country_code.upper() in [c.upper() for c in allowed_countries]
