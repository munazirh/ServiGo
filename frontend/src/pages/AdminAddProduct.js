import React, { useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { useNavigate } from "react-router-dom";

const AdminAddProduct = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    images: "",
    isFeatured: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

const res = await fetch("http://localhost:5000/api/products/add", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({
  name: form.name,
  price: Number(form.price),
  category: form.category,
  stock: Number(form.stock) || 0,
  description: form.description,
  images: form.images ? [form.images] : [],
  isFeatured: form.isFeatured

  })
});

const data = await res.json();
console.log("SERVER RESPONSE:", data);

if (res.ok) {
  navigate("/admin/products");
} else {
  alert(data.message || "Error adding product");
}

  };

  return (
    <AdminLayout>
      <h2>Add New Product</h2>

      <form className="admin-form" onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Product Name"
          onChange={handleChange}
          required
        />

        <input
          name="price"
          placeholder="Price"
          type="number"
          onChange={handleChange}
          required
        />

        <input
          name="stock"
          placeholder="Stock"
          type="number"
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category"
          onChange={handleChange}
          required
        />

        <input
          name="images"
          placeholder="Image URL"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          onChange={handleChange}
        />

        <label>
          <input
            type="checkbox"
            name="isFeatured"
            onChange={handleChange}
          />
          Featured Product
        </label>

        <button type="submit">Add Product</button>
      </form>
    </AdminLayout>
  );
};

export default AdminAddProduct;
