import React from "react";
import { useNavigate } from "react-router-dom";
import { parseStoredUser } from "../utils/session";

const AdminSidebar = () => {
  const navigate = useNavigate();
  const user = parseStoredUser() || {};
  const isSupport = user.role === "support";
  const base = isSupport ? "/support" : "/admin";

  return (
    <div className="sidebar">
      <h2 className="logo">{isSupport ? "Customer Service" : "Admin"}</h2>

      <ul>
        {!isSupport && <li onClick={() => navigate("/admin")}>📊 Analytics</li>}
        <li onClick={() => navigate(`${base}/services`)}>🧰 Services & Pricing</li>
        <li onClick={() => navigate(`${base}/bookings`)}>📦 Booking Control</li>
        {isSupport && <li onClick={() => navigate("/support/customers")}>👤 Customer 360</li>}
        <li onClick={() => navigate(`${base}/providers`)}>🛠 Provider Approval</li>
        <li onClick={() => navigate(`${base}/users`)}>👥 User Block/Unblock</li>
        <li onClick={() => navigate(`${base}/tickets`)}>🎫 Support Tickets</li>
        {!isSupport && <li onClick={() => navigate("/admin/products")}>🧾 Legacy Products</li>}
        {!isSupport && <li onClick={() => navigate("/admin/add-product")}>➕ Add Product</li>}
      </ul>
    </div>
  );
};

export default AdminSidebar;
