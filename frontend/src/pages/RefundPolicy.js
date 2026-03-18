import React from "react";

function RefundPolicy() {
  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1>Refund Policy</h1>

        <section>
          <h2>1. Introduction</h2>
          <p>
            At ServiGo, we strive to provide excellent appliance repair services. This Refund Policy outlines the terms and conditions for refunds. By using our services, you agree to this policy.
          </p>
        </section>

        <section>
          <h2>2. Service Payment</h2>
          <p>
            Payment for services is due upon completion of the repair work. We accept the following payment methods:
          </p>
          <ul>
            <li>Cash</li>
            <li>UPI (Google Pay, PhonePe, Paytm, etc.)</li>
            <li>Credit/Debit Cards</li>
            <li>Bank Transfer</li>
          </ul>
        </section>

        <section>
          <h2>3.Refund Eligibility</h2>
          <p><strong>3.1 Service Not Performed:</strong></p>
          <p>
            If a service technician is unable to complete the repair due to reasons attributable to ServiGo (such as unavailability of parts, technician no-show without prior notice), you may be eligible for a full refund or rescheduling at no additional cost.
          </p>

          <p><strong>3.2 Partial Service:</strong></p>
          <p>
            If the technician diagnoses the issue but is unable to complete the repair, a diagnostic fee may apply. This fee is non-refundable but will be credited towards future service if you proceed with the repair later.
          </p>

          <p><strong>3.3 Customer Satisfaction:</strong></p>
          <p>
            If you are not satisfied with the service provided, please contact our customer support within 48 hours of service completion. We will review your case and may offer a partial refund or re-service at no additional cost.
          </p>
        </section>

        <section>
          <h2>4. Non-Refundable Items</h2>
          <p>The following are not eligible for refunds:</p>
          <ul>
            <li>Diagnostic fee (if repair is not proceeded with)</li>
            <li>Parts and components that have been installed</li>
            <li>Service charges for completed repairs</li>
            <li>Cancellation fees for bookings cancelled less than 2 hours before appointment</li>
            <li>Any service where the customer is not present at the scheduled time</li>
          </ul>
        </section>

        <section>
          <h2>5. Cancellation and Rescheduling</h2>
          <p><strong>5.1 Cancellation by Customer:</strong></p>
          <ul>
            <li>Cancelled more than 24 hours before appointment: Full refund or no cancellation fee</li>
            <li>Cancelled 2-24 hours before appointment: May incur a small convenience fee</li>
            <li>Cancelled less than 2 hours before appointment: Cancellation fee may apply</li>
          </ul>

          <p><strong>5.2 Cancellation by ServiGo:</strong></p>
          <p>
            If we need to cancel an appointment due to technician unavailability or other issues, you will receive a full refund or the option to reschedule at no additional cost.
          </p>
        </section>

        <section>
          <h2>6. Warranty-Related Refunds</h2>
          <p>
            If a previously repaired issue recurs within the warranty period (30 days for labor), we will re-service at no additional cost. If we are unable to fix the issue after multiple attempts, a partial refund may be considered on a case-by-case basis.
          </p>
        </section>

        <section>
          <h2>7. Refund Process</h2>
          <p>To request a refund:</p>
          <ol>
            <li>Contact our customer support within 48 hours of service completion</li>
            <li>Provide your booking ID, service date, and reason for refund request</li>
            <li>Our team will review your request within 3-5 business days</li>
            <li>Approved refunds will be processed within 7-10 business days</li>
          </ol>
        </section>

        <section>
          <h2>8. Refund Methods</h2>
          <p>Refunds will be processed using the original payment method:</p>
          <ul>
            <li><strong>UPI/Card Payments:</strong> 7-10 business days</li>
            <li><strong>Bank Transfer:</strong> 5-7 business days</li>
            <li><strong>Cash:</strong> Available for pickup or bank transfer</li>
          </ul>
        </section>

        <section>
          <h2>9. Dispute Resolution</h2>
          <p>
            If you have a dispute regarding a refund, please contact our customer support first. We aim to resolve all disputes amicably. If resolution is not possible, the dispute will be governed by the laws of India.
          </p>
        </section>

        <section>
          <h2>10. Contact Us</h2>
          <p>
            For refund-related inquiries, please contact us:
          </p>
          <ul>
            <li>Email: support@servigo.in</li>
            <li>Phone: 7970503756</li>
            <li>Hours: Monday - Saturday, 9:00 AM - 8:00 PM</li>
          </ul>
        </section>
      </div>
    </div>
  );
}

export default RefundPolicy;
