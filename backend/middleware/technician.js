module.exports = function technicianMiddleware(req, res, next) {
  if (!req.user || req.user.role !== "technician") {
    return res.status(403).json({ message: "Access denied. Technician only." });
  }
  next();
};
