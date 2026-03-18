import React, { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { fetchSupportCustomerProfile } from "../services/adminApi";

function SupportCustomers() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const searchCustomer = async () => {
    try {
      setError("");
      setMessage("");
      setResult(null);

      const normalizedQuery = query.trim();
      if (!normalizedQuery) {
        setError("Mobile number or email is required");
        return;
      }

      const data = await fetchSupportCustomerProfile(normalizedQuery);
      setResult(data);
      setMessage("It is done. Customer profile loaded.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <h2>Customer 360 Lookup</h2>
      {message && <p className="panel-message">{message}</p>}
      {error && <p className="panel-error">{error}</p>}

      <div className="admin-form">
        <input
          type="text"
          placeholder="Enter customer mobile or email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="button" className="update-btn" onClick={searchCustomer}>
          View Customer Details
        </button>
      </div>

      {result && (
        <>
          <div className="status-grid">
            <article className="status-card">
              <h4>Name</h4>
              <p>{result.customer?.name}</p>
            </article>
            <article className="status-card">
              <h4>Phone</h4>
              <p>{result.customer?.phone}</p>
            </article>
            <article className="status-card">
              <h4>Email</h4>
              <p>{result.customer?.email}</p>
            </article>
            <article className="status-card">
              <h4>Total Bookings</h4>
              <p>{result.bookings?.length || 0}</p>
            </article>
          </div>

          <table className="product-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Date</th>
                <th>Time</th>
                <th>Status</th>
                <th>Technician</th>
                <th>Price</th>
              </tr>
            </thead>
            <tbody>
              {(result.bookings || []).map((booking) => (
                <tr key={booking._id}>
                  <td>{booking.serviceName || booking.service?.name}</td>
                  <td>{booking.date}</td>
                  <td>{booking.time}</td>
                  <td>{booking.status}</td>
                  <td>{booking.technician?.name || "Not assigned"}</td>
                  <td>₹ {booking.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </AdminLayout>
  );
}

export default SupportCustomers;
