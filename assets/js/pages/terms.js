// assets/js/pages/terms.js
export function TermsPage() {
  // Scroll to top when Terms page loads
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);

  return `
    <section class="terms-hero">
      <div class="container">
        <h1>Terms & Conditions</h1>
        <p class="terms-subtitle">Please read these terms carefully before booking your stay at Kina Resort</p>
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
        <h2>1. Resort Booking Agreement</h2>
        <p>By making a reservation at Kina Resort, you accept and agree to be bound by these terms and conditions. These terms govern your stay at our tropical paradise resort located at M.H Del Pilar Street, San Rafael, Rodriguez, Rizal, Philippines.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>2. Resort Services and Amenities</h2>
        <p>Kina Resort offers luxury accommodations, dining services, recreational activities, and resort amenities. All services are subject to availability and seasonal variations. We reserve the right to modify or discontinue services with reasonable notice.</p>
        
        <h3>2.1 Accommodation Services</h3>
        <p>Our resort features luxury cottages, scenic-view rooms, and premium suites. All accommodations include daily housekeeping, resort amenities, and access to resort facilities.</p>
        
        <h3>2.2 Dining and Culinary Services</h3>
        <p>We offer fine dining experiences, outdoor dining, and room service. Special dietary requirements can be accommodated with advance notice.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>3. Reservations and Payment</h2>
        <h3>3.1 Booking Process</h3>
        <p>All reservations are subject to availability and confirmation. A valid credit card is required to secure your booking. We reserve the right to refuse service to anyone for any reason at any time.</p>
        
        <h3>3.2 Payment Terms</h3>
        <p>Full payment is required at the time of booking. We accept major credit cards, bank transfers, and other approved payment methods. All prices are in Philippine Peso (PHP) and include applicable taxes.</p>
        
        <h3>3.3 Cancellation and Refund Policy</h3>
        <p>Cancellations made 7 days or more before arrival: Full refund. Cancellations made 3-6 days before arrival: 50% refund. Cancellations made less than 3 days before arrival: No refund. No-shows will be charged the full amount.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>4. Guest Responsibilities and Resort Policies</h2>
        <p>Guests are responsible for:</p>
        <ul>
          <li>Providing accurate information during booking and check-in</li>
          <li>Following resort policies, safety guidelines, and local regulations</li>
          <li>Respecting other guests, staff, and resort property</li>
          <li>Reporting any damages, safety concerns, or issues immediately</li>
          <li>Maintaining appropriate behavior throughout their stay</li>
          <li>Complying with dress codes in dining areas and common spaces</li>
        </ul>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>5. Resort Safety and Security</h2>
        <p>Guest safety is our priority. We maintain 24/7 security services and emergency procedures. Guests must follow all safety instructions, especially during water activities and resort excursions. Children must be supervised at all times.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>6. Privacy and Data Protection</h2>
        <p>We collect and process your personal information in accordance with Philippine data protection laws. Your information is used for reservation management, service delivery, and communication purposes. We do not share your information with third parties without consent.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>7. Resort Liability and Limitations</h2>
        <p>Kina Resort is not liable for personal injuries, lost or stolen property, or damages resulting from guest negligence, weather conditions, or circumstances beyond our control. We recommend travel insurance for all guests.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>8. Environmental and Sustainability</h2>
        <p>We are committed to environmental conservation and sustainable tourism. Guests are expected to respect our eco-friendly policies, including proper waste disposal, water conservation, and protection of marine life and coral reefs.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>9. Force Majeure</h2>
        <p>Kina Resort is not liable for cancellations or service interruptions due to natural disasters, government restrictions, pandemics, or other force majeure events. In such cases, we will work with guests to reschedule or provide appropriate alternatives.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>10. Governing Law and Disputes</h2>
        <p>These terms are governed by Philippine law. Any disputes will be resolved through local courts in the Philippines. We encourage amicable resolution of any concerns through direct communication with resort management.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>11. Changes to Terms</h2>
        <p>We reserve the right to modify these terms at any time. Significant changes will be communicated to guests with advance notice. Continued use of our services constitutes acceptance of updated terms.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>12. Contact Information</h2>
        <p>For questions about these Terms and Conditions or resort services, please contact us:</p>
        <ul>
          <li><strong>Email:</strong> book@kinaresort.ph</li>
          <li><strong>Phone:</strong> +63 900 111 2222</li>
          <li><strong>Address:</strong> M.H Del Pilar Street, San Rafael, Rodriguez, Rizal, Philippines</li>
          <li><strong>Resort Hours:</strong> Open daily, 8:00 AM - 10:00 PM</li>
        </ul>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <div class="last-updated">
          <p><strong>Important Note:</strong> These terms and conditions are subject to change without notice. Please review them periodically for any updates. By booking with Kina Resort, you acknowledge that you have read, understood, and agree to these terms.</p>
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
