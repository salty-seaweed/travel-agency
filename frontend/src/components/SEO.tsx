import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useWhatsApp } from '../hooks/useQueries';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  structuredData?: object;
}

export function SEO({ 
  title, 
  description, 
  keywords, 
  image, 
  url, 
  type = 'website',
  structuredData 
}: SEOProps) {
  const { whatsappNumber } = useWhatsApp();
  const siteName = 'Maldives Travel';
  const fullTitle = `${title} | ${siteName}`;
  const defaultImage = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=630&fit=crop';
  const defaultUrl = 'https://maldives-travel.com';

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={siteName} />
      <meta name="robots" content="index, follow" />
      
      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      <meta property="og:url" content={url || defaultUrl} />
      <meta property="og:image" content={image || defaultImage} />
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image || defaultImage} />
      
      {/* Additional Meta Tags */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="theme-color" content="#2563eb" />
      <link rel="canonical" href={url || defaultUrl} />
      
      {/* Structured Data */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}

// Predefined SEO configurations for common pages
export const seoConfigs = {
  home: {
    title: 'Maldives Travel - Discover Your Paradise',
    description: 'Book your dream Maldives vacation with our curated selection of properties and travel packages. From luxury resorts to charming properties, find your perfect paradise getaway.',
    keywords: 'Maldives travel, Maldives vacation, Maldives resorts, Maldives properties, Maldives packages, Maldives booking',
    type: 'website' as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "Maldives Travel",
      "description": "Your trusted partner for Maldives travel experiences",
      "url": "https://maldives-travel.com",
      "logo": "https://maldives-travel.com/logo.png",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Male",
        "addressCountry": "MV"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "Contact us for phone number",
        "contactType": "customer service"
      }
    }
  },
  
  properties: {
    title: 'Maldives Properties - Hotels, Resorts & Accommodations',
    description: 'Browse our hand-picked selection of Maldives properties including luxury resorts, boutique hotels, and local accommodations. Find your perfect accommodation in paradise.',
    keywords: 'Maldives hotels, Maldives resorts, Maldives properties, Maldives accommodation, Maldives properties',
    type: 'website' as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Maldives Properties",
      "description": "Curated selection of Maldives accommodations"
    }
  },
  
  packages: {
    title: 'Maldives Travel Packages - Complete Vacation Experiences',
    description: 'Discover our curated Maldives travel packages including island hopping, luxury honeymoons, and adventure tours. All-inclusive experiences tailored for every traveler.',
    keywords: 'Maldives packages, Maldives tours, Maldives vacation packages, Maldives island hopping, Maldives honeymoon',
    type: 'website' as const
  },
  
  about: {
    title: 'About Maldives Travel - Your Trusted Travel Partner',
    description: 'Learn about Maldives Travel, our story, values, and commitment to creating unforgettable travel experiences in the Maldives.',
    keywords: 'about Maldives Travel, Maldives travel agency, Maldives travel company, Maldives travel experts',
    type: 'website' as const
  },
  
  contact: {
    title: 'Contact Maldives Travel - Get in Touch',
    description: 'Contact Maldives Travel for personalized travel advice, bookings, and support. We\'re here to help you plan your perfect Maldives adventure.',
    keywords: 'contact Maldives Travel, Maldives travel contact, Maldives booking support, Maldives travel help',
    type: 'website' as const
  },
  
  faq: {
    title: 'Maldives Travel FAQ - Common Questions Answered',
    description: 'Find answers to frequently asked questions about traveling to the Maldives, booking properties, transportation, and planning your perfect vacation.',
    keywords: 'Maldives FAQ, Maldives travel questions, Maldives travel guide, Maldives travel tips',
    type: 'website' as const
  }
};

export default SEO; 