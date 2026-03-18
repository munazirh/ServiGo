import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  createAdminProvider,
  createSupportAccount,
  fetchAdminProviders,
  updateProviderApproval,
  updateUserBlockStatus
} from "../services/adminApi";
import { parseStoredUser } from "../utils/session";

function AdminProviders() {
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneDigits: "",
    password: "",
    city: "",
    experienceYears: "",
    skills: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [supportForm, setSupportForm] = useState({
    name: "",
    phoneDigits: "",
    password: "",
  });
  const currentUser = parseStoredUser() || {};
  const isAdmin = currentUser.role === "admin";

  const loadProviders = async () => {
    try {
      const data = await fetchAdminProviders();
      setProviders(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const createSupport = async (event) => {
    event.preventDefault();
    try {
      setError("");
      setMessage("");
      if (!/^\d{10}$/.test(supportForm.phoneDigits)) {
        setError("Support phone number must be 10 digits");
        return;
      }

      await createSupportAccount({
        name: supportForm.name,
        phone: `+91${supportForm.phoneDigits}`,
        password: supportForm.password,
      });

      setSupportForm({ name: "", phoneDigits: "", password: "" });
      setMessage("It is done. Customer service account created.");
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    loadProviders();
  }, []);

  const updateApproval = async (providerId, isApproved) => {
    try {
      setError("");
      setMessage("");
      await updateProviderApproval(providerId, isApproved);
      await loadProviders();
      setMessage(`It is done. Technician ${isApproved ? "approved" : "set to pending"} successfully.`);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleBlock = async (providerId, isBlocked) => {
    try {
      setError("");
      setMessage("");
      await updateUserBlockStatus(providerId, !isBlocked);
      await loadProviders();
      setMessage(`It is done. Provider ${isBlocked ? "unblocked" : "blocked"} successfully.`);
    } catch (err) {
      setError(err.message);
    }
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const createProvider = async (event) => {
    event.preventDefault();
    try {
      setError("");
      setMessage("");
      if (!/^\d{10}$/.test(form.phoneDigits)) {
        setError("Phone number must be 10 digits");
        return;
      }
      await createAdminProvider({
        name: form.name,
        email: form.email,
        phone: `+91${form.phoneDigits}`,
        password: form.password,
        city: form.city,
        experienceYears: Number(form.experienceYears || 0),
        skills: form.skills.split(",").map((item) => item.trim()).filter(Boolean),
      });

      setForm({
        name: "",
        email: "",
        phoneDigits: "",
        password: "",
        city: "",
        experienceYears: "",
        skills: "",
      });
      await loadProviders();
      setMessage("It is done. Technician account created.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <h2>Provider Approval</h2>
      {message && <p className="panel-message">{message}</p>}
      {error && <p className="panel-error">{error}</p>}

      <form className="admin-form" onSubmit={createProvider}>
        <h3>Create Technician Account</h3>
        <input name="name" placeholder="Name" value={form.name} onChange={onChange} required />
        <input name="email" placeholder="Email" value={form.email} onChange={onChange} required />
        <div className="phone-input-group admin-phone-input">
          <span>+91</span>
          <input
            name="phoneDigits"
            placeholder="10 digit phone"
            value={form.phoneDigits}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                phoneDigits: e.target.value.replace(/\D/g, "").slice(0, 10)
              }))
            }
            required
          />
        </div>
        <input
          name="password"
          type="password"
          placeholder="Temporary Password"
          value={form.password}
          onChange={onChange}
          required
        />
        <input name="city" placeholder="City" value={form.city} onChange={onChange} />
        <input
          name="experienceYears"
          type="number"
          placeholder="Experience Years"
          value={form.experienceYears}
          onChange={onChange}
        />
        <input
          name="skills"
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={onChange}
        />
        <button type="submit" className="update-btn">
          Add Technician
        </button>
      </form>

      {isAdmin && (
        <form className="admin-form" onSubmit={createSupport}>
          <h3>Create Customer Service Account</h3>
          <input
            placeholder="Support Staff Name"
            value={supportForm.name}
            onChange={(e) => setSupportForm((prev) => ({ ...prev, name: e.target.value }))}
            required
          />
          <div className="phone-input-group admin-phone-input">
            <span>+91</span>
            <input
              placeholder="10 digit phone"
              value={supportForm.phoneDigits}
              onChange={(e) =>
                setSupportForm((prev) => ({
                  ...prev,
                  phoneDigits: e.target.value.replace(/\D/g, "").slice(0, 10),
                }))
              }
              required
            />
          </div>
          <input
            type="password"
            placeholder="Temporary Password"
            value={supportForm.password}
            onChange={(e) => setSupportForm((prev) => ({ ...prev, password: e.target.value }))}
            required
          />
          <button type="submit" className="update-btn">
            Add Customer Service Staff
          </button>
        </form>
      )}

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>City</th>
            <th>Skills</th>
            <th>Approved</th>
            <th>Blocked</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {providers.map((provider) => (
            <tr key={provider._id}>
              <td>{provider.name}</td>
              <td>
                {provider.email}
                <br />
                <small>{provider.phone}</small>
              </td>
              <td>{provider.technicianProfile?.city || "-"}</td>
              <td>{(provider.technicianProfile?.skills || []).join(", ") || "-"}</td>
              <td>{provider.isApproved ? "Yes" : "No"}</td>
              <td>{provider.isBlocked ? "Yes" : "No"}</td>
              <td>
                <div className="action-buttons">
                  {!provider.isApproved ? (
                    <button className="edit-btn" onClick={() => updateApproval(provider._id, true)}>
                      Approve
                    </button>
                  ) : (
                    <button className="delete-btn" onClick={() => updateApproval(provider._id, false)}>
                      Revoke
                    </button>
                  )}
                  {isAdmin ? (
                    <button className="delete-btn" onClick={() => toggleBlock(provider._id, provider.isBlocked)}>
                      {provider.isBlocked ? "Unblock" : "Block"}
                    </button>
                  ) : (
                    <span>Admin Only</span>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}

export default AdminProviders;
