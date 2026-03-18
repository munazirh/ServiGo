import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import adminApi from "../services/adminApi";
import "./Dashboard.css";

function AdminTickets() {
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState({
    status: "",
    priority: "",
    category: ""
  });
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [resolution, setResolution] = useState("");

  useEffect(() => {
    fetchTickets();
  }, [filter]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filter.status) params.append("status", filter.status);
      if (filter.priority) params.append("priority", filter.priority);
      if (filter.category) params.append("category", filter.category);

      const response = await adminApi.fetchAllTickets(params.toString() ? Object.fromEntries(params) : {});
      setTickets(response.tickets || []);
    } catch (err) {
      setError("Failed to load tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await adminApi.updateTicketStatus(ticketId, {
        status: newStatus,
        resolution: resolution || undefined
      });
      fetchTickets();
      setSelectedTicket(null);
      setResolution("");
    } catch (err) {
      alert("Failed to update ticket status");
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

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Support Tickets Management</h1>
        <button 
          className="dashboard-primary-btn"
          onClick={fetchTickets}
        >
          🔄 Refresh
        </button>
      </div>

      <div className="dashboard-filters" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "20px" }}>
        <select 
          value={filter.status} 
          onChange={(e) => setFilter({...filter, status: e.target.value})}
          style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)" }}
        >
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <select 
          value={filter.priority} 
          onChange={(e) => setFilter({...filter, priority: e.target.value})}
          style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)" }}
        >
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        <select 
          value={filter.category} 
          onChange={(e) => setFilter({...filter, category: e.target.value})}
          style={{ padding: "8px 12px", borderRadius: "8px", border: "1px solid var(--border-color)" }}
        >
          <option value="">All Categories</option>
          <option value="billing">Billing</option>
          <option value="technical">Technical</option>
          <option value="service">Service</option>
          <option value="feedback">Feedback</option>
          <option value="complaint">Complaint</option>
          <option value="other">Other</option>
        </select>
      </div>

      {error && <div className="dashboard-error">{error}</div>}

      {loading ? (
        <div className="dashboard-loading">Loading tickets...</div>
      ) : (
        <div className="tickets-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {tickets.map((ticket) => (
            <div key={ticket._id} className="ticket-card" style={{ 
              padding: "16px", 
              borderRadius: "12px", 
              border: "1px solid var(--border-color)", 
              background: "var(--bg-surface)" 
            }}>
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
                  {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
                </span>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  {formatDate(ticket.createdAt)}
                </span>
              </div>

              <p style={{ fontSize: "13px", color: "var(--text-secondary)", margin: "0 0 12px" }}>
                {ticket.description.length > 100 
                  ? ticket.description.substring(0, 100) + "..." 
                  : ticket.description}
              </p>

              {ticket.resolution && (
                <div style={{ padding: "8px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "6px", marginBottom: "12px" }}>
                  <p style={{ margin: 0, fontSize: "12px", color: "#10b981" }}>
                    <strong>Resolved:</strong> {ticket.resolution}
                  </p>
                </div>
              )}

              <button 
                className="dashboard-primary-btn"
                onClick={() => setSelectedTicket(ticket)}
                style={{ width: "100%" }}
              >
                Manage Ticket
              </button>
            </div>
          ))}
        </div>
      )}

      {tickets.length === 0 && !loading && (
        <div className="dashboard-empty">
          <p>No tickets found</p>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div 
          style={{ 
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 
          }} 
          onClick={() => setSelectedTicket(null)}
        >
          <div 
            style={{ 
              background: "var(--bg-overlay)", 
              borderRadius: "16px", 
              padding: "24px", 
              maxWidth: "500px", 
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto"
            }} 
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ margin: 0 }}>Ticket #{selectedTicket._id.slice(-8)}</h2>
              <button 
                onClick={() => setSelectedTicket(null)}
                style={{ background: "none", border: "none", fontSize: "24px", cursor: "pointer", color: "var(--text-secondary)" }}
              >
                ×
              </button>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <h3 style={{ margin: "0 0 8px" }}>{selectedTicket.title}</h3>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "11px", backgroundColor: getPriorityColor(selectedTicket.priority), color: "#fff" }}>
                  {selectedTicket.priority}
                </span>
                <span style={{ padding: "4px 8px", borderRadius: "4px", fontSize: "11px", backgroundColor: getStatusColor(selectedTicket.status), color: "#fff" }}>
                  {selectedTicket.status.replace("_", " ")}
                </span>
                <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>
                  {getCategoryLabel(selectedTicket.category)}
                </span>
              </div>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <h4 style={{ margin: "0 0 8px" }}>Customer Information</h4>
              <p style={{ margin: "0 0 4px" }}><strong>Name:</strong> {selectedTicket.createdBy?.name || "Unknown"}</p>
              <p style={{ margin: "0 0 4px" }}><strong>Email:</strong> {selectedTicket.createdBy?.email || "N/A"}</p>
              <p style={{ margin: 0 }}><strong>Phone:</strong> {selectedTicket.createdBy?.phone || "N/A"}</p>
            </div>

            <div style={{ marginBottom: "16px" }}>
              <h4 style={{ margin: "0 0 8px" }}>Description</h4>
              <p style={{ margin: 0, color: "var(--text-secondary)" }}>{selectedTicket.description}</p>
            </div>

            {selectedTicket.resolution && (
              <div style={{ marginBottom: "16px", padding: "12px", background: "rgba(16, 185, 129, 0.1)", borderRadius: "8px" }}>
                <h4 style={{ margin: "0 0 8px", color: "#10b981" }}>Resolution</h4>
                <p style={{ margin: 0 }}>{selectedTicket.resolution}</p>
              </div>
            )}

            <div style={{ marginBottom: "16px" }}>
              <h4 style={{ margin: "0 0 12px" }}>Update Status</h4>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <select 
                  value={selectedTicket.status}
                  onChange={(e) => {
                    setSelectedTicket({...selectedTicket, status: e.target.value});
                  }}
                  style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)" }}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
                
                {(selectedTicket.status === "resolved" || selectedTicket.status === "closed") && (
                  <textarea
                    placeholder="Enter resolution notes..."
                    value={resolution}
                    onChange={(e) => setResolution(e.target.value)}
                    rows="3"
                    style={{ padding: "10px", borderRadius: "8px", border: "1px solid var(--border-color)", resize: "vertical" }}
                  />
                )}

                <button 
                  className="dashboard-primary-btn"
                  onClick={() => handleStatusChange(selectedTicket._id, selectedTicket.status)}
                >
                  Update Status
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTickets;
