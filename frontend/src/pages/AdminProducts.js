import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const deleteProduct = async (id) => {
    const token = localStorage.getItem("token");

    await fetch(`http://localhost:5000/api/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchProducts();
  };

  return (
    <AdminLayout>
      <h2>📦 Product Management</h2>

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>₹ {p.price}</td>
              <td>{p.stock}</td>
              <td>
  <div className="action-buttons">
    <button
      className="edit-btn"
      onClick={() => navigate(`/admin/edit/${p._id}`)}
    >
      ✏️ Edit
    </button>

    <button
      className="delete-btn"
      onClick={() => deleteProduct(p._id)}
    >
      🗑 Delete
    </button>
  </div>
</td>

            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default AdminProducts;
