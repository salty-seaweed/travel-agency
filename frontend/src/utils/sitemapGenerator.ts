/**
 * Dynamic Sitemap Generator for Thread Travels
 */

interface SitemapUrl {
  loc: string;
  changefreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
  lastmod?: string;
}

export class SitemapGenerator {
  private baseUrl = 'https://threadtravels.com';
  private urls: SitemapUrl[] = [];

  constructor() {
    this.addStaticUrls();
  }

  private addStaticUrls() {
    const staticUrls: SitemapUrl[] = [
      {
        loc: '/',
        changefreq: 'daily',
        priority: 1.0,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/packages',
        changefreq: 'daily',
        priority: 0.9,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/transportation',
        changefreq: 'weekly',
        priority: 0.8,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/about',
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/contact',
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/blog',
        changefreq: 'weekly',
        priority: 0.6,
        lastmod: new Date().toISOString().split('T')[0]
      },
      {
        loc: '/faq',
        changefreq: 'monthly',
        priority: 0.5,
        lastmod: new Date().toISOString().split('T')[0]
      }
    ];

    this.urls.push(...staticUrls);
  }

  async addPackageUrls() {
    try {
      // Fetch packages from API
      const response = await fetch('/api/packages/');
      if (response.ok) {
        const packages = await response.json();
        
        const packageUrls: SitemapUrl[] = packages.map((pkg: any) => ({
          loc: `/packages/${pkg.id}`,
          changefreq: 'weekly' as const,
          priority: 0.8,
          lastmod: pkg.updated_at ? new Date(pkg.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        }));

        this.urls.push(...packageUrls);
      }
    } catch (error) {
      console.warn('Failed to fetch packages for sitemap:', error);
    }
  }

  async addCMSPageUrls() {
    try {
      // Fetch CMS pages from API
      const response = await fetch('/api/pages/?status=published');
      if (response.ok) {
        const pages = await response.json();
        
        const pageUrls: SitemapUrl[] = pages.map((page: any) => ({
          loc: `/page/${page.slug}`,
          changefreq: 'monthly' as const,
          priority: 0.6,
          lastmod: page.updated_at ? new Date(page.updated_at).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
        }));

        this.urls.push(...pageUrls);
      }
    } catch (error) {
      console.warn('Failed to fetch CMS pages for sitemap:', error);
    }
  }

  addPackageCategories() {
    const categories = [
      'luxury',
      'budget',
      'adventure',
      'honeymoon',
      'family',
      'diving',
      'surfing'
    ];

    const categoryUrls: SitemapUrl[] = categories.map(category => ({
      loc: `/packages?category=${category}`,
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date().toISOString().split('T')[0]
    }));

    this.urls.push(...categoryUrls);
  }

  generateXML(): string {
    const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;

    const xmlUrls = this.urls.map(url => {
      const fullUrl = url.loc.startsWith('http') ? url.loc : `${this.baseUrl}${url.loc}`;
      return `    <url>
        <loc>${fullUrl}</loc>
        <changefreq>${url.changefreq}</changefreq>
        <priority>${url.priority}</priority>
        ${url.lastmod ? `<lastmod>${url.lastmod}</lastmod>` : ''}
    </url>`;
    }).join('\n');

    const xmlFooter = `</urlset>`;

    return `${xmlHeader}\n${xmlUrls}\n${xmlFooter}`;
  }

  async generateSitemap(): Promise<string> {
    // Add dynamic content
    await this.addPackageUrls();
    await this.addCMSPageUrls();
    this.addPackageCategories();

    return this.generateXML();
  }

  // Method to save sitemap to public folder (for build process)
  async saveSitemap(): Promise<void> {
    const sitemapXML = await this.generateSitemap();
    
    // In a real implementation, you would save this to the public folder
    // For now, we'll just log it or return it
    console.log('Generated sitemap:', sitemapXML);
    
    // You could also trigger a download or save via API
    return Promise.resolve();
  }
}

// Utility function to generate sitemap on demand
export const generateSitemap = async (): Promise<string> => {
  const generator = new SitemapGenerator();
  return await generator.generateSitemap();
};

// Hook to trigger sitemap generation
export const useSitemapGeneration = () => {
  const generateAndDownload = async () => {
    try {
      const sitemap = await generateSitemap();
      
      // Create downloadable blob
      const blob = new Blob([sitemap], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      
      // Trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = 'sitemap.xml';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate sitemap:', error);
    }
  };

  return { generateAndDownload };
};

export default SitemapGenerator;
