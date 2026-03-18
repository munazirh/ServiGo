import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AuthStyles.css";

function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  const phone = location.state?.phone;

  const handleReset = async () => {
    if (!newPassword) {
      alert("Enter new password");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/customer/reset-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone, newPassword }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Password Updated Successfully 🎉");
        navigate("/login");
      } else {
        alert(data.error || "Error resetting password");
      }
    } catch (error) {
      alert("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Reset Password</h2>

        <input
          type="password"
          className="auth-input"
          placeholder="Enter New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button
          className="auth-button primary"
          onClick={handleReset}
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </div>
  );
}

export default ResetPassword;
