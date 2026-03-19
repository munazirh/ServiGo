const BASE_URL = process.env.REACT_APP_API_URL;

// Small helper to keep fetch handling consistent everywhere.
async function request(endpoint, { method = "GET", body, token } = {}) {
  const headers = {
    "Content-Type": "application/json",
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload.message || "Something went wrong");
  }

  return payload;
}

// Public service list.
export async function fetchServices(category = "all") {
  const query = category && category !== "all" ? `?category=${category}` : "";
  return request(`/services${query}`);
}

// Dev helper: populate starter services (AC/Fridge/Geyser) from backend seed route.
export async function seedServices() {
  return request("/services/seed", {
    method: "POST",
  });
}

// Customer booking create API.
export async function createBooking(bookingInput) {
  const token = localStorage.getItem("token");
  return request("/bookings", {
    method: "POST",
    body: bookingInput,
    token,
  });
}

// Logged-in customer bookings.
export async function fetchMyBookings() {
  const token = localStorage.getItem("token");
  return request("/bookings/me", {
    token,
  });
}

// Customer rating + review submission.
export async function submitBookingReview(bookingId, reviewPayload) {
  const token = localStorage.getItem("token");
  return request(`/bookings/${bookingId}/review`, {
    method: "PATCH",
    body: reviewPayload,
    token,
  });
}

// Temporary status update helper for local demo/testing.
// TODO: Remove from customer UI once technician panel is ready.
export async function updateBookingStatus(bookingId, status) {
  const token = localStorage.getItem("token");
  return request(`/bookings/${bookingId}/status`, {
    method: "PATCH",
    body: { status },
    token,
  });
}

// Portal notifications for logged-in user.
export async function fetchMyNotifications() {
  const token = localStorage.getItem("token");
  return request("/notifications/me", { token });
}

export async function markNotificationRead(notificationId) {
  const token = localStorage.getItem("token");
  return request(`/notifications/${notificationId}/read`, {
    method: "PATCH",
    token,
  });
}

// ===== TICKET API FUNCTIONS =====

// Create a new support ticket
export async function createTicket(ticketData) {
  const token = localStorage.getItem("token");
  return request("/tickets", {
    method: "POST",
    body: ticketData,
    token,
  });
}

// Get user's own tickets
export async function fetchMyTickets() {
  const token = localStorage.getItem("token");
  return request("/tickets/my-tickets", { token });
}

// Get single ticket by ID
export async function fetchTicketById(ticketId) {
  const token = localStorage.getItem("token");
  return request(`/tickets/${ticketId}`, { token });
}

// Default export for backward compatibility
export default {
  fetchServices,
  seedServices,
  createBooking,
  fetchMyBookings,
  submitBookingReview,
  updateBookingStatus,
  fetchMyNotifications,
  markNotificationRead,
  createTicket,
  fetchMyTickets,
  fetchTicketById,
};
