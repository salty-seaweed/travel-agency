// Sitemap utility for SEO optimization
// This will be used to generate XML sitemaps for search engines

export interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export const baseUrl = 'https://maldives-travel.com';

// Define all static pages
export const staticPages: SitemapUrl[] = [
  {
    url: '/',
    changefreq: 'daily',
    priority: 1.0
  },
  {
    url: '/properties',
    changefreq: 'daily',
    priority: 0.9
  },
  {
    url: '/packages',
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    url: '/about',
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    url: '/contact',
    changefreq: 'monthly',
    priority: 0.7
  },
  {
    url: '/faq',
    changefreq: 'monthly',
    priority: 0.6
  },
  {
    url: '/blog',
    changefreq: 'weekly',
    priority: 0.8
  }
];

// Generate sitemap XML
export function generateSitemapXml(urls: SitemapUrl[]): string {
  const xmlUrls = urls.map(url => {
    const lastmod = url.lastmod || new Date().toISOString().split('T')[0];
    const changefreq = url.changefreq || 'weekly';
    const priority = url.priority || 0.5;
    
    return `  <url>
    <loc>${baseUrl}${url.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
  }).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${xmlUrls}
</urlset>`;
}

// Generate robots.txt content
export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin areas
Disallow: /admin/
Disallow: /api/

# Allow important pages
Allow: /properties/
Allow: /packages/
Allow: /blog/
Allow: /about/
Allow: /contact/
Allow: /faq/`;
}

// Generate structured data for properties
export function generatePropertyStructuredData(property: any) {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "name": property.name,
    "description": property.description,
    "image": property.image,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": property.location,
      "addressCountry": "MV"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": property.rating,
      "reviewCount": property.reviewCount
    },
    "priceRange": "$$",
    "amenityFeature": property.amenities.map((amenity: string) => ({
      "@type": "LocationFeatureSpecification",
      "name": amenity
    }))
  };
}

// Generate structured data for packages
export function generatePackageStructuredData(travelPackage: any) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": travelPackage.name,
    "description": travelPackage.description,
    "image": travelPackage.image,
    "offers": {
      "@type": "Offer",
      "price": travelPackage.price,
      "priceCurrency": "USD",
      "availability": "https://schema.org/InStock"
    },
    "duration": travelPackage.duration,
    "touristType": travelPackage.category
  };
}

// Generate breadcrumb structured data
export function generateBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": `${baseUrl}${item.url}`
    }))
  };
}

// Generate organization structured data
export function generateOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    "name": "Maldives Travel",
    "description": "Your trusted partner for Maldives travel experiences",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Male",
      "addressCountry": "MV"
    },
    "contactPoint": {
      "@type": "ContactPoint",
              "telephone": "+960-744-1097",
      "contactType": "customer service",
      "availableLanguage": "English"
    },
    "sameAs": [
      "https://facebook.com/maldives-travel",
      "https://instagram.com/maldives-travel",
      "https://twitter.com/maldives-travel"
    ]
  };
} 