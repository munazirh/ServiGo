import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Contact() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, this would send to backend
    console.log("Contact form submitted:", formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="policy-page">
        <div className="policy-container" style={{ textAlign: 'center' }}>
          <h1>Thank You! ✅</h1>
          <p>Your message has been submitted successfully. Our team will get back to you within 24 hours.</p>
          <button 
            type="button" 
            onClick={() => { setSubmitted(false); setFormData({ name: "", email: "", phone: "", subject: "", message: "" }); }}
            style={{ marginTop: '20px', padding: '12px 24px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Send Another Message
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="policy-page">
      <div className="policy-container">
        <h1>Contact Us</h1>
        
        <section>
          <p style={{ marginBottom: '32px', textAlign: 'center' }}>
            Have a question or need assistance? We're here to help!
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={{ textAlign: 'center', padding: '20px', background: 'var(--bg-surface)', borderRadius: '12px' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📞</div>
              <h4>Phone</h4>
              <p><a href="tel:7970503756">7970503756</a></p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: 'var(--bg-surface)', borderRadius: '12px' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>📧</div>
              <h4>Email</h4>
              <p><a href="mailto:support@servigo.in">support@servigo.in</a></p>
            </div>
            <div style={{ textAlign: 'center', padding: '20px', background: 'var(--bg-surface)', borderRadius: '12px' }}>
              <div style={{ fontSize: '32px', marginBottom: '12px' }}>🕐</div>
              <h4>Hours</h4>
              <p>Mon - Sat: 9AM - 8PM</p>
            </div>
          </div>
        </section>

        <section>
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '14px' }}
              />
              <input
                type="email"
                name="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '14px' }}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
                style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '14px' }}
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '14px' }}
              />
            </div>
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              rows="5"
              style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-surface)', color: 'var(--text-primary)', fontSize: '14px', resize: 'vertical' }}
            />
            <button
              type="submit"
              style={{ padding: '14px 24px', background: 'linear-gradient(135deg, var(--accent), var(--accent-2))', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '16px' }}
            >
              📤 Send Message
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

export default Contact;
