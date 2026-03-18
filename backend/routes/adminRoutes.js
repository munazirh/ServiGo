const express = require("express");
const Customer = require("../models/customer");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { createPortalNotification, sendSms, sendTechnicianAssigned, sendBookingCompleted, sendBookingCancelled } = require("../utils/notify");
const auth = require("../middleware/auth");
const staff = require("../middleware/staff");

const router = express.Router();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only image files are allowed (jpeg, jpg, png, gif, webp)"));
  }
});

const normalizePhone = (value = "") => {
  const digits = String(value).replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  return value.trim();
};
const toLegacy10Digit = (value = "") => String(value).replace(/\D/g, "").slice(-10);
const isValidIndianPhone = (value = "") => /^(\+91\d{10}|\d{10})$/.test(value);

// File upload endpoint for service images
router.post("/upload", auth, staff, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }
    
    // Return the full file URL that can be stored in the database
    const baseUrl = `${req.protocol}://${req.get("host")}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
    res.json({ 
      message: "Image uploaded successfully",
      imageUrl,
      filename: req.file.filename
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ message: "Failed to upload image" });
  }
});

// Staff endpoints: admin + support.
router.use(auth, staff);

// ------------------ Analytics ------------------
router.get("/analytics", async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  try {
    const [
      totalServices,
      totalBookings,
      totalCustomers,
      totalTechnicians,
      pendingProviders,
      pendingBookings,
      assignedBookings,
      completedBookings,
      blockedUsers
    ] = await Promise.all([
      Service.countDocuments(),
      Booking.countDocuments(),
      Customer.countDocuments({ role: { $in: ["customer", "user"] } }),
      Customer.countDocuments({ role: "technician" }),
      Customer.countDocuments({ role: "technician", isApproved: false }),
      Booking.countDocuments({ status: "pending" }),
      Booking.countDocuments({ status: "assigned" }),
      Booking.countDocuments({ status: "completed" }),
      Customer.countDocuments({ isBlocked: true })
    ]);

    const revenueSummary = await Booking.aggregate([
      { $match: { paymentStatus: "paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$price" } } }
    ]);

    res.json({
      totalServices,
      totalBookings,
      totalCustomers,
      totalTechnicians,
      pendingProviders,
      pendingBookings,
      assignedBookings,
      completedBookings,
      blockedUsers,
      totalRevenue: revenueSummary[0]?.totalRevenue || 0
    });
  } catch (error) {
    console.error("Admin analytics error:", error.message);
    res.status(500).json({ message: "Unable to load analytics" });
  }
});

// ------------------ Services & Pricing ------------------
router.get("/services", async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.json(services);
  } catch (error) {
    console.error("Admin service list error:", error.message);
    res.status(500).json({ message: "Unable to fetch services" });
  }
});

router.post("/services", async (req, res) => {
  try {
    const { name, description, category, price, etaMinutes, image } = req.body;

    if (!name || !description || !category || price === undefined) {
      return res.status(400).json({ message: "name, description, category and price are required" });
    }

    const service = await Service.create({
      name,
      description,
      category: String(category).toLowerCase(),
      price: Number(price),
      etaMinutes: Number(etaMinutes || 60),
      image: image || ""
    });

    res.status(201).json(service);
  } catch (error) {
    console.error("Admin add service error:", error.message);
    res.status(500).json({ message: "Unable to create service" });
  }
});

// Admin creates customer support staff account (mobile-first).
router.post("/staff/support", async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  try {
    const { name, password, email = "" } = req.body;
    const phone = normalizePhone(req.body.phone);

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "name, phone and password are required" });
    }
    if (!isValidIndianPhone(phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits or +91 followed by 10 digits" });
    }

    const existing = await Customer.findOne({ $or: [{ phone }, { email: email || "__none__" }] });
    if (existing) {
      return res.status(400).json({ message: "Support account already exists for this phone/email" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const supportUser = await Customer.create({
      name,
      email: email || `${phone.replace("+", "")}@support.servigo.local`,
      phone,
      password: hashedPassword,
      role: "support",
      isApproved: true,
      isBlocked: false
    });

    res.status(201).json({
      message: "Support account created",
      user: {
        _id: supportUser._id,
        name: supportUser.name,
        phone: supportUser.phone,
        role: supportUser.role
      }
    });
  } catch (error) {
    console.error("Admin create support error:", error.message);
    res.status(500).json({ message: "Unable to create support account" });
  }
});

router.put("/services/:id", async (req, res) => {
  try {
    const updatePayload = {
      ...req.body,
    };
    if (updatePayload.category) updatePayload.category = String(updatePayload.category).toLowerCase();
    if (updatePayload.price !== undefined) updatePayload.price = Number(updatePayload.price);
    if (updatePayload.etaMinutes !== undefined) updatePayload.etaMinutes = Number(updatePayload.etaMinutes);

    const service = await Service.findByIdAndUpdate(req.params.id, updatePayload, { new: true });
    if (!service) return res.status(404).json({ message: "Service not found" });

    res.json(service);
  } catch (error) {
    console.error("Admin update service error:", error.message);
    res.status(500).json({ message: "Unable to update service" });
  }
});

router.patch("/services/:id/toggle", async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ message: "Service not found" });

    service.isActive = !service.isActive;
    await service.save();

    res.json(service);
  } catch (error) {
    console.error("Admin toggle service error:", error.message);
    res.status(500).json({ message: "Unable to toggle service" });
  }
});

// ------------------ Booking Control ------------------
router.get("/bookings", async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email phone role isBlocked")
      .populate("service", "name category")
      .populate("technician", "name email technicianProfile.city")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error("Admin bookings list error:", error.message);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

router.patch("/bookings/:id/status", async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["pending", "assigned", "completed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await Booking.findById(req.params.id).populate("user", "name email phone");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const previousStatus = booking.status;
    booking.status = status;
    await booking.save();

    // Send email and SMS notifications for status changes
    if (booking.user) {
      if (status === "completed" && previousStatus !== "completed") {
        const ratingUrl = `${process.env.FRONTEND_URL || "http://localhost:3000"}/dashboard?rating=${booking._id}`;
        sendBookingCompleted({
          customerEmail: booking.user.email,
          customerName: booking.user.name,
          customerPhone: booking.user.phone,
          serviceName: booking.serviceName,
          price: booking.price,
          bookingId: booking._id,
          ratingUrl
        }).catch(err => console.error("Booking completed notification error:", err.message));
      } else if (status === "cancelled" && previousStatus !== "cancelled") {
        sendBookingCancelled({
          customerEmail: booking.user.email,
          customerName: booking.user.name,
          customerPhone: booking.user.phone,
          serviceName: booking.serviceName,
          date: booking.date,
          time: booking.time,
          bookingId: booking._id,
          reason: req.body.reason || "Cancelled by admin"
        }).catch(err => console.error("Booking cancelled notification error:", err.message));
      }
    }

    res.json(booking);
  } catch (error) {
    console.error("Admin booking status update error:", error.message);
    res.status(500).json({ message: "Unable to update booking status" });
  }
});

// Assign technician to booking.
router.patch("/bookings/:id/assign", async (req, res) => {
  try {
    const { technicianId } = req.body;
    if (!technicianId) {
      return res.status(400).json({ message: "technicianId is required" });
    }

    const technician = await Customer.findOne({
      _id: technicianId,
      role: "technician",
      isApproved: true,
      isBlocked: false
    });
    if (!technician) {
      return res.status(404).json({ message: "Approved technician not found" });
    }

    const booking = await Booking.findById(req.params.id).populate("user", "name email phone");
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    booking.technician = technician._id;
    booking.status = "assigned";
    booking.technicianAction = "none";
    await booking.save();

    // Portal notifications
    await Promise.all([
      createPortalNotification({
        recipientId: booking.user._id,
        title: "Technician Assigned",
        message: `${technician.name} has been assigned to your ${booking.serviceName} booking.`,
        type: "booking",
        meta: { bookingId: booking._id, technicianId: technician._id }
      }),
      createPortalNotification({
        recipientId: technician._id,
        title: "New Job Assigned",
        message: `You have a new ${booking.serviceName} job assigned. Please accept or reject.`,
        type: "job",
        meta: { bookingId: booking._id, customerId: booking.user._id }
      })
    ]);

    // Send email and SMS with technician mobile number
    if (booking.user && technician.phone) {
      sendTechnicianAssigned({
        customerEmail: booking.user.email,
        customerName: booking.user.name,
        customerPhone: booking.user.phone,
        serviceName: booking.serviceName,
        technicianName: technician.name,
        technicianPhone: technician.phone,
        date: booking.date,
        time: booking.time,
        location: booking.location,
        bookingId: booking._id
      }).catch(err => console.error("Technician assigned notification error:", err.message));
    }

    // SMS to technician
    sendSms({
      phone: technician.phone,
      text: `New job assigned: ${booking.serviceName}. Customer location: ${booking.location}. Date: ${booking.date} at ${booking.time}.`
    }).catch(err => console.error("SMS error:", err.message));

    res.json({ message: "Technician assigned successfully", booking });
  } catch (error) {
    console.error("Admin assign technician error:", error.message);
    res.status(500).json({ message: "Unable to assign technician" });
  }
});

// ------------------ Provider Approval ------------------
router.get("/providers", async (req, res) => {
  try {
    const filter = { role: "technician" };
    if (req.query.approved === "true") filter.isApproved = true;
    if (req.query.approved === "false") filter.isApproved = false;

    const providers = await Customer.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(providers);
  } catch (error) {
    console.error("Admin provider list error:", error.message);
    res.status(500).json({ message: "Unable to fetch providers" });
  }
});

// Admin creates technician account directly.
router.post("/providers", async (req, res) => {
  try {
    const { name, email, password, skills = [], city = "", experienceYears = 0 } = req.body;
    const phone = normalizePhone(req.body.phone);

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "name, email, phone and password are required" });
    }
    if (!isValidIndianPhone(phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits or +91 followed by 10 digits" });
    }

    const existing = await Customer.findOne({ $or: [{ email }, { phone }] });
    if (existing) {
      return res.status(400).json({ message: "Technician email or phone already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const isAdminUser = req.user.role === "admin";

    const technician = await Customer.create({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "technician",
      isApproved: isAdminUser,
      technicianProfile: {
        skills,
        city,
        experienceYears: Number(experienceYears) || 0
      }
    });

    res.status(201).json({
      message: isAdminUser
        ? "Technician account created and approved"
        : "Technician account created and sent for admin approval",
      technician: {
        _id: technician._id,
        name: technician.name,
        email: technician.email,
        phone: technician.phone,
        role: technician.role
      }
    });
  } catch (error) {
    console.error("Admin create technician error:", error.message);
    res.status(500).json({ message: "Unable to create technician account" });
  }
});

// Search customer/caller by phone or email for service desk operations.
router.get("/support/customers/search", async (req, res) => {
  try {
    const query = String(req.query.query || "").trim();
    if (!query) {
      return res.json([]);
    }

    const normalized = query.includes("@") ? query.toLowerCase() : normalizePhone(query);
    const digits = toLegacy10Digit(normalized);
    const filter = query.includes("@")
      ? { email: { $regex: normalized, $options: "i" } }
      : {
          $or: [
            { phone: normalized },
            { phone: toLegacy10Digit(normalized) },
            { phone: { $regex: `${digits}$` } }
          ]
        };

    const users = await Customer.find(filter)
      .select("name email phone role isBlocked isApproved")
      .limit(10)
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("Support customer search error:", error.message);
    res.status(500).json({ message: "Unable to search customer" });
  }
});

// Full customer profile + booking history by mobile/email for service desk.
router.get("/support/customers/profile", async (req, res) => {
  try {
    const query = String(req.query.query || "").trim();
    if (!query) {
      return res.status(400).json({ message: "query is required" });
    }

    const normalized = query.includes("@") ? query.toLowerCase() : normalizePhone(query);
    const filter = query.includes("@")
      ? { email: normalized }
      : {
          $or: [
            { phone: normalized },
            { phone: toLegacy10Digit(normalized) }
          ]
        };

    const customer = await Customer.findOne(filter).select("-password");
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }

    const bookings = await Booking.find({ user: customer._id })
      .populate("service", "name category price")
      .populate("technician", "name phone")
      .sort({ createdAt: -1 });

    res.json({
      customer,
      bookings
    });
  } catch (error) {
    console.error("Support customer profile error:", error.message);
    res.status(500).json({ message: "Unable to fetch customer profile" });
  }
});

// Service desk booking flow: allows caller booking with mobile number only.
router.post("/support/bookings/caller", async (req, res) => {
  try {
    const {
      customerPhone,
      customerEmail = "",
      customerName = "",
      serviceId,
      date,
      time = "",
      location,
      address,
      paymentMethod = "cash"
    } = req.body;

    if (!customerPhone || !serviceId || !date) {
      return res.status(400).json({ message: "customerPhone, serviceId and date are required" });
    }

    const phone = normalizePhone(customerPhone);
    if (!isValidIndianPhone(phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits or +91 followed by 10 digits" });
    }

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ message: "Service not available" });
    }

    const resolvedTime = String(time || "").trim() || "10:00";
    if (!/^\d{2}:\d{2}$/.test(resolvedTime)) {
      return res.status(400).json({ message: "Invalid time format" });
    }

    const requestedDateTime = new Date(`${date}T${resolvedTime}`);
    if (Number.isNaN(requestedDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid date/time format" });
    }
    if (requestedDateTime < new Date()) {
      return res.status(400).json({ message: "Past date/time booking is not allowed" });
    }

    const locationFromAddress = [
      address?.addressLine1,
      address?.addressLine2,
      address?.landmark,
      address?.city,
      address?.state,
      address?.pincode
    ]
      .filter(Boolean)
      .join(", ");
    const resolvedLocation = (locationFromAddress || location || "").trim();
    if (!resolvedLocation) {
      return res.status(400).json({ message: "Location or address is required" });
    }

    const email = String(customerEmail || "").trim().toLowerCase();
    const existingCustomer = await Customer.findOne({
      $or: [
        { phone },
        { phone: toLegacy10Digit(phone) },
        ...(email ? [{ email }] : [])
      ]
    });

    let customer = existingCustomer;
    if (!customer) {
      const generatedPassword = await bcrypt.hash(`caller-${Date.now()}`, 10);
      const fallbackEmail = email || `${phone.replace("+", "")}.${Date.now()}@servigo.local`;

      customer = await Customer.create({
        name: customerName.trim() || `Caller ${phone.slice(-4)}`,
        email: fallbackEmail,
        phone,
        password: generatedPassword,
        role: "customer",
        isApproved: true,
        isBlocked: false
      });
    }

    if (customer.isBlocked) {
      return res.status(403).json({ message: "Customer account is blocked" });
    }

    const isOnlinePayment = paymentMethod === "upi" || paymentMethod === "card";
    const booking = await Booking.create({
      user: customer._id,
      service: service._id,
      serviceName: service.name,
      category: service.category,
      location: resolvedLocation,
      address: address || {},
      date,
      time: resolvedTime,
      price: service.price,
      paymentMethod,
      paymentStatus: isOnlinePayment ? "paid" : "pending",
      status: "pending"
    });

    await createPortalNotification({
      recipientId: customer._id,
      title: "Booking Created by Service Desk",
      message: `Your ${service.name} booking was created successfully.`,
      type: "booking",
      meta: { bookingId: booking._id }
    });

    await sendSms({
      phone: customer.phone,
      text: `ServiGo booking confirmed: ${service.name} on ${date} at ${resolvedTime}.`,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("user", "name email phone")
      .populate("service", "name category price");

    res.status(201).json({
      message: "Caller booking created successfully.",
      booking: populatedBooking
    });
  } catch (error) {
    console.error("Support caller booking error:", error.message);
    res.status(500).json({ message: "Unable to create caller booking" });
  }
});

router.patch("/providers/:id/approval", async (req, res) => {
  try {
    const { isApproved } = req.body;
    if (typeof isApproved !== "boolean") {
      return res.status(400).json({ message: "isApproved must be boolean" });
    }

    const provider = await Customer.findOne({ _id: req.params.id, role: "technician" });
    if (!provider) return res.status(404).json({ message: "Provider not found" });

    provider.isApproved = isApproved;
    await provider.save();

    res.json({
      message: `Provider ${isApproved ? "approved" : "rejected"}`,
      provider
    });
  } catch (error) {
    console.error("Admin provider approval error:", error.message);
    res.status(500).json({ message: "Unable to update provider approval" });
  }
});

// ------------------ User/Provider Block ------------------
router.get("/users", async (req, res) => {
  try {
    const filter = {};
    if (req.query.role && req.query.role !== "all") {
      filter.role = req.query.role;
    } else {
      filter.role = { $in: ["customer", "user", "technician", "support"] };
    }

    const users = await Customer.find(filter)
      .select("-password")
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (error) {
    console.error("Admin users list error:", error.message);
    res.status(500).json({ message: "Unable to fetch users" });
  }
});

router.patch("/users/:id/block", async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admin only." });
  }

  try {
    const { isBlocked } = req.body;
    if (typeof isBlocked !== "boolean") {
      return res.status(400).json({ message: "isBlocked must be boolean" });
    }

    const user = await Customer.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") {
      return res.status(400).json({ message: "Cannot block admin account" });
    }

    user.isBlocked = isBlocked;
    await user.save();

    res.json({ message: `${isBlocked ? "Blocked" : "Unblocked"} successfully`, user });
  } catch (error) {
    console.error("Admin user block error:", error.message);
    res.status(500).json({ message: "Unable to update block status" });
  }
});

module.exports = router;
