import React, { useCallback, useEffect, useState } from "react";
import AdminLayout from "../layouts/AdminLayout";
import { fetchAdminUsers, updateUserBlockStatus } from "../services/adminApi";
import { parseStoredUser } from "../utils/session";

function AdminUsers() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const currentUser = parseStoredUser() || {};
  const isSupport = currentUser.role === "support";

  const loadUsers = useCallback(async (role = roleFilter) => {
    try {
      const data = await fetchAdminUsers(role);
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  }, [roleFilter]);

  useEffect(() => {
    loadUsers(roleFilter);
  }, [loadUsers, roleFilter]);

  const toggleBlock = async (userId, isBlocked) => {
    try {
      await updateUserBlockStatus(userId, !isBlocked);
      await loadUsers(roleFilter);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <AdminLayout>
      <h2>User / Provider Block-Unblock</h2>
      {error && <p className="panel-error">{error}</p>}

      <div className="admin-filter-row">
        <label htmlFor="roleFilter">Role Filter</label>
        <select id="roleFilter" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="all">All</option>
          <option value="customer">Customer</option>
          <option value="user">Legacy User</option>
          <option value="technician">Technician</option>
          <option value="support">Support</option>
        </select>
      </div>

      <table className="product-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Blocked</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{user.role}</td>
              <td>{user.isBlocked ? "Yes" : "No"}</td>
              <td>
                {isSupport ? (
                  <span>Admin Only</span>
                ) : (
                  <button className="delete-btn" onClick={() => toggleBlock(user._id, user.isBlocked)}>
                    {user.isBlocked ? "Unblock" : "Block"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
}

export default AdminUsers;
