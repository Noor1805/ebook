const express = require("express");
const router = express.Router();

const {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  updateBookCover,
} = require("../controller/bookController");

const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");

router.use(protect); // protect all routes

router.route("/")
  .post(createBook)
  .get(getBooks);

router.route("/:id")
  .get(getBookById)
  .put(upload.single("coverImage"), updateBook)
  .delete(deleteBook);

router.route("/cover/:id").put(upload.single("coverImage"), updateBookCover);

module.exports = router;

