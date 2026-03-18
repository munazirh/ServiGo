import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { fetchAdminAnalytics } from "../services/adminApi";

function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [error, setError] = useState("");

  const loadAnalytics = async () => {
    try {
      const data = await fetchAdminAnalytics();
      setAnalytics(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <AdminLayout>
      <h2>Analytics Dashboard</h2>
      {error && <p className="panel-error">{error}</p>}

      {!analytics ? (
        <p className="panel-message">Loading analytics...</p>
      ) : (
        <>
          <div className="dashboard-cards">
            <div className="card">
              <h3>Total Revenue</h3>
              <p>₹ {analytics.totalRevenue}</p>
            </div>
            <div className="card">
              <h3>Total Bookings</h3>
              <p>{analytics.totalBookings}</p>
            </div>
            <div className="card">
              <h3>Total Services</h3>
              <p>{analytics.totalServices}</p>
            </div>
            <div className="card">
              <h3>Customers</h3>
              <p>{analytics.totalCustomers}</p>
            </div>
            <div className="card">
              <h3>Technicians</h3>
              <p>{analytics.totalTechnicians}</p>
            </div>
            <div className="card">
              <h3>Pending Providers</h3>
              <p>{analytics.pendingProviders}</p>
            </div>
            <div className="card">
              <h3>Blocked Users</h3>
              <p>{analytics.blockedUsers}</p>
            </div>
          </div>

          <div className="status-grid">
            <div className="status-card">
              <h4>Pending Bookings</h4>
              <p>{analytics.pendingBookings}</p>
            </div>
            <div className="status-card">
              <h4>Assigned Bookings</h4>
              <p>{analytics.assignedBookings}</p>
            </div>
            <div className="status-card">
              <h4>Completed Bookings</h4>
              <p>{analytics.completedBookings}</p>
            </div>
          </div>
        </>
      )}
    </AdminLayout>
  );
}

export default AdminDashboard;
