import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { fetchServices } from "../services/api";
import "./Home.css";

const categoryInfo = {
  ac: { title: "AC Repair", icon: "❄️", color: "#06b6d4" },
  fridge: { title: "Fridge Repair", icon: "🧊", color: "#3b82f6" },
  geyser: { title: "Geyser Repair", icon: "🔥", color: "#f97316" },
  washing: { title: "Washing Machine", icon: "🧺", color: "#8b5cf6" },
  microwave: { title: "Microwave Oven", icon: "🍳", color: "#ec4899" },
  tv: { title: "TV Repair", icon: "📺", color: "#14b8a6" },
  other: { title: "Other Services", icon: "🔧", color: "#6b7280" },
};

function Services() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await fetchServices();
      // Filter only active services (if data is an array)
      if (Array.isArray(data)) {
        const activeServices = data.filter(s => s.isActive !== false);
        setServices(activeServices);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("Failed to load services:", err);
      setError("Unable to load services. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Group services by category
  const servicesByCategory = useMemo(() => {
    const grouped = {};
    services.forEach((service) => {
      const category = service.category || "other";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(service);
    });
    return grouped;
  }, [services]);

  const handleBookNow = (serviceKey) => {
    if (!isLoggedIn) {
      // Store the intended destination and redirect to login
      navigate(`/login?redirect=/book?service=${serviceKey}`);
      return;
    }
    navigate(`/book?service=${serviceKey}`);
  };

  if (loading) {
    return (
      <div className="services-page">
        <div className="services-loading">
          <div className="loading-spinner"></div>
          <p>Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="services-page">
        <div className="services-error">
          <p>{error}</p>
          <button onClick={loadServices}>Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="services-page">
      <div className="services-hero">
        <h1>Our Professional Services</h1>
        <p>
          Expert technicians, transparent pricing, quality service guaranteed.
          Browse our services below and book your appointment today.
        </p>
      </div>

      {Object.keys(servicesByCategory).length === 0 ? (
        <div className="services-empty">
          <h2>No Services Available</h2>
          <p>Currently there are no active services. Please check back later.</p>
        </div>
      ) : (
        Object.entries(servicesByCategory).map(([category, categoryServices]) => {
          const info = categoryInfo[category] || categoryInfo.other;
          return (
            <section key={category} className="services-category-section">
              <div className="category-header">
                <span className="category-icon" style={{ backgroundColor: info.color }}>
                  {info.icon}
                </span>
                <h2>{info.title}</h2>
              </div>
              
              <div className="services-grid">
                {categoryServices.map((service) => (
                  <article key={service._id} className="service-card">
                    {service.image && (
                      <div className="service-card-image">
                        <img src={service.image} alt={service.name} />
                      </div>
                    )}
                    <div className="service-card-content">
                      <h3>{service.name}</h3>
                      <p className="service-description">{service.description}</p>
                      {service.features && service.features.length > 0 && (
                        <ul className="service-features">
                          {service.features.slice(0, 4).map((feature, index) => (
                            <li key={index}>✓ {feature}</li>
                          ))}
                        </ul>
                      )}
                      <div className="service-card-footer">
                        <div className="service-price">
                          <span className="price-label">Starting from</span>
                          <span className="price-amount">₹{service.price}</span>
                        </div>
                        <div className="service-eta">
                          ⏱ {service.etaMinutes || 60} mins
                        </div>
                      </div>
                      <button 
                        type="button" 
                        className="book-now-btn"
                        onClick={() => handleBookNow(service._id || service.name.toLowerCase().replace(/\s+/g, '-'))}
                      >
                        🚀 Book Now
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          );
        })
      )}

      <section className="services-cta">
        <div className="cta-content">
          <h2>Need Help Choosing?</h2>
          <p>Our customer support team is here to assist you with any questions.</p>
          <div className="cta-buttons">
            <button type="button" onClick={() => navigate("/contact")}>
              💬 Contact Us
            </button>
            <a href="tel:7970503756" className="cta-call-btn">
              📞 7970503756
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Services;
