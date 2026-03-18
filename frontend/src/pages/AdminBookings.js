import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";
import {
  assignTechnicianToBooking,
  createSupportCallerBooking,
  fetchAdminBookings,
  fetchAdminServices,
  fetchAdminProviders,
  searchSupportCustomers,
  updateAdminBookingStatus
} from "../services/adminApi";
import { parseStoredUser } from "../utils/session";

const statuses = ["pending", "assigned", "completed", "cancelled"];

function AdminBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [technicians, setTechnicians] = useState([]);
  const [services, setServices] = useState([]);
  const [customerMatches, setCustomerMatches] = useState([]);
  const [customerLookup, setCustomerLookup] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const currentUser = parseStoredUser() || {};
  const isSupport = currentUser.role === "support";

  const [quickBooking, setQuickBooking] = useState({
    customerPhone: "",
    customerEmail: "",
    customerName: "",
    serviceId: "",
    date: "",
    time: "",
    location: "",
    paymentMethod: "cash",
  });

  const loadBookings = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminBookings();
      setBookings(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
    fetchAdminServices()
      .then((items) => setServices(items || []))
      .catch((err) => setError(err.message));
    fetchAdminProviders()
      .then((providers) =>
        setTechnicians(
          providers.filter((provider) => provider.isApproved && !provider.isBlocked)
        )
      )
      .catch((err) => setError(err.message));
  }, []);

  const handleStatusChange = async (bookingId, status) => {
    try {
      setError("");
      setMessage("");
      await updateAdminBookingStatus(bookingId, status);
      await loadBookings();
      setMessage("It is done. Booking status updated.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAssignTechnician = async (bookingId, technicianId) => {
    if (!technicianId) return;
    try {
      setError("");
      setMessage("");
      await assignTechnicianToBooking(bookingId, technicianId);
      await loadBookings();
      setMessage("It is done. Technician assigned.");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLookupCustomer = async () => {
    try {
      setError("");
      const query = customerLookup.trim();
      if (!query) {
        setCustomerMatches([]);
        return;
      }
      const results = await searchSupportCustomers(query);
      setCustomerMatches(results || []);
      setMessage(results?.length ? "It is done. Matching customers found." : "No matching customer found.");
    } catch (err) {
      setError(err.message);
    }
  };

  const fillCustomerFromMatch = (customer) => {
    setQuickBooking((prev) => ({
      ...prev,
      customerPhone: String(customer.phone || "").replace(/^\+91/, ""),
      customerEmail: customer.email || "",
      customerName: customer.name || "",
    }));
  };

  const createCallerBooking = async (event) => {
    event.preventDefault();
    try {
      setError("");
      setMessage("");

      if (!/^\d{10}$/.test(quickBooking.customerPhone)) {
        setError("Customer phone must be 10 digits");
        return;
      }
      if (!quickBooking.serviceId || !quickBooking.date || !quickBooking.location) {
        setError("Service, date and location are required");
        return;
      }

      await createSupportCallerBooking({
        customerPhone: `+91${quickBooking.customerPhone}`,
        customerEmail: quickBooking.customerEmail,
        customerName: quickBooking.customerName,
        serviceId: quickBooking.serviceId,
        date: quickBooking.date,
        time: quickBooking.time,
        location: quickBooking.location,
        paymentMethod: quickBooking.paymentMethod,
      });

      setQuickBooking({
        customerPhone: "",
        customerEmail: "",
        customerName: "",
        serviceId: "",
        date: "",
        time: "",
        location: "",
        paymentMethod: "cash",
      });
      await loadBookings();
      setMessage("It is done. Caller booking created successfully.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <h2>{isSupport ? "Customer Service Booking Desk" : "Booking Control"}</h2>
      {message && <p className="panel-message">{message}</p>}
      {error && <p className="panel-error">{error}</p>}
      {loading && <p className="panel-message">Loading bookings...</p>}

      <form className="admin-form" onSubmit={createCallerBooking}>
        <h3>Call Booking (Mobile Number Only)</h3>
        <div className="admin-filter-row">
          <input
            type="text"
            placeholder="Find customer by mobile/email"
            value={customerLookup}
            onChange={(e) => setCustomerLookup(e.target.value)}
          />
          <button type="button" className="update-btn" onClick={handleLookupCustomer}>
            Search Customer
          </button>
          <button
            type="button"
            className="update-btn"
            onClick={() => navigate("/support/customers")}
            style={{ display: isSupport ? "inline-block" : "none" }}
          >
            Open Customer 360
          </button>
        </div>

        {customerMatches.length > 0 && (
          <div className="booking-grid">
            {customerMatches.map((customer) => (
              <article className="booking-card" key={customer._id}>
                <p>
                  <strong>{customer.name}</strong> ({customer.phone})
                </p>
                <p>{customer.email}</p>
                <button type="button" className="update-btn" onClick={() => fillCustomerFromMatch(customer)}>
                  Use This Customer
                </button>
              </article>
            ))}
          </div>
        )}

        <div className="admin-phone-input">
          <span>+91</span>
          <input
            placeholder="Customer Mobile (required)"
            value={quickBooking.customerPhone}
            onChange={(e) =>
              setQuickBooking((prev) => ({
                ...prev,
                customerPhone: e.target.value.replace(/\D/g, "").slice(0, 10),
              }))
            }
            required
          />
        </div>

        <input
          placeholder="Customer Name (optional)"
          value={quickBooking.customerName}
          onChange={(e) => setQuickBooking((prev) => ({ ...prev, customerName: e.target.value }))}
        />

        <input
          placeholder="Customer Email (optional)"
          value={quickBooking.customerEmail}
          onChange={(e) => setQuickBooking((prev) => ({ ...prev, customerEmail: e.target.value }))}
        />

        <select
          value={quickBooking.serviceId}
          onChange={(e) => setQuickBooking((prev) => ({ ...prev, serviceId: e.target.value }))}
          required
        >
          <option value="">Select Service</option>
          {services.map((service) => (
            <option key={service._id} value={service._id}>
              {service.name} ({service.category}) - ₹ {service.price}
            </option>
          ))}
        </select>

        <div className="address-grid">
          <input
            type="date"
            value={quickBooking.date}
            onChange={(e) => setQuickBooking((prev) => ({ ...prev, date: e.target.value }))}
            required
          />
          <input
            type="time"
            value={quickBooking.time}
            onChange={(e) => setQuickBooking((prev) => ({ ...prev, time: e.target.value }))}
          />
        </div>

        <input
          placeholder="Service Location"
          value={quickBooking.location}
          onChange={(e) => setQuickBooking((prev) => ({ ...prev, location: e.target.value }))}
          required
        />

        <select
          value={quickBooking.paymentMethod}
          onChange={(e) => setQuickBooking((prev) => ({ ...prev, paymentMethod: e.target.value }))}
        >
          <option value="cash">Cash on Service</option>
          <option value="upi">UPI</option>
          <option value="card">Card</option>
        </select>

        <button type="submit" className="update-btn">
          Create Caller Booking
        </button>
      </form>

      <table className="product-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Service</th>
            <th>Schedule</th>
            <th>Location</th>
            <th>Price</th>
            <th>Payment</th>
            <th>Status</th>
            <th>Technician Assign</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking._id}>
              <td>
                {booking.address?.fullName || booking.user?.name}
                <br />
                <small>{booking.address?.phone || booking.user?.phone}</small>
                {booking.address?.addressLine1 && (
                  <>
                    <br />
                    <small>{booking.address.addressLine1}</small>
                    {booking.address.city && <>, {booking.address.city}</>}
                    {booking.address.state && <>, {booking.address.state}</>}
                    {booking.address.pincode && <>, {booking.address.pincode}</>}
                  </>
                )}
              </td>
              <td>{booking.serviceName || booking.service?.name}</td>
              <td>
                {booking.date}
                <br />
                <small>{booking.time}</small>
              </td>
              <td>{booking.location}</td>
              <td>₹ {booking.price}</td>
              <td>
                {booking.paymentMethod}
                <br />
                <small>{booking.paymentStatus}</small>
              </td>
              <td>
                <select
                  value={booking.status}
                  onChange={(event) => handleStatusChange(booking._id, event.target.value)}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <select
                  value={booking.technician?._id || ""}
                  onChange={(event) => handleAssignTechnician(booking._id, event.target.value)}
                >
                  <option value="">Select Technician</option>
                  {technicians.map((technician) => (
                    <option key={technician._id} value={technician._id}>
                      {technician.name} ({technician.technicianProfile?.city || "N/A"})
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}

export default AdminBookings;
