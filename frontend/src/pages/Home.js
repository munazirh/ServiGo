import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fetchServices } from "../services/api";
import "./Home.css";

// Default category images (fallback if no service images exist)
const defaultCategoryImages = {
  ac: "../ac.jpeg",
  fridge: "https://images.unsplash.com/photo-1586201375761-83865001e31b?auto=format&fit=crop&w=600&q=80",
  geyser: "https://images.unsplash.com/photo-1621905251189-08b45249ffb2?auto=format&fit=crop&w=600&q=80"
};

const quickCategoryCards = [
  { key: "ac", title: "AC Repair", subtitle: "Cooling, gas refill, service" },
  { key: "fridge", title: "Fridge Repair", subtitle: "Compressor, leakage, cooling" },
  { key: "geyser", title: "Geyser Repair", subtitle: "Heating, install, wiring" }
];

function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const searchPlaceholders = [
    "Search for AC repair",
    "Search for fridge repair",
    "Search for geyser repair",
    "Search for emergency home repair",
  ];

  useEffect(() => {
    fetchServices("all")
      .then((data) => setServices(Array.isArray(data) ? data : []))
      .catch(() => setServices([]));
  }, []);

  useEffect(() => {
    const query = searchParams.get("q") || "";
    setSearchText(query);
  }, [searchParams]);

  useEffect(() => {
    const timer = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % searchPlaceholders.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [searchPlaceholders.length]);

  const filteredServices = useMemo(() => {
    const normalizedQuery = searchText.trim().toLowerCase();
    return services.filter((service) => {
      const categoryMatch = !activeCategory || service.category === activeCategory;
      const textMatch = !normalizedQuery ||
        service.name?.toLowerCase().includes(normalizedQuery) ||
        service.description?.toLowerCase().includes(normalizedQuery) ||
        service.category?.toLowerCase().includes(normalizedQuery);
      return categoryMatch && textMatch;
    });
  }, [activeCategory, searchText, services]);

  const goToBooking = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    navigate("/dashboard");
  };

  const stats = [
    { value: "500+", label: "Happy Customers", icon: "😊" },
    { value: "50+", label: "Expert Technicians", icon: "🔧" },
    { value: "95%", label: "Satisfaction Rate", icon: "⭐" },
    { value: "9AM-8PM", label: "Daily Service", icon: "🕐" },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      service: "AC Repair",
      rating: 5,
      text: "Excellent service! The technician arrived on time and fixed my AC within an hour. Very professional and reasonably priced.",
      location: "Godda"
    },
    {
      name: "Priya Sharma",
      service: "Fridge Repair",
      rating: 5,
      text: "My fridge was not cooling properly. The team diagnosed the issue quickly and the repair was done perfectly. Highly recommend!",
      location: "Lalmatia"
    },
    {
      name: "Amit Patel",
      service: "Geyser Installation",
      rating: 5,
      text: "Great experience with geyser installation. The team was knowledgeable and completed the work cleanly. Will definitely use again.",
      location: "Basantrai"
    }
  ];

  const whyChooseUs = [
    { icon: "🛡️", title: "Verified Experts", description: "All technicians undergo rigorous background checks and skill verification" },
    { icon: "💰", title: "Transparent Pricing", description: "No hidden fees. Get upfront pricing before any work begins" },
    { icon: "⚡", title: "Fast Response", description: "Same-day service availability with quick response time" },
    { icon: "🔒", title: "Service Warranty", description: "Up to 30 days warranty on all repair services" },
    { icon: "📱", title: "Easy Tracking", description: "Real-time booking status updates on your phone" },
    { icon: "💳", title: "Secure Payments", description: "Multiple payment options including UPI, cards, and cash" }
  ];

  const brands = [
    { name: "Samsung", logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg" },
    { name: "LG", logo: "https://upload.wikimedia.org/wikipedia/commons/2/20/LG_Logo.svg" },
    { name: "Whirlpool", logo: "https://upload.wikimedia.org/wikipedia/commons/4/4d/Whirlpool_Logo.svg" },
    { name: "Godrej", logo: "https://upload.wikimedia.org/wikipedia/commons/5/5f/Godrej_Logo.svg" },
    { name: "Haier", logo: "https://upload.wikimedia.org/wikipedia/commons/4/49/Haier_Logo.svg" },
    { name: "Panasonic", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Panasonic_logo.svg" },
    { name: "Voltas", logo: "https://upload.wikimedia.org/wikipedia/commons/4/46/Voltas_logo.svg" },
    { name: "Hitachi", logo: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Hitachi_logo.svg" },
  ];

  const faqs = [
    { question: "How quickly can you respond to service requests?", answer: "We offer same-day service with quick response for emergency repairs." },
    { question: "Do you provide warranty on repairs?", answer: "Yes! All our repairs come with up to 30 days warranty covering both parts and labor." },
    { question: "What payment methods do you accept?", answer: "We accept UPI, all major credit/debit cards, net banking, and cash on service completion." },
    { question: "Are your technicians certified?", answer: "All our technicians are background-verified and undergo rigorous skill assessment before joining." }
  ];

  const serviceComparison = [
    { feature: "Same-day Service", servigo: true, others: false },
    { feature: "15-Day Warranty", servigo: true, others: false },
    { feature: "Transparent Pricing", servigo: true, others: false },
    { feature: "Live Tracking", servigo: true, others: false },
    { feature: "Verified Technicians", servigo: true, others: true },
    { feature: "Quality Support", servigo: true, others: false },
  ];

const processSteps = [
    { number: "01", title: "Book Your Service", description: "Select your appliance type and describe the issue through our app or website", icon: "📱" },
    { number: "02", title: "Get Expert Matched", description: "Our system matches you with a verified technician based on your requirements", icon: "🔧" },
    { number: "03", title: "Get It Fixed", description: "Technician arrives at your doorstep with all necessary tools and parts", icon: "🏠" },
    { number: "04", title: "Pay & Review", description: "After service completion, pay securely and share your valuable feedback", icon: "💳" }
  ];

  // Get category image from services or use default
  const getCategoryImage = (categoryKey) => {
    // Find first active service with image for this category
    const categoryService = services.find(s => s.category === categoryKey && s.image);
    return categoryService?.image || defaultCategoryImages[categoryKey] || "";
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-content">
          <span className="hero-pill">🔧 Trusted Appliance Repair Service</span>
          <h1>Fast, Reliable <span>Repair Services</span> at Your Doorstep</h1>
          <p>AC, Fridge, and Geyser repair experts with transparent pricing, easy booking, and real-time status updates.</p>

          <div className="hero-search">
            <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder={searchPlaceholders[placeholderIndex]} aria-label="Search services" />
            <button type="button">Search</button>
          </div>

          <div className="hero-actions">
            <button type="button" className="primary-cta" onClick={goToBooking}>🛠 Book a Repair</button>
            <button type="button" className="secondary-cta" onClick={() => navigate("/dashboard")}>📍 Track Bookings</button>
          </div>
        </div>

        <div className="hero-visual">
          <div className="floating-card floating-card-1">
            <strong>500+</strong>
            <span>✅ Repairs Completed</span>
          </div>
          <div className="floating-card floating-card-2">
            <strong>4.8/5</strong>
            <span>⭐ Customer Rating</span>
          </div>
          <div className="floating-card floating-card-3">
            <strong>Same Day</strong>
            <span>⚡ Service Available</span>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="home-stats">
        {stats.map((stat, index) => (
          <div className="stat-card" key={index}>
            <span className="stat-icon">{stat.icon}</span>
            <strong className="stat-value">{stat.value}</strong>
            <span className="stat-label">{stat.label}</span>
          </div>
        ))}
      </section>

      {/* Services Section */}
      <section className="home-services" id="services">
        <div className="section-head">
          <h2>Explore Services</h2>
          <p>AC, Fridge, Geyser - Choose your appliance and get instant repair quotes</p>
        </div>

<div className="service-category-grid">
          {quickCategoryCards.map((category) => (
            <button key={category.key} type="button" className={`service-category-card ${activeCategory === category.key ? "active" : ""}`} onClick={() => setActiveCategory(category.key)}>
              <img src={getCategoryImage(category.key)} alt={category.title} />
              <div>
                <h4>{category.title}</h4>
                <p>{category.subtitle}</p>
              </div>
            </button>
          ))}
        </div>

        {activeCategory && (
          <div className="service-card-grid">
            {filteredServices.map((service) => (
              <article className="service-card-premium" key={service._id}>
                {service.image ? <img src={service.image} alt={service.name} className="service-card-image" /> : <div className="service-card-image service-card-image-fallback"><span>{service.category?.toUpperCase()} REPAIR</span></div>}
                <div className="service-card-body">
                  <span className="service-tag">{service.category}</span>
                  <h3>{service.name}</h3>
                  <p>{service.description}</p>
                  <div className="service-footer">
                    <strong>₹ {service.price}</strong>
                    <span>⏱ ETA {service.etaMinutes || 60} mins</span>
                  </div>
                  <button type="button" onClick={goToBooking}>🚀 Book Service</button>
                </div>
              </article>
            ))}
          </div>
        )}

        {activeCategory && filteredServices.length === 0 && <div className="empty-state">No services found. Try another search or category.</div>}
        {!activeCategory && <div className="empty-state">Choose AC, Fridge, or Geyser card to view services.</div>}
      </section>

      {/* Process Section */}
      <section className="home-process">
        <div className="section-head">
          <h2>How It Works</h2>
          <p>Get your appliance repaired in 4 simple steps</p>
        </div>
        <div className="process-grid">
          {processSteps.map((step, index) => (
            <div className="process-card" key={index}>
              <div className="process-icon">{step.icon}</div>
              <span className="process-number">{step.number}</span>
              <h4>{step.title}</h4>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="home-why-choose" id="about">
        <div className="section-head">
          <h2>Why Choose ServiGo?</h2>
          <p>Experience the difference with our professional appliance repair services</p>
        </div>
        <div className="why-choose-grid">
          {whyChooseUs.map((item, index) => (
            <div className="why-choose-card" key={index}>
              <span className="why-choose-icon">{item.icon}</span>
              <h4>{item.title}</h4>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Section */}
      <section className="home-comparison">
        <div className="section-head">
          <h2>Why ServiGo Stands Out</h2>
          <p>See how we compare with traditional repair services</p>
        </div>
        <div className="comparison-table">
          <div className="comparison-header">
            <span>Features</span>
            <span className="servigo-col">ServiGo</span>
            <span className="others-col">Others</span>
          </div>
          {serviceComparison.map((item, index) => (
            <div className="comparison-row" key={index}>
              <span>{item.feature}</span>
              <span className="servigo-col">{item.servigo ? "✅" : "❌"}</span>
              <span className="others-col">{item.others ? "✅" : "❌"}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Brands Section */}
      <section className="home-brands">
        <div className="section-head">
          <h2>We Service All Major Brands</h2>
          <p>Expert repair for all leading appliance brands</p>
        </div>
        <div className="brands-grid">
          {brands.map((brand, index) => (
            <div className="brand-card" key={index}>
              <img src={brand.logo} alt={brand.name} className="brand-logo" />
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="home-testimonials">
        <div className="section-head">
          <h2>What Our Customers Say</h2>
          <p>Real feedback from our valued customers</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <div className="testimonial-card" key={index}>
              <div className="testimonial-header">
                <div className="testimonial-avatar">{testimonial.name.charAt(0)}</div>
                <div>
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.service} • {testimonial.location}</span>
                </div>
              </div>
              <div className="testimonial-rating">{"⭐".repeat(testimonial.rating)}</div>
              <p className="testimonial-text">"{testimonial.text}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="home-faq" id="faq">
        <div className="section-head">
          <h2>Frequently Asked Questions</h2>
          <p>Got questions? We've got answers!</p>
        </div>
        <div className="faq-grid">
          {faqs.map((faq, index) => (
            <div className={`faq-card ${expandedFaq === index ? "expanded" : ""}`} key={index} onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}>
              <div className="faq-question">
                <span>{faq.question}</span>
                <span className="faq-toggle">{expandedFaq === index ? "−" : "+"}</span>
              </div>
              {expandedFaq === index && <div className="faq-answer">{faq.answer}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* Benefits Section */}
      <section className="home-benefits">
        <article><h4>Verified Technicians</h4><p>Every provider is screened and approved before assignment.</p></article>
        <article><h4>Live Booking Status</h4><p>Track Pending, Assigned, and Completed jobs in one place.</p></article>
        <article><h4>Transparent Pricing</h4><p>Know service estimate before booking, no hidden surprise charges.</p></article>
        <article><h4>Secure Payments</h4><p>UPI, Card, and Cash-on-service options supported.</p></article>
      </section>

      {/* CTA Section */}
      <section className="home-cta">
        <h2>Need appliance repair today?</h2>
        <p>Login and schedule your service now. We will take care of the rest.</p>
        <div className="home-cta-actions">
          <button type="button" onClick={goToBooking}>🔥 Start Booking</button>
          <a href="tel:7970503756" className="home-call-btn">📞 7970503756</a>
        </div>
      </section>
    </div>
  );
}

export default Home;
