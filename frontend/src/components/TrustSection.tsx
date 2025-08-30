import React from 'react';
import { 
  ShieldCheckIcon, 
  StarIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  CheckCircleIcon,
  UserGroupIcon,
  GlobeAltIcon,
  HeartIcon
} from '@heroicons/react/24/outline';
import { useTranslation } from '../i18n';
import { Card } from './ui/Card';

interface TrustSectionProps {
  className?: string;
  showCertifications?: boolean;
  showGuarantees?: boolean;
  showStats?: boolean;
}

export function TrustSection({ 
  className = '', 
  showCertifications = true, 
  showGuarantees = true, 
  showStats = true 
}: TrustSectionProps) {
  const { t } = useTranslation();

  const certifications = [
    {
      icon: ShieldCheckIcon,
      name: "Maldives Tourism Authority",
      description: "Official licensed travel agency",
      color: "text-blue-600"
    },
    {
      icon: GlobeAltIcon,
      name: "IATA Member",
      description: "International Air Transport Association",
      color: "text-green-600"
    },
    {
      icon: StarIcon,
      name: "PATA Member", 
      description: "Pacific Asia Travel Association",
      color: "text-purple-600"
    }
  ];

  const guarantees = [
    {
      icon: CheckCircleIcon,
      title: "Quality Guarantee",
      description: "All properties personally verified by our team",
      color: "text-green-600"
    },
    {
      icon: CurrencyDollarIcon,
      title: "Price Match",
      description: "We'll match any lower price you find",
      color: "text-blue-600"
    },
    {
      icon: ClockIcon,
      title: "24/7 Support",
      description: "Round-the-clock assistance during your trip",
      color: "text-purple-600"
    }
  ];

  const stats = [
    {
      icon: UserGroupIcon,
      number: "15,000+",
      label: "Happy Travelers",
      color: "text-blue-600"
    },
    {
      icon: StarIcon,
      number: "4.9/5",
      label: "Average Rating",
      color: "text-yellow-600"
    },
    {
      icon: HeartIcon,
      number: "500+",
      label: "Properties Verified",
      color: "text-red-600"
    },
    {
      icon: GlobeAltIcon,
      number: "50+",
      label: "Destinations",
      color: "text-green-600"
    }
  ];

  return (
    <section className={`py-16 bg-gradient-to-br from-gray-50 to-blue-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Travelers Trust Thread Travels
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            We're committed to providing you with the safest, most reliable, and most enjoyable 
            Maldives travel experience possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Certifications */}
          {showCertifications && (
            <div className="lg:col-span-1">
              <Card className="h-full">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <ShieldCheckIcon className="w-6 h-6 mr-2 text-blue-600" />
                    Our Certifications
                  </h3>
                  <div className="space-y-4">
                    {certifications.map((cert, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <cert.icon className={`w-5 h-5 mt-0.5 ${cert.color}`} />
                        <div>
                          <h4 className="font-medium text-gray-900">{cert.name}</h4>
                          <p className="text-sm text-gray-600">{cert.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Guarantees */}
          {showGuarantees && (
            <div className="lg:col-span-1">
              <Card className="h-full">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <CheckCircleIcon className="w-6 h-6 mr-2 text-green-600" />
                    Our Guarantees
                  </h3>
                  <div className="space-y-4">
                    {guarantees.map((guarantee, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <guarantee.icon className={`w-5 h-5 mt-0.5 ${guarantee.color}`} />
                        <div>
                          <h4 className="font-medium text-gray-900">{guarantee.title}</h4>
                          <p className="text-sm text-gray-600">{guarantee.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Statistics */}
          {showStats && (
            <div className="lg:col-span-1">
              <Card className="h-full">
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                    <StarIcon className="w-6 h-6 mr-2 text-yellow-600" />
                    By The Numbers
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center">
                        <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
                        <div className={`text-2xl font-bold ${stat.color}`}>
                          {stat.number}
                        </div>
                        <div className="text-sm text-gray-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Trust Badges */}
        <div className="mt-12 text-center">
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center space-x-2">
              <ShieldCheckIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircleIcon className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-medium text-gray-600">Verified Business</span>
            </div>
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-gray-600">24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <CurrencyDollarIcon className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-600">Best Price Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TrustSection;
