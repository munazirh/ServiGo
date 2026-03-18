import React from "react";
import { useNavigate } from "react-router-dom";

const faqData = [
  {
    question: "How do I book a service?",
    answer: "You can book a service by visiting our website and selecting the appliance type you need repair. You can also call us directly at 7970503756 to schedule an appointment."
  },
  {
    question: "What are your service hours?",
    answer: "Our services are available from Monday to Saturday, 9:00 AM to 8:00 PM. For urgent repairs, you can also reach our support team."
  },
  {
    question: "How much do you charge for a service visit?",
    answer: "Our diagnostic fee starts from ₹299, which is waived off if you proceed with the repair. Final pricing depends on the issue and parts required."
  },
  {
    question: "Do you provide warranty on repairs?",
    answer: "Yes! All our repair services come with a 30-day warranty on labor. Parts warranty varies by manufacturer and will be communicated at the time of service."
  },
  {
    question: "How long does a typical repair take?",
    answer: "Most common repairs are completed within 1-2 hours. Complex issues may take longer depending on the availability of parts."
  },
  {
    question: "Are your technicians certified?",
    answer: "Yes, all our technicians are background-verified and certified professionals with years of experience in appliance repair."
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept cash, UPI (Google Pay, PhonePe, Paytm), credit/debit cards, and bank transfers."
  },
  {
    question: "Can I reschedule or cancel my booking?",
    answer: "Yes, you can reschedule or cancel your booking at least 2 hours before the scheduled appointment without any cancellation fee."
  },
  {
    question: "What areas do you serve?",
    answer: "We serve Jharkhand and surrounding areas. Contact us to confirm if we cover your location."
  },
  {
    question: "How can I track my booking status?",
    answer: "You can track your booking status by logging into your dashboard or by calling our customer support."
  }
];

function FAQ() {
  const navigate = useNavigate();

  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1>Frequently Asked Questions</h1>
        
        <section>
          <p style={{ marginBottom: '32px', textAlign: 'center' }}>
            Find answers to the most common questions about our services.
          </p>

          <div className="faq-list">
            {faqData.map((faq, index) => (
              <div key={index} className="faq-item">
                <h3>{faq.question}</h3>
                <p>{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="home-cta" style={{ marginTop: '32px', textAlign: 'center' }}>
          <h2>Still have questions?</h2>
          <p>Our support team is here to help you.</p>
          <div className="home-cta-actions" style={{ justifyContent: 'center' }}>
            <button type="button" onClick={() => navigate("/support")}>
              💬 Contact Support
            </button>
            <a href="tel:7970503756" className="home-call-btn">
              📞 Call Now
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

export default FAQ;
