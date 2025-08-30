import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeftIcon,
  StarIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  CurrencyDollarIcon,
  ShareIcon,
  HeartIcon,
  CheckIcon,
  XMarkIcon,
  ClockIcon,
  GlobeAltIcon,
  WifiIcon,
  ShieldCheckIcon,
  TruckIcon,
  HomeIcon,
  CakeIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { SEO } from '../SEO';
import { Card } from '../Card';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../LoadingSpinner';
import { LazyImage } from '../LazyImage';
import { usePackage, usePackages } from '../../hooks/useQueries';
import { useNotification } from '../../hooks/useNotification';
import { getWhatsAppUrl } from '../../config';
import { whatsappBooking } from '../../services/whatsapp-booking';

// Calendar component for date selection
function Calendar({ price, onDateSelect }: { price: number; onDateSelect: (date: Date) => void }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    // Add previous month's days to fill first week
    const firstDayOfWeek = firstDay.getDay();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      days.push({ date, isCurrentMonth: false });
    }
    
    // Add current month's days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({ date, isCurrentMonth: true });
    }
    
    // Add next month's days to fill last week
    const lastDayOfWeek = lastDay.getDay();
    for (let day = 1; day <= 6 - lastDayOfWeek; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, isCurrentMonth: false });
    }
    
    return days;
  }, [currentMonth]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="bg-white rounded-lg border">
      <div className="flex items-center justify-between p-4 border-b">
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
          className="p-2 hover:bg-gray-100 rounded"
        >
          ←
        </button>
        <h3 className="font-semibold">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button 
          onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
          className="p-2 hover:bg-gray-100 rounded"
        >
          →
        </button>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-7 gap-1 text-xs text-gray-500 mb-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <div key={day} className="text-center py-1">{day}</div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map(({ date, isCurrentMonth }, index) => (
            <button
              key={index}
              onClick={() => isCurrentMonth && onDateSelect(date)}
              disabled={!isCurrentMonth}
              className={`
                p-2 text-left rounded hover:bg-blue-50 transition-colors
                ${isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                ${!isCurrentMonth ? 'cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className="text-sm font-medium">{date.getDate()}</div>
              {isCurrentMonth && (
                <div className="text-xs text-blue-600 font-semibold">
                  ${price.toFixed(0)}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Review component with category breakdown
function ReviewScores({ rating = 3.6, reviewCount = 3 }: { rating?: number; reviewCount?: number }) {
  const categories = [
    { name: 'Quality', score: 3.33 },
    { name: 'Location', score: 4.0 },
    { name: 'Amenities', score: 3.67 },
    { name: 'Services', score: 3.0 },
    { name: 'Price', score: 4.0 }
  ];

  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center gap-3 mb-4">
        <StarSolidIcon className="h-6 w-6 text-yellow-400" />
        <div className="text-2xl font-bold">{rating.toFixed(1)}/5</div>
        <div className="text-gray-500">Very Good</div>
      </div>
      <div className="text-sm text-gray-600 mb-4">{reviewCount} verified reviews</div>
      
      <div className="space-y-3">
        {categories.map(category => (
          <div key={category.name} className="flex items-center gap-3">
            <div className="w-16 text-sm text-gray-700">{category.name}</div>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-yellow-400" 
                style={{ width: `${(category.score / 5) * 100}%` }}
              />
            </div>
            <div className="w-8 text-sm font-medium">{category.score.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Included/Excluded component
function IncludedExcluded({ inclusions }: { inclusions: any[] }) {
  const included = inclusions?.filter(item => item.category === 'included') || [];
  const excluded = inclusions?.filter(item => item.category === 'excluded') || [];

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-xl font-semibold mb-4">Included/Exclude</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold mb-3">Included</h4>
          <ul className="space-y-2">
            {included.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckIcon className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">{item.item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Excluded</h4>
          <ul className="space-y-2">
            {excluded.map((item, index) => (
              <li key={index} className="flex items-center gap-2">
                <XMarkIcon className="h-5 w-5 text-red-500" />
                <span className="text-gray-700">{item.item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

// Tour Plan component
function TourPlan({ itinerary }: { itinerary: any[] }) {
  if (!itinerary || itinerary.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-xl font-semibold mb-4">Tour Plan</h3>
      <div className="space-y-4">
        {itinerary.map((day, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                {day.day}
              </div>
              <h4 className="font-semibold">{day.title}</h4>
            </div>
            {day.description && (
              <p className="text-gray-700 ml-11">{day.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Amenities component
function Amenities({ amenities }: { amenities: any[] }) {
  if (!amenities || amenities.length === 0) return null;

  const amenityIcons: Record<string, any> = {
    'Diving': GlobeAltIcon,
    'WiFi': WifiIcon,
    'Restaurants': CakeIcon,
    'Spa': ShieldCheckIcon,
    'Swimming Pool': HomeIcon,
    'Watersports': GlobeAltIcon,
    'Flat Screen TV': HomeIcon
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-xl font-semibold mb-4">Amenities</h3>
      <div className="flex flex-wrap gap-3">
        {amenities.map((amenity, index) => {
          const IconComponent = amenityIcons[amenity.name] || HomeIcon;
          return (
            <div key={index} className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-full">
              <IconComponent className="h-4 w-4 text-gray-600" />
              <span className="text-sm text-gray-700">{amenity.name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Related Tours component
function RelatedTours({ tours, currentId }: { tours: any[]; currentId: number }) {
  const filteredTours = tours.filter(tour => tour.id !== currentId).slice(0, 3);

  if (filteredTours.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-xl font-semibold mb-4">Related Tours</h3>
      <div className="space-y-4">
        {filteredTours.map(tour => (
          <Link 
            key={tour.id} 
            to={`/packages/${tour.id}/raajje`}
            className="flex items-center gap-4 group hover:bg-gray-50 p-3 rounded-lg transition-colors"
          >
            {tour.images?.[0]?.image && (
              <LazyImage 
                src={tour.images[0].image} 
                alt={tour.name}
                className="w-20 h-16 object-cover rounded-lg"
              />
            )}
            <div className="flex-1">
              <h4 className="font-semibold group-hover:text-blue-600 transition-colors">
                {tour.name}
              </h4>
              <p className="text-sm text-gray-600">
                From ${parseFloat(tour.price).toFixed(0)}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-600">
                  {tour.rating?.toFixed(1) || '4.0'} ({tour.review_count || 0})
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Last Minute Deals component
function LastMinuteDeals({ tours, currentId }: { tours: any[]; currentId: number }) {
  const filteredTours = tours.filter(tour => tour.id !== currentId).slice(0, 3);

  if (filteredTours.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="text-lg font-semibold mb-4">Last Minute Deals</h3>
      <div className="space-y-3">
        {filteredTours.map(tour => (
          <Link 
            key={tour.id} 
            to={`/packages/${tour.id}/raajje`}
            className="flex items-center gap-3 group"
          >
            {tour.images?.[0]?.image && (
              <LazyImage 
                src={tour.images[0].image} 
                alt={tour.name}
                className="w-16 h-12 object-cover rounded"
              />
            )}
            <div className="flex-1">
              <h4 className="font-medium text-sm group-hover:text-blue-600 transition-colors">
                {tour.name}
              </h4>
              <p className="text-xs text-gray-600">
                From ${parseFloat(tour.price).toFixed(0)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// Main component
export default function PackageDetailPageRaajje() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showError } = useNotification();
  
  const packageId = Number(id);
  const { data: pkg, isLoading, error } = usePackage(packageId);
  const { data: relatedPackages = [] } = usePackages({ is_featured: true });

  // Booking form state
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bookingTime, setBookingTime] = useState('');
  const [tickets, setTickets] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !pkg) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="p-8 max-w-md w-full">
          <div className="text-center">
            <XMarkIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Package Not Found</h2>
            <p className="text-gray-600 mb-6">The package you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/packages')} variant="primary">
              Browse Packages
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const price = parseFloat(pkg.price);
  const totalPrice = tickets * price;

  const handleBooking = () => {
    if (!selectedDate || !bookingTime || tickets < 1) {
      showError('Please fill in all the data.');
      return;
    }

    const message = `Hi! I'm interested in the "${pkg.name}" package on ${selectedDate.toDateString()} at ${bookingTime} for ${tickets} ticket(s). Total $${totalPrice.toFixed(2)} USD.`;
    whatsappBooking.openWhatsApp(message);
  };

  return (
    <>
      <SEO 
        title={`${pkg.name} - Maldives Travel Package`}
        description={pkg.description}
        image={pkg.images?.[0]?.image}
      />
      
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="relative text-white">
          <div className="absolute inset-0">
            {pkg.images?.[0]?.image ? (
              <LazyImage 
                src={pkg.images[0].image} 
                alt={pkg.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600" />
            )}
            <div className="absolute inset-0 bg-black/50" />
          </div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Breadcrumb */}
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={() => navigate('/packages')} 
                className="flex items-center gap-2 text-white/90 hover:text-white"
              >
                <ArrowLeftIcon className="h-5 w-5" />
                <span>Back to Packages</span>
              </button>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <span>Home</span>
                <span>/</span>
                <span>Offers</span>
                <span>/</span>
                <span className="font-semibold">{pkg.name}</span>
              </div>
            </div>

            {/* Hero Content */}
            <div className="grid lg:grid-cols-12 gap-8 items-end">
              <div className="lg:col-span-8">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                    {pkg.category || 'Full-Board'}
                  </span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-medium">
                    {pkg.difficulty_level || 'Easy'}
                  </span>
                  {pkg.is_featured && (
                    <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-medium">
                      Featured
                    </span>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-5xl font-bold mb-3">{pkg.name}</h1>
                
                <div className="flex items-center gap-3 text-sm opacity-90 mb-2">
                  {pkg.destinations?.[0]?.location && (
                    <span className="flex items-center gap-2">
                      <MapPinIcon className="h-4 w-4" />
                      {pkg.destinations[0].location.island}, {pkg.destinations[0].location.atoll}
                    </span>
                  )}
                  <span className="flex items-center gap-2">
                    <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                    {pkg.rating || 3.6} by {pkg.review_count || 3} reviews
                  </span>
                </div>
                
                <p className="max-w-3xl text-white/90 mb-4">{pkg.description}</p>
                
                <div className="flex flex-wrap gap-6 text-sm">
                  <span className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    {pkg.duration} days
                  </span>
                  <span className="flex items-center gap-2">
                    <UsersIcon className="h-5 w-5" />
                    {pkg.group_size?.min || 1}-{pkg.group_size?.max || 6} people
                  </span>
                  <span className="flex items-center gap-2">
                    <MapPinIcon className="h-5 w-5" />
                    {pkg.destinations?.length || 1} destinations
                  </span>
                </div>
              </div>
              
              <div className="lg:col-span-4">
                <div className="rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm opacity-90">From</span>
                    <div className="flex items-center gap-2">
                      <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                      <span className="text-sm">{pkg.rating || 3.6} ({pkg.review_count || 3})</span>
                    </div>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-bold">${price.toFixed(0)}</span>
                    <span className="text-sm opacity-80">per person</span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <Button 
                      onClick={handleBooking}
                      className="bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg"
                    >
                      <CalendarIcon className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                                         <Button 
                       onClick={() => {
                         const message = `Hi! I'm interested in the "${pkg.name}" package.`;
                         whatsappBooking.openWhatsApp(message);
                       }}
                       className="bg-white/20 hover:bg-white/30 text-white py-2 rounded-lg"
                     >
                       <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                       WhatsApp
                     </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Share & Wishlist */}
              <div className="bg-white rounded-lg border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <ShareIcon className="h-5 w-5" />
                    <span>Share This Post:</span>
                    <a 
                      className="underline hover:text-blue-600" 
                      target="_blank" 
                      rel="noreferrer" 
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    >
                      Facebook
                    </a>
                    <a 
                      className="underline hover:text-sky-500" 
                      target="_blank" 
                      rel="noreferrer" 
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(pkg.name)}&url=${encodeURIComponent(window.location.href)}`}
                    >
                      Twitter
                    </a>
                  </div>
                  <button className="flex items-center gap-2 text-sm text-gray-700 hover:text-red-600">
                    <HeartIcon className="h-5 w-5" />
                    <span>Wishlist</span>
                  </button>
                </div>
              </div>

              {/* Overview */}
              <div className="bg-white rounded-lg border p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>
                <p className="text-gray-700 leading-relaxed">
                  {pkg.detailed_description || pkg.description}
                </p>
              </div>

              {/* Included/Excluded */}
              <IncludedExcluded inclusions={pkg.inclusions} />

              {/* Tour Plan */}
              <TourPlan itinerary={pkg.itinerary} />

              {/* Amenities */}
              <Amenities amenities={pkg.amenities} />

              {/* Review Scores */}
              <ReviewScores rating={pkg.rating} reviewCount={pkg.review_count} />

              {/* Related Tours */}
              <RelatedTours tours={relatedPackages} currentId={pkg.id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Calendar & Price */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Calendar & Price</h3>
                <Calendar price={price} onDateSelect={setSelectedDate} />
              </div>

              {/* Booking Form */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Booking Tour</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">From:</label>
                    <input 
                      type="date" 
                      value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ''} 
                      onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Time:</label>
                    <input 
                      type="time" 
                      value={bookingTime} 
                      onChange={(e) => setBookingTime(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Tickets:</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="6"
                      value={tickets} 
                      onChange={(e) => setTickets(parseInt(e.target.value) || 1)}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  
                  <div className="text-sm text-gray-700 flex items-center justify-between">
                    <span>Total:</span>
                    <span className="font-semibold">${totalPrice.toFixed(2)}</span>
                  </div>
                  
                  <Button 
                    onClick={handleBooking}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                  >
                    Book Now
                  </Button>
                </div>
              </div>

              {/* Tour Information */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Tour Information</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Max Guests</span>
                    <span className="font-medium">{pkg.group_size?.max || 6}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Min Age</span>
                    <span className="font-medium">12+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Languages Support</span>
                    <span className="font-medium">English</span>
                  </div>
                </div>
              </div>

              {/* Last Minute Deals */}
              <LastMinuteDeals tours={relatedPackages} currentId={pkg.id} />

              {/* Contact Information */}
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">Contact</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <MapPinIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">H. Orchid Maage, Fareedhee Magu, Maldives</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">sales@raajjetours.com</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <PhoneIcon className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-700">+960 754 2777</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
