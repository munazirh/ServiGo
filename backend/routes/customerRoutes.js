// routes/customer.js
const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const auth = require("../middleware/auth"); // JWT auth middleware

// ================= PUBLIC ROUTES =================

// Register a new customer
router.post("/customer/register", customerController.register);
router.post("/technician/register", customerController.registerTechnician);

// Login with email or phone
router.post("/customer/login", customerController.login);

// Reset password (requires phone + newPassword)
router.post("/customer/reset-password", customerController.resetPassword);

// ================= PROTECTED ROUTES =================

// Example protected route: Get customer profile
router.get("/customer/profile", auth, async (req, res) => {
  try {
    res.json({
      message: "This is a protected profile route",
      userId: req.user.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
