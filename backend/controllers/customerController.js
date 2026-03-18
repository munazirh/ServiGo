const Customer = require("../models/customer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const normalizePhone = (value = "") => {
  const digits = String(value).replace(/\D/g, "");
  if (digits.length === 10) return `+91${digits}`;
  if (digits.length === 12 && digits.startsWith("91")) return `+${digits}`;
  if (digits.length === 13 && digits.startsWith("091")) return `+91${digits.slice(3)}`;
  return value.trim();
};

const toLegacy10Digit = (value = "") => String(value).replace(/\D/g, "").slice(-10);

const isValidIndianPhone = (value = "") => /^(\+91\d{10}|\d{10})$/.test(value);

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const phone = normalizePhone(req.body.phone);

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidIndianPhone(phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits or +91 followed by 10 digits" });
    }

    const existingUser = await Customer.findOne({
      $or: [{ email }, { phone }, { phone: toLegacy10Digit(phone) }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Customer({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "customer",
      isApproved: true
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= TECHNICIAN REGISTER =================
exports.registerTechnician = async (req, res) => {
  try {
    const { name, email, password, skills = [], city = "", experienceYears = 0 } = req.body;
    const phone = normalizePhone(req.body.phone);

    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidIndianPhone(phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits or +91 followed by 10 digits" });
    }

    const existingUser = await Customer.findOne({
      $or: [{ email }, { phone }, { phone: toLegacy10Digit(phone) }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const technician = new Customer({
      name,
      email,
      phone,
      password: hashedPassword,
      role: "technician",
      isApproved: false,
      technicianProfile: {
        skills,
        city,
        experienceYears
      }
    });

    await technician.save();

    res.status(201).json({
      message: "Technician registration submitted. Waiting for admin approval.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedIdentifier = String(identifier).includes("@")
      ? String(identifier).trim()
      : normalizePhone(identifier);

    const user = await Customer.findOne({
      $or: [
        { email: normalizedIdentifier },
        { phone: normalizedIdentifier },
        { phone: toLegacy10Digit(normalizedIdentifier) }
      ],
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user.isBlocked) {
      return res.status(403).json({ message: "Your account is blocked. Contact support." });
    }

    if (user.role === "technician" && !user.isApproved) {
      return res.status(403).json({ message: "Technician account pending admin approval" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= RESET PASSWORD =================
exports.resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const phone = normalizePhone(req.body.phone);

    if (!phone || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!isValidIndianPhone(phone)) {
      return res.status(400).json({ message: "Phone must be 10 digits or +91 followed by 10 digits" });
    }

    const user = await Customer.findOne({
      $or: [{ phone }, { phone: toLegacy10Digit(phone) }]
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
