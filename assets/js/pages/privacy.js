// assets/js/pages/privacy.js
export function PrivacyPage() {
  // Scroll to top when Privacy page loads
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);

  return `
    <section class="terms-hero">
      <div class="container">
        <h1>Privacy Policy</h1>
        <p class="terms-subtitle">Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <div class="last-updated">
          <strong>Last Updated:</strong> December 2024
        </div>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>1. Introduction</h2>
        <p>At Kina Resort, we are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, make a reservation, or use our services.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>2. Information We Collect</h2>
        <p>We collect information that you provide directly to us when you:</p>
        <ul>
          <li>Make a reservation or booking</li>
          <li>Create an account on our website</li>
          <li>Contact us for customer support</li>
          <li>Subscribe to our newsletter or promotional communications</li>
          <li>Participate in surveys or special offers</li>
        </ul>
        <h3>2.1 Personal Information</h3>
        <p>This may include your name, email address, phone number, mailing address, payment information, identification documents, and any other information you choose to provide.</p>
        <h3>2.2 Automatically Collected Information</h3>
        <p>When you visit our website, we automatically collect certain information about your device, including your IP address, browser type, operating system, and browsing behavior through cookies and similar tracking technologies.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Process and manage your reservations and bookings</li>
          <li>Communicate with you about your reservations, requests, and inquiries</li>
          <li>Send you marketing communications, promotional offers, and newsletters (with your consent)</li>
          <li>Improve our services, website functionality, and user experience</li>
          <li>Comply with legal obligations and resolve disputes</li>
          <li>Ensure the security and safety of our resort and guests</li>
          <li>Conduct analytics and research to better understand our guests' preferences</li>
        </ul>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>4. Information Sharing and Disclosure</h2>
        <p>We do not sell or rent your personal information to third parties. We may share your information only in the following circumstances:</p>
        <h3>4.1 Service Providers</h3>
        <p>We may share your information with trusted third-party service providers who assist us in operating our website, processing payments, managing reservations, and providing guest services.</p>
        <h3>4.2 Legal Requirements</h3>
        <p>We may disclose your information if required by law, court order, or governmental regulation, or to protect the rights, property, or safety of Kina Resort, our guests, or others.</p>
        <h3>4.3 Business Transfers</h3>
        <p>In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of the transaction.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>5. Data Security</h2>
        <p>We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>6. Your Rights and Choices</h2>
        <p>You have the right to:</p>
        <ul>
          <li>Access and request a copy of your personal information</li>
          <li>Correct inaccurate or incomplete information</li>
          <li>Request deletion of your personal information</li>
          <li>Opt-out of marketing communications at any time</li>
          <li>Object to the processing of your personal information</li>
          <li>Request restriction of processing your information</li>
        </ul>
        <p>To exercise these rights, please contact us using the information provided in the Contact section below.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>7. Cookies and Tracking Technologies</h2>
        <p>Our website uses cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and personalize content. You can control cookie preferences through your browser settings, but disabling cookies may limit some website functionality.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>8. Children's Privacy</h2>
        <p>Our services are not directed to children under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>9. Changes to This Privacy Policy</h2>
        <p>We may update this Privacy Policy from time to time to reflect changes in our practices or for legal, operational, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website and updating the "Last Updated" date.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>10. Contact Us</h2>
        <p>If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
        <ul>
          <li><strong>Email:</strong> privacy@kinaresort.ph</li>
          <li><strong>Phone:</strong> +63 900 111 2222</li>
          <li><strong>Address:</strong> M.H Del Pilar Street, San Rafael, Rodriguez, Rizal, Philippines</li>
          <li><strong>Resort Hours:</strong> Open daily, 8:00 AM - 10:00 PM</li>
        </ul>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <div class="last-updated">
          <p><strong>Important Note:</strong> By using our website and services, you acknowledge that you have read and understood this Privacy Policy. Your continued use of our services constitutes acceptance of any updates to this policy.</p>
        </div>
      </div>
    </section>

    <style>
      .terms-hero {
        padding: 100px 20px 0px 20px;
        text-align: center;
        background: white;
        padding-block: 0 !important;
        margin: 0;
        margin-top: 100px;
      }

      .terms-hero .container {
        max-width: 800px;
        margin: 0 auto;
        margin-bottom: 40px;
      }

      .terms-hero h1 {
        font-size: clamp(36px, 6vw, 56px);
        font-weight: 700;
        margin: 0 0 20px 0;
        color: var(--color-text);
        position: relative;
        display: inline-block;
      }

      .terms-hero h1::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 100px;
        height: 3px;
        background: #ffd700;
        border-radius: 2px;
      }

      .terms-subtitle {
        font-size: clamp(16px, 2.5vw, 20px);
        margin: 0;
        opacity: 0.9;
        font-weight: 400;
        color: var(--color-muted);
      }

      .terms-content {
        padding: 0 20px;
        margin-bottom: 12px;
        background: #f8f9fa;
        position: relative;
        z-index: 1;
        overflow: visible;
      }

      .terms-content .container {
        max-width: 800px;
        margin: 0 auto;
        padding: 0;
        overflow: visible;
      }

      .terms-content h2 {
        font-size: clamp(20px, 3vw, 28px);
        margin: 0 0 15px;
        color: #1a1a1a;
        position: relative;
        display: block;
        text-align: left;
        width: 100%;
      }

      .terms-content h2::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 100px;
        height: 3px;
        background: linear-gradient(90deg, #ffd700 0%, #ffed4e 100%);
        border-radius: 2px;
        box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
      }

      .terms-content h3 {
        color: var(--color-accent);
        font-size: 20px;
        font-weight: 600;
        margin: 25px 0 10px 0;
      }

      .terms-content p {
        font-size: 16px;
        line-height: 1.7;
        margin: 0 0 20px;
        color: #4a4a4a;
        text-align: left;
      }

      .terms-content ul {
        margin: 0 0 20px 20px;
        padding: 0;
      }

      .terms-content li {
        margin: 0 0 8px 0;
        color: #4a4a4a;
        font-size: 16px;
        line-height: 1.7;
      }

      .terms-content strong {
        color: var(--color-text);
        font-weight: 600;
      }

      .last-updated {
        background: white;
        padding: 16px;
        border-radius: 12px;
        margin: 20px 0;
        border: 2px solid var(--color-accent);
        box-shadow: 0 4px 12px rgba(56, 182, 255, 0.1);
        font-style: italic;
        color: #666;
        position: relative;
      }

      .last-updated::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(56, 182, 255, 0.05) 0%, rgba(44, 90, 160, 0.05) 100%);
        border-radius: 10px;
        z-index: 0;
      }

      .last-updated > * {
        position: relative;
        z-index: 1;
      }

      .last-updated p {
        margin: 0;
      }

      @media (max-width: 768px) {
        .terms-hero {
          padding: 80px 15px 0px 15px;
        }

        .terms-content {
          padding: 0 15px;
          margin-bottom: 12px;
        }

        .terms-content .container {
          padding: 0;
        }

        .terms-content h2 {
          font-size: 22px;
        }

        .terms-content h3 {
          font-size: 18px;
        }

        .last-updated {
          padding: 15px;
          margin: 20px 0;
        }
      }
    </style>
  `;
}

