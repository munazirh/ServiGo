import React from "react";
import { Navigate } from "react-router-dom";
import { parseStoredUser } from "../utils/session";

function PrivateRoute({ children, allowedRoles = [] }) {
  const token = localStorage.getItem("token");
  const user = parseStoredUser() || {};

  if (!token) return <Navigate to="/login" />;

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default PrivateRoute;
