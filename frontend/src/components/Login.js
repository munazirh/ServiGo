import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./components.css";
import { request } from "../services/api.js";
import { parseStoredUser, setAuthSession } from "../utils/session";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get("redirect");

  // Auto redirect if already logged in
useEffect(() => {
  const token = localStorage.getItem("token");
  const user = parseStoredUser();

  if (token && user) {
    if (user.role === "admin") {
      navigate("/admin");
    } else if (user.role === "technician") {
      navigate("/technician");
    } else if (user.role === "support") {
      navigate("/support/bookings");
    } else {
      navigate("/dashboard");
    }
  }
}, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password.trim()) {
      setError("All fields are required");
      return;
    }

    setLoading(true);

    try {
      const data = await request("/customer/login", {
        method: "POST",
        body: {
          identifier: identifier.trim(),
          password: password.trim(),
        },
      });

      if (!data.token || !data.user) {
        setError("Invalid server response");
        return;
      }

      // Session survives tab refresh but closes with browser session end.
      setAuthSession(data.token, data.user);

      // Redirect to the intended page or role-based default
      if (redirectUrl) {
        navigate(redirectUrl);
      } else if (data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user.role === "technician") {
        navigate("/technician");
      } else if (data.user.role === "support") {
        navigate("/support");
      } else {
        navigate("/dashboard");
      }


    } catch (err) {
      console.error("Login Error:", err);
      setError(err?.message || "Server error. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back 👋</h2>
        <p className="auth-subtitle">Login to continue your service journey</p>

        <form onSubmit={handleSubmit}>
          {error && <p className="auth-error">⚠ {error}</p>}

          <input
            type="text"
            className="auth-input"
            placeholder="Email or Phone"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              className="auth-input"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="forgot-password">
            <span onClick={() => navigate("/forgot-password")}>
              🔑 Forgot Password?
            </span>
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="switch-text">
          New here?{" "}
          <span onClick={() => navigate("/register")}>
            Create Account ✨
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
