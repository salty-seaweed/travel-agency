// WhatsApp Booking Service
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
  openWhatsApp: (message: string, phoneNumber: string = '+9601234567'): void => {
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
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
  }
}; 