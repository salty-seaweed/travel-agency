import React, { useState } from 'react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  CheckIcon, 
  SunIcon, 
  CloudIcon, 
  ExclamationCircleIcon,
  ExclamationTriangleIcon,
  DocumentTextIcon,
  CreditCardIcon
} from '@heroicons/react/24/outline';
import { Card } from '../Card';
import type { Package } from '../../types';

interface PackageImportantInfoProps {
  package: Package;
}

export function PackageImportantInfo({ package: pkg }: PackageImportantInfoProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="p-6 bg-white rounded-2xl border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Important Information</h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-600 hover:text-blue-700"
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
          {/* Weather & Best Time */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <SunIcon className="h-5 w-5" />
                Best Time to Visit
              </h3>
              <p className="text-gray-700">{pkg.best_time_to_visit || 'Year-round'}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CloudIcon className="h-5 w-5" />
                Weather Information
              </h3>
              <p className="text-gray-700">{pkg.weather_info || 'Tropical climate with warm temperatures year-round'}</p>
            </div>
          </div>
          
          {/* What to Bring */}
          {pkg.what_to_bring && pkg.what_to_bring.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">What to Bring</h3>
              <div className="grid md:grid-cols-2 gap-2">
                {pkg.what_to_bring.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckIcon className="h-4 w-4 text-green-500" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Important Notes */}
          {pkg.important_notes && pkg.important_notes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ExclamationCircleIcon className="h-5 w-5" />
                Important Notes
              </h3>
              <div className="space-y-2">
                {pkg.important_notes.map((note, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500 mt-0.5" />
                    <span className="text-gray-700">{note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Booking Terms & Policies */}
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <DocumentTextIcon className="h-5 w-5" />
                Booking Terms
              </h3>
              <p className="text-gray-700">{pkg.booking_terms || 'Standard booking terms apply'}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <ExclamationTriangleIcon className="h-5 w-5" />
                Cancellation Policy
              </h3>
              <p className="text-gray-700">{pkg.cancellation_policy || 'Standard cancellation policy applies'}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CreditCardIcon className="h-5 w-5" />
                Payment Terms
              </h3>
              <p className="text-gray-700">{pkg.payment_terms || 'Payment required to confirm booking'}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
