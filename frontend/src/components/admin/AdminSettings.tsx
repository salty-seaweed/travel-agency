import React, { useState } from 'react';
import { Card } from '../index';
import { AdminAmenities } from './settings/AdminAmenities';
import { AdminPropertyTypes } from './settings/AdminPropertyTypes';
import { AdminLocations } from './settings/AdminLocations';
import {
  WrenchScrewdriverIcon,
  SparklesIcon,
  HomeIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

export function AdminSettings() {
  const [activeTab, setActiveTab] = useState<'amenities' | 'types' | 'locations'>('amenities');

  const tabs = [
    { id: 'amenities', name: 'Amenities', icon: SparklesIcon, color: 'purple' },
    { id: 'types', name: 'Property Types', icon: HomeIcon, color: 'blue' },
    { id: 'locations', name: 'Locations', icon: MapPinIcon, color: 'emerald' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-gray-200 px-6 py-6 mb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <WrenchScrewdriverIcon className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
              <p className="text-gray-600">Manage amenities, property types, and locations</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Tabs */}
        <Card>
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? `border-${tab.color}-500 text-${tab.color}-600`
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6">
            {activeTab === 'amenities' && <AdminAmenities />}
            {activeTab === 'types' && <AdminPropertyTypes />}
            {activeTab === 'locations' && <AdminLocations />}
          </div>
        </Card>
      </div>
    </div>
  );
} 