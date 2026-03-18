const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Customer",
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: "info"
  },
  isRead: {
    type: Boolean,
    default: false
  },
  meta: {
    type: Object,
    default: {}
  }
}, { timestamps: true });

module.exports = mongoose.model("Notification", notificationSchema);
