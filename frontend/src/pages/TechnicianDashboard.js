import React, { useEffect, useMemo, useState } from "react";
import { fetchMyNotifications, markNotificationRead } from "../services/api";
import {
  fetchTechnicianDashboard,
  updateTechnicianAvailability,
  updateTechnicianBookingAction,
  updateTechnicianSkills,
} from "../services/technicianApi";
import "./TechnicianDashboard.css";

function TechnicianDashboard() {
  const [data, setData] = useState(null);
  const [skillsInput, setSkillsInput] = useState("");
  const [availability, setAvailability] = useState({});
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const loadDashboard = async () => {
    try {
      setError("");
      const payload = await fetchTechnicianDashboard();
      setData(payload);
      setAvailability(payload.profile?.availability || {});
      setSkillsInput((payload.profile?.skills || []).join(", "));
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadDashboard();
    fetchMyNotifications()
      .then((items) => setNotifications(items || []))
      .catch(() => setNotifications([]));
  }, []);

  const handleReadNotification = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n._id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      setError(err.message);
    }
  };

  const activeJobs = data?.assignedJobs || [];
  const historyJobs = data?.historyJobs || [];
  const stats = data?.stats || { activeJobs: 0, completedJobs: 0, totalEarnings: 0 };

  const availableDays = useMemo(
    () => ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
    []
  );

  const handleAction = async (bookingId, action) => {
    try {
      await updateTechnicianBookingAction(bookingId, action);
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    }
  };

  const saveSkills = async () => {
    try {
      setIsSaving(true);
      const skills = skillsInput
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean);
      await updateTechnicianSkills(skills);
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleAvailabilityDay = (day) => {
    setAvailability((prev) => ({ ...prev, [day]: !prev[day] }));
  };

  const saveAvailability = async () => {
    try {
      setIsSaving(true);
      await updateTechnicianAvailability(availability);
      await loadDashboard();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="tech-page">
      <header className="tech-header">
        <div>
          <p className="tech-badge">🛠 Service Provider Panel</p>
          <h1>{data?.profile?.name || "Technician"}</h1>
          <p className="tech-subtitle">Manage jobs, availability, skills and earnings from one dashboard.</p>
        </div>
      </header>

      {error && <p className="tech-error">{error}</p>}

      <section className="tech-stats">
        <article>
          <h3>Active Jobs</h3>
          <p>{stats.activeJobs}</p>
        </article>
        <article>
          <h3>Completed Jobs</h3>
          <p>{stats.completedJobs}</p>
        </article>
        <article>
          <h3>Total Earnings</h3>
          <p>₹ {stats.totalEarnings}</p>
        </article>
      </section>

      <section className="tech-grid">
        <div className="tech-card">
          <h2>🧩 Services Select (Skills)</h2>
          <p>Add comma separated skills: AC Repair, Fridge Gas Fill, Geyser Install...</p>
          <input
            type="text"
            value={skillsInput}
            onChange={(event) => setSkillsInput(event.target.value)}
            placeholder="AC Repair, Fridge Repair"
          />
          <button type="button" onClick={saveSkills} disabled={isSaving}>
            💾 Save Skills
          </button>
        </div>

        <div className="tech-card">
          <h2>📅 Availability Calendar</h2>
          <div className="availability-grid">
            {availableDays.map((day) => (
              <button
                type="button"
                key={day}
                className={`availability-pill ${availability[day] ? "on" : "off"}`}
                onClick={() => toggleAvailabilityDay(day)}
              >
                {day.slice(0, 3).toUpperCase()} - {availability[day] ? "Available" : "Off"}
              </button>
            ))}
          </div>
          <button type="button" onClick={saveAvailability} disabled={isSaving}>
            💾 Save Availability
          </button>
        </div>
      </section>

      <section className="tech-card">
        <h2>🔔 Portal Notifications</h2>
        <div className="tech-notification-list">
          {notifications.map((item) => (
            <article key={item._id} className={`tech-note ${item.isRead ? "read" : "unread"}`}>
              <div>
                <strong>{item.title}</strong>
                <p>{item.message}</p>
              </div>
              {!item.isRead && (
                <button type="button" onClick={() => handleReadNotification(item._id)}>
                  ✅ Mark Read
                </button>
              )}
            </article>
          ))}
          {notifications.length === 0 && <p className="tech-empty">No notifications yet.</p>}
        </div>
      </section>

      <section className="tech-card">
        <h2>📦 Booking Accept / Reject</h2>
        <div className="job-list">
          {activeJobs.map((job) => (
            <article className="job-item" key={job._id}>
              <div>
                <h4>{job.serviceName || job.service?.name}</h4>
                <p>
                  {job.user?.name} ({job.user?.phone}) | {job.date} {job.time}
                </p>
                <p>{job.location}</p>
                <small>Status: {job.status} | Action: {job.technicianAction}</small>
              </div>
              <div className="job-actions">
                <button type="button" onClick={() => handleAction(job._id, "accept")}>
                  👍 Accept
                </button>
                <button type="button" className="warn" onClick={() => handleAction(job._id, "reject")}>
                  👎 Reject
                </button>
                <button type="button" className="success" onClick={() => handleAction(job._id, "complete")}>
                  ✅ Complete
                </button>
              </div>
            </article>
          ))}
          {activeJobs.length === 0 && <p className="tech-empty">No active assigned jobs.</p>}
        </div>
      </section>

      <section className="tech-card">
        <h2>🧾 Job History</h2>
        <div className="job-list">
          {historyJobs.map((job) => (
            <article className="job-item history" key={job._id}>
              <div>
                <h4>{job.serviceName || job.service?.name}</h4>
                <p>
                  {job.user?.name} | {job.date} {job.time}
                </p>
                <small>Status: {job.status}</small>
              </div>
              <strong>₹ {job.price}</strong>
            </article>
          ))}
          {historyJobs.length === 0 && <p className="tech-empty">No completed/cancelled history yet.</p>}
        </div>
      </section>
    </div>
  );
}

export default TechnicianDashboard;
