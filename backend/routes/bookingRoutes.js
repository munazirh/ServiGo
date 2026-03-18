const express = require("express");
const Booking = require("../models/Booking");
const Service = require("../models/Service");
const Customer = require("../models/customer");
const auth = require("../middleware/auth");
const { sendBookingConfirmation } = require("../utils/notify");
const router = express.Router();

// Create booking for logged-in customer.
router.post("/bookings", auth, async (req, res) => {
  try {
    const { serviceId, location, address, date, time, paymentMethod } = req.body;

    if (!serviceId || !date || !time) {
      return res.status(400).json({ message: "serviceId, date and time are required" });
    }

    const service = await Service.findById(serviceId);
    if (!service || !service.isActive) {
      return res.status(404).json({ message: "Service not available" });
    }

    // Prevent booking in the past even if frontend validation is bypassed.
    const requestedDateTime = new Date(`${date}T${time}`);
    if (Number.isNaN(requestedDateTime.getTime())) {
      return res.status(400).json({ message: "Invalid date/time format" });
    }
    if (requestedDateTime < new Date()) {
      return res.status(400).json({ message: "Past date/time booking is not allowed" });
    }

    // Basic estimate logic (can be expanded later with distance/time rules).
    const estimatedPrice = service.price;
    const isOnlinePayment = paymentMethod === "upi" || paymentMethod === "card";

    // Build a normalized full location string from structured address if provided.
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
      return res.status(400).json({ message: "Location or full address is required" });
    }
    if (address?.phone && !/^\+91\d{10}$/.test(String(address.phone))) {
      return res.status(400).json({ message: "Address phone must be +91 followed by 10 digits" });
    }

    const booking = await Booking.create({
      user: req.user.id,
      service: service._id,
      serviceName: service.name,
      category: service.category,
      location: resolvedLocation,
      address: address || {},
      date,
      time,
      price: estimatedPrice,
      paymentMethod: paymentMethod || "upi",
      paymentStatus: isOnlinePayment ? "paid" : "pending",
      status: "pending"
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("service")
      .populate("user", "name email phone");

    // Send email and SMS confirmation
    const customer = populatedBooking.user;
    if (customer) {
      sendBookingConfirmation({
        customerEmail: customer.email,
        customerName: customer.name,
        customerPhone: customer.phone,
        serviceName: service.name,
        date,
        time,
        location: resolvedLocation,
        price: estimatedPrice,
        bookingId: booking._id
      }).catch(err => console.error("Booking confirmation notification error:", err.message));
    }

    res.status(201).json(populatedBooking);
  } catch (err) {
    console.error("Create booking error:", err.message);
    res.status(500).json({ message: "Booking failed" });
  }
});

// Get bookings for logged-in customer.
router.get("/bookings/me", auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate("service")
      .populate("technician", "name phone")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    console.error("My bookings error:", err.message);
    res.status(500).json({ message: "Unable to fetch bookings" });
  }
});

// Update rating/review after completion.
router.patch("/bookings/:id/review", auth, async (req, res) => {
  try {
    const { rating, review } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status !== "completed") {
      return res.status(400).json({ message: "Rating allowed only for completed bookings" });
    }

    booking.rating = Number(rating);
    booking.review = review || "";
    await booking.save();

    res.json({ message: "Review submitted successfully", booking });
  } catch (err) {
    console.error("Review update error:", err.message);
    res.status(500).json({ message: "Unable to submit review" });
  }
});

// Temporary helper route to quickly test status flow on local setup.
// TODO: Move to technician/admin route with proper role checks.
router.patch("/bookings/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["pending", "assigned", "completed", "cancelled"];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.status = status;
    await booking.save();
    res.json({ message: "Status updated", booking });
  } catch (err) {
    console.error("Status update error:", err.message);
    res.status(500).json({ message: "Unable to update booking status" });
  }
});

module.exports = router;
