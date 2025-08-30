import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '../i18n';
import { 
  CalendarIcon,
  ClockIcon,
  UserIcon,
  MagnifyingGlassIcon,
  TagIcon
} from '@heroicons/react/24/outline';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishDate: string;
  readTime: string;
  image: string;
  category: string;
  tags: string[];
  featured: boolean;
  slug: string;
}

export function BlogPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const blogPosts: BlogPost[] = [
    {
      id: '1',
      title: 'Ultimate Guide to Island Hopping in the Maldives',
      excerpt: 'Discover the best islands to visit, transportation options, and insider tips for the perfect island hopping adventure in the Maldives.',
      content: 'Full article content here...',
      author: 'Ahmed Hassan',
      publishDate: '2024-01-15',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop',
      category: 'Travel Guide',
      tags: ['island hopping', 'travel tips', 'adventure'],
      featured: true,
      slug: 'ultimate-guide-island-hopping-maldives'
    },
    {
      id: '2',
      title: 'Best Time to Visit the Maldives: Weather and Seasons',
      excerpt: 'Learn about the different seasons in the Maldives, weather patterns, and when to plan your visit for the best experience.',
      content: 'Full article content here...',
      author: 'Fatima Ali',
      publishDate: '2024-01-10',
      readTime: '6 min read',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop',
      category: 'Travel Tips',
      tags: ['weather', 'best time', 'seasons'],
      featured: true,
      slug: 'best-time-visit-maldives-weather-seasons'
    },
    {
      id: '3',
      title: 'Budget Travel in the Maldives: How to Save Money',
      excerpt: 'Explore the Maldives on a budget with our comprehensive guide to affordable accommodation, food, and activities.',
      content: 'Full article content here...',
      author: 'Mohammed Ibrahim',
      publishDate: '2024-01-05',
      readTime: '10 min read',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop',
      category: 'Budget Travel',
      tags: ['budget', 'money saving', 'affordable'],
      featured: false,
      slug: 'budget-travel-maldives-save-money'
    },
    {
      id: '4',
      title: 'Top 10 Snorkeling Spots in the Maldives',
      excerpt: 'Discover the most beautiful coral reefs and marine life in the Maldives with our guide to the best snorkeling locations.',
      content: 'Full article content here...',
      author: 'Ahmed Hassan',
      publishDate: '2023-12-28',
      readTime: '7 min read',
      image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop',
      category: 'Activities',
      tags: ['snorkeling', 'marine life', 'coral reefs'],
      featured: false,
      slug: 'top-10-snorkeling-spots-maldives'
    },
    {
      id: '5',
      title: 'Maldives Culture and Traditions: What to Know',
      excerpt: 'Learn about the rich culture, traditions, and customs of the Maldives to enhance your travel experience.',
      content: 'Full article content here...',
      author: 'Fatima Ali',
      publishDate: '2023-12-20',
      readTime: '9 min read',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop',
      category: 'Culture',
      tags: ['culture', 'traditions', 'local life'],
      featured: false,
      slug: 'maldives-culture-traditions-guide'
    },
    {
      id: '6',
      title: 'Luxury vs Budget: Choosing Your Maldives Experience',
      excerpt: 'Compare luxury resorts and budget guesthouses to find the perfect Maldives experience for your style and budget.',
      content: 'Full article content here...',
      author: 'Mohammed Ibrahim',
      publishDate: '2023-12-15',
      readTime: '8 min read',
      image: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&h=400&fit=crop',
      category: 'Travel Guide',
      tags: ['luxury', 'budget', 'comparison'],
      featured: false,
      slug: 'luxury-vs-budget-maldives-experience'
    }
  ];

  const categories = ['all', 'Travel Guide', 'Travel Tips', 'Budget Travel', 'Activities', 'Culture'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden text-white py-16">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/src/assets/images/ishan112.jpg"
            alt="Maldives Blog Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('blog.hero.title', 'Maldives Travel Blog')}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t('blog.hero.subtitle', 'Discover travel tips, destination guides, and insider knowledge to help you plan the perfect Maldives adventure.')}
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('blog.search.placeholder', 'Search articles...')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category === 'all' ? t('blog.categories.all', 'All Categories') : category}
                </option>
              ))}
            </select>
          </div>
          
          {searchTerm && (
            <p className="text-gray-600">
              {t('blog.search.results', 'Found {{count}} article{{count !== 1 ? "s" : ""}} matching "{{term}}"', { count: filteredPosts.length, term: searchTerm })}
            </p>
          )}
        </div>

        {/* Featured Posts */}
        {featuredPosts.length > 0 && (
          <section className="mb-12">
                         <h2 className="text-2xl font-bold text-gray-900 mb-6">
               {t('blog.featured.title', 'Featured Articles')}
             </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(post.publishDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        {post.readTime}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      <Link to={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <UserIcon className="h-4 w-4" />
                        {post.author}
                      </div>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        {t('blog.readMore', 'Read More')} →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* Regular Posts */}
        {regularPosts.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {t('blog.latest.title', 'Latest Articles')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regularPosts.map((post) => (
                <article key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                        {post.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        {new Date(post.publishDate).toLocaleDateString()}
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3">
                      <Link to={`/blog/${post.slug}`} className="hover:text-blue-600 transition-colors">
                        {post.title}
                      </Link>
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <UserIcon className="h-4 w-4" />
                        {post.author}
                      </div>
                      <Link
                        to={`/blog/${post.slug}`}
                        className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        {t('blog.readMore', 'Read More')} →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {/* No Results */}
        {filteredPosts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MagnifyingGlassIcon className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {t('blog.noResults.title', 'No articles found')}
            </h3>
            <p className="text-gray-600">
              {t('blog.noResults.description', 'Try adjusting your search terms or browse all categories.')}
            </p>
          </div>
        )}

        {/* Newsletter Signup */}
        <section className="mt-16 bg-blue-50 rounded-lg p-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              {t('blog.newsletter.title', 'Stay Updated')}
            </h3>
            <p className="text-gray-600 mb-6">
              {t('blog.newsletter.description', 'Subscribe to our newsletter for the latest travel tips, destination guides, and exclusive offers.')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder={t('blog.newsletter.emailPlaceholder', 'Enter your email')}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                {t('blog.newsletter.subscribe', 'Subscribe')}
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
} 