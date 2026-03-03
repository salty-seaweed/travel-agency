import React from 'react';
import { PolicyPage } from './PolicyPage';
import { config } from '../../config';

export function SecurityPage() {
  const content = (
    <>
      <h2>1. Security Capabilities</h2>
      <p>
        We are committed to protecting your payment card information and personal data. Our
        security measures include:
      </p>

      <h3>1.1 Data Transmission Security</h3>
      <ul>
        <li><strong>SSL/TLS Encryption:</strong> All data transmitted between your browser and our servers is encrypted using industry-standard SSL/TLS protocols</li>
        <li><strong>HTTPS:</strong> Our website uses HTTPS to ensure secure communication</li>
        <li><strong>Secure Payment Gateway:</strong> All payment transactions are processed through Bank of Maldives (BML) secure payment gateway</li>
      </ul>

      <h3>1.2 Payment Card Security</h3>
      <ul>
        <li>We do not store your payment card details on our servers</li>
        <li>All payment information is processed directly through BML payment gateway</li>
        <li>BML payment gateway is PCI DSS compliant</li>
        <li>Card details are encrypted during transmission</li>
        <li>We never have access to your full card number</li>
      </ul>

      <h3>1.3 Server Security</h3>
      <ul>
        <li>Regular security updates and patches</li>
        <li>Firewall protection</li>
        <li>Intrusion detection systems</li>
        <li>Secure authentication mechanisms</li>
        <li>Access controls and monitoring</li>
      </ul>

      <h2>2. Preventing Unauthorized Access</h2>
      <p>
        We have implemented multiple layers of security to prevent unauthorized access to
        cardholder information:
      </p>
      <ul>
        <li><strong>Access Controls:</strong> Limited access to personal data on a need-to-know basis</li>
        <li><strong>Authentication:</strong> Strong authentication requirements for staff access</li>
        <li><strong>Encryption:</strong> Data encryption at rest and in transit</li>
        <li><strong>Monitoring:</strong> Continuous monitoring for suspicious activities</li>
        <li><strong>Regular Audits:</strong> Security audits and vulnerability assessments</li>
        <li><strong>Employee Training:</strong> Regular security training for all staff</li>
      </ul>

      <h2>3. Data Storage</h2>
      <p>
        Personal information is stored securely in encrypted databases. We retain your
        information only as long as necessary to provide our services and comply with legal
        obligations.
      </p>

      <h2>4. Third-Party Security</h2>
      <p>
        We work only with trusted third-party service providers who maintain high security
        standards:
      </p>
      <ul>
        <li><strong>Payment Processor:</strong> Bank of Maldives (BML) - PCI DSS compliant</li>
        <li><strong>Hosting:</strong> Secure cloud hosting with regular security updates</li>
        <li><strong>Data Backup:</strong> Encrypted backups stored securely</li>
      </ul>

      <h2>5. Incident Response</h2>
      <p>
        In the unlikely event of a security breach, we will:
      </p>
      <ul>
        <li>Immediately investigate and contain the breach</li>
        <li>Notify affected customers as required by law</li>
        <li>Work with security experts to resolve the issue</li>
        <li>Implement additional security measures to prevent future incidents</li>
      </ul>

      <h2>6. Your Responsibility</h2>
      <p>
        To help protect your information:
      </p>
      <ul>
        <li>Use strong, unique passwords</li>
        <li>Keep your login credentials confidential</li>
        <li>Log out after using shared computers</li>
        <li>Report any suspicious activity immediately</li>
        <li>Keep your browser and devices updated</li>
      </ul>

      <h2>7. Contact Us</h2>
      <p>
        If you have security concerns or questions, please contact us at {config.supportEmail}
        {' '}or {config.whatsappNumber}.
      </p>
    </>
  );

  return <PolicyPage title="Security Policy" content={content} />;
}



