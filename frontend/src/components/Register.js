import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./components.css";
import { request } from "../services/api.js";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneDigits, setPhoneDigits] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!/^\d{10}$/.test(phoneDigits)) {
      setError("Phone number must be exactly 10 digits");
      return;
    }

    try {
      setLoading(true);

      await request("/customer/register", {
        method: "POST",
        body: { name, email, phone: `+91${phoneDigits}`, password },
      });

      setSuccess("Registration successful. Redirecting to login...");
      setTimeout(() => navigate("/login"), 800);

    } catch (error) {
      setError(error?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join us today and book services in minutes 🚀</p>

        <form onSubmit={handleSubmit}>
          {error && <p className="auth-error">⚠ {error}</p>}
          {success && <p className="auth-success">✅ {success}</p>}

          <input
            type="text"
            className="auth-input"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            className="auth-input"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <div className="phone-input-group">
            <span>+91</span>
            <input
              type="text"
              className="auth-input phone-field"
              placeholder="10 digit phone number"
              value={phoneDigits}
              onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, "").slice(0, 10))}
              required
            />
          </div>

          <input
            type="password"
            className="auth-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="auth-button primary"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account ✨"}
          </button>

        </form>

        <p className="switch-text">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login 🔐</span>
        </p>
      </div>
    </div>
  );
}

export default Register;
