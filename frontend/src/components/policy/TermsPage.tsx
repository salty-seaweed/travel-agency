import React from 'react';
import { PolicyPage } from './PolicyPage';
import { config } from '../../config';

export function TermsPage() {
  const content = (
    <>
      <h2>1. Introduction</h2>
      <p>
        Welcome to {config.companyName}. These Terms and Conditions govern your use of our website
        and services. By accessing or using our services, you agree to be bound by these terms.
      </p>

      <h2>2. Services</h2>
      <p>
        We provide travel agency services including but not limited to:
      </p>
      <ul>
        <li>Travel package bookings</li>
        <li>Resort and accommodation reservations</li>
        <li>Boat tours and activities</li>
        <li>Transportation services</li>
      </ul>

      <h2>3. Purchase Terms and Conditions</h2>
      <p>
        When making a purchase through our website:
      </p>
      <ul>
        <li>All prices are displayed in USD (United States Dollars) unless otherwise stated</li>
        <li>Prices are subject to change without notice</li>
        <li>Payment must be completed to confirm your booking</li>
        <li>All bookings are subject to availability</li>
        <li>We reserve the right to refuse service to anyone</li>
      </ul>

      <h2>4. Payment</h2>
      <p>
        We accept payments through Bank of Maldives (BML) payment gateway. All transactions are
        processed securely. By making a payment, you confirm that you are authorized to use the
        payment method provided.
      </p>

      <h2>5. Booking Confirmation</h2>
      <p>
        Bookings are confirmed upon successful payment. You will receive a confirmation email
        within 24 hours. All bookings are subject to our review and final confirmation.
      </p>

      <h2>6. Cancellation and Refunds</h2>
      <p>
        Please refer to our Cancellation Policy for detailed information about cancellations and
        refunds. Cancellation policies vary by service type and may be subject to fees.
      </p>

      <h2>7. Merchant Information</h2>
      <p>
        <strong>Trading Name:</strong> {config.companyName}<br />
        <strong>Email:</strong> {config.supportEmail}<br />
        <strong>Phone:</strong> {config.whatsappNumber}<br />
        <strong>Merchant Outlet Country:</strong> Maldives
      </p>

      <h2>8. Limitation of Liability</h2>
      <p>
        We are not liable for any indirect, incidental, or consequential damages arising from your
        use of our services. Our total liability shall not exceed the amount paid for the service.
      </p>

      <h2>9. Changes to Terms</h2>
      <p>
        We reserve the right to modify these terms at any time. Changes will be effective
        immediately upon posting on our website.
      </p>

      <h2>10. Contact Us</h2>
      <p>
        If you have questions about these Terms and Conditions, please contact us at{' '}
        {config.supportEmail} or {config.whatsappNumber}.
      </p>
    </>
  );

  return <PolicyPage title="Terms & Conditions" content={content} />;
}

