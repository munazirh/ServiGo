import React, { useEffect, useMemo, useState } from "react";
import ServicesSection from "../components/dashboard/ServicesSection";
import BookingModal from "../components/dashboard/BookingModal";
import MyBookings from "../components/dashboard/MyBookings";
import {
  fetchMyBookings,
  fetchMyNotifications,
  fetchServices,
  markNotificationRead,
  seedServices
} from "../services/api";
import "../components/dashboard/dashboard.css";
import { parseStoredUser } from "../utils/session";

function Dashboard() {
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedService, setSelectedService] = useState(null);
  const [isLoadingServices, setIsLoadingServices] = useState(false);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [isSeedingServices, setIsSeedingServices] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");

  // Read once from localStorage for greeting.
  const user = parseStoredUser() || {};
  const customerName = user?.name || "Customer";

  const loadServices = async (category = selectedCategory) => {
    try {
      setIsLoadingServices(true);
      setError("");
      const serviceData = await fetchServices(category);
      setServices(serviceData);
    } catch (err) {
      setError(err.message || "Unable to fetch services");
    } finally {
      setIsLoadingServices(false);
    }
  };

  const loadBookings = async () => {
    try {
      setIsLoadingBookings(true);
      setError("");
      const bookingData = await fetchMyBookings();
      setBookings(bookingData);
    } catch (err) {
      setError(err.message || "Unable to fetch bookings");
    } finally {
      setIsLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadServices(selectedCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  useEffect(() => {
    loadBookings();
    fetchMyNotifications()
      .then((items) => setNotifications(items || []))
      .catch(() => setNotifications([]));
  }, []);

  const handleReadNotification = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      setError(err.message || "Unable to update notification");
    }
  };

  const handleSeedServices = async () => {
    try {
      setIsSeedingServices(true);
      setError("");
      await seedServices();
      await loadServices(selectedCategory);
    } catch (err) {
      setError(err.message || "Unable to seed services");
    } finally {
      setIsSeedingServices(false);
    }
  };

  const stats = useMemo(() => {
    const pending = bookings.filter((b) => b.status === "pending").length;
    const assigned = bookings.filter((b) => b.status === "assigned").length;
    const completed = bookings.filter((b) => b.status === "completed").length;
    return { pending, assigned, completed };
  }, [bookings]);

  return (
    <div className="dashboard-container">
      <header className="customer-hero">
        <div>
          {/* TODO: Uncomment this when you add customer hero banner image */}
          {/* <img src="/images/customer-hero.jpg" alt="Home appliance services" className="hero-banner" /> */}

          <h2>
            👋 Welcome, <span>{customerName}</span>
          </h2>
          <p>
            Book trusted technicians for AC, Fridge and Geyser with real-time status updates.
          </p>
        </div>
      </header>

      {/* Quick status summary cards */}
      <section className="summary-grid">
        <article className="summary-card">
          <h4>🕒 Pending</h4>
          <p>{stats.pending}</p>
        </article>
        <article className="summary-card">
          <h4>🧰 Assigned</h4>
          <p>{stats.assigned}</p>
        </article>
        <article className="summary-card">
          <h4>✅ Completed</h4>
          <p>{stats.completed}</p>
        </article>
      </section>

      {error && <p className="panel-error">{error}</p>}

      <section className="customer-section">
        <div className="section-header">
          <h3 className="section-title">🔔 Portal Notifications</h3>
          <p className="section-subtitle">Real-time booking updates from admin and technicians.</p>
        </div>
        <div className="notification-list">
          {notifications.map((item) => (
            <article
              className={`notification-item ${item.isRead ? "read" : "unread"}`}
              key={item._id}
            >
              <div>
                <h4>{item.title}</h4>
                <p>{item.message}</p>
              </div>
              {!item.isRead && (
                  <button type="button" onClick={() => handleReadNotification(item._id)}>
                  ✅ Mark Read
                </button>
              )}
            </article>
          ))}
          {notifications.length === 0 && <p className="panel-message">No notifications yet.</p>}
        </div>
      </section>

      <ServicesSection
        services={services}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        onBook={setSelectedService}
        isLoading={isLoadingServices}
      />

      {!isLoadingServices && services.length === 0 && (
        <section className="customer-section empty-services">
          <h3>No services available yet</h3>
          <p>
            Services appear here after admin adds them. For now you can load demo services.
          </p>
          <button
            type="button"
            className="seed-btn"
            onClick={handleSeedServices}
            disabled={isSeedingServices}
          >
            {isSeedingServices ? "Loading Demo Services..." : "⚡ Load Demo Services"}
          </button>
        </section>
      )}

      <MyBookings bookings={bookings} onRefresh={loadBookings} />

      {(isLoadingBookings || isLoadingServices) && (
        <div className="panel-message">Refreshing latest data...</div>
      )}

      {selectedService && (
        <BookingModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
          onBooked={loadBookings}
        />
      )}
    </div>
  );
}

export default Dashboard;
