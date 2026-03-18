const express = require("express");
const Service = require("../models/Service");
const router = express.Router();

// Public service listing for customer panel.
// Supports optional category filter: /api/services?category=ac
router.get("/services", async (req, res) => {
  try {
    const { category } = req.query;

    const query = { isActive: true };
    if (category && category !== "all") query.category = String(category).toLowerCase();

    const services = await Service.find(query).sort({ createdAt: -1, name: 1 });
    res.json(services);
  } catch (err) {
    console.error("Service list error:", err.message);
    res.status(500).json({ message: "Unable to fetch services" });
  }
});

// Temporary seed endpoint for quick local setup.
// TODO: Protect with admin middleware before production.
router.post("/services/seed", async (req, res) => {
  try {
    const existing = await Service.countDocuments();
    if (existing > 0) {
      return res.status(400).json({ message: "Services already seeded" });
    }

    const sampleServices = [
      {
        name: "AC Repair",
        description: "Cooling issue, gas refill check, fan/compressor troubleshooting.",
        price: 599,
        category: "ac",
        etaMinutes: 90
      },
      {
        name: "AC General Service",
        description: "Indoor + outdoor cleaning, filter wash, performance inspection.",
        price: 499,
        category: "ac",
        etaMinutes: 75
      },
      {
        name: "Fridge Repair",
        description: "No cooling, leakage, thermostat, compressor and wiring diagnosis.",
        price: 549,
        category: "fridge",
        etaMinutes: 80
      },
      {
        name: "Fridge Deep Service",
        description: "Condenser cleaning, drain cleaning, door seal and airflow check.",
        price: 449,
        category: "fridge",
        etaMinutes: 60
      },
      {
        name: "Geyser Repair",
        description: "Heating, thermostat, pressure valve and electrical safety checks.",
        price: 499,
        category: "geyser",
        etaMinutes: 70
      },
      {
        name: "Geyser Installation",
        description: "Safe wall mounting, plumbing connection, wiring and test run.",
        price: 699,
        category: "geyser",
        etaMinutes: 100
      }
    ];

    await Service.insertMany(sampleServices);
    res.status(201).json({ message: "Service seed completed" });
  } catch (err) {
    console.error("Service seed error:", err.message);
    res.status(500).json({ message: "Unable to seed services" });
  }
});

module.exports = router;
