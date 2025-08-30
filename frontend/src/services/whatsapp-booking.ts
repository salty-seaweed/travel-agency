// WhatsApp Booking Service
import { config } from '../config';

export interface WhatsAppBookingData {
  propertyName: string;
  propertyId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
  pricePerNight: number;
  totalPrice?: number;
}

// WhatsApp number validation and formatting
const validateAndFormatWhatsAppNumber = (phoneNumber: string): string => {
  // Remove all non-digit characters
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  
  // Check if it's a valid Maldives number (960 + 7 digits)
  if (cleanNumber.startsWith('960') && cleanNumber.length === 10) {
    return cleanNumber;
  }
  
  // Check if it's a valid international number (country code + number)
  if (cleanNumber.length >= 10 && cleanNumber.length <= 15) {
    return cleanNumber;
  }
  
  // If invalid, return the default number
  console.warn(`Invalid WhatsApp number format: ${phoneNumber}. Using default number.`);
  return '9607441097'; // Default Maldives number
};

// Get the configured WhatsApp number
const getWhatsAppNumber = (): string => {
  const configuredNumber = config.whatsappNumber;
  return validateAndFormatWhatsAppNumber(configuredNumber);
};

export const whatsappBooking = {
  // Generate WhatsApp message for property booking
  generatePropertyMessage: (data: WhatsAppBookingData): string => {
    const nights = Math.ceil((new Date(data.checkOutDate).getTime() - new Date(data.checkInDate).getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = data.totalPrice || (data.pricePerNight * nights);
    
    return `Hi! I'm interested in booking ${data.propertyName}.

📋 *Booking Details:*
• Check-in: ${data.checkInDate}
• Check-out: ${data.checkOutDate}
• Nights: ${nights}
• Guests: ${data.numberOfGuests}
• Price per night: $${data.pricePerNight}
• Total: $${totalPrice}

👤 *Guest Information:*
• Name: ${data.customerName}
• Email: ${data.customerEmail}
• Phone: ${data.customerPhone}

${data.specialRequests ? `📝 *Special Requests:*\n${data.specialRequests}\n` : ''}
Please let me know if this property is available for these dates and help me with the booking process. Thank you!`;
  },

  // Generate WhatsApp message for package booking
  generatePackageMessage: (data: WhatsAppBookingData): string => {
    return `Hi! I'm interested in booking the ${data.propertyName} package.

📋 *Package Details:*
• Package: ${data.propertyName}
• Check-in: ${data.checkInDate}
• Check-out: ${data.checkOutDate}
• Guests: ${data.numberOfGuests}
• Price: $${data.pricePerNight}

👤 *Guest Information:*
• Name: ${data.customerName}
• Email: ${data.customerEmail}
• Phone: ${data.customerPhone}

${data.specialRequests ? `📝 *Special Requests:*\n${data.specialRequests}\n` : ''}
Please let me know if this package is available and help me with the booking process. Thank you!`;
  },

  // Open WhatsApp with pre-filled message
  openWhatsApp: (message: string, phoneNumber?: string): void => {
    try {
      const number = phoneNumber ? validateAndFormatWhatsAppNumber(phoneNumber) : getWhatsAppNumber();
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://wa.me/${number}?text=${encodedMessage}`;
      
      // Log the URL for debugging (remove in production)
      console.log('Opening WhatsApp URL:', whatsappUrl);
      
      window.open(whatsappUrl, '_blank');
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      // Fallback: show error message to user
      alert('Unable to open WhatsApp. Please contact us directly at +960 744 1097');
    }
  },

  // Direct WhatsApp booking for property
  bookPropertyDirect: (property: any, phoneNumber?: string): void => {
    const message = `Hi! I'm interested in booking ${property.name}.

📍 Location: ${property.location?.island || 'Maldives'}, ${property.location?.atoll || 'Paradise'}
💰 Price: $${property.price_per_night || property.price} per night
🏖️ Type: ${property.property_type?.name || 'Luxury Resort'}

Please help me with availability and booking process. Thank you!`;
    
    whatsappBooking.openWhatsApp(message, phoneNumber);
  },

  // Direct WhatsApp booking for package
  bookPackageDirect: (pkg: any, phoneNumber?: string): void => {
    const message = `Hi! I'm interested in booking the ${pkg.name} package.

🏖️ Package: ${pkg.name}
📍 Destinations: ${pkg.destinations?.join(', ') || 'Maldives Paradise'}
💰 Price: $${pkg.price} per person
⏱️ Duration: ${pkg.duration} days
👥 Max Travelers: ${pkg.maxTravelers || 4}

Please help me with availability and booking process. Thank you!`;
    
    whatsappBooking.openWhatsApp(message, phoneNumber);
  },

  // Get WhatsApp URL for direct use
  getWhatsAppUrl: (message: string, phoneNumber?: string): string => {
    const number = phoneNumber ? validateAndFormatWhatsAppNumber(phoneNumber) : getWhatsAppNumber();
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${number}?text=${encodedMessage}`;
  },

  // Get the current WhatsApp number
  getWhatsAppNumber: (): string => {
    return getWhatsAppNumber();
  },

  // Test WhatsApp number validity
  testWhatsAppNumber: async (phoneNumber?: string): Promise<boolean> => {
    const number = phoneNumber ? validateAndFormatWhatsAppNumber(phoneNumber) : getWhatsAppNumber();
    const testUrl = `https://wa.me/${number}`;
    
    try {
      const response = await fetch(testUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      console.error('Error testing WhatsApp number:', error);
      return false;
    }
  }
}; 