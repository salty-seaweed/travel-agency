import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PhoneIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { useResort } from '../../hooks/useResorts';
import { useUserCountry } from '../../hooks/useUserCountry';
import { useNotification } from '../../hooks';
import { useTranslation } from '../../i18n';
import { useWhatsApp, useHomepageContent } from '../../hooks/useQueries';
import { whatsappBooking } from '../../services/whatsapp-booking';
import { LoadingSpinner } from '../LoadingSpinner';
import { LazyImage } from '../LazyImage';
import type { ResortRoomType } from '../../types';
import './ResortRoomBookingPage.css';

interface LocationState {
  roomTypeId?: number | null;
  roomSelections?: Record<number, number>;
}

interface BookingFormState {
  name: string;
  email: string;
  phone: string;
  nationality: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rooms: number;
  specialRequests: string;
}

type RoomSelections = Record<number, number>;

export function ResortRoomBookingPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const resortId = id ? parseInt(id, 10) : 0;
  const userCountry = useUserCountry();
  const { resort, loading, error } = useResort(resortId, userCountry || undefined);
  const { t } = useTranslation();
  const { showError, showSuccess } = useNotification();
  const { whatsappNumber } = useWhatsApp();
  const { data: homepageContent } = useHomepageContent();

  const initialSelections: RoomSelections = useMemo(() => {
    if (state?.roomSelections) {
      const valid = Object.entries(state.roomSelections).reduce<RoomSelections>((acc, [key, value]) => {
        const qty = Number(value);
        if (!Number.isNaN(qty) && qty > 0) {
          acc[Number(key)] = qty;
        }
        return acc;
      }, {});
      if (Object.keys(valid).length > 0) {
        return valid;
      }
    }
    if (state?.roomTypeId) {
      return { [state.roomTypeId]: 1 };
    }
    return {};
  }, [state?.roomSelections, state?.roomTypeId]);

  const [roomSelections, setRoomSelections] = useState<RoomSelections>(initialSelections);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<BookingFormState>({
    name: '',
    email: '',
    phone: '',
    nationality: '',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    rooms: Object.values(initialSelections).reduce((total, qty) => total + qty, 0) || 1,
    specialRequests: '',
  });
  const formRef = useRef<HTMLDivElement | null>(null);

  const activeRoomTypes = useMemo<ResortRoomType[]>(() => {
    if (!resort?.room_types) return [];
    return resort.room_types.filter((roomType) => roomType && roomType.is_active);
  }, [resort?.room_types]);

  const selectedRooms = useMemo(
    () => activeRoomTypes.filter((roomType) => (roomSelections[roomType.id] ?? 0) > 0),
    [activeRoomTypes, roomSelections],
  );

  const totalSelectedRooms = useMemo(
    () => selectedRooms.reduce((total, roomType) => total + (roomSelections[roomType.id] ?? 0), 0),
    [roomSelections, selectedRooms],
  );

  useEffect(() => {
    if (resort && !resort.is_room_type) {
      navigate(`/resorts/${resort.id}`, { replace: true });
    }
  }, [resort, navigate]);

  useEffect(() => {
    const validIds = new Set(activeRoomTypes.map((roomType) => roomType.id));
    setRoomSelections((prev) => {
      const next = { ...prev };
      let changed = false;
      Object.keys(next).forEach((key) => {
        const numericKey = Number(key);
        if (!validIds.has(numericKey)) {
          delete next[numericKey];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [activeRoomTypes]);

  useEffect(() => {
    if (!activeRoomTypes.length) {
      setRoomSelections({});
      return;
    }

    if (Object.keys(roomSelections).length === 0) {
      const fallbackId =
        (state?.roomTypeId &&
          activeRoomTypes.some((roomType) => roomType.id === state.roomTypeId) &&
          state.roomTypeId) ||
        activeRoomTypes[0].id;
      setRoomSelections({ [fallbackId]: 1 });
    }
  }, [activeRoomTypes, roomSelections, state?.roomTypeId]);

  useEffect(() => {
    const desiredRooms = totalSelectedRooms > 0 ? totalSelectedRooms : 1;
    setFormData((prev) => (prev.rooms === desiredRooms ? prev : { ...prev, rooms: desiredRooms }));
  }, [totalSelectedRooms]);

  const handleInputChange = (field: keyof BookingFormState, value: string | number) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoomQuantityChange = (roomTypeId: number, quantity: number) => {
    const safeQuantity = Math.max(0, Math.min(quantity, 5));
    setRoomSelections((prev) => {
      const next = { ...prev };
      if (safeQuantity > 0) {
        next[roomTypeId] = safeQuantity;
      } else {
        delete next[roomTypeId];
      }
      return next;
    });
  };

  const scrollToForm = () => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleQuickSelect = (roomTypeId: number) => {
    setRoomSelections((prev) => {
      const next = { ...prev };
      next[roomTypeId] = next[roomTypeId] ? next[roomTypeId] : 1;
      return next;
    });
    scrollToForm();
  };

  const validateForm = () => {
    if (!selectedRooms.length) {
      showError('Please choose at least one room type to continue.');
      return false;
    }
    if (!formData.name.trim()) {
      showError(t('simpleBooking.error.nameRequired', 'Name is required'));
      return false;
    }
    if (!formData.email.trim()) {
      showError(t('simpleBooking.error.emailRequired', 'Email is required'));
      return false;
    }
    if (!formData.phone.trim()) {
      showError(t('simpleBooking.error.phoneRequired', 'Phone is required'));
      return false;
    }
    if (!formData.nationality.trim()) {
      showError('Nationality is required');
      return false;
    }
    if (!formData.checkIn) {
      showError(t('simpleBooking.error.checkInRequired', 'Check-in date is required'));
      return false;
    }
    if (!formData.checkOut) {
      showError(t('simpleBooking.error.checkOutRequired', 'Check-out date is required'));
      return false;
    }
    if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
      showError(t('simpleBooking.error.invalidDates', 'Check-out date must be after check-in date'));
      return false;
    }
    if (!formData.rooms || formData.rooms < 1) {
      showError('Please specify how many rooms you would like to book.');
      return false;
    }
    if (formData.rooms < totalSelectedRooms) {
      showError('Number of rooms cannot be less than the selected room quantities.');
      return false;
    }
    return true;
  };

  const formatRoomPrice = (roomType: ResortRoomType) => {
    if (!roomType.price_per_night) {
      return 'Starting from Contact us';
    }
    const currencyCode = (roomType.currency || resort?.currency || 'USD').toUpperCase();
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

  const buildBookingMessage = () => {
    const adultsLine = `${formData.adults} adult${formData.adults !== 1 ? 's' : ''}`;
    const childrenLine =
      formData.children > 0
        ? `, ${formData.children} child${formData.children !== 1 ? 'ren' : ''}`
        : '';
    const roomBreakdown = selectedRooms
      .map(
        (roomType) =>
          `• ${roomSelections[roomType.id]} x ${roomType.name} (${formatRoomPrice(roomType)})`,
      )
      .join('\n');

    return `🏨 *${resort?.name} Room Booking Request*

🛏️ *Room Count:* ${formData.rooms}${roomBreakdown ? `\n\n🏘️ *Room Selection:*\n${roomBreakdown}` : ''}

👤 *Guest Details:*
• Name: ${formData.name}
• Email: ${formData.email}
• Phone: ${formData.phone}
• Nationality: ${formData.nationality}

📅 *Travel Dates:*
• Check-in: ${formData.checkIn}
• Check-out: ${formData.checkOut}
• Guests: ${adultsLine}${childrenLine}

${formData.specialRequests ? `💬 *Special Requests:*\n${formData.specialRequests}\n\n` : ''}Please confirm availability and current pricing for this room.`;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    if (!selectedRooms.length) {
      showError('Please choose at least one room type to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      const message = buildBookingMessage();
      whatsappBooking.openWhatsApp(message, whatsappNumber);
      showSuccess('Your request has been sent! We will get in touch shortly.');
      navigate(`/resorts/${resortId}`);
    } catch (submitError) {
      console.error('Room booking submission failed', submitError);
      showError('Failed to submit booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleWhatsAppDirect = () => {
    if (!selectedRooms.length) {
      showError('Please choose at least one room type to continue.');
      return;
    }
    const message = buildBookingMessage();
    whatsappBooking.openWhatsApp(message, whatsappNumber);
  };

  if (loading) {
    return (
      <div className="resort-room-booking-loading">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error || !resort) {
    return (
      <div className="resort-room-booking-error">
        <div className="resort-room-booking-error-card">
          <h1>Resort not available</h1>
          <p>The resort you are trying to book could not be found.</p>
          <Link to="/resorts" className="resort-room-booking-back-link">
            Browse resorts
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="resort-room-booking-container">
      <div className="resort-room-booking-content">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="resort-room-booking-back-button"
        >
          <ArrowLeftIcon className="resort-room-booking-back-icon" />
          Back
        </button>

        <header className="resort-room-booking-header">
          <div>
            <h1>Book your stay at {resort.name}</h1>
            <p>
              Choose your preferred room type and share your travel details. Our concierge team
              will reply with the latest availability and rates.
            </p>
          </div>
          {resort.hero_image_url && (
            <LazyImage
              src={resort.hero_image_url}
              alt={resort.name}
              className="resort-room-booking-hero"
            />
          )}
        </header>

        <main className="resort-room-booking-main">
          <section className="resort-room-booking-room-types">
            <div className="resort-room-booking-section-header">
              <h2>Select room type</h2>
              <p>Each room has unique inclusions and pricing. Pick the best match for your stay.</p>
            </div>

            <div className="resort-room-booking-selected-summary">
              {selectedRooms.length > 0 ? (
                <span>
                  {totalSelectedRooms} room{totalSelectedRooms === 1 ? '' : 's'} selected
                </span>
              ) : (
                <span>No rooms selected yet.</span>
              )}
            </div>

            {activeRoomTypes.length > 0 ? (
              <div className="resort-detail-room-types-grid">
                {activeRoomTypes.map((roomType) => {
                  const quantity = roomSelections[roomType.id] ?? 0;
                  const amenitiesList = Array.isArray(roomType.amenities) ? roomType.amenities : [];
                  const displayedAmenities = amenitiesList.slice(0, 4);
                  const totalAmenities = amenitiesList.length;

                  return (
                    <div
                      key={roomType.id}
                      className={`resort-detail-room-type-card${
                        quantity > 0 ? ' resort-detail-room-type-card-selected' : ''
                      }`}
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
                          <span>
                            {roomType.occupancy_adults} adult{roomType.occupancy_adults !== 1 ? 's' : ''}
                            {roomType.occupancy_children > 0
                              ? ` • ${roomType.occupancy_children} child${
                                  roomType.occupancy_children !== 1 ? 'ren' : ''
                                }`
                              : ''}
                          </span>
                        </div>
                        {displayedAmenities.length > 0 && (
                          <div className="resort-detail-room-type-amenities">
                            {displayedAmenities.map((amenity, index) => (
                              <span
                                key={`${roomType.id}-short-amenity-${index}`}
                                className="resort-detail-room-type-amenity"
                              >
                                {amenity}
                              </span>
                            ))}
                            {totalAmenities > displayedAmenities.length && (
                              <span className="resort-detail-room-type-amenity-more">
                                +{totalAmenities - displayedAmenities.length} more
                              </span>
                            )}
                          </div>
                        )}
                        <div className="resort-detail-room-type-price">
                          {formatRoomPrice(roomType)}
                        </div>
                      </div>
                      <div className="resort-detail-room-type-actions">
                        <div className="resort-room-type-quantity">
                          <label htmlFor={`room-quantity-${roomType.id}`}>Rooms</label>
                          <select
                            id={`room-quantity-${roomType.id}`}
                            value={quantity}
                            onChange={(event) =>
                              handleRoomQuantityChange(roomType.id, parseInt(event.target.value, 10))
                            }
                          >
                            {Array.from({ length: 6 }, (_, idx) => (
                              <option key={idx} value={idx}>
                                {idx}
                              </option>
                            ))}
                          </select>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleQuickSelect(roomType.id)}
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
                  Room-specific pricing is being updated. Please share your travel details and our
                  team will recommend the best room options available.
                </p>
              </div>
            )}
          </section>

          <section className="resort-room-booking-form-section" ref={formRef}>
            <div className="resort-room-booking-section-header">
              <h2>Your stay details</h2>
              <p>
                Provide your travel information and we’ll confirm the best rates for your selected
                room type.
              </p>
            </div>

            <form className="resort-room-booking-form" onSubmit={handleSubmit}>
              <div className="resort-room-booking-form-grid">
                <div className="resort-room-booking-field">
                  <label htmlFor="name">Full name *</label>
                  <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={(event) => handleInputChange('name', event.target.value)}
                    required
                  />
                </div>
                <div className="resort-room-booking-field">
                  <label htmlFor="email">Email *</label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(event) => handleInputChange('email', event.target.value)}
                    required
                  />
                </div>
                <div className="resort-room-booking-field">
                  <label htmlFor="phone">Phone number *</label>
                  <input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(event) => handleInputChange('phone', event.target.value)}
                    required
                  />
                </div>
                <div className="resort-room-booking-field">
                  <label htmlFor="nationality">Nationality *</label>
                  <input
                    id="nationality"
                    type="text"
                    value={formData.nationality}
                    onChange={(event) => handleInputChange('nationality', event.target.value)}
                    placeholder="e.g., United Kingdom"
                    required
                  />
                </div>
                <div className="resort-room-booking-field">
                  <label htmlFor="checkIn">Check-in date *</label>
                  <input
                    id="checkIn"
                    type="date"
                    value={formData.checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(event) => handleInputChange('checkIn', event.target.value)}
                    required
                  />
                </div>
                <div className="resort-room-booking-field">
                  <label htmlFor="checkOut">Check-out date *</label>
                  <input
                    id="checkOut"
                    type="date"
                    value={formData.checkOut}
                    min={formData.checkIn || new Date().toISOString().split('T')[0]}
                    onChange={(event) => handleInputChange('checkOut', event.target.value)}
                    required
                  />
                </div>
                <div className="resort-room-booking-field">
                  <label htmlFor="adults">Adults *</label>
                  <select
                    id="adults"
                    value={formData.adults}
                    onChange={(event) => handleInputChange('adults', parseInt(event.target.value, 10))}
                    required
                  >
                    {Array.from({ length: 10 }, (_, index) => index + 1).map((number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="resort-room-booking-field">
                  <label htmlFor="children">Children</label>
                  <select
                    id="children"
                    value={formData.children}
                    onChange={(event) => handleInputChange('children', parseInt(event.target.value, 10))}
                  >
                    {Array.from({ length: 10 }, (_, index) => index).map((number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="resort-room-booking-field">
                  <label htmlFor="rooms">Number of rooms *</label>
                  <select
                    id="rooms"
                    value={formData.rooms}
                    onChange={(event) => handleInputChange('rooms', parseInt(event.target.value, 10))}
                    required
                  >
                    {Array.from({ length: 10 }, (_, index) => index + 1).map((number) => (
                      <option key={number} value={number}>
                        {number}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="resort-room-booking-field">
                <label htmlFor="specialRequests">Special requests</label>
                <textarea
                  id="specialRequests"
                  rows={4}
                  value={formData.specialRequests}
                  onChange={(event) => handleInputChange('specialRequests', event.target.value)}
                  placeholder="Share any preferences, occasions, or transfer requirements."
                />
              </div>

              <div className="resort-room-booking-actions">
                <button
                  type="button"
                  className="resort-room-booking-action resort-room-booking-action-secondary"
                  onClick={handleWhatsAppDirect}
                >
                  Message on WhatsApp
                </button>
                <button
                  type="submit"
                  className="resort-room-booking-action resort-room-booking-action-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit booking request'}
                </button>
              </div>
            </form>
          </section>
        </main>

        <footer className="resort-room-booking-footer">
          <div className="resort-room-booking-contact">
            <h3>Need any help?</h3>
            <p>Our team is available to tailor every detail of your getaway.</p>
            <div className="resort-room-booking-contact-details">
              <span>
                <PhoneIcon className="resort-room-booking-contact-icon" />
                {homepageContent?.settings?.contact_phone || whatsappNumber}
              </span>
              <span>
                <EnvelopeIcon className="resort-room-booking-contact-icon" />
                {homepageContent?.settings?.contact_email || 'info@threadtravels.com'}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ResortRoomBookingPage;

