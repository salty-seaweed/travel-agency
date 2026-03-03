import React from 'react';
import { PolicyPage } from './PolicyPage';
import { config } from '../../config';

export function RefundPage() {
  const content = (
    <>
      <h2>1. Refund Policy</h2>
      <p>
        All refund requests are subject to review and approval. Refund eligibility depends on
        the type of service, cancellation timing, and terms of the service provider.
      </p>

      <h2>2. Cancellation and Refund Terms</h2>
      <p><strong>IMPORTANT:</strong> Please read the following refund terms carefully before making a purchase:</p>

      <h3>2.1 Travel Packages</h3>
      <ul>
        <li><strong>More than 30 days before departure:</strong> Full refund minus 10% processing fee</li>
        <li><strong>15-30 days before departure:</strong> 50% refund</li>
        <li><strong>Less than 15 days before departure:</strong> No refund</li>
      </ul>

      <h3>2.2 Resort Bookings</h3>
      <ul>
        <li><strong>More than 14 days before check-in:</strong> Full refund minus 5% processing fee</li>
        <li><strong>7-14 days before check-in:</strong> 50% refund</li>
        <li><strong>Less than 7 days before check-in:</strong> No refund</li>
      </ul>

      <h3>2.3 Boat Tours and Activities</h3>
      <ul>
        <li><strong>More than 48 hours before activity:</strong> Full refund</li>
        <li><strong>24-48 hours before activity:</strong> 50% refund</li>
        <li><strong>Less than 24 hours before activity:</strong> No refund</li>
      </ul>

      <h2>3. Processing Time</h2>
      <p>
        Refunds, when approved, will be processed within 7-14 business days. The refund will be
        credited to the original payment method used for the transaction.
      </p>

      <h2>4. Non-Refundable Items</h2>
      <p>The following are non-refundable:</p>
      <ul>
        <li>Processing fees</li>
        <li>Service charges</li>
        <li>Special promotions or discounted rates (unless otherwise stated)</li>
        <li>No-show bookings</li>
      </ul>

      <h2>5. Force Majeure</h2>
      <p>
        In cases of force majeure (natural disasters, pandemics, government restrictions, etc.),
        refund policies may be adjusted. We will work with you to find the best solution.
      </p>

      <h2>6. How to Request a Refund</h2>
      <p>
        To request a refund, please contact us at {config.supportEmail} or{' '}
        {config.whatsappNumber} with your booking reference number and reason for cancellation.
      </p>

      <h2>7. Contact Us</h2>
      <p>
        For questions about refunds, please contact our customer service at {config.supportEmail}
        {' '}or {config.whatsappNumber}.
      </p>
    </>
  );

  return <PolicyPage title="Refund & Cancellation Policy" content={content} />;
}



