import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPinIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid';
import { useResort, useResortImages } from '../../hooks/useResorts';
import { useUserCountry } from '../../hooks/useUserCountry';
import { LoadingSpinner } from '../LoadingSpinner';
import { LazyImage } from '../LazyImage';
import { SimpleBookingForm } from './SimpleBookingForm';
import { useWhatsApp } from '../../hooks/useQueries';
import { whatsappBooking } from '../../services/whatsapp-booking';
import './ResortDetailPage.css';
import type { ResortRoomType } from '../../types';

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
  const [roomSelections, setRoomSelections] = useState<Record<number, number>>({});

  const activeRoomTypes = useMemo(() => {
    if (!resort?.room_types) return [];
    return resort.room_types.filter((roomType: ResortRoomType) => roomType && roomType.is_active);
  }, [resort?.room_types]);

  useEffect(() => {
    if (!resort?.is_room_type) {
      setRoomSelections({});
      return;
    }
    if (activeRoomTypes.length === 0) {
      setRoomSelections({});
      return;
    }
    setRoomSelections(prev => {
      const next = { ...prev };
      let changed = false;
      const validIds = new Set(activeRoomTypes.map(roomType => roomType.id));
      Object.keys(next).forEach(key => {
        const numericKey = Number(key);
        if (!validIds.has(numericKey)) {
          delete next[numericKey];
          changed = true;
        }
      });
      if (Object.keys(next).length === 0) {
        next[activeRoomTypes[0].id] = 1;
        changed = true;
      }
      return changed ? next : prev;
    });
  }, [resort?.is_room_type, activeRoomTypes]);

  const totalSelectedRooms = useMemo(
    () => Object.values(roomSelections).reduce((total, qty) => total + qty, 0),
    [roomSelections]
  );

  const formatRoomPrice = (roomType: ResortRoomType) => {
    // If hide_price is true, show contact message
    if (roomType.hide_price) {
      return 'Contact us for pricing';
    }
    
    if (!roomType.price_per_night) {
      return 'Contact us for pricing';
    }
    const currencyCode = (roomType.currency || resort.currency || 'USD').toUpperCase();
    const amount = Number(roomType.price_per_night);
    if (!Number.isNaN(amount)) {
      try {
        const formatted = new Intl.NumberFormat(undefined, {
          style: 'currency',
          currency: currencyCode,
          maximumFractionDigits: 0,
        }).format(amount);
        return `Starting from ${formatted}`;
      } catch {
        return `Starting from ${currencyCode} ${amount.toLocaleString()}`;
      }
    }
    return `Starting from ${currencyCode} ${roomType.price_per_night}`;
  };

  const navigateToBookingPage = (roomTypeId?: number | null) => {
    if (resort.is_room_type) {
      let selections = roomSelections;
      if ((!selections || Object.keys(selections).length === 0) && activeRoomTypes.length > 0) {
        selections = { [roomTypeId ?? activeRoomTypes[0].id]: 1 };
        setRoomSelections(selections);
      } else if (roomTypeId && (!selections[roomTypeId] || selections[roomTypeId] < 1)) {
        selections = { ...selections, [roomTypeId]: 1 };
        setRoomSelections(selections);
      }
      navigate(`/resorts/${resort.id}/book`, {
        state: {
          roomSelections: selections,
        },
      });
      return;
    }
    setShowBookingForm(true);
  };

  const handleRoomQuantityChange = (roomTypeId: number, quantity: number) => {
    const safeQuantity = Math.max(0, Math.min(quantity, 5));
    setRoomSelections(prev => {
      const next = { ...prev };
      if (safeQuantity > 0) {
        next[roomTypeId] = safeQuantity;
      } else {
        delete next[roomTypeId];
      }
      return next;
    });
  };

  const handleQuickBook = (roomTypeId: number) => {
    setRoomSelections(prev => {
      const next = { ...prev };
      next[roomTypeId] = next[roomTypeId] ? next[roomTypeId] : 1;
      return next;
    });
    navigateToBookingPage(roomTypeId);
  };

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
    ...(Array.isArray(resort.gallery_images) ? resort.gallery_images.map((url: string) => ({ 
      url, 
      type: 'gallery' 
    })) : []),
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
    navigateToBookingPage();
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

  const primaryBookingLabel = resort.is_room_type
    ? totalSelectedRooms > 0
      ? `Book ${totalSelectedRooms} Room${totalSelectedRooms === 1 ? '' : 's'}`
      : 'Book Now (Select Rooms)'
    : 'Book Now';

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

                {/* Room Types */}
                {resort.is_room_type && (
                  <div className="resort-detail-room-types-section">
                    <div className="resort-detail-room-types-header">
                      <h3>Room Types & Pricing</h3>
                      <div className="resort-detail-room-types-selected">
                        {totalSelectedRooms > 0 ? (
                          <>
                            <span className="resort-detail-room-types-selected-label">Selected:</span>
                            <span className="resort-detail-room-types-selected-name">
                              {totalSelectedRooms} room{totalSelectedRooms === 1 ? '' : 's'} chosen
                            </span>
                          </>
                        ) : (
                          <span className="resort-detail-room-types-selected-name">
                            Choose your preferred room type below.
                          </span>
                        )}
                      </div>
                    </div>
                    {activeRoomTypes.length > 0 ? (
                      <div className="resort-detail-room-types-grid">
                        {activeRoomTypes.map((roomType) => {
                          const quantity = roomSelections[roomType.id] ?? 0;
                          const occupancyChunks = [
                            `${roomType.occupancy_adults} adult${roomType.occupancy_adults !== 1 ? 's' : ''}`,
                            ...(roomType.occupancy_children > 0
                              ? [`${roomType.occupancy_children} child${roomType.occupancy_children !== 1 ? 'ren' : ''}`]
                              : []),
                          ];
                          const amenitiesList = Array.isArray(roomType.amenities) ? roomType.amenities : [];
                          const displayedAmenities = amenitiesList.slice(0, 5);
                          const totalAmenities = amenitiesList.length;

                          return (
                            <div
                              key={roomType.id}
                              className={`resort-detail-room-type-card${quantity > 0 ? ' resort-detail-room-type-card-selected' : ''}`}
                            >
                              <div className="resort-detail-room-type-media">
                                {roomType.image_url || roomType.image ? (
                                  <LazyImage
                                    src={roomType.image_url || roomType.image || ''}
                                    alt={`${roomType.name} - ${resort.name}`}
                                    className="resort-detail-room-type-image"
                                  />
                                ) : (
                                  <div className="resort-detail-room-type-image-placeholder">
                                    <span>{roomType.name}</span>
                                  </div>
                                )}
                              </div>

                              <div className="resort-detail-room-type-body">
                                <div className="resort-detail-room-type-content">
                                  <div className="resort-detail-room-type-heading">
                                    <h4>{roomType.name}</h4>
                                    {roomType.bed_configuration && (
                                      <span className="resort-detail-room-type-bed">{roomType.bed_configuration}</span>
                                    )}
                                  </div>

                                  {roomType.description && (
                                    <p className="resort-detail-room-type-description">{roomType.description}</p>
                                  )}

                                  <div className="resort-detail-room-type-occupancy">
                                    <span>{occupancyChunks.join(' • ')}</span>
                                  </div>

                                  {displayedAmenities.length > 0 && (
                                    <div className="resort-detail-room-type-amenities">
                                      <ul className="resort-detail-room-type-amenities-list">
                                        {displayedAmenities.map((amenity, index) => (
                                          <li key={`${roomType.id}-amenity-${index}`}>
                                            {amenity}
                                          </li>
                                        ))}
                                      </ul>
                                      {totalAmenities > displayedAmenities.length && (
                                        <span className="resort-detail-room-type-amenity-more">
                                          +{totalAmenities - displayedAmenities.length} more amenities
                                        </span>
                                      )}
                                    </div>
                                  )}
                                </div>

                                <div className="resort-detail-room-type-price">
                                  {formatRoomPrice(roomType)}
                                </div>
                              </div>

                              <div className="resort-detail-room-type-actions">
                                <div className="resort-room-type-quantity">
                                  <label htmlFor={`resort-room-type-${roomType.id}-qty`}>Rooms</label>
                                  <select
                                    id={`resort-room-type-${roomType.id}-qty`}
                                    value={quantity}
                                    onChange={(event) =>
                                      handleRoomQuantityChange(roomType.id, parseInt(event.target.value, 10))
                                    }
                                  >
                                    {Array.from({ length: 6 }, (_, idx) => idx).map(num => (
                                      <option key={num} value={num}>{num}</option>
                                    ))}
                                  </select>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleQuickBook(roomType.id)}
                                  className="resort-detail-room-type-action-button resort-detail-room-type-book-button"
                                >
                                  Book this room
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="resort-detail-room-types-empty">
                        <p>
                          Room-specific pricing will be available soon. Please contact us to receive tailored rates for your stay.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Accommodation Options */}
                {!resort.is_room_type && (
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
                )}
              </div>

              {/* Sidebar */}
              <aside className="resort-detail-sidebar">
                <div className="resort-detail-booking-card">
                  <h3 className="resort-detail-booking-title">Ready to book?</h3>
                  <p className="resort-detail-booking-description">
                    {resort.is_room_type
                      ? 'Select your preferred room type to view tailored pricing and complete your booking request.'
                      : 'Contact us for personalized rates and availability'}
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
                      {primaryBookingLabel}
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
      {showBookingForm && !resort.is_room_type && (
        <SimpleBookingForm
          resort={resort}
          isOpen={showBookingForm}
          onClose={() => setShowBookingForm(false)}
        />
      )}
    </div>
  );
}