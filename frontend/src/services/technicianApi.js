const BASE_URL = "http://localhost:5000/api";

function getHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

async function technicianRequest(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Technician request failed");
  return payload;
}

export function fetchTechnicianDashboard() {
  return technicianRequest("/technician/dashboard");
}

export function updateTechnicianSkills(skills) {
  return technicianRequest("/technician/services", {
    method: "PATCH",
    body: JSON.stringify({ skills }),
  });
}

export function updateTechnicianAvailability(availability) {
  return technicianRequest("/technician/availability", {
    method: "PATCH",
    body: JSON.stringify({ availability }),
  });
}

export function updateTechnicianBookingAction(bookingId, action) {
  return technicianRequest(`/technician/bookings/${bookingId}/action`, {
    method: "PATCH",
    body: JSON.stringify({ action }),
  });
}
