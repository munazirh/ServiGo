const express = require("express");
const Ticket = require("../models/Ticket");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const staff = require("../middleware/staff");

const router = express.Router();

// Create a new ticket (for logged-in users)
router.post("/tickets", auth, async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title and description are required" });
    }

    const ticket = new Ticket({
      title,
      description,
      category: category || 'other',
      priority: priority || 'medium',
      createdBy: req.user.id
    });

    await ticket.save();

    res.status(201).json({ message: "Ticket created successfully", ticket });
  } catch (error) {
    console.error("Ticket creation error:", error.message);
    res.status(500).json({ message: "Unable to create ticket" });
  }
});

// Get user's own tickets
router.get("/tickets/my-tickets", auth, async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(tickets);
  } catch (error) {
    console.error("Fetch user tickets error:", error.message);
    res.status(500).json({ message: "Unable to fetch tickets" });
  }
});

// Get single ticket by ID (for ticket owner)
router.get("/tickets/:id", auth, async (req, res) => {
  try {
    const ticket = await Ticket.findOne({
      _id: req.params.id,
      createdBy: req.user.id
    }).populate('createdBy', 'name email phone');

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    res.json(ticket);
  } catch (error) {
    console.error("Fetch ticket error:", error.message);
    res.status(500).json({ message: "Unable to fetch ticket" });
  }
});

// Get all tickets (admin/staff only)
router.get("/tickets-admin/all", auth, admin, async (req, res) => {
  try {
    const { status, priority, category, page = 1, limit = 20 } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;

    const tickets = await Ticket.find(query)
      .populate('createdBy', 'name email phone')
      .populate('resolvedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Ticket.countDocuments(query);

    res.json({
      tickets,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      totalTickets: count
    });
  } catch (error) {
    console.error("Fetch all tickets error:", error.message);
    res.status(500).json({ message: "Unable to fetch tickets" });
  }
});

// Update ticket status (admin/staff only)
router.patch("/tickets-admin/:id/status", auth, admin, async (req, res) => {
  try {
    const { status, resolution } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.status = status || ticket.status;
    if (resolution) {
      ticket.resolution = resolution;
      ticket.resolvedBy = req.user.id;
    }

    await ticket.save();

    res.json({ message: "Ticket updated successfully", ticket });
  } catch (error) {
    console.error("Update ticket error:", error.message);
    res.status(500).json({ message: "Unable to update ticket" });
  }
});

// Assign ticket to staff (admin/staff only)
router.patch("/tickets-admin/:id/assign", auth, admin, async (req, res) => {
  try {
    const { assignedTo } = req.body;

    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.assignedTo = assignedTo || null;
    await ticket.save();

    res.json({ message: "Ticket assigned successfully", ticket });
  } catch (error) {
    console.error("Assign ticket error:", error.message);
    res.status(500).json({ message: "Unable to assign ticket" });
  }
});

module.exports = router;
