const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },

  phone: {
    type: String,
    required: true,
    unique: true,
    // Backward compatible: supports old 10-digit stored values and new +91 format.
    match: [/^(\+91\d{10}|\d{10})$/, "Phone must be 10 digits or +91 followed by 10 digits"]
  },

  password: {
    type: String,
    required: true
  },
  role: {
  type: String,
  // Kept "user" for backward compatibility with existing DB records.
  enum: ["user", "customer", "technician", "support", "admin"],
  default: "customer"
},
  // Admin can block abusive users/providers.
  isBlocked: {
    type: Boolean,
    default: false
  },
  // Technician accounts require admin approval.
  isApproved: {
    type: Boolean,
    default: true
  },
  // Technician profile metadata (optional for customer/admin).
  technicianProfile: {
    skills: [{
      type: String
    }],
    city: {
      type: String,
      default: ""
    },
    experienceYears: {
      type: Number,
      default: 0
    },
    availability: {
      type: Object,
      default: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: false,
        sunday: false
      }
    }
  },
}, { timestamps: true });

module.exports = mongoose.model("Customer", customerSchema);
