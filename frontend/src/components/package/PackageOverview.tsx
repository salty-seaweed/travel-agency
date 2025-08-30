import React, { useState } from 'react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  CheckIcon, 
  CalendarIcon, 
  UsersIcon, 
  MapPinIcon, 
  GlobeAltIcon 
} from '@heroicons/react/24/outline';
import { Card } from '../Card';
import type { Package } from '../../types';

interface PackageOverviewProps {
  package: Package;
}

export function PackageOverview({ package: pkg }: PackageOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Package Overview</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700 transition-colors"
        >
          {isExpanded ? (
            <ChevronUpIcon className="h-5 w-5" />
          ) : (
            <ChevronDownIcon className="h-5 w-5" />
          )}
        </button>
      </div>
      
      {isExpanded && (
        <div className="space-y-8">
          {/* Detailed Description */}
          {pkg.detailed_description && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">About This Package</h3>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  {pkg.detailed_description}
                </p>
              </div>
            </div>
          )}
          
          <div className="grid lg:grid-cols-2 gap-8">
                         {/* Package Highlights */}
             <div>
               <h3 className="text-xl font-semibold text-gray-900 mb-4">Package Highlights</h3>
               <div className="space-y-3">
                 {pkg.highlights ? (
                   // If highlights is a string, split it into array
                   (typeof pkg.highlights === 'string' ? 
                     pkg.highlights.split(/[,\n]/).filter(h => h.trim()) : 
                     pkg.highlights
                   ).map((highlight, index) => (
                     <div key={index} className="flex items-start gap-3">
                       <div className="flex-shrink-0 mt-1">
                         <CheckIcon className="h-5 w-5 text-green-500" />
                       </div>
                       <span className="text-gray-700 leading-relaxed">{highlight.trim()}</span>
                     </div>
                   ))
                 ) : (
                   <p className="text-gray-500 italic">No highlights specified</p>
                 )}
               </div>
             </div>
            
            {/* Quick Facts */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Facts</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <CalendarIcon className="h-6 w-6 text-blue-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">{pkg.duration} days</div>
                    <div className="text-sm text-gray-500">Duration</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <UsersIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">
                      {pkg.group_size?.min}-{pkg.group_size?.max} people
                    </div>
                    <div className="text-sm text-gray-500">Group Size</div>
                  </div>
                </div>
                
                                 <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                   <MapPinIcon className="h-6 w-6 text-purple-500 flex-shrink-0" />
                   <div>
                     <div className="font-medium text-gray-900">
                       {pkg.destinations?.length || 1} island(s)
                     </div>
                     <div className="text-sm text-gray-500">Destinations</div>
                   </div>
                 </div>
                
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <GlobeAltIcon className="h-6 w-6 text-orange-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-gray-900">{pkg.category}</div>
                    <div className="text-sm text-gray-500">Category</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
