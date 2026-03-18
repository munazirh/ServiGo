const express = require("express");
const Booking = require("../models/Booking");
const Customer = require("../models/customer");
const auth = require("../middleware/auth");
const technician = require("../middleware/technician");

const router = express.Router();

router.use(auth, technician);

// Dashboard summary + active queue.
router.get("/technician/dashboard", async (req, res) => {
  try {
    const tech = await Customer.findById(req.user.id);
    if (!tech || !tech.isApproved) {
      return res.status(403).json({ message: "Technician is not approved by admin" });
    }
    if (tech.isBlocked) {
      return res.status(403).json({ message: "Technician account is blocked" });
    }

    const [assignedJobs, historyJobs] = await Promise.all([
      Booking.find({
        technician: req.user.id,
        status: { $in: ["assigned", "pending"] }
      })
        .populate("user", "name phone")
        .populate("service", "name category")
        .sort({ createdAt: -1 }),
      Booking.find({
        technician: req.user.id,
        status: { $in: ["completed", "cancelled"] }
      })
        .populate("user", "name phone")
        .populate("service", "name category")
        .sort({ createdAt: -1 })
    ]);

    const completedCount = historyJobs.filter((job) => job.status === "completed").length;
    const earnings = historyJobs
      .filter((job) => job.status === "completed")
      .reduce((sum, job) => sum + (job.price || 0), 0);

    res.json({
      profile: {
        name: tech.name,
        email: tech.email,
        phone: tech.phone,
        skills: tech.technicianProfile?.skills || [],
        city: tech.technicianProfile?.city || "",
        availability: tech.technicianProfile?.availability || {},
      },
      stats: {
        activeJobs: assignedJobs.length,
        completedJobs: completedCount,
        totalEarnings: earnings,
      },
      assignedJobs,
      historyJobs,
    });
  } catch (error) {
    console.error("Technician dashboard error:", error.message);
    res.status(500).json({ message: "Unable to load technician dashboard" });
  }
});

// Update technician service skills.
router.patch("/technician/services", async (req, res) => {
  try {
    const { skills } = req.body;
    if (!Array.isArray(skills)) {
      return res.status(400).json({ message: "skills must be an array" });
    }

    const tech = await Customer.findById(req.user.id);
    if (!tech) return res.status(404).json({ message: "Technician not found" });

    tech.technicianProfile = tech.technicianProfile || {};
    tech.technicianProfile.skills = skills;
    await tech.save();

    res.json({ message: "Skills updated", skills: tech.technicianProfile.skills });
  } catch (error) {
    console.error("Technician skill update error:", error.message);
    res.status(500).json({ message: "Unable to update skills" });
  }
});

// Availability calendar preferences.
router.patch("/technician/availability", async (req, res) => {
  try {
    const { availability } = req.body;
    if (!availability || typeof availability !== "object") {
      return res.status(400).json({ message: "availability object required" });
    }

    const tech = await Customer.findById(req.user.id);
    if (!tech) return res.status(404).json({ message: "Technician not found" });

    tech.technicianProfile = tech.technicianProfile || {};
    tech.technicianProfile.availability = availability;
    await tech.save();

    res.json({ message: "Availability updated", availability });
  } catch (error) {
    console.error("Technician availability error:", error.message);
    res.status(500).json({ message: "Unable to update availability" });
  }
});

// Accept / reject / complete assigned jobs.
router.patch("/technician/bookings/:id/action", async (req, res) => {
  try {
    const { action } = req.body;
    const allowed = ["accept", "reject", "complete"];
    if (!allowed.includes(action)) {
      return res.status(400).json({ message: "Invalid action" });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (!booking.technician || String(booking.technician) !== String(req.user.id)) {
      return res.status(403).json({ message: "This job is not assigned to you" });
    }

    if (action === "accept") {
      booking.technicianAction = "accepted";
      booking.status = "assigned";
    }

    if (action === "reject") {
      booking.technicianAction = "rejected";
      booking.technician = null;
      booking.status = "pending";
    }

    if (action === "complete") {
      booking.technicianAction = "accepted";
      booking.status = "completed";
    }

    await booking.save();
    res.json({ message: "Job action updated", booking });
  } catch (error) {
    console.error("Technician job action error:", error.message);
    res.status(500).json({ message: "Unable to update job action" });
  }
});

module.exports = router;
