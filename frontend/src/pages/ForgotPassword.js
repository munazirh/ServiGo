import React, { useState } from "react";
import { auth } from "../firebase";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./AuthStyles.css";

function ForgotPassword() {
  const [phoneDigits, setPhoneDigits] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const phone = `+91${phoneDigits}`;

  const getOrCreateInvisibleRecaptcha = () => {
    if (window.recaptchaVerifier) {
      return window.recaptchaVerifier;
    }

    const recaptchaContainerId = "firebase-recaptcha-hidden";
    let container = document.getElementById(recaptchaContainerId);

    if (!container) {
      container = document.createElement("div");
      container.id = recaptchaContainerId;
      container.style.display = "none";
      document.body.appendChild(container);
    }

    window.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
      size: "invisible",
    });

    return window.recaptchaVerifier;
  };

  const sendOtp = async () => {
    setError("");
    setSuccess("");

    if (!/^\d{10}$/.test(phoneDigits)) {
      setError("Enter 10 digit phone number");
      return;
    }

    try {
      setLoading(true);
      const appVerifier = getOrCreateInvisibleRecaptcha();

      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setSuccess("OTP sent successfully");
    } catch (err) {
      setError(err?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };


  const verifyOtp = async () => {
    setError("");
    setSuccess("");

    if (!otp) {
      setError("Enter OTP");
      return;
    }

    try {
      setLoading(true);

      await confirmationResult.confirm(otp);

      // Check phone exists in backend
      const response = await fetch(
        "http://localhost:5000/api/customer/verify-phone",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ phone }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Phone not registered");
        return;
      }

      await signOut(auth); // logout firebase session

      setSuccess("OTP verified successfully");
      navigate("/reset-password", { state: { phone } });
    } catch {
      setError("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>
        <p className="auth-subtitle">
          Enter your registered phone number to reset password
        </p>

        {error && <p className="auth-error">⚠ {error}</p>}
        {success && <p className="auth-success">✅ {success}</p>}

        <div className="phone-input-group">
          <span>+91</span>
          <input
            type="text"
            className="auth-input phone-field"
            placeholder="10 digit phone number"
            value={phoneDigits}
            onChange={(e) => setPhoneDigits(e.target.value.replace(/\D/g, "").slice(0, 10))}
          />
        </div>

        <button
          className="auth-button primary"
          onClick={sendOtp}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>

        {confirmationResult && (
          <>
            <input
              type="text"
              className="auth-input"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              className="auth-button success"
              onClick={verifyOtp}
              disabled={loading}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;
