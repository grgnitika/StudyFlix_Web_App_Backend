const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // ✅ Check if authorization header exists and has correct format
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "User is not authenticated (Token missing or incorrect format)",
    });
  }

  // ✅ Extract token after "Bearer "
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // ✅ Store user info in req.user
    next();
  } catch (e) {
    console.error("❌ JWT Verification Error:", e.message); // ✅ Log error for debugging
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ✅ Only instructors can access instructor routes
const isInstructor = (req, res, next) => {
  if (!req.user || req.user.role !== "instructor") {
    return res.status(403).json({
      success: false,
      message: "Access denied! Only instructors (admins) can perform this action.",
    });
  }
  next();
};

module.exports = { authenticate, isInstructor };
