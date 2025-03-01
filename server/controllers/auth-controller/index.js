const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ✅ Register a new user
const registerUser = async (req, res) => {
  try {
    console.log("➡️ Register User Function Called");
    console.log("Request Body:", req.body);

    const { userName, userEmail, password, role } = req.body;

    // ✅ Ensure required fields are present
    if (!userName || !userEmail || !password || !role) {
      console.log("❌ Missing required fields!");
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

        // Check for valid email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userEmail)) {
          return res.status(400).json({
            success: false,
            message: "Invalid email format",
          });
        }

        // Check for valid role
    const validRoles = ['user', 'instructor'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role',
      });
    }

    // ✅ Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ userEmail }, { userName }],
    });

    if (existingUser) {
      console.log("❌ User name or email already exists!");
      return res.status(400).json({
        success: false,
        message: "User name or user email already exists",
      });
    }

    // ✅ Do NOT hash password manually (Handled by Mongoose)
    const newUser = new User({
      userName,
      userEmail,
      role,
      password, // Save plain text (Mongoose will hash it)
    });

    console.log("✅ Saving new user:", newUser);
    await newUser.save();

    console.log("✅ User registered successfully!");
    return res.status(201).json({
      success: true,
      message: "User registered successfully!",
    });

  } catch (error) {
    console.error("❌ Registration Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// ✅ Login user
const loginUser = async (req, res) => {
  try {
    console.log("➡️ Login User Function Called");

    const { userEmail, password } = req.body;

    // ✅ Check if email and password are provided
    if (!userEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // ✅ Find user in MongoDB
    const checkUser = await User.findOne({ userEmail });

    if (!checkUser) {
      console.log("❌ User not found for email:", userEmail);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    console.log("🔍 Stored Hashed Password in DB:", checkUser.password);
    console.log("🔍 Entered Password:", password);

    // ✅ Compare entered password with hashed password in DB
    const isPasswordCorrect = await bcrypt.compare(password, checkUser.password);

    if (!isPasswordCorrect) {
      console.log("❌ Incorrect password for user:", checkUser.userEmail);
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // ✅ Generate JWT Token
    const accessToken = jwt.sign(
      {
        _id: checkUser._id,
        userName: checkUser.userName,
        userEmail: checkUser.userEmail,
        role: checkUser.role,
      },
      process.env.JWT_SECRET, // ✅ Use env variable for security
      { expiresIn: "2h" }
    );

    console.log("✅ User logged in successfully!");

    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      data: {
        accessToken,
        user: {
          _id: checkUser._id,
          userName: checkUser.userName,
          userEmail: checkUser.userEmail,
          role: checkUser.role,
          redirectTo: checkUser.role === "instructor" ? "/instructor" : "/home", // ✅ Redirect Logic
        },
      },
    });
  } catch (error) {
    console.error("❌ Login Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const getTotalUsers = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" }); // Assuming your normal users have role: "user"

    res.status(200).json({
      success: true,
      data: totalUsers,
    });
  } catch (error) {
    console.log("❌ Error fetching total users:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch total users",
    });
  }
};

module.exports = { registerUser, loginUser, getTotalUsers };

