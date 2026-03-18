const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {

  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "No token, access denied" });
  }

  // Remove "Bearer "
  const token = authHeader.replace("Bearer ", "");

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.log("JWT ERROR:", err.message);
    res.status(400).json({ message: "Invalid token" });
  }
};
