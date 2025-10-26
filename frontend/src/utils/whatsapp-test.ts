// WhatsApp testing utility
import { whatsappBooking } from '../services/whatsapp-booking';

export const testWhatsAppIntegration = async () => {
  console.log('🔍 Testing WhatsApp Integration...');
  
  // Test the current configured number
  const currentNumber = whatsappBooking.getWhatsAppNumber();
  console.log('📱 Current WhatsApp number:', currentNumber);
  
  // Test URL generation
  const testMessage = 'Hi! This is a test message.';
  const testUrl = whatsappBooking.getWhatsAppUrl(testMessage);
  console.log('🔗 Generated WhatsApp URL:', testUrl);
  
  // Test number validity
  try {
    const isValid = await whatsappBooking.testWhatsAppNumber();
    console.log('✅ WhatsApp number validity:', isValid);
    
    if (!isValid) {
      console.warn('⚠️ WhatsApp number may be invalid or not registered');
      console.log('💡 Try updating the VITE_WHATSAPP_NUMBER environment variable');
    }
  } catch (error) {
    console.error('❌ Error testing WhatsApp number:', error);
  }
  
  // Test different number formats
  const testNumbers = [
    '+9607441097',
    '9607441097',
    '+960 744 1097',
    '960 744 1097',
    '+960-744-1097',
    '960-744-1097'
  ];
  
  console.log('🧪 Testing different number formats:');
  testNumbers.forEach(number => {
    const formatted = whatsappBooking.getWhatsAppUrl('test', number);
    console.log(`  ${number} → ${formatted}`);
  });
};

// Export for use in browser console
if (typeof window !== 'undefined') {
  (window as any).testWhatsApp = testWhatsAppIntegration;
}


