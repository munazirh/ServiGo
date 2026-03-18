import React, { useState } from "react";
import { submitBookingReview } from "../../services/api";

// Star Rating Component for interactive rating
function StarRating({ rating, setRating, interactive = true }) {
  const [hoverRating, setHoverRating] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${(hoverRating || rating) >= star ? "active" : ""}`}
          onClick={() => interactive && setRating(star)}
          onMouseEnter={() => interactive && setHoverRating(star)}
          onMouseLeave={() => interactive && setHoverRating(0)}
          style={{ cursor: interactive ? "pointer" : "default" }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

// Rating Display Component for showing existing ratings
function RatingDisplay({ rating }) {
  return (
    <div className="rating-display">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={`star ${star <= rating ? "filled" : "empty"}`}>
          ★
        </span>
      ))}
    </div>
  );
}

function MyBookings({ bookings, onRefresh }) {
  const [activeReviewBooking, setActiveReviewBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const [isSavingReview, setIsSavingReview] = useState(false);
  const [error, setError] = useState("");

  const openReviewForm = (booking) => {
    setActiveReviewBooking(booking._id);
    setRating(booking.rating || 5);
    setReview(booking.review || "");
    setError("");
  };

  const saveReview = async () => {
    if (!activeReviewBooking) return;

    try {
      setIsSavingReview(true);
      setError("");
      await submitBookingReview(activeReviewBooking, {
        rating: Number(rating),
        review,
      });
      setActiveReviewBooking(null);
      onRefresh();
    } catch (err) {
      setError(err.message || "Unable to save review");
    } finally {
      setIsSavingReview(false);
    }
  };

  const bookingStep = (status) => {
    if (status === "completed") return 3;
    if (status === "assigned") return 2;
    return 1;
  };

  return (
    <section className="customer-section">
      <div className="section-header">
        <h3 className="section-title">📋 My Bookings</h3>
        <p className="section-subtitle">
          Track status, payment, and submit feedback after service completion.
        </p>
      </div>

      <div className="booking-grid">
        {bookings.map((booking) => (
          <article key={booking._id} className="booking-card">
            <div className="booking-top">
              <h4>{booking.serviceName || booking.service?.name}</h4>
              <span className={`status ${booking.status || "pending"}`}>{booking.status}</span>
            </div>

            <div className="status-timeline">
              {["Pending", "Assigned", "Completed"].map((label, index) => {
                const active = bookingStep(booking.status) >= index + 1;
                return (
                  <div key={label} className={`timeline-step ${active ? "active" : ""}`}>
                    <span className="timeline-dot" />
                    <small>{label}</small>
                  </div>
                );
              })}
            </div>

            <p>
              <strong>Category:</strong> {booking.category}
            </p>
            <p>
              <strong>Date & Time:</strong> {booking.date} | {booking.time}
            </p>
            <p>
              <strong>Location:</strong> {booking.location}
            </p>
            {booking.address?.googleMapsLink && (
              <p>
                <strong>Map:</strong>{" "}
                <a href={booking.address.googleMapsLink} target="_blank" rel="noreferrer">
                  Open Map
                </a>
              </p>
            )}
            {booking.technician?.name && (
              <p>
                <strong>Technician:</strong> {booking.technician.name} ({booking.technician.phone})
              </p>
            )}
            <p>
              <strong>Payment:</strong> {booking.paymentMethod} ({booking.paymentStatus})
            </p>
            <p>
              <strong>Price:</strong> ₹ {booking.price}
            </p>

            {/* Show existing rating if available */}
            {booking.rating && booking.status === "completed" && (
              <div style={{ marginTop: "10px" }}>
                <p style={{ margin: "0 0 4px", fontSize: "0.9rem" }}><strong>Your Rating:</strong></p>
                <RatingDisplay rating={booking.rating} />
                {booking.review && (
                  <p style={{ margin: "8px 0 0", color: "var(--text-secondary)", fontSize: "0.9rem", fontStyle: "italic" }}>
                    "{booking.review}"
                  </p>
                )}
              </div>
            )}

            {booking.status === "completed" && (
              <div className="booking-actions">
                <button type="button" onClick={() => openReviewForm(booking)}>
                  {booking.rating ? "✍ Update Review" : "⭐ Rate & Review"}
                </button>
              </div>
            )}

            {activeReviewBooking === booking._id && (
              <div className="review-form">
                <label>Your Rating</label>
                <StarRating rating={rating} setRating={setRating} />

                <label htmlFor={`review-${booking._id}`}>Review</label>
                <textarea
                  id={`review-${booking._id}`}
                  rows="3"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="Share your experience with this service..."
                />

                <div className="review-actions">
                  <button type="button" onClick={() => setActiveReviewBooking(null)}>
                    Cancel
                  </button>
                  <button type="button" onClick={saveReview} disabled={isSavingReview}>
                    {isSavingReview ? "Saving..." : "💾 Save Review"}
                  </button>
                </div>

                {error && <p className="panel-error">{error}</p>}
              </div>
            )}
          </article>
        ))}
      </div>

      {bookings.length === 0 && (
        <div className="panel-message">No bookings yet. Book your first service above.</div>
      )}
    </section>
  );
}

export default MyBookings;
