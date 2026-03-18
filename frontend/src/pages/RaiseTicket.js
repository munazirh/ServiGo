import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../services/api";
import "./AuthStyles.css";

function RaiseTicket() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "other",
    priority: "medium"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const categories = [
    { value: "billing", label: "Billing Issue" },
    { value: "technical", label: "Technical Problem" },
    { value: "service", label: "Service Complaint" },
    { value: "feedback", label: "Feedback" },
    { value: "complaint", label: "Complaint" },
    { value: "other", label: "Other" }
  ];

  const priorities = [
    { value: "low", label: "Low - General Inquiry" },
    { value: "medium", label: "Medium - Need Assistance" },
    { value: "high", label: "High - Urgent Issue" },
    { value: "urgent", label: "Urgent - Critical Problem" }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.createTicket(formData);
      setSuccess("Ticket raised successfully! Our support team will get back to you soon.");
      setTimeout(() => {
        navigate("/my-tickets");
      }, 2000);
    } catch (err) {
      setError(err.message || ". Please try againFailed to raise ticket.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <h1 className="auth-title">Raise a Ticket</h1>
        <p className="auth-subtitle">
          We're here to help! Describe your issue and we'll get back to you.
        </p>

        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            className="auth-input"
            placeholder="Brief title of your issue"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <select
            name="category"
            className="auth-input"
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>

          <select
            name="priority"
            className="auth-input"
            value={formData.priority}
            onChange={handleChange}
          >
            {priorities.map(pri => (
              <option key={pri.value} value={pri.value}>{pri.label}</option>
            ))}
          </select>

          <textarea
            name="description"
            className="auth-input"
            placeholder="Describe your issue in detail..."
            rows="5"
            value={formData.description}
            onChange={handleChange}
            required
            style={{ resize: "vertical", minHeight: "100px" }}
          />

          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>
        </form>

        <p className="switch-text">
          <span onClick={() => navigate("/my-tickets")}>
            View My Tickets
          </span>
        </p>
      </div>
    </div>
  );
}

export default RaiseTicket;
