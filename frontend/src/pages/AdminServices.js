import React, { useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import {
  createAdminService,
  fetchAdminServices,
  toggleAdminService,
  updateAdminService,
  uploadServiceImage,
} from "../services/adminApi";

const initialForm = {
  name: "",
  category: "ac",
  description: "",
  price: "",
  etaMinutes: 60,
  image: "",
};

function AdminServices() {
  const [services, setServices] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminServices();
      const normalized = Array.isArray(data)
        ? data
        : Array.isArray(data?.services)
          ? data.services
          : [];

      if (!Array.isArray(data) && !Array.isArray(data?.services)) {
        setError("Unexpected services response format");
      }

      setServices(normalized);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Handle file upload for service image
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, or WebP)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must be less than 5MB");
      return;
    }

    try {
      setUploading(true);
      setError("");
      const result = await uploadServiceImage(file);
      setForm((prev) => ({ ...prev, image: result.imageUrl }));
    } catch (err) {
      setError(err.message || "Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  // Clear the uploaded image
  const clearImage = () => {
    setForm((prev) => ({ ...prev, image: "" }));
  };

  const onEdit = (service) => {
    setEditingId(service._id);
    setForm({
      name: service.name,
      category: service.category,
      description: service.description,
      price: service.price,
      etaMinutes: service.etaMinutes || 60,
      image: service.image || "",
    });
  };

  const resetForm = () => {
    setEditingId("");
    setForm(initialForm);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      setError("");
      const payload = {
        ...form,
        price: Number(form.price),
        etaMinutes: Number(form.etaMinutes),
      };

      if (editingId) {
        await updateAdminService(editingId, payload);
      } else {
        await createAdminService(payload);
      }
      resetForm();
      await loadServices();
    } catch (err) {
      setError(err.message);
    }
  };

  const onToggleService = async (serviceId) => {
    try {
      await toggleAdminService(serviceId);
      await loadServices();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <h2>Services & Pricing Management</h2>

<form className="admin-form" onSubmit={onSubmit}>
        {form.image && (
          <div className="image-preview-container">
            <img src={form.image} alt="Service preview" className="service-preview" />
            <button type="button" className="clear-image-btn" onClick={clearImage}>
              ✕ Remove Image
            </button>
          </div>
        )}
        <input name="name" value={form.name} onChange={onChange} placeholder="Service Name" required />
        <select name="category" value={form.category} onChange={onChange}>
          <option value="ac">AC</option>
          <option value="fridge">Fridge</option>
          <option value="geyser">Geyser</option>
        </select>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          placeholder="Service description"
          required
        />
        <input
          name="price"
          type="number"
          value={form.price}
          onChange={onChange}
          placeholder="Base Price"
          required
        />
        <input
          name="etaMinutes"
          type="number"
          value={form.etaMinutes}
          onChange={onChange}
          placeholder="ETA (minutes)"
        />
        
        {/* File upload for service image - Primary method */}
        <div className="image-upload-section">
          <label className="image-upload-label">
            📁 Upload Image from Computer
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
              onChange={handleImageUpload}
              disabled={uploading}
              className="image-upload-input"
            />
          </label>
          {uploading && <span className="upload-status">⏳ Uploading...</span>}
          {error && error.includes("upload") && <span className="upload-error">{error}</span>}
        </div>

        {/* Alternative: URL input */}
        <div className="url-input-section">
          <label>🔗 Or enter Image URL:</label>
          <input
            name="imageUrl"
            value={form.image ? "" : ""}
            onChange={(e) => {
              if (!form.image) {
                setForm(prev => ({ ...prev, image: e.target.value }));
              }
            }}
            placeholder="https://example.com/image.jpg"
            disabled={!!form.image}
          />
          {form.image && <small style={{color: 'var(--text-secondary)'}}>Remove the uploaded image first to use URL</small>}
        </div>

        <div className="action-buttons">
          <button type="submit" className="update-btn">
            {editingId ? "Update Service" : "Create Service"}
          </button>
          {editingId && (
            <button type="button" className="delete-btn" onClick={resetForm}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {error && <p className="panel-error">{error}</p>}
      {loading && <p className="panel-message">Loading services...</p>}

      <table className="product-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>ETA</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(services) &&
            services.map((service) => (
            <tr key={service._id}>
              <td>
                {service.image ? (
                  <img src={service.image} alt={service.name} className="service-preview-thumb" />
                ) : (
                  "No image"
                )}
              </td>
              <td>{service.name}</td>
              <td>{service.category}</td>
              <td>₹ {service.price}</td>
              <td>{service.etaMinutes} min</td>
              <td>{service.isActive ? "Active" : "Disabled"}</td>
              <td>
                <div className="action-buttons">
                  <button className="edit-btn" onClick={() => onEdit(service)}>
                    Edit
                  </button>
                  <button className="delete-btn" onClick={() => onToggleService(service._id)}>
                    {service.isActive ? "Disable" : "Enable"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}

export default AdminServices;
