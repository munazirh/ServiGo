const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  // Customer who placed the booking.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  // Linked service for price/category reference.
  service: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },
  // Assigned technician/provider.
  technician: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer"
  },
  // Snapshot fields let us keep historic data even if service changes later.
  serviceName: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    fullName: { type: String, default: "" },
    phone: { type: String, default: "" },
    addressLine1: { type: String, default: "" },
    addressLine2: { type: String, default: "" },
    landmark: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
    googleMapsLink: { type: String, default: "" }
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: false
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ["upi", "card", "cash"],
    default: "upi"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },
  status: {
    type: String,
    enum: ["pending", "assigned", "completed", "cancelled"],
    default: "pending"
  },
  technicianAction: {
    type: String,
    enum: ["none", "accepted", "rejected"],
    default: "none"
  },
  rating: {
    type: Number,
    min: 1,
    max: 5
  },
  review: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, { timestamps: true });

module.exports = mongoose.model("Booking", bookingSchema);
