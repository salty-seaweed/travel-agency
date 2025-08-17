import React, { useState } from 'react';
import { 
  MagnifyingGlassIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  tags: string[];
}

export function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const faqData: FAQItem[] = [
    // Booking & Reservations
    {
      id: 'booking-1',
      question: 'How do I book a property in the Maldives?',
      answer: 'You can book properties through our website, WhatsApp, email, or by calling us directly. We recommend contacting us via WhatsApp for immediate assistance and personalized recommendations based on your preferences and budget.',
      category: 'Booking & Reservations',
      tags: ['booking', 'reservation', 'how to book']
    },
    {
      id: 'booking-2',
      question: 'What payment methods do you accept?',
      answer: 'We accept various payment methods including bank transfers, credit cards, PayPal, and local payment options. Payment terms vary by property - some require deposits while others require full payment upfront.',
      category: 'Booking & Reservations',
      tags: ['payment', 'credit card', 'bank transfer']
    },
    {
      id: 'booking-3',
      question: 'What is your cancellation policy?',
      answer: 'Cancellation policies vary by property, but most offer free cancellation up to 24-48 hours before check-in. Some luxury properties may require 72 hours notice. We always recommend purchasing travel insurance for added protection.',
      category: 'Booking & Reservations',
      tags: ['cancellation', 'refund', 'policy']
    },
    {
      id: 'booking-4',
      question: 'What are the deposit requirements for bookings?',
      answer: 'Deposit requirements vary by property. Most properties require a 20-30% deposit to confirm booking, while some resorts may require full payment upfront. We\'ll clearly communicate all payment requirements before booking.',
      category: 'Booking & Reservations',
      tags: ['booking', 'payment', 'deposit']
    },

    // Travel & Transportation
    {
      id: 'travel-1',
      question: 'How do I get to the Maldives?',
      answer: 'The Maldives is accessible by international flights to Velana International Airport (MLE) in Male. Major airlines from Europe, Asia, and the Middle East operate regular flights. From Male, you can reach other islands by domestic flights, speedboats, or seaplanes.',
      category: 'Travel & Transportation',
      tags: ['flights', 'airport', 'transportation']
    },
    {
      id: 'travel-2',
      question: 'Do you provide airport transfers?',
      answer: 'Yes, we can arrange airport transfers for most properties. This service is often included in our packages. Transfers can be by speedboat, seaplane, or domestic flight depending on your destination island.',
      category: 'Travel & Transportation',
      tags: ['airport transfer', 'transport', 'speedboat']
    },
    {
      id: 'travel-3',
      question: 'What is the best time to visit the Maldives?',
      answer: 'The Maldives is a year-round destination, but the best weather is typically from November to April during the dry season. The monsoon season (May to October) brings more rain but also lower prices and fewer crowds.',
      category: 'Travel & Transportation',
      tags: ['weather', 'best time', 'season']
    },
    {
      id: 'travel-4',
      question: 'Do I need a visa to visit the Maldives?',
      answer: 'Tourists from most countries receive a free 30-day visa on arrival. You\'ll need a valid passport with at least 6 months validity and proof of onward travel. No advance visa application is required.',
      category: 'Travel & Transportation',
      tags: ['visa', 'immigration', 'passport']
    },

    // Accommodation & Properties
    {
      id: 'accommodation-1',
      question: 'What types of accommodations do you offer?',
      answer: 'We offer a wide range of accommodations including luxury resorts, boutique hotels, local properties, and private villas. Our properties range from budget-friendly options to high-end luxury experiences.',
      category: 'Accommodation & Properties',
      tags: ['hotels', 'resorts', 'properties', 'types']
    },
    {
      id: 'accommodation-2',
      question: 'Are the properties safe and clean?',
      answer: 'Yes, all our properties are personally verified for safety, cleanliness, and quality standards. We regularly inspect properties and maintain relationships with trusted local partners to ensure the best experience.',
      category: 'Accommodation & Properties',
      tags: ['safety', 'cleanliness', 'quality']
    },
    {
      id: 'accommodation-3',
      question: 'Is WiFi available at all properties?',
      answer: 'WiFi availability varies by property. We list all amenities for each property. Budget properties may have limited WiFi, while luxury resorts typically offer high-speed internet.',
      category: 'Accommodation & Properties',
      tags: ['wifi', 'amenities', 'connectivity']
    },
    {
      id: 'accommodation-4',
      question: 'Can I stay on local islands?',
      answer: 'Yes! We offer accommodations on local islands which provide authentic cultural experiences. These are often more affordable than resort islands and allow you to interact with local communities.',
      category: 'Accommodation & Properties',
      tags: ['local islands', 'culture', 'authentic']
    },

    // Activities & Experiences
    {
      id: 'activities-1',
      question: 'What activities are available in the Maldives?',
      answer: 'Popular activities include snorkeling, diving, water sports, island hopping, cultural tours, fishing, and spa treatments. Many activities can be arranged through your accommodation or we can help organize them.',
      category: 'Activities & Experiences',
      tags: ['snorkeling', 'diving', 'water sports', 'activities']
    },
    {
      id: 'activities-2',
      question: 'Do I need to bring my own snorkeling equipment?',
      answer: 'Most properties provide basic snorkeling equipment for free or rent it at reasonable rates. However, if you have your own equipment and prefer to use it, you\'re welcome to bring it.',
      category: 'Activities & Experiences',
      tags: ['snorkeling', 'equipment', 'gear']
    },
    {
      id: 'activities-3',
      question: 'Can I go diving without certification?',
      answer: 'Yes, many dive centers offer "discover scuba diving" programs for beginners. However, for deeper dives and more advanced sites, you\'ll need proper certification. We can help arrange diving courses.',
      category: 'Activities & Experiences',
      tags: ['diving', 'certification', 'beginner']
    },
    {
      id: 'activities-4',
      question: 'Are there cultural activities available?',
      answer: 'Yes! We can arrange cultural tours, cooking classes, fishing trips with locals, and visits to local islands. These experiences provide insight into Maldivian culture and traditions.',
      category: 'Activities & Experiences',
      tags: ['culture', 'tours', 'local experience']
    },

    // Practical Information
    {
      id: 'practical-1',
      question: 'What currency is used in the Maldives?',
      answer: 'The local currency is the Maldivian Rufiyaa (MVR), but US Dollars are widely accepted, especially in resorts and tourist areas. Credit cards are accepted in most places, but it\'s good to have some cash for local islands.',
      category: 'Practical Information',
      tags: ['currency', 'money', 'payment']
    },
    {
      id: 'practical-2',
      question: 'What should I pack for my trip?',
      answer: 'Pack light, breathable clothing, swimwear, reef-safe sunscreen, a hat, sunglasses, and comfortable shoes. Don\'t forget your camera and any medications. Most properties provide towels and basic toiletries.',
      category: 'Practical Information',
      tags: ['packing', 'what to bring', 'essentials']
    },
    {
      id: 'practical-3',
      question: 'Is the Maldives safe for solo travelers?',
      answer: 'Yes, the Maldives is generally very safe for solo travelers. The crime rate is low, and locals are friendly and welcoming. However, it\'s always good practice to take normal safety precautions.',
      category: 'Practical Information',
      tags: ['safety', 'solo travel', 'security']
    },
    {
      id: 'practical-4',
      question: 'What language is spoken in the Maldives?',
      answer: 'The official language is Dhivehi, but English is widely spoken, especially in tourist areas. Most staff at hotels and resorts speak English, and signs are often in both languages.',
      category: 'Practical Information',
      tags: ['language', 'english', 'communication']
    }
  ];

  const categories = ['all', 'Booking & Reservations', 'Travel & Transportation', 'Accommodation & Properties', 'Activities & Experiences', 'Practical Information'];

  const filteredFAQs = faqData.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         faq.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedFAQs = filteredFAQs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  const toggleItem = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Find answers to common questions about traveling to the Maldives, booking properties, and planning your perfect vacation.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filter */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search questions..."
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
                  {category === 'all' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>
          
          {searchTerm && (
            <p className="text-gray-600">
              Found {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''} matching "{searchTerm}"
            </p>
          )}
        </div>

        {/* FAQ Content */}
        {filteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <QuestionMarkCircleIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
            <p className="text-gray-600">Try adjusting your search terms or browse all categories.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(groupedFAQs).map(([category, faqs]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">{category}</h2>
                <div className="space-y-4">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="bg-white rounded-lg shadow-sm border">
                      <button
                        onClick={() => toggleItem(faq.id)}
                        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <span className="font-medium text-gray-900">{faq.question}</span>
                        {expandedItems.has(faq.id) ? (
                          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                        ) : (
                          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                        )}
                      </button>
                      {expandedItems.has(faq.id) && (
                        <div className="px-6 pb-4">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                          <div className="flex flex-wrap gap-2 mt-3">
                            {faq.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Contact Section */}
        <div className="mt-16 bg-blue-50 rounded-lg p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Still have questions?</h3>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our travel experts are here to help!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="https://wa.me/9601234567"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 