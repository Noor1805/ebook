const express = require("express");
const router = express.Router();

const {
  generateOutline,
  generateChapterContent,
} = require("../controller/aiController");
const { protect } = require("../middlewares/authMiddleware");

router.use(protect);
// Routes (controller functions ko use karte hue)
router.post("/generate-Outline", generateOutline);
router.post("/generate-Chapter-Content", generateChapterContent);
module.exports = router;
