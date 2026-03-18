const BASE_URL = "http://localhost:5000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

function getMultipartHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

async function adminRequest(endpoint, options = {}) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...getAuthHeaders(),
      ...(options.headers || {}),
    },
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Admin request failed");
  return payload;
}

// Upload image for service
export function uploadServiceImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  return fetch(`${BASE_URL}/admin/upload`, {
    method: "POST",
    headers: getMultipartHeaders(),
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then(err => {
          throw new Error(err.message || "Upload failed");
        });
      }
      return response.json();
    })
    .then((payload) => {
      return payload;
    })
    .catch((error) => {
      console.error("Upload error:", error);
      throw error;
    });
}

// Admin Analytics
export function fetchAdminAnalytics() {
  return adminRequest("/admin/analytics");
}

// Admin Services
export function fetchAdminServices() {
  return adminRequest("/admin/services");
}

export function createAdminService(data) {
  return adminRequest("/admin/services", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateAdminService(serviceId, data) {
  return adminRequest(`/admin/services/${serviceId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function toggleAdminService(serviceId) {
  return adminRequest(`/admin/services/${serviceId}/toggle`, {
    method: "PATCH",
  });
}

// Admin Bookings
export function fetchAdminBookings() {
  return adminRequest("/admin/bookings");
}

export function searchSupportCustomers(query) {
  return adminRequest(`/admin/support/customers/search?query=${encodeURIComponent(query)}`);
}

export function createSupportCallerBooking(data) {
  return adminRequest("/admin/support/bookings/caller", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function fetchSupportCustomerProfile(query) {
  return adminRequest(`/admin/support/customers/profile?query=${encodeURIComponent(query)}`);
}

export function updateAdminBookingStatus(bookingId, status) {
  return adminRequest(`/admin/bookings/${bookingId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export function assignTechnicianToBooking(bookingId, technicianId) {
  return adminRequest(`/admin/bookings/${bookingId}/assign`, {
    method: "PATCH",
    body: JSON.stringify({ technicianId }),
  });
}

// Admin Providers
export function fetchAdminProviders() {
  return adminRequest("/admin/providers");
}

export function createAdminProvider(data) {
  return adminRequest("/admin/providers", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function createSupportAccount(data) {
  return adminRequest("/admin/staff/support", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export function updateProviderApproval(providerId, isApproved) {
  return adminRequest(`/admin/providers/${providerId}/approval`, {
    method: "PATCH",
    body: JSON.stringify({ isApproved }),
  });
}

// Admin Users
export function fetchAdminUsers(role = "all") {
  return adminRequest(`/admin/users?role=${role}`);
}

export function updateUserBlockStatus(userId, isBlocked) {
  return adminRequest(`/admin/users/${userId}/block`, {
    method: "PATCH",
    body: JSON.stringify({ isBlocked }),
  });
}

// ===== TICKET ADMIN FUNCTIONS =====

// Get all tickets (admin/staff)
export function fetchAllTickets(params = {}) {
  const query = new URLSearchParams(params).toString();
  return adminRequest(`/tickets-admin/all?${query}`);
}

// Update ticket status
export function updateTicketStatus(ticketId, data) {
  return adminRequest(`/tickets-admin/${ticketId}/status`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

// Assign ticket to staff
export function assignTicket(ticketId, assignedTo) {
  return adminRequest(`/tickets-admin/${ticketId}/assign`, {
    method: "PATCH",
    body: JSON.stringify({ assignedTo }),
  });
}

// Default export for backward compatibility
export default {
  fetchAdminAnalytics,
  fetchAdminServices,
  createAdminService,
  updateAdminService,
  toggleAdminService,
  fetchAdminBookings,
  searchSupportCustomers,
  createSupportCallerBooking,
  fetchSupportCustomerProfile,
  updateAdminBookingStatus,
  assignTechnicianToBooking,
  fetchAdminProviders,
  createAdminProvider,
  createSupportAccount,
  updateProviderApproval,
  fetchAdminUsers,
  updateUserBlockStatus,
  fetchAllTickets,
  updateTicketStatus,
  assignTicket,
};
