import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminEditProduct from "./pages/AdminEditProduct";
import AdminServices from "./pages/AdminServices";
import AdminBookings from "./pages/AdminBookings";
import AdminProviders from "./pages/AdminProviders";
import AdminUsers from "./pages/AdminUsers";
import TechnicianDashboard from "./pages/TechnicianDashboard";
import FixedCallButton from "./components/FixedCallButton";
import { bootstrapAuthSession } from "./utils/session";
import LoadingSpinner from "./components/LoadingSpinner";
import NotFound from "./pages/NotFound";
import { useLoading } from "./context/LoadingContext";
import SupportCustomers from "./pages/SupportCustomers";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import RefundPolicy from "./pages/RefundPolicy";
import RaiseTicket from "./pages/RaiseTicket";
import MyTickets from "./pages/MyTickets";
import AdminTickets from "./pages/AdminTickets";

function getInitialTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light" || savedTheme === "dark") return savedTheme;
  return "light";
}

function App() {
  const [theme, setTheme] = useState(getInitialTheme);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    bootstrapAuthSession();
    setSessionReady(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"));
  };

  if (!sessionReady) return null;

  return (
    <Router>
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/services" element={<Services />} />
        <Route path="/about" element={<About />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/terms" element={<TermsOfService />} />
        <Route path="/refund" element={<RefundPolicy />} />
        
        {/* Ticket Routes */}
        <Route path="/raise-ticket" element={
          <PrivateRoute>
            <RaiseTicket />
          </PrivateRoute>
        } />
        <Route path="/my-tickets" element={
          <PrivateRoute>
            <MyTickets />
          </PrivateRoute>
        } />
        
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/technician"
          element={
            <PrivateRoute allowedRoles={["technician"]}>
              <TechnicianDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/support"
          element={
            <PrivateRoute allowedRoles={["support"]}>
              <AdminBookings />
            </PrivateRoute>
          }
        />
        <Route
          path="/support/bookings"
          element={
            <PrivateRoute allowedRoles={["support"]}>
              <AdminBookings />
            </PrivateRoute>
          }
        />
        <Route
          path="/support/services"
          element={
            <PrivateRoute allowedRoles={["support"]}>
              <AdminServices />
            </PrivateRoute>
          }
        />
        <Route
          path="/support/providers"
          element={
            <PrivateRoute allowedRoles={["support"]}>
              <AdminProviders />
            </PrivateRoute>
          }
        />
        <Route
          path="/support/users"
          element={
            <PrivateRoute allowedRoles={["support"]}>
              <AdminUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/support/customers"
          element={
            <PrivateRoute allowedRoles={["support"]}>
              <SupportCustomers />
            </PrivateRoute>
          }
        />
        
        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminServices />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminBookings />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/providers"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminProviders />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminUsers />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/products"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminProducts />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/add-product"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminAddProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/edit/:id"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminEditProduct />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/tickets"
          element={
            <PrivateRoute allowedRoles={["admin"]}>
              <AdminTickets />
            </PrivateRoute>
          }
        />
      </Routes>
      <FixedCallButton />
      <Footer />
    </Router>
  );
}

export default App;
