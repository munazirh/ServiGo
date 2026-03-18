import React from "react";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1>About ServiGo</h1>
        
        <section>
          <h2>Who We Are</h2>
          <p>
            ServiGo is a leading home appliance repair service provider, committed to bringing convenience and reliability to your doorstep. We specialize in repairing and maintaining a wide range of household appliances including ACs, refrigerators, geysers, washing machines, microwaves, and TVs.
          </p>
        </section>

        <section>
          <h2>Our Mission</h2>
          <p>
            Our mission is to make appliance repair hassle-free and transparent. We believe in providing quality service at honest prices, with no hidden charges. Our team of certified technicians ensures that your appliances are in safe hands.
          </p>
        </section>

        <section>
          <h2>Why Choose Us?</h2>
          <ul>
            <li><strong>Verified Technicians:</strong> All our technicians are background-verified and certified</li>
            <li><strong>Transparent Pricing:</strong> Get upfront quotes before we start any work</li>
            <li><strong>15-Day Warranty:</strong> All repair services come with a warranty</li>
            <li><strong>Quick Service:</strong> We aim to fix your appliance on the first visit</li>
            <li><strong>24/7 Support:</strong> Our customer support team is available round the clock</li>
          </ul>
        </section>

        <section>
          <h2>Our Services</h2>
          <ul>
            <li>AC Repair & Maintenance</li>
            <li>Refrigerator Repair</li>
            <li>Geyser Installation & Repair</li>
            <li>Washing Machine Repair</li>
            <li>Microwave Oven Repair</li>
            <li>TV Repair</li>
          </ul>
        </section>

        <section>
          <h2>Our Reach</h2>
          <p>
            We proudly serve customers across Jharkhand and surrounding areas. Our network of skilled technicians ensures that professional help is always just a phone call away.
          </p>
        </section>

        <section>
          <h2>Contact Us</h2>
          <p>
            Have questions? We'd love to hear from you!
          </p>
          <ul>
            <li>📞 Phone: <a href="tel:7970503756">7970503756</a></li>
            <li>📧 Email: <a href="mailto:support@servigo.in">support@servigo.in</a></li>
            <li>🕐 Hours: Monday - Saturday, 9:00 AM - 8:00 PM</li>
          </ul>
        </section>

        <section className="home-cta" style={{ marginTop: '32px', textAlign: 'center' }}>
          <h2>Ready to get started?</h2>
          <p>Book your service now and let us take care of your appliances.</p>
          <div className="home-cta-actions" style={{ justifyContent: 'center' }}>
            <button type="button" onClick={() => navigate("/services")}>
              🚀 View All Services
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

export default About;
