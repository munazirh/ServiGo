const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  // Display name shown on customer cards.
  name: {
    type: String,
    required: true,
    trim: true
  },
  // Service details shown before booking.
  description: {
    type: String,
    required: true,
    trim: true
  },
  // Base price used for estimate + booking record.
  price: {
    type: Number,
    required: true,
    min: 0
  },
  // Category used by customer filters.
  category: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  // Optional image URL for card media.
  image: {
    type: String,
    default: ""
  },
  // Estimated duration shown to customer.
  etaMinutes: {
    type: Number,
    default: 60
  },
  // Switch to quickly hide unavailable services.
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Service", serviceSchema);
