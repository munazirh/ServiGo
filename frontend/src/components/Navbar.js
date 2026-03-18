import React, { useMemo } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "./components.css";
import { clearSessionPreserveTheme, parseStoredUser } from "../utils/session";

function Navbar({ theme, onToggleTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  const user = parseStoredUser() || {};
  const role = user?.role || "guest";
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  // Common buttons visible to all users
  const commonNavItems = [
    { label: "🏠 Home", path: "/" },
    { label: "🛠 Services", path: "/services" },
    { label: "📞 Contact", path: "/contact" },
    { label: "ℹ️ About", path: "/about" },
    { label: "❓ FAQ", path: "/faq" },
  ];

  const navItems = useMemo(() => {
    if (!isLoggedIn) {
      return commonNavItems;
    }

    if (role === "admin") {
      return [
        { label: "🛡 Admin", path: "/admin" },
        { label: "📦 Bookings", path: "/admin/bookings" },
        { label: "👥 Users", path: "/admin/users" },
        { label: "🧰 Services", path: "/admin/services" },
      ];
    }

    if (role === "technician") {
      return [
        { label: "🛠 Technician Desk", path: "/technician" },
      ];
    }

    if (role === "support") {
      return [
        { label: "📦 Bookings", path: "/support/bookings" },
        { label: "👤 Customer 360", path: "/support/customers" },
        { label: "👥 Users", path: "/support/users" },
      ];
    }

    return [
      ...commonNavItems,
      { label: "📋 My Dashboard", path: "/dashboard" },
    ];
  }, [isLoggedIn, role]);

  const goToPanel = () => {
    if (!isLoggedIn) {
      navigate("/login");
      return;
    }
    if (user.role === "admin") navigate("/admin");
    else if (user.role === "technician") navigate("/technician");
    else if (user.role === "support") navigate("/support/bookings");
    else navigate("/dashboard");
  };

  const logout = () => {
    clearSessionPreserveTheme();
    navigate("/");
  };

  return (
    <nav className="navbar-custom">
      <Link to="/" className="nav-logo">
        <span>ServiGo</span>
        <small className="nav-logo-sub">Repair. Track. Relax.</small>
      </Link>

      <div className="nav-links">
        {navItems.map((item) => (
          <button
            type="button"
            key={`${item.label}-${item.path}`}
            className={`nav-chip ${location.pathname === item.path ? "active" : ""}`}
            onClick={() => navigate(item.path)}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="nav-actions">
        <button
          type="button"
          className="theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
          title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        >
          <span className="theme-toggle-track" aria-hidden="true">
            <span className="theme-toggle-thumb" />
          </span>
          <span className="theme-toggle-icon" aria-hidden="true">
            {theme === "dark" ? "☀" : "☾"}
          </span>
          <span className="theme-toggle-label">
            {theme === "dark" ? "Day Mode" : "Night Mode"}
          </span>
        </button>

        {isLoggedIn ? (
          <button type="button" className="nav-logout-btn" onClick={logout}>
            🚪 Logout
          </button>
        ) : (
          <button className="nav-auth-btn" onClick={goToPanel}>
            🔐 Login / Register
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
