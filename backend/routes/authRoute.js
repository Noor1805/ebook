const express = require("express");
const router = express.Router();

const { registerUser, loginUser, getProfile, updateUserProfile } = require("../controller/authController");
const { protect } = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

// GET PROFILE
router.get("/profile", protect, getProfile);

// UPDATE PROFILE
router.put("/profile", protect, updateUserProfile);


module.exports = router;
