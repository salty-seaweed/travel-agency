import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

const COUNTRY_CACHE_KEY = 'user_country_detected';
const COUNTRY_CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

interface CountryCache {
  code: string;
  timestamp: number;
}

/**
 * Hook to detect user's country code
 * Priority:
 * 1. Query parameter ?country=XX (allows override)
 * 2. Cached country from localStorage
 * 3. IP geolocation API
 */
export function useUserCountry(): string | null {
  const [searchParams] = useSearchParams();
  const [countryCode, setCountryCode] = useState<string | null>(null);
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    const detectCountry = async () => {
      // 1. Check query parameter first (highest priority)
      const queryCountry = searchParams.get('country');
      if (queryCountry && queryCountry.length === 2) {
        const upperCountry = queryCountry.toUpperCase();
        setCountryCode(upperCountry);
        setIsDetecting(false);
        // Store in cache for future use
        try {
          localStorage.setItem(COUNTRY_CACHE_KEY, JSON.stringify({
            code: upperCountry,
            timestamp: Date.now(),
          }));
        } catch (e) {
          // Ignore localStorage errors
        }
        return;
      }

      // 2. Check cached country
      try {
        const cached = localStorage.getItem(COUNTRY_CACHE_KEY);
        if (cached) {
          const cacheData: CountryCache = JSON.parse(cached);
          const now = Date.now();
          // Use cache if it's less than 24 hours old
          if (cacheData.code && (now - cacheData.timestamp) < COUNTRY_CACHE_EXPIRY) {
            setCountryCode(cacheData.code.toUpperCase());
            setIsDetecting(false);
            return;
          }
        }
      } catch (e) {
        // Ignore cache errors
      }

      // 3. Try IP geolocation
      try {
        // Use a free geolocation API with HTTPS support
        // ipapi.co provides free tier with HTTPS (45,000 requests/month)
        const response = await fetch('https://ipapi.co/json/', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data.country_code) {
            const detectedCountry = data.country_code.toUpperCase();
            setCountryCode(detectedCountry);
            
            // Cache the result
            try {
              localStorage.setItem(COUNTRY_CACHE_KEY, JSON.stringify({
                code: detectedCountry,
                timestamp: Date.now(),
              }));
            } catch (e) {
              // Ignore localStorage errors
            }
          }
        }
      } catch (error) {
        console.warn('Failed to detect country from IP:', error);
        // Silently fail - country will remain null
      } finally {
        setIsDetecting(false);
      }
    };

    detectCountry();
  }, [searchParams]);

  return countryCode;
}

/**
 * Utility function to get country code without React hook
 * Useful for API calls outside of components
 */
export function getUserCountryFromURL(): string | null {
  if (typeof window === 'undefined') return null;
  
  const params = new URLSearchParams(window.location.search);
  const queryCountry = params.get('country');
  if (queryCountry && queryCountry.length === 2) {
    return queryCountry.toUpperCase();
  }
  
  // Check cache
  try {
    const cached = localStorage.getItem(COUNTRY_CACHE_KEY);
    if (cached) {
      const cacheData: CountryCache = JSON.parse(cached);
      const now = Date.now();
      if (cacheData.code && (now - cacheData.timestamp) < COUNTRY_CACHE_EXPIRY) {
        return cacheData.code.toUpperCase();
      }
    }
  } catch (e) {
    // Ignore errors
  }
  
  return null;
}
