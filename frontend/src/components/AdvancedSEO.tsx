import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

interface AdvancedSEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product' | 'service';
  structuredData?: object | object[];
  breadcrumbs?: Array<{ name: string; url: string }>;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  locale?: string;
  alternateLocales?: Array<{ locale: string; url: string }>;
  price?: {
    amount: number;
    currency: string;
    availability?: 'InStock' | 'OutOfStock' | 'PreOrder';
  };
  rating?: {
    value: number;
    count: number;
    bestRating?: number;
    worstRating?: number;
  };
  organization?: {
    name: string;
    logo: string;
    url: string;
    contactPoint?: {
      telephone: string;
      email: string;
      contactType: string;
    };
  };
}

export const AdvancedSEO: React.FC<AdvancedSEOProps> = ({
  title,
  description,
  keywords,
  image,
  url,
  type = 'website',
  structuredData,
  breadcrumbs,
  author,
  publishedTime,
  modifiedTime,
  locale = 'en_US',
  alternateLocales,
  price,
  rating,
  organization
}) => {
  const location = useLocation();
  const currentUrl = url || `https://threadtravels.com${location.pathname}`;
  const fullTitle = `${title} | Thread Travels & Tours`;
  const defaultImage = 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&h=630&fit=crop';
  const imageUrl = image || defaultImage;

  // Default organization data
  const defaultOrganization = organization || {
    name: 'Thread Travels & Tours',
    logo: 'https://threadtravels.com/logo.png',
    url: 'https://threadtravels.com',
    contactPoint: {
      telephone: '+9607441097',
      email: 'support@threadtravels.com',
      contactType: 'customer service'
    }
  };

  // Generate breadcrumb structured data
  const breadcrumbStructuredData = breadcrumbs && breadcrumbs.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": crumb.name,
      "item": crumb.url
    }))
  } : null;

  // Generate organization structured data
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": defaultOrganization.name,
    "url": defaultOrganization.url,
    "logo": {
      "@type": "ImageObject",
      "url": defaultOrganization.logo
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": defaultOrganization.contactPoint?.telephone,
      "email": defaultOrganization.contactPoint?.email,
      "contactType": defaultOrganization.contactPoint?.contactType,
      "availableLanguage": ["English", "Dhivehi"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Male",
      "addressCountry": "MV"
    },
    "sameAs": [
      "https://www.facebook.com/threadtravels",
      "https://www.instagram.com/threadtravels"
    ]
  };

  // Generate product/service structured data for packages
  const productStructuredData = price ? {
    "@context": "https://schema.org",
    "@type": type === 'product' ? 'Product' : 'Service',
    "name": title,
    "description": description,
    "image": imageUrl,
    "url": currentUrl,
    "provider": defaultOrganization.name,
    "offers": {
      "@type": "Offer",
      "price": price.amount,
      "priceCurrency": price.currency,
      "availability": `https://schema.org/${price.availability || 'InStock'}`,
      "url": currentUrl
    },
    ...(rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": rating.value,
        "reviewCount": rating.count,
        "bestRating": rating.bestRating || 5,
        "worstRating": rating.worstRating || 1
      }
    })
  } : null;

  // Combine all structured data
  const allStructuredData = [
    organizationStructuredData,
    breadcrumbStructuredData,
    productStructuredData,
    ...(Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : [])
  ].filter(Boolean);

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {author && <meta name="author" content={author} />}
      <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <link rel="canonical" href={currentUrl} />
      
      {/* Advanced Meta Tags */}
      <meta name="theme-color" content="#1e40af" />
      <meta name="msapplication-TileColor" content="#1e40af" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="format-detection" content="telephone=yes" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={title} />
      <meta property="og:site_name" content="Thread Travels & Tours" />
      <meta property="og:locale" content={locale} />
      {alternateLocales?.map(alt => (
        <meta key={alt.locale} property="og:locale:alternate" content={alt.locale} />
      ))}
      
      {/* Article specific OG tags */}
      {type === 'article' && (
        <>
          {author && <meta property="article:author" content={author} />}
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          <meta property="article:section" content="Travel" />
          <meta property="article:tag" content="Maldives, Travel, Tourism" />
        </>
      )}
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content={title} />
      <meta name="twitter:site" content="@threadtravels" />
      <meta name="twitter:creator" content="@threadtravels" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="geo.region" content="MV" />
      <meta name="geo.placename" content="Maldives" />
      <meta name="geo.position" content="3.2028;73.2207" />
      <meta name="ICBM" content="3.2028, 73.2207" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      <link rel="dns-prefetch" href="https://api.threadtravels.com" />
      
      {/* Alternate language versions */}
      {alternateLocales?.map(alt => (
        <link key={alt.locale} rel="alternate" hrefLang={alt.locale} href={alt.url} />
      ))}
      
      {/* Structured Data */}
      {allStructuredData.map((data, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(data)}
        </script>
      ))}
    </Helmet>
  );
};

// Enhanced SEO configurations with structured data
export const advancedSeoConfigs = {
  home: {
    title: 'Thread Travels & Tours - Discover Your Paradise',
    description: 'Book your dream Maldives vacation with Thread Travels & Tours. Curated selection of luxury resorts, travel packages, and authentic experiences in the Maldives.',
    keywords: 'Maldives travel, Maldives vacation, Maldives resorts, Thread Travels, Maldives packages, luxury resorts, island hopping',
    type: 'website' as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "Thread Travels & Tours",
      "url": "https://threadtravels.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://threadtravels.com/packages?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  },
  
  packages: {
    title: 'Maldives Travel Packages - Complete Experiences',
    description: 'Discover Thread Travels curated Maldives packages including island hopping, luxury honeymoons, and adventure tours. All-inclusive experiences tailored for every traveler.',
    keywords: 'Thread Travels packages, Maldives tours, Maldives vacation packages, island hopping, honeymoon packages',
    type: 'website' as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Maldives Travel Packages",
      "description": "Curated collection of Maldives travel packages by Thread Travels"
    }
  },
  
  about: {
    title: 'About Thread Travels & Tours - Your Trusted Travel Partner',
    description: 'Learn about Thread Travels & Tours, our story, values, and commitment to creating unforgettable travel experiences in the Maldives.',
    keywords: 'about Thread Travels, Thread Travels agency, Maldives travel company, travel experts',
    type: 'website' as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "AboutPage",
      "name": "About Thread Travels & Tours",
      "description": "Learn about Thread Travels & Tours and our commitment to exceptional Maldives travel experiences"
    }
  },
  
  contact: {
    title: 'Contact Thread Travels & Tours - Get in Touch',
    description: 'Contact Thread Travels & Tours for personalized travel advice, bookings, and support. We\'re here to help you plan your perfect Maldives adventure.',
    keywords: 'contact Thread Travels, Thread Travels contact, Maldives booking support, travel consultation',
    type: 'website' as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": "Contact Thread Travels & Tours",
      "description": "Get in touch with Thread Travels for your Maldives travel needs"
    }
  }
};

export default AdvancedSEO;
