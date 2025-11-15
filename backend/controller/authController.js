const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { getErrorMessage, errorResponse } = require("../utils/errorHandler");

// ✅ Generate token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

//  Register User
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return errorResponse(
        res,
        400,
        "Please provide all required fields: name, email, and password"
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse(res, 400, "Please provide a valid email address");
    }

    // Validate password length
    if (password.length < 6) {
      return errorResponse(
        res,
        400,
        "Password must be at least 6 characters long"
      );
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return errorResponse(
        res,
        400,
        "An account with this email already exists. Please log in instead."
      );
    }

    // Note: password will be hashed by the User model's pre("save") hook.
    // Do NOT hash it here, otherwise it will be double-hashed and login will always fail.
    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        success: true,
        message: "Account created successfully! You can now log in.",
        token: generateToken(user._id),
      });
    } else {
      return errorResponse(
        res,
        400,
        "Failed to create account. Please try again."
      );
    }
  } catch (error) {
    console.error("Registration error:", error);
    return errorResponse(
      res,
      500,
      getErrorMessage(
        error,
        "Unable to create account. Please try again later."
      ),
      error
    );
  }
};

//  Login User
//  Login User (FIXED)
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return errorResponse(res, 400, "Please provide both email and password");
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return errorResponse(
        res,
        401,
        "Invalid email or password. Please check your credentials and try again."
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return errorResponse(
        res,
        401,
        "Invalid email or password. Please check your credentials and try again."
      );
    }

    return res.json({
      success: true,
      message: "Login successful! Welcome back.",
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return errorResponse(
      res,
      500,
      getErrorMessage(error, "Unable to log in. Please try again later."),
      error
    );
  }
};

//  Get Logged In User Profile (Using Token)
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return errorResponse(res, 404, "User profile not found");
    }

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isPro: user.isPro,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return errorResponse(
      res,
      500,
      getErrorMessage(error, "Unable to fetch profile. Please try again."),
      error
    );
  }
};

exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return errorResponse(res, 404, "User profile not found");
    }

    if (req.body.name && req.body.name.trim().length === 0) {
      return errorResponse(res, 400, "Name cannot be empty");
    }

    user.name = req.body.name || user.name;
    const updatedUser = await user.save();

    res.json({
      success: true,
      message: "Profile updated successfully",
      _id: updatedUser._id,
      name: updatedUser.name,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return errorResponse(
      res,
      500,
      getErrorMessage(error, "Unable to update profile. Please try again."),
      error
    );
  }
};
