import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as api from "../services/api";
import "./Dashboard.css";

function MyTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const response = await api.fetchMyTickets();
      setTickets(response);
    } catch (err) {
      setError("Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      open: "#06b6d4",
      in_progress: "#f59e0b",
      resolved: "#10b981",
      closed: "#6b7280"
    };
    return colors[status] || "#6b7280";
  };

  const getPriorityColor = (priority) => {
    const colors = {
      low: "#6b7280",
      medium: "#3b82f6",
      high: "#f59e0b",
      urgent: "#ef4444"
    };
    return colors[priority] || "#6b7280";
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getCategoryLabel = (category) => {
    const labels = {
      billing: "Billing",
      technical: "Technical",
      service: "Service",
      feedback: "Feedback",
      complaint: "Complaint",
      other: "Other"
    };
    return labels[category] || category;
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="dashboard-loading">Loading your tickets...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>My Support Tickets</h1>
        <button 
          className="dashboard-primary-btn"
          onClick={() => navigate("/raise-ticket")}
        >
          Raise New Ticket
        </button>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      {tickets.length === 0 ? (
        <div className="dashboard-empty">
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🎫</div>
          <h3>No tickets yet</h3>
          <p>Need help? Raise a ticket and our support team will assist you.</p>
          <button 
            className="dashboard-primary-btn"
            onClick={() => navigate("/raise-ticket")}
          >
            Raise Your First Ticket
          </button>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {tickets.map((ticket) => (
            <div 
              key={ticket._id} 
              style={{ 
                padding: "16px", 
                borderRadius: "12px", 
                border: "1px solid var(--border-color)", 
                background: "var(--bg-surface)" 
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>#{ticket._id.slice(-6)}</span>
                <span 
                  style={{ 
                    padding: "4px 10px", 
                    borderRadius: "6px", 
                    fontSize: "11px", 
                    fontWeight: "700",
                    textTransform: "uppercase",
                    backgroundColor: getStatusColor(ticket.status),
                    color: "#fff"
                  }}
                >
                  {ticket.status.replace("_", " ")}
                </span>
              </div>
              
              <h3 style={{ margin: "0 0 8px", fontSize: "16px" }}>{ticket.title}</h3>
              
              <div style={{ display: "flex", gap: "12px", marginBottom: "12px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  {getCategoryLabel(ticket.category)}
                </span>
                <span 
                  style={{ fontSize: "12px", color: getPriorityColor(ticket.priority), fontWeight: "600" }}
                >
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)} Priority
                </span>
              </div>

              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 12px" }}>
                {ticket.description.length > 120 
                  ? ticket.description.substring(0, 120) + "..." 
                  : ticket.description}
              </p>

              {ticket.resolution && (
                <div style={{ padding: "10px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "8px", marginBottom: "12px" }}>
                  <p style={{ margin: 0, fontSize: "12px", color: "#10b981" }}>
                    <strong>Resolution:</strong> {ticket.resolution}
                  </p>
                </div>
              )}

              <div style={{ fontSize: "11px", color: "var(--text-secondary)" }}>
                Created: {formatDate(ticket.createdAt)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTickets;
