const express = require("express");
const { registerUser, loginUser, getTotalUsers } = require("../../controllers/auth-controller/index");
const { authenticate } = require("../../middleware/auth-middleware");
const User = require("../../models/User"); 

const router = express.Router();

// ✅ User Registration
router.post("/register", registerUser);

// ✅ User Login
router.post("/login", loginUser);

// ✅ Auth Check (Only authenticated users can access)
router.get("/check-auth", authenticate, (req, res) => {
  const user = req.user;

  res.status(200).json({
    success: true,
    message: "Authenticated user!",
    data: {
      user,
    },
  });
});



module.exports = router;
