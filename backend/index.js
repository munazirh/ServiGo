require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");

const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(helmet());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ================= DATABASE CONNECTION =================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  });

// ================= ROUTES =================
const customerRoutes = require("./routes/customerRoutes");
const serviceRoutes = require("./routes/serviceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const productRoutes = require("./routes/productRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const technicianRoutes = require("./routes/technicianRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const ticketRoutes = require("./routes/ticketRoutes");

app.use("/api", customerRoutes);
app.use("/api", serviceRoutes);
app.use("/api", bookingRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", technicianRoutes);
app.use("/api", notificationRoutes);
app.use("/api", ticketRoutes);

// ================= DEFAULT ROUTE =================
app.get("/", (req, res) => {
  res.send("🚀 Server is running...");
});

// ================= GLOBAL ERROR HANDLER =================
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Something went wrong!" });
});

// ================= SERVER START =================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🔥 Server running on port ${PORT}`);
});
