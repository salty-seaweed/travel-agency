import React, { useState, useEffect } from 'react';
import { 
  HeartIcon, 
  StarIcon, 
  UserIcon, 
  CogIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  CurrencyDollarIcon,
  CalendarIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '../i18n';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

interface UserPreferences {
  budget: string;
  travelStyle: string[];
  activities: string[];
  accommodation: string[];
  destinations: string[];
  groupSize: string;
  travelDates: string;
}

interface PersonalizationSectionProps {
  className?: string;
  onPreferencesChange?: (preferences: UserPreferences) => void;
}

export function PersonalizationSection({ 
  className = '', 
  onPreferencesChange 
}: PersonalizationSectionProps) {
  const { t } = useTranslation();
  const [preferences, setPreferences] = useState<UserPreferences>({
    budget: '',
    travelStyle: [],
    activities: [],
    accommodation: [],
    destinations: [],
    groupSize: '',
    travelDates: ''
  });
  const [showPreferences, setShowPreferences] = useState(false);

  const budgetRanges = [
    { value: 'budget', label: 'Budget ($50-150/night)', icon: CurrencyDollarIcon },
    { value: 'mid-range', label: 'Mid-Range ($150-300/night)', icon: CurrencyDollarIcon },
    { value: 'luxury', label: 'Luxury ($300+/night)', icon: CurrencyDollarIcon },
    { value: 'ultra-luxury', label: 'Ultra-Luxury ($500+/night)', icon: CurrencyDollarIcon }
  ];

  const travelStyles = [
    { value: 'romantic', label: 'Romantic Getaway', icon: HeartIcon },
    { value: 'adventure', label: 'Adventure & Exploration', icon: MapPinIcon },
    { value: 'relaxation', label: 'Relaxation & Wellness', icon: StarIcon },
    { value: 'family', label: 'Family-Friendly', icon: UserIcon },
    { value: 'luxury', label: 'Luxury Experience', icon: StarIcon },
    { value: 'cultural', label: 'Cultural Immersion', icon: UserIcon }
  ];

  const activities = [
    { value: 'diving', label: 'Diving & Snorkeling' },
    { value: 'water-sports', label: 'Water Sports' },
    { value: 'spa', label: 'Spa & Wellness' },
    { value: 'fishing', label: 'Fishing' },
    { value: 'sailing', label: 'Sailing & Cruises' },
    { value: 'photography', label: 'Photography' },
    { value: 'cooking', label: 'Cooking Classes' },
    { value: 'yoga', label: 'Yoga & Meditation' }
  ];

  const accommodationTypes = [
    { value: 'resort', label: 'Luxury Resorts' },
    { value: 'boutique', label: 'Boutique Hotels' },
    { value: 'guesthouse', label: 'Local Guesthouses' },
    { value: 'villa', label: 'Private Villas' },
    { value: 'overwater', label: 'Overwater Bungalows' },
    { value: 'beachfront', label: 'Beachfront Properties' }
  ];

  const popularDestinations = [
    { value: 'male', label: 'Male & Hulhumale' },
    { value: 'maafushi', label: 'Maafushi' },
    { value: 'fulidhoo', label: 'Fulidhoo' },
    { value: 'gulhi', label: 'Gulhi' },
    { value: 'thulusdhoo', label: 'Thulusdhoo' },
    { value: 'dhigurah', label: 'Dhigurah' }
  ];

  const groupSizes = [
    { value: 'solo', label: 'Solo Traveler' },
    { value: 'couple', label: 'Couple' },
    { value: 'family', label: 'Family (3-4 people)' },
    { value: 'group', label: 'Group (5+ people)' }
  ];

  useEffect(() => {
    // Load saved preferences from localStorage
    const savedPreferences = localStorage.getItem('user-preferences');
    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
  }, []);

  const handlePreferenceChange = (category: keyof UserPreferences, value: any) => {
    const newPreferences = { ...preferences };
    
    if (Array.isArray(preferences[category])) {
      const currentArray = preferences[category] as string[];
      if (currentArray.includes(value)) {
        newPreferences[category] = currentArray.filter(item => item !== value);
      } else {
        newPreferences[category] = [...currentArray, value];
      }
    } else {
      newPreferences[category] = value;
    }
    
    setPreferences(newPreferences);
    localStorage.setItem('user-preferences', JSON.stringify(newPreferences));
    onPreferencesChange?.(newPreferences);
  };

  const renderMultiSelect = (
    items: Array<{ value: string; label: string; icon?: any }>,
    category: keyof UserPreferences,
    title: string
  ) => (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-900 mb-3">{title}</h4>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {items.map((item) => {
          const isSelected = Array.isArray(preferences[category]) && 
            (preferences[category] as string[]).includes(item.value);
          
          return (
            <button
              key={item.value}
              onClick={() => handlePreferenceChange(category, item.value)}
              className={`p-2 text-xs rounded-lg border transition-all ${
                isSelected
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4 mx-auto mb-1" />}
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  const renderSingleSelect = (
    items: Array<{ value: string; label: string; icon?: any }>,
    category: keyof UserPreferences,
    title: string
  ) => (
    <div className="mb-6">
      <h4 className="text-sm font-medium text-gray-900 mb-3">{title}</h4>
      <div className="grid grid-cols-2 md:grid-cols-2 gap-2">
        {items.map((item) => {
          const isSelected = preferences[category] === item.value;
          
          return (
            <button
              key={item.value}
              onClick={() => handlePreferenceChange(category, item.value)}
              className={`p-3 text-sm rounded-lg border transition-all ${
                isSelected
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
              }`}
            >
              {item.icon && <item.icon className="w-4 h-4 mx-auto mb-1" />}
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <section className={`py-12 ${className}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card>
          <div className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <UserIcon className="w-6 h-6 mr-2 text-blue-600" />
                  Personalize Your Experience
                </h2>
                <p className="text-gray-600 mt-1">
                  Help us recommend the perfect Maldives experience for you
                </p>
              </div>
              <Button
                onClick={() => setShowPreferences(!showPreferences)}
                variant="outline"
                className="flex items-center"
              >
                <CogIcon className="w-4 h-4 mr-2" />
                {showPreferences ? 'Hide' : 'Show'} Preferences
              </Button>
            </div>

            {/* Quick Preferences Summary */}
            {!showPreferences && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">Your Current Preferences:</h3>
                <div className="flex flex-wrap gap-2">
                  {preferences.budget && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      Budget: {budgetRanges.find(b => b.value === preferences.budget)?.label}
                    </span>
                  )}
                  {preferences.travelStyle.length > 0 && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      {preferences.travelStyle.length} travel styles selected
                    </span>
                  )}
                  {preferences.activities.length > 0 && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                      {preferences.activities.length} activities selected
                    </span>
                  )}
                  {preferences.accommodation.length > 0 && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded">
                      {preferences.accommodation.length} accommodation types
                    </span>
                  )}
                  {preferences.destinations.length === 0 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      No destinations selected
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Detailed Preferences Form */}
            {showPreferences && (
              <div className="space-y-6">
                {/* Budget Range */}
                {renderSingleSelect(budgetRanges, 'budget', 'Budget Range')}

                {/* Travel Style */}
                {renderMultiSelect(travelStyles, 'travelStyle', 'Travel Style')}

                {/* Activities */}
                {renderMultiSelect(activities, 'activities', 'Preferred Activities')}

                {/* Accommodation Type */}
                {renderMultiSelect(accommodationTypes, 'accommodation', 'Accommodation Type')}

                {/* Destinations */}
                {renderMultiSelect(popularDestinations, 'destinations', 'Preferred Destinations')}

                {/* Group Size */}
                {renderSingleSelect(groupSizes, 'groupSize', 'Group Size')}

                {/* Travel Dates */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">When are you planning to travel?</h4>
                  <input
                    type="text"
                    placeholder="e.g., December 2024, March 2025"
                    value={preferences.travelDates}
                    onChange={(e) => handlePreferenceChange('travelDates', e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Save Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={() => setShowPreferences(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Save Preferences
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </section>
  );
}

export default PersonalizationSection;
