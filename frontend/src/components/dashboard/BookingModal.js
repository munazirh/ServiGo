import React, { useEffect, useMemo, useState } from "react";
import { createBooking } from "../../services/api";

function BookingModal({ service, onClose, onBooked }) {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    landmark: "",
    city: "Godda",
    subcity: "",
    state: "Jharkhand",
    pincode: "",
    googleMapsLink: "",
  });
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [manualAddressConfirmed, setManualAddressConfirmed] = useState(false);
  const [locationFetchMessage, setLocationFetchMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  const estimatedTotal = useMemo(() => Number(service?.price || 0), [service?.price]);

  const fullAddress = useMemo(
    () =>
      [
        address.addressLine1,
        address.addressLine2,
        address.landmark,
        address.subcity,
        address.city,
        address.state,
        address.pincode,
      ]
        .filter(Boolean)
        .join(", "),
    [address]
  );

  const mapsSearchUrl = useMemo(() => {
    if (!fullAddress) return "https://www.google.com/maps";
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;
  }, [fullAddress]);

  const minDate = useMemo(() => now.toISOString().split("T")[0], [now]);
  const minTimeForDate = useMemo(() => {
    if (!date || date !== minDate) return "";
    const next = new Date(now.getTime() + 5 * 60 * 1000);
    return next.toTimeString().slice(0, 5);
  }, [date, minDate, now]);

  const isPastDateTime = useMemo(() => {
    if (!date || !time) return false;
    const selectedDateTime = new Date(`${date}T${time}`);
    return Number.isNaN(selectedDateTime.getTime()) || selectedDateTime < now;
  }, [date, time, now]);

  const upiId = "7970503756@upi";
  const upiNote = useMemo(
    () => `${service?.name || "Repair Service"} Booking`,
    [service?.name]
  );
  const upiUri = useMemo(
    () =>
      `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
        "Repair Hub"
      )}&am=${estimatedTotal}&cu=INR&tn=${encodeURIComponent(upiNote)}`,
    [upiId, estimatedTotal, upiNote]
  );
  const upiQrUrl = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
        upiUri
      )}`,
    [upiUri]
  );

  const updateAddressField = (key, value) => {
    setAddress((prev) => ({ ...prev, [key]: value }));
  };

  const fetchCurrentLocation = () => {
    setLocationFetchMessage("");
    if (!navigator.geolocation) {
      setLocationFetchMessage("Geolocation not supported on this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const link = `https://www.google.com/maps?q=${latitude},${longitude}`;
        setAddress((prev) => ({ ...prev, googleMapsLink: link }));
        setLocationFetchMessage(
          "Location fetched! Please verify your address below."
        );
      },
      () => {
        setLocationFetchMessage("Unable to fetch location. Please check browser permission.");
      }
    );
  };

  const continueStep = () => {
    setError("");
    if (step === 1) {
      if (!address.fullName || !address.phone || !address.addressLine1 || !address.city || !address.state || !address.pincode) {
        setError("Please fill all required address fields");
        return;
      }
      if (!/^\d{10}$/.test(address.phone)) {
        setError("Phone number must be 10 digits");
        return;
      }
      if (!manualAddressConfirmed) {
        setError("Please confirm that you manually verified your full address");
        return;
      }
    }
    if (step === 2 && !date) {
      setError("Please select a date");
      return;
    }
    if (step === 2 && date && time && isPastDateTime) {
      setError("Past date/time booking is not allowed");
      return;
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const goBack = () => {
    setError("");
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const confirmBooking = async () => {
    try {
      setIsSubmitting(true);
      setError("");

      await createBooking({
        serviceId: service._id,
        location: fullAddress,
        address: {
          ...address,
          phone: `+91${address.phone}`,
          googleMapsLink: address.googleMapsLink || mapsSearchUrl,
        },
        date,
        time,
        paymentMethod,
      });

      onBooked();
      onClose();
    } catch (err) {
      setError(err.message || "Unable to create booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card modal-scrollable">
        <button className="close-btn" onClick={onClose} type="button">
          X
        </button>

        <div className="progress-bar">
          <div className="progress" style={{ width: `${step * 33.33}%` }} />
        </div>

        {step === 1 && (
          <div>
            <h3>Customer Address</h3>
            <p className="modal-note">
              Booking for <strong>{service.name}</strong>
            </p>

            <div className="address-grid">
              <div className="form-field">
                <label className="field-label">Full Name *</label>
                <input
                  type="text"
                  placeholder="Your full name"
                  value={address.fullName}
                  onChange={(e) => updateAddressField("fullName", e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="field-label">Phone Number *</label>
                <div className="phone-input-group booking-phone-group">
                  <span>+91</span>
                  <input
                    type="text"
                    className="phone-field"
                    placeholder="10 digit phone"
                    value={address.phone}
                    onChange={(e) =>
                      updateAddressField("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
                    }
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">State *</label>
                <select
                  value={address.state}
                  onChange={(e) => updateAddressField("state", e.target.value)}
                  required
                >
                  <option value="Jharkhand">Jharkhand</option>
                </select>
              </div>

              <div className="form-field">
                <label className="field-label">City *</label>
                <select
                  value={address.city}
                  onChange={(e) => updateAddressField("city", e.target.value)}
                  required
                >
                  <option value="Godda">Godda</option>
                </select>
              </div>

              <div className="form-field">
                <label className="field-label">Sub-City / Area *</label>
                <select
                  value={address.subcity}
                  onChange={(e) => updateAddressField("subcity", e.target.value)}
                  required
                >
                  <option value="">Select Area</option>
                  <option value="Godda Town">Godda Town</option>
                  <option value="Mahagama">Mahagama</option>
                  <option value="Poriyahat">Poriyahat</option>
                  <option value="Pathargama">Pathargama</option>
                  <option value="Basantrai">Basantrai</option>
                  <option value="Lalmatia">Lalmatia</option>
                  <option value="Urjanagar">Urjanagar</option>
                </select>
              </div>

              <div className="form-field">
                <label className="field-label">6-Digit Pincode *</label>
                <input
                  type="text"
                  placeholder="Enter pincode"
                  value={address.pincode}
                  onChange={(e) => updateAddressField("pincode", e.target.value)}
                  maxLength={6}
                />
              </div>

              <div className="form-field full-width">
                <label className="field-label">Address Line 1 *</label>
                <input
                  type="text"
                  placeholder="House No., Street Name, Area"
                  value={address.addressLine1}
                  onChange={(e) => updateAddressField("addressLine1", e.target.value)}
                />
              </div>

              <div className="form-field full-width">
                <label className="field-label">Address Line 2</label>
                <input
                  type="text"
                  placeholder="Landmark, Colony (optional)"
                  value={address.addressLine2}
                  onChange={(e) => updateAddressField("addressLine2", e.target.value)}
                />
              </div>
            </div>

            <div className="confirm-checkbox">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={manualAddressConfirmed}
                  onChange={(e) => setManualAddressConfirmed(e.target.checked)}
                />
                <span className="checkmark"></span>
                <span className="checkbox-text">I have manually verified and typed my correct full address</span>
              </label>
            </div>

            <div className="modal-actions">
              <button type="button" onClick={continueStep}>
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h3>Date and Time</h3>
            <div className="address-grid">
              <div className="form-field">
                <label className="field-label">Select Date *</label>
                <input type="date" min={minDate} value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="field-label">Select Time</label>
                <input
                  type="time"
                  min={minTimeForDate}
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
            </div>
            <p className="modal-note">
              Current: {now.toLocaleDateString()} | {now.toLocaleTimeString()}
            </p>
            <div className="modal-actions">
              <button type="button" onClick={goBack} className="back-btn">
                Back
              </button>
              <button type="button" onClick={continueStep}>
                Next
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h3>Price and Payment</h3>
            <div className="payment-summary">
              <p>
                <span>Service Charge</span>
                <strong>Rs {estimatedTotal}</strong>
              </p>
              <p>
                <span>Platform Fee</span>
                <strong>Rs 0</strong>
              </p>
              <p className="total">
                <span>Total Payable</span>
                <strong>Rs {estimatedTotal}</strong>
              </p>
            </div>

            <div className="payment-mode-grid">
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === "upi"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <strong>UPI</strong>
                  <small>Fast QR Payment</small>
                </div>
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === "card"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <strong>Card</strong>
                  <small>Credit/Debit</small>
                </div>
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <div>
                  <strong>Cash</strong>
                  <small>Pay After Service</small>
                </div>
              </label>
            </div>

            {paymentMethod === "upi" && (
              <div className="upi-qr-card">
                <img src={upiQrUrl} alt="UPI QR Code" />
                <p>Scan to Pay via UPI</p>
                <small>UPI ID: <strong>{upiId}</strong></small>
              </div>
            )}

            <div className="modal-actions">
              <button type="button" onClick={goBack} className="back-btn">
                Back
              </button>
              <button
                type="button"
                className="confirm-btn"
                onClick={confirmBooking}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Booking..." : "Confirm Booking"}
              </button>
            </div>
          </div>
        )}

        {error && <p className="modal-error">{error}</p>}
      </div>
    </div>
  );
}

export default BookingModal;
