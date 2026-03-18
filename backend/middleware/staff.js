module.exports = function staffMiddleware(req, res, next) {
  if (!req.user || !["admin", "support"].includes(req.user.role)) {
    return res.status(403).json({ message: "Access denied. Staff only." });
  }
  next();
};
