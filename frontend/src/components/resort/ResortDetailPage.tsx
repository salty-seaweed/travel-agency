import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { StarIcon, MapPinIcon, ChevronLeftIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useResort, useResortImages } from '../../hooks/useResorts';
import { useUserCountry } from '../../hooks/useUserCountry';
import { LoadingSpinner } from '../LoadingSpinner';
import { LazyImage } from '../LazyImage';
import { ResortBookingForm } from './ResortBookingForm';
import { SimpleBookingForm } from './SimpleBookingForm';
import { useWhatsApp } from '../../hooks/useQueries';
import { whatsappBooking } from '../../services/whatsapp-booking';
import './ResortDetailPage.css';

export function ResortDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const resortId = id ? parseInt(id) : 0;
  const userCountry = useUserCountry();
  const { whatsappNumber } = useWhatsApp();
  
  const { resort, loading: resortLoading, error: resortError } = useResort(resortId, userCountry || undefined);
  const { images, loading: imagesLoading } = useResortImages(resortId);
  
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  if (resortLoading || imagesLoading) {
    return (
      <div className="resort-detail-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (resortError || !resort) {
    return (
      <div className="resort-detail-error">
        <div className="resort-detail-error-content">
          <h3 className="resort-detail-error-title">Resort not found</h3>
          <p className="resort-detail-error-description">The resort you're looking for doesn't exist.</p>
          <Link to="/resorts" className="resort-detail-error-button">
            Back to Resorts
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [
    ...(resort.hero_image_url ? [{ url: resort.hero_image_url, type: 'hero' }] : []),
    ...(Array.isArray(images) ? images.map(img => ({ 
      url: img.image_url || img.image || '', 
      type: img.image_type || 'gallery' 
    })) : []),
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleBookNow = () => {
    setShowBookingForm(true);
  };

  const handleWhatsAppBooking = () => {
    if (resort) {
      const message = `Hi! I'm interested in booking ${resort.name}.

📍 Location: ${resort.full_location || `${resort.atoll}, Maldives`}
⭐ Rating: ${resort.star_rating} Star Resort

Please help me with availability and booking process. Thank you!`;

      whatsappBooking.openWhatsApp(message, whatsappNumber);
    }
  };

  return (
    <div className="resort-detail-container">
      {/* Main Content */}
      <main className="resort-detail-main">
        <div className="resort-detail-content-wrapper">
          {/* Hero Section */}
          <section className="resort-detail-hero-section">
            <div className="resort-detail-hero-content">
              <h1 className="resort-detail-title">{resort.name}</h1>
              <div className="resort-detail-subtitle">
                <div className="resort-detail-rating">
                  {[...Array(5)].map((_, i) => (
                    <StarIconSolid
                      key={i}
                      className={`resort-detail-star ${
                        i < resort.star_rating ? 'resort-detail-star-filled' : 'resort-detail-star-empty'
                      }`}
                    />
                  ))}
                  <span className="resort-detail-rating-text">{resort.star_rating} Star Resort</span>
                </div>
                <div className="resort-detail-location">
                  <MapPinIcon className="resort-detail-location-icon" />
                  <span>{resort.full_location || `${resort.atoll}, Maldives`}</span>
                </div>
              </div>
            </div>
          </section>

          {/* Image Gallery */}
          <section className="resort-detail-gallery-section">
            {allImages.length > 0 && (
              <div className="resort-detail-gallery">
                <div className="resort-detail-gallery-grid">
                  {allImages.slice(0, 4).map((img, index) => (
                    <div key={index} className={`resort-detail-gallery-item ${index === 0 ? 'resort-detail-gallery-main' : ''}`}>
                      <LazyImage
                        src={img.url}
                        alt={`${resort.name} - Image ${index + 1}`}
                        className="resort-detail-gallery-image"
                      />
                    </div>
                  ))}
                </div>
                {allImages.length > 4 && (
                  <div className="resort-detail-gallery-more">
                    <span>Show all {allImages.length} photos</span>
                  </div>
                )}
              </div>
            )}
          </section>

          {/* Resort Details */}
          <section className="resort-detail-info-section">
            <div className="resort-detail-info-content">
              <div className="resort-detail-main-info">
                <h2>About this property</h2>
                <p className="resort-detail-description">{resort.description}</p>
                {resort.detailed_description && (
                  <p className="resort-detail-detailed-description">{resort.detailed_description}</p>
                )}

                {/* Features */}
                {(resort.restaurants > 0 || resort.bars > 0 || resort.spa_centers > 0 || resort.pools > 0) && (
                  <div className="resort-detail-features">
                    <h3>What this place offers</h3>
                    <div className="resort-detail-features-list">
                      {resort.restaurants > 0 && (
                        <div className="resort-detail-feature-item">
                          <span className="resort-detail-feature-label">Transfer</span>
                          <span className="resort-detail-feature-value">Seaplane</span>
                        </div>
                      )}
                      {resort.pools > 0 && (
                        <div className="resort-detail-feature-item">
                          <span className="resort-detail-feature-label">Special Features</span>
                          <span className="resort-detail-feature-value">
                            A stunning island resort with luxury accommodations, water sports, and wellness facilities. Includes beach villas, water sports, a spa, restaurants, pools, and more.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Accommodation Options */}
                <div className="resort-detail-accommodation-section">
                  <h3>Accommodation Options</h3>
                  <div className="resort-detail-accommodation-grid">
                    {resort.beach_villas && resort.beach_villas > 0 && (
                      <div className="resort-detail-accommodation-item">
                        <LazyImage
                          src="/images/accommodations/beach-villa.jpg"
                          alt="Beach Villa"
                          className="resort-detail-accommodation-image"
                        />
                        <p className="resort-detail-accommodation-name">Beach Villa</p>
                      </div>
                    )}
                    {resort.overwater_villas && resort.overwater_villas > 0 && (
                      <div className="resort-detail-accommodation-item">
                        <LazyImage
                          src="/images/accommodations/overwater-villa.jpg"
                          alt="Overwater Villa"
                          className="resort-detail-accommodation-image"
                        />
                        <p className="resort-detail-accommodation-name">Overwater Villa</p>
                      </div>
                    )}
                    {resort.water_villas && resort.water_villas > 0 && (
                      <div className="resort-detail-accommodation-item">
                        <LazyImage
                          src="/images/accommodations/water-villa.jpg"
                          alt="Water Villa"
                          className="resort-detail-accommodation-image"
                        />
                        <p className="resort-detail-accommodation-name">Water Villa</p>
                      </div>
                    )}
                    {resort.garden_villas && resort.garden_villas > 0 && (
                      <div className="resort-detail-accommodation-item">
                        <LazyImage
                          src="/images/accommodations/garden-villa.jpg"
                          alt="Garden Villa"
                          className="resort-detail-accommodation-image"
                        />
                        <p className="resort-detail-accommodation-name">Garden Villa</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <aside className="resort-detail-sidebar">
                <div className="resort-detail-booking-card">
                  <h3 className="resort-detail-booking-title">Ready to book?</h3>
                  <p className="resort-detail-booking-description">
                    Contact us for personalized rates and availability
                  </p>

                  <div className="resort-detail-booking-buttons">
                    <button
                      onClick={handleWhatsAppBooking}
                      className="resort-detail-booking-button resort-detail-booking-button-whatsapp"
                    >
                      WhatsApp Us
                    </button>
                    <button
                      onClick={handleBookNow}
                      className="resort-detail-booking-button resort-detail-booking-button-primary"
                    >
                      Book Now
                    </button>
                  </div>

                  <div className="resort-detail-booking-features">
                    <div className="resort-detail-booking-feature">
                      <svg className="resort-detail-booking-feature-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Best price guarantee
                    </div>
                    <div className="resort-detail-booking-feature">
                      <svg className="resort-detail-booking-feature-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Customer support
                    </div>
                    <div className="resort-detail-booking-feature">
                      <svg className="resort-detail-booking-feature-icon" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Personalized recommendations
                    </div>
                  </div>
                </div>

              </aside>
            </div>
          </section>
        </div>
      </main>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <SimpleBookingForm
          resort={resort}
          isOpen={showBookingForm}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
}