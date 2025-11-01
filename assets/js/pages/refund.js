// assets/js/pages/refund.js
export function RefundPage() {
  // Scroll to top when Refund page loads
  setTimeout(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 100);

  return `
    <section class="terms-hero">
      <div class="container">
        <h1>Refund Policy</h1>
        <p class="terms-subtitle">Our commitment to fair and transparent refund procedures for your peace of mind.</p>
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
        <h2>1. Overview</h2>
        <p>At Kina Resort, we strive to provide exceptional service and ensure your satisfaction. This Refund Policy outlines the terms and conditions under which refunds may be issued for bookings, services, and purchases made through our resort.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>2. Cancellation and Refund Eligibility</h2>
        <p>Refunds are available based on the timing of your cancellation relative to your scheduled arrival date. The following refund schedule applies to all bookings:</p>
        <h3>2.1 Full Refund (100%)</h3>
        <p>Cancellations made 7 days or more before your scheduled arrival date will receive a full refund of all payments made, minus any applicable processing fees.</p>
        <h3>2.2 Partial Refund (50%)</h3>
        <p>Cancellations made 3 to 6 days before your scheduled arrival date will receive a 50% refund of the total booking amount, minus any applicable processing fees.</p>
        <h3>2.3 No Refund</h3>
        <p>Cancellations made less than 3 days before your scheduled arrival date, no-shows, or early departures are not eligible for refunds.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>3. Processing Fees</h2>
        <p>A processing fee may be deducted from refunds to cover administrative and payment processing costs. The standard processing fee is 3% of the refund amount, with a minimum of ₱100.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>4. Refund Methods</h2>
        <p>Refunds will be processed using the same payment method used for the original transaction:</p>
        <ul>
          <li><strong>Credit/Debit Cards:</strong> Refunds will be processed to the original card within 7-14 business days</li>
          <li><strong>Bank Transfers:</strong> Refunds will be processed to the original bank account within 5-10 business days</li>
          <li><strong>Cash Payments:</strong> Refunds may be issued via bank transfer or resort credit at our discretion</li>
        </ul>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>5. Special Circumstances</h2>
        <h3>5.1 Force Majeure</h3>
        <p>In cases of natural disasters, government restrictions, pandemics, or other force majeure events that prevent travel, we will work with you to provide a full refund or reschedule your booking at no additional charge.</p>
        <h3>5.2 Medical Emergencies</h3>
        <p>Guests who cannot travel due to medical emergencies may be eligible for a refund or rescheduling. Valid medical documentation may be required.</p>
        <h3>5.3 Resort Cancellations</h3>
        <p>If Kina Resort cancels your booking due to maintenance, overbooking, or other resort-related issues, you will receive a full refund or alternative accommodation at no additional cost.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>6. Group Bookings</h2>
        <p>For group bookings of 10 or more guests, special cancellation terms may apply. Please refer to your group booking agreement or contact our reservations team for specific terms.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>7. Package and Service Refunds</h2>
        <h3>7.1 Activity Packages</h3>
        <p>Pre-booked activity packages may be cancelled for a full refund if cancelled 24 hours in advance. Cancellations within 24 hours may be subject to a 50% cancellation fee.</p>
        <h3>7.2 Spa and Wellness Services</h3>
        <p>Spa and wellness service bookings cancelled 24 hours in advance receive a full refund. Same-day cancellations may incur a 50% fee.</p>
        <h3>7.3 Event and Function Hall Bookings</h3>
        <p>Event bookings follow standard cancellation policies based on notice period. Early cancellations (30+ days) may qualify for full refunds minus deposits.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>8. Non-Refundable Items</h2>
        <p>The following items and services are non-refundable once purchased or consumed:</p>
        <ul>
          <li>Gift shop purchases and merchandise</li>
          <li>Dining services already provided</li>
          <li>Completed spa or wellness services</li>
          <li>Special promotional packages marked as non-refundable</li>
          <li>Processing fees and administrative charges</li>
        </ul>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>9. How to Request a Refund</h2>
        <p>To request a refund, please contact us using one of the following methods:</p>
        <ul>
          <li><strong>Email:</strong> refunds@kinaresort.ph (include your booking reference number)</li>
          <li><strong>Phone:</strong> +63 900 111 2222</li>
          <li><strong>In Person:</strong> Visit our front desk during resort hours</li>
        </ul>
        <p>Please provide your booking reference number, name, and reason for cancellation when requesting a refund.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>10. Refund Processing Time</h2>
        <p>Once your refund request is approved:</p>
        <ul>
          <li>Refund confirmation will be sent via email within 2 business days</li>
          <li>Credit card refunds typically appear in 7-14 business days</li>
          <li>Bank transfer refunds typically process in 5-10 business days</li>
          <li>Processing times may vary depending on your financial institution</li>
        </ul>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>11. Disputes and Complaints</h2>
        <p>If you are unsatisfied with a refund decision, please contact our guest relations team. We are committed to resolving disputes fairly and will review each case individually.</p>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <h2>12. Contact Information</h2>
        <p>For questions about this Refund Policy or to request a refund, please contact us:</p>
        <ul>
          <li><strong>Email:</strong> refunds@kinaresort.ph</li>
          <li><strong>Phone:</strong> +63 900 111 2222</li>
          <li><strong>Address:</strong> M.H Del Pilar Street, San Rafael, Rodriguez, Rizal, Philippines</li>
          <li><strong>Resort Hours:</strong> Open daily, 8:00 AM - 10:00 PM</li>
        </ul>
      </div>
    </section>

    <section class="terms-content">
      <div class="container">
        <div class="last-updated">
          <p><strong>Important Note:</strong> This refund policy is subject to change. Please review it periodically for updates. By making a booking with Kina Resort, you acknowledge that you have read, understood, and agree to this refund policy.</p>
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

