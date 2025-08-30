import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon, 
  MapPinIcon, 
  CalendarIcon, 
  UsersIcon, 
  StarIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { LazyImage } from '../LazyImage';
import { Button } from '../ui/Button';
import type { Package } from '../../types';

interface PackageHeroProps {
  package: Package;
  onBookNow: () => void;
  onWhatsAppInquiry: () => void;
}

export function PackageHero({ package: pkg, onBookNow, onWhatsAppInquiry }: PackageHeroProps) {
  const navigate = useNavigate();

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const price = parseFloat(pkg.price);

  return (
    <section className="relative text-white min-h-[70vh] flex items-end">
      {/* Hero Background */}
      <div className="absolute inset-0">
        {pkg.images && pkg.images.length > 0 ? (
          <LazyImage 
            src={pkg.images[0].image} 
            alt={pkg.name} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/20" />
      </div>

      {/* Navigation */}
      <div className="relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <button 
              onClick={() => navigate('/packages')} 
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span>Back to Packages</span>
            </button>
            <div className="flex items-center gap-2 text-sm opacity-90">
              <span>Home</span>
              <span>/</span>
              <span>Packages</span>
              <span>/</span>
              <span className="font-semibold">{pkg.name}</span>
            </div>
          </div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-12 gap-8 items-end">
            {/* Main Content */}
            <div className="lg:col-span-8">
              {/* Badges */}
              <div className="flex items-center gap-3 mb-4">
                {pkg.category && (
                  <span className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-sm font-medium border border-white/30">
                    {pkg.category}
                  </span>
                )}
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getDifficultyColor(pkg.difficulty_level)}`}>
                  {pkg.difficulty_level}
                </span>
                {pkg.is_featured && (
                  <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold">
                    ⭐ Featured Package
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
                {pkg.name}
              </h1>

              {/* Location and Rating */}
              <div className="flex items-center gap-6 text-lg opacity-90 mb-4">
                {pkg.destinations?.[0]?.location && (
                  <span className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5" />
                    {pkg.destinations[0].location.island}, {pkg.destinations[0].location.atoll}
                  </span>
                )}
                <span className="flex items-center gap-2">
                  <StarSolidIcon className="h-5 w-5 text-yellow-400" />
                  {pkg.rating || 4.8} ({pkg.review_count || 24} reviews)
                </span>
              </div>

              {/* Description */}
              <p className="text-xl text-white/90 mb-6 max-w-4xl leading-relaxed">
                {pkg.description}
              </p>

              {/* Quick Facts */}
              <div className="flex flex-wrap gap-8 text-lg">
                <span className="flex items-center gap-3">
                  <CalendarIcon className="h-6 w-6" />
                  {pkg.duration} days
                </span>
                <span className="flex items-center gap-3">
                  <UsersIcon className="h-6 w-6" />
                  {pkg.group_size?.min}-{pkg.group_size?.max} people
                </span>
                                 <span className="flex items-center gap-3">
                   <MapPinIcon className="h-6 w-6" />
                   {pkg.destinations?.length || 1} islands
                 </span>
              </div>
            </div>

            {/* Booking Card */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg opacity-90">From</span>
                  <div className="flex items-center gap-2">
                    <StarSolidIcon className="h-5 w-5 text-yellow-400" />
                    <span className="text-lg">{pkg.rating || 4.8} ({pkg.review_count || 24})</span>
                  </div>
                </div>
                
                <div className="flex items-end gap-3 mb-6">
                  <span className="text-4xl font-bold">${price.toLocaleString()}</span>
                  <span className="text-lg opacity-80">per person</span>
                </div>
                
                <div className="space-y-3">
                  <Button 
                    onClick={onBookNow}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    <CalendarIcon className="h-5 w-5 mr-2" />
                    Book Now
                  </Button>
                  <Button 
                    onClick={onWhatsAppInquiry}
                    className="w-full bg-white/20 hover:bg-white/30 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 border border-white/30"
                  >
                    <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
                    WhatsApp Inquiry
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
