import React from "react";

const categories = [
  { key: "all", label: "All Services" },
  { key: "ac", label: "AC" },
  { key: "fridge", label: "Fridge" },
  { key: "geyser", label: "Geyser" },
];

function ServicesSection({
  services,
  selectedCategory,
  onCategoryChange,
  onBook,
  isLoading,
}) {
  return (
    <section className="customer-section">
      <div className="section-header">
        <h3 className="section-title">🧰 Browse Services</h3>
        <p className="section-subtitle">
          Choose a category and book a technician in a few clicks.
        </p>
      </div>

      <div className="category-filter">
        {categories.map((category) => (
          <button
            key={category.key}
            type="button"
            className={`category-chip ${selectedCategory === category.key ? "active" : ""}`}
            onClick={() => onCategoryChange(category.key)}
          >
            {category.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="panel-message">Loading services...</div>
      ) : (
        <div className="service-grid">
          {services.map((service) => (
            <article key={service._id} className="service-card">
              {service.image ? (
                <img src={service.image} alt={service.name} className="service-image" />
              ) : (
                <div className="service-image service-image-fallback">
                  <span>{service.category?.toUpperCase()}</span>
                </div>
              )}

              <div className="service-content">
                <span className="service-category">{service.category}</span>
                <h4>{service.name}</h4>
                <p>{service.description}</p>
                <div className="service-meta">
                  <span className="service-price">₹ {service.price}</span>
                  <span className="service-eta">ETA {service.etaMinutes || 60} min</span>
                </div>
                <button type="button" onClick={() => onBook(service)}>
                  ⚡ Book Now
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {!isLoading && services.length === 0 && (
        <div className="panel-message">No services found for this category.</div>
      )}
    </section>
  );
}

export default ServicesSection;
