import React, { useState } from 'react';
import { 
  MapPinIcon, 
  PhoneIcon, 
  EnvelopeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      
      // Reset success message after 5 seconds
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 2000);
  };

  const contactInfo = [
    {
      icon: PhoneIcon,
      title: "Phone",
      details: ["+960 123 4567", "+960 987 6543"],
      description: "Call us for immediate assistance",
      action: "Call Now",
      actionUrl: "tel:+9601234567"
    },
    {
      icon: EnvelopeIcon,
      title: "Email",
      details: ["info@maldives-travel.com", "bookings@maldives-travel.com"],
      description: "Send us an email anytime",
      action: "Send Email",
      actionUrl: "mailto:info@maldives-travel.com"
    },
    {
      icon: MapPinIcon,
      title: "Office",
      details: ["123 Travel Street", "Male, Maldives 20000"],
      description: "Visit our office in Male",
      action: "Get Directions",
      actionUrl: "https://maps.google.com"
    },
    {
      icon: ClockIcon,
      title: "Business Hours",
      details: ["Mon-Fri: 9:00 AM - 6:00 PM", "Sat: 10:00 AM - 4:00 PM"],
      description: "We're here to help you",
      action: "WhatsApp",
      actionUrl: "https://wa.me/9601234567"
    }
  ];

  const faqs = [
    {
      question: "How do I book a property?",
      answer: "You can book properties through WhatsApp, email, or by calling us directly. We'll guide you through the entire process."
    },
    {
      question: "What's included in the travel packages?",
      answer: "Our packages typically include accommodation, some meals, transportation, and guided activities. Specific inclusions vary by package."
    },
    {
      question: "Do you offer airport transfers?",
      answer: "Yes, we can arrange airport transfers for most properties. This service is often included in our packages."
    },
    {
      question: "What's the best time to visit the Maldives?",
      answer: "The Maldives is a year-round destination, but the best weather is typically from November to April during the dry season."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section - Improved Mobile */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">Contact Us</h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-2xl mx-auto px-4">
              Ready to start your Maldives adventure? Get in touch with us and let's make your dream vacation a reality.
            </p>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {isSubmitted && (
        <div className="fixed top-4 left-4 right-4 z-50 bg-green-50 border border-green-200 rounded-lg p-4 shadow-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-600 mr-3" />
            <div>
              <h3 className="text-sm font-medium text-green-800">Message sent successfully!</h3>
              <p className="text-sm text-green-700">We'll get back to you within 24 hours.</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Information - Improved Mobile */}
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Get in Touch</h2>
              <p className="text-gray-600 text-base sm:text-lg">
                Have questions about our properties or packages? We're here to help you plan the perfect Maldives getaway.
              </p>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {contactInfo.map((info, index) => (
                <div key={index} className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <info.icon className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{info.title}</h3>
                      <div className="space-y-1 mb-3">
                        {info.details.map((detail, detailIndex) => (
                          <p key={detailIndex} className="text-sm sm:text-base text-gray-600">{detail}</p>
                        ))}
                      </div>
                      <p className="text-sm text-gray-500 mb-3">{info.description}</p>
                      <a
                        href={info.actionUrl}
                        className="inline-flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
                      >
                        {info.action}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* WhatsApp Quick Contact - Mobile Optimized */}
            <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
              <div className="flex items-center mb-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <ChatBubbleLeftRightIcon className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900">Quick WhatsApp Chat</h3>
                  <p className="text-sm text-gray-600">Get instant responses</p>
                </div>
              </div>
              <a
                href="https://wa.me/9601234567?text=Hi! I'm interested in your Maldives travel services. Can you help me?"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 text-white py-3 px-4 rounded-lg font-semibold text-center hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-lg">💬</span>
                Start WhatsApp Chat
              </a>
            </div>
          </div>

          {/* Contact Form - Improved Mobile */}
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 lg:p-8">
            <div className="mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Send us a Message</h2>
              <p className="text-gray-600">Fill out the form below and we'll get back to you as soon as possible.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="booking">Booking Request</option>
                    <option value="package">Package Information</option>
                    <option value="support">Customer Support</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base resize-none"
                  placeholder="Tell us about your travel plans, questions, or any specific requirements..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 sm:py-4 px-6 rounded-lg font-semibold text-base sm:text-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending Message...
                  </>
                ) : (
                  <>
                    <EnvelopeIcon className="h-5 w-5" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section - Improved Mobile */}
        <div className="mt-12 sm:mt-16 lg:mt-20">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-600 text-base sm:text-lg max-w-3xl mx-auto">
              Find quick answers to common questions about our services and the Maldives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage; 