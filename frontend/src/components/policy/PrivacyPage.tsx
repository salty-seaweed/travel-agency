import React from 'react';
import { PolicyPage } from './PolicyPage';
import { config } from '../../config';

export function PrivacyPage() {
  const content = (
    <>
      <h2>1. Information We Collect</h2>
      <p>
        We collect the following types of information:
      </p>
      <ul>
        <li><strong>Personal Information:</strong> Name, email address, phone number, date of birth, nationality, passport number</li>
        <li><strong>Payment Information:</strong> Payment card details (processed securely through BML payment gateway, not stored on our servers)</li>
        <li><strong>Booking Information:</strong> Travel dates, preferences, special requests</li>
        <li><strong>Technical Information:</strong> IP address, browser type, device information</li>
      </ul>

      <h2>2. How We Use Your Information</h2>
      <p>We use your information for the following purposes:</p>
      <ul>
        <li>To process and confirm your bookings</li>
        <li>To communicate with you about your reservations</li>
        <li>To process payments securely</li>
        <li>To improve our services and website</li>
        <li>To comply with legal obligations</li>
        <li>To send you promotional materials (with your consent)</li>
      </ul>

      <h2>3. Data Protection</h2>
      <p>
        We implement industry-standard security measures to protect your personal information:
      </p>
      <ul>
        <li>SSL encryption for data transmission</li>
        <li>Secure payment processing through BML payment gateway</li>
        <li>Access controls and authentication</li>
        <li>Regular security audits</li>
        <li>Secure data storage</li>
      </ul>
      <p>
        We do not store your payment card details on our servers. All payment information is
        processed securely through Bank of Maldives payment gateway.
      </p>

      <h2>4. Preventing Unauthorized Access</h2>
      <p>
        To prevent unauthorized access to cardholder information, we have implemented:
      </p>
      <ul>
        <li>Encrypted data transmission (HTTPS/TLS)</li>
        <li>Secure authentication mechanisms</li>
        <li>Regular security monitoring and updates</li>
        <li>Limited access to personal data on a need-to-know basis</li>
        <li>Secure payment gateway integration (PCI DSS compliant)</li>
      </ul>

      <h2>5. Sharing Your Information</h2>
      <p>
        We do not sell your personal information. We may share your information with:
      </p>
      <ul>
        <li>Service providers (hotels, resorts, transportation companies) to fulfill your bookings</li>
        <li>Payment processors (BML) to process payments</li>
        <li>Legal authorities when required by law</li>
      </ul>

      <h2>6. Your Rights</h2>
      <p>You have the right to:</p>
      <ul>
        <li>Access your personal information</li>
        <li>Correct inaccurate information</li>
        <li>Request deletion of your information</li>
        <li>Opt-out of marketing communications</li>
        <li>Request a copy of your data</li>
      </ul>

      <h2>7. Cookies</h2>
      <p>
        We use cookies to enhance your browsing experience and analyze website traffic. You can
        control cookie settings through your browser preferences.
      </p>

      <h2>8. Contact Us</h2>
      <p>
        For privacy-related inquiries, please contact us at {config.supportEmail} or{' '}
        {config.whatsappNumber}.
      </p>
    </>
  );

  return <PolicyPage title="Privacy Policy" content={content} />;
}



