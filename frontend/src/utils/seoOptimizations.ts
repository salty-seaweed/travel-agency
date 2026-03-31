/**
 * SEO and Performance Optimization Utilities
 */

// Critical resource hints for better performance
export const addResourceHints = () => {
  const head = document.head;

  // Preconnect to critical domains
  const preconnectDomains = [
    'https://fonts.googleapis.com',
    'https://fonts.gstatic.com',
    'https://images.unsplash.com',
    'https://api.threadtravels.com'
  ];

  preconnectDomains.forEach(domain => {
    if (!document.querySelector(`link[href="${domain}"]`)) {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = domain;
      if (domain.includes('gstatic')) {
        link.crossOrigin = 'anonymous';
      }
      head.appendChild(link);
    }
  });

  // DNS prefetch for additional domains
  const dnsPrefetchDomains = [
    'https://www.google-analytics.com',
    'https://www.googletagmanager.com'
  ];

  dnsPrefetchDomains.forEach(domain => {
    if (!document.querySelector(`link[href="${domain}"][rel="dns-prefetch"]`)) {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      head.appendChild(link);
    }
  });
};

// Optimize images for better loading
export const optimizeImageLoading = () => {
  // Add loading="lazy" to images that don't have it
  const images = document.querySelectorAll('img:not([loading])');
  images.forEach((img, index) => {
    // First few images should load eagerly (above fold)
    if (index < 3) {
      img.setAttribute('loading', 'eager');
    } else {
      img.setAttribute('loading', 'lazy');
    }
    
    // Add decoding attribute for better performance
    img.setAttribute('decoding', 'async');
  });
};

// Add structured data for better SEO
export const addOrganizationStructuredData = () => {
  const existingScript = document.querySelector('script[type="application/ld+json"][data-type="organization"]');
  if (existingScript) return;

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Thread Travels & Tours",
    "url": "https://threadtravels.com",
    "logo": {
      "@type": "ImageObject",
      "url": "https://threadtravels.com/logo.png"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+9607441097",
      "contactType": "customer service",
      "availableLanguage": ["English", "Dhivehi"],
      "areaServed": "MV"
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Male",
      "addressCountry": "MV"
    },
    "sameAs": [
      "https://www.facebook.com/threadtravels",
      "https://www.instagram.com/threadtravels"
    ],
    "description": "Thread Travels & Tours is your trusted Maldives travel partner, offering budget-friendly island packages and multi-island adventures that let you experience paradise without breaking the bank.",
    "foundingDate": "2020",
    "numberOfEmployees": "10-50",
    "priceRange": "$$-$$$",
    "currenciesAccepted": ["USD", "MVR"],
    "paymentAccepted": ["Credit Card", "Bank Transfer", "Cash"],
    "serviceArea": {
      "@type": "Country",
      "name": "Maldives"
    }
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-type', 'organization');
  script.textContent = JSON.stringify(organizationData);
  document.head.appendChild(script);
};

// Add website structured data
export const addWebsiteStructuredData = () => {
  const existingScript = document.querySelector('script[type="application/ld+json"][data-type="website"]');
  if (existingScript) return;

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Thread Travels & Tours",
    "url": "https://threadtravels.com",
    "description": "Discover the best Maldives travel experiences with Thread Travels & Tours. Luxury resorts, authentic adventures, and personalized service.",
    "publisher": {
      "@type": "Organization",
      "name": "Thread Travels & Tours"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://threadtravels.com/packages?search={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "inLanguage": ["en", "dv"],
    "copyrightYear": new Date().getFullYear(),
    "genre": "Travel and Tourism"
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.setAttribute('data-type', 'website');
  script.textContent = JSON.stringify(websiteData);
  document.head.appendChild(script);
};

/** Webfonts use Google Fonts link in index.html with display=swap. */
export const optimizeFontLoading = () => {};

// Add meta tags for better SEO if missing
export const addMissingMetaTags = () => {
  const metaTags = [
    { name: 'format-detection', content: 'telephone=yes' },
    { name: 'theme-color', content: '#1e40af' },
    { name: 'msapplication-TileColor', content: '#1e40af' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'mobile-web-app-capable', content: 'yes' },
    { property: 'og:locale', content: 'en_US' },
    { property: 'og:site_name', content: 'Thread Travels & Tours' },
    { name: 'twitter:site', content: '@threadtravels' },
    { name: 'twitter:creator', content: '@threadtravels' },
    { name: 'geo.region', content: 'MV' },
    { name: 'geo.placename', content: 'Maldives' },
    { name: 'geo.position', content: '3.2028;73.2207' },
    { name: 'ICBM', content: '3.2028, 73.2207' }
  ];

  metaTags.forEach(tag => {
    const selector = tag.name 
      ? `meta[name="${tag.name}"]` 
      : `meta[property="${tag.property}"]`;
    
    if (!document.querySelector(selector)) {
      const meta = document.createElement('meta');
      if (tag.name) {
        meta.name = tag.name;
      } else if (tag.property) {
        meta.setAttribute('property', tag.property);
      }
      meta.content = tag.content;
      document.head.appendChild(meta);
    }
  });
};

// Monitor Core Web Vitals
export const monitorCoreWebVitals = () => {
  if (typeof window !== 'undefined' && 'performance' in window) {
    // Monitor Largest Contentful Paint (LCP)
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1];
      console.log('LCP:', lastEntry.startTime);
    });
    
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // Fallback for browsers that don't support LCP
      console.warn('LCP monitoring not supported');
    }

    // Monitor First Input Delay (FID)
    const fidObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        console.log('FID:', entry.processingStart - entry.startTime);
      });
    });

    try {
      fidObserver.observe({ entryTypes: ['first-input'] });
    } catch (e) {
      console.warn('FID monitoring not supported');
    }

    // Monitor Cumulative Layout Shift (CLS)
    let clsValue = 0;
    const clsObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      console.log('CLS:', clsValue);
    });

    try {
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    } catch (e) {
      console.warn('CLS monitoring not supported');
    }
  }
};

// Initialize all SEO optimizations
export const initializeSEOOptimizations = () => {
  // Run immediately
  addResourceHints();
  addMissingMetaTags();
  optimizeFontLoading();
  
  // Run after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      optimizeImageLoading();
      addOrganizationStructuredData();
      addWebsiteStructuredData();
    });
  } else {
    optimizeImageLoading();
    addOrganizationStructuredData();
    addWebsiteStructuredData();
  }

  // Run after load
  window.addEventListener('load', () => {
    monitorCoreWebVitals();
  });
};

// Package-specific structured data generator
export const generatePackageStructuredData = (packageData: any) => {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": packageData.name,
    "description": packageData.description,
    "image": packageData.images?.[0]?.image,
    "url": `https://threadtravels.com/packages/${packageData.id}`,
    "provider": {
      "@type": "TravelAgency",
      "name": "Thread Travels & Tours",
      "url": "https://threadtravels.com"
    },
    "touristType": "Leisure",
    "itinerary": packageData.destinations?.map((dest: any, index: number) => ({
      "@type": "TouristDestination",
      "name": dest.name,
      "description": dest.description,
      "position": index + 1
    })),
    "offers": {
      "@type": "Offer",
      "price": packageData.price_from,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock",
      "validFrom": new Date().toISOString(),
      "priceValidUntil": new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
    },
    "duration": packageData.duration ? `P${packageData.duration}D` : undefined,
    "startDate": packageData.start_date,
    "endDate": packageData.end_date
  };
};

export default {
  addResourceHints,
  optimizeImageLoading,
  addOrganizationStructuredData,
  addWebsiteStructuredData,
  optimizeFontLoading,
  addMissingMetaTags,
  monitorCoreWebVitals,
  initializeSEOOptimizations,
  generatePackageStructuredData
};
