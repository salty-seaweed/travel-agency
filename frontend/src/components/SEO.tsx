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
  const siteName = 'Thread Travels & Tours';
  const fullTitle = `${title} | ${siteName}`;
  const defaultImage = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&h=630&fit=crop';
  const defaultUrl = 'https://threadtravels.com';

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
    title: 'Thread Travels & Tours - Discover Your Paradise',
    description: 'Discover budget-friendly Maldives travel with Thread Travels & Tours. Island packages and multi-island adventures that let you experience paradise without breaking the bank.',
    keywords: 'Maldives travel, Maldives vacation, budget Maldives, Thread Travels, island packages, multi-island adventures, affordable Maldives',
    type: 'website' as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "TravelAgency",
      "name": "Thread Travels & Tours",
      "description": "Your trusted Maldives travel partner for budget-friendly island packages and multi-island adventures",
      "url": "https://threadtravels.com",
      "logo": "https://threadtravels.com/logo.png",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Male",
        "addressCountry": "MV"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+9607441097",
        "contactType": "customer service"
      }
    }
  },
  
  properties: {
    title: 'Thread Travels Properties - Hotels, Resorts & Accommodations',
    description: 'Browse our curated selection of Maldives accommodations from budget guesthouses to mid-range resorts. Thread Travels finds the best value options for your island adventures.',
    keywords: 'Maldives hotels, budget Maldives accommodation, Thread Travels properties, Maldives guesthouses, affordable Maldives resorts',
    type: 'website' as const,
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "name": "Thread Travels Properties",
      "description": "Curated selection of Maldives accommodations by Thread Travels"
    }
  },
  
  packages: {
    title: 'Thread Travels Packages - Complete Maldives Experiences',
    description: 'Discover Thread Travels budget-friendly Maldives packages including island hopping adventures and multi-island experiences. Affordable paradise exploration for every traveler.',
    keywords: 'Thread Travels packages, budget Maldives tours, Maldives vacation packages, island hopping, multi-island adventures, affordable Maldives',
    type: 'website' as const
  },
  
  about: {
    title: 'About Thread Travels & Tours - Your Trusted Travel Partner',
    description: 'Learn about Thread Travels & Tours, our story, values, and commitment to creating unforgettable travel experiences in the Maldives.',
    keywords: 'about Thread Travels, Thread Travels agency, Maldives travel company, Maldives travel experts',
    type: 'website' as const
  },
  
  contact: {
    title: 'Contact Thread Travels & Tours - Get in Touch',
    description: 'Contact Thread Travels & Tours for personalized travel advice, bookings, and support. We\'re here to help you plan your perfect Maldives adventure.',
    keywords: 'contact Thread Travels, Thread Travels contact, Maldives booking support, Thread Travels help',
    type: 'website' as const
  },
  
  faq: {
    title: 'Thread Travels FAQ - Common Questions Answered',
    description: 'Find answers to frequently asked questions about traveling to the Maldives with Thread Travels, booking properties, transportation, and planning your perfect vacation.',
    keywords: 'Thread Travels FAQ, Maldives travel questions, Thread Travels guide, Maldives travel tips',
    type: 'website' as const
  }
};

export default SEO; 