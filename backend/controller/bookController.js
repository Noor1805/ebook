const Book = require("../models/Book");
const { getErrorMessage, errorResponse } = require("../utils/errorHandler");

/** ✅ Create Book */
const createBook = async (req, res) => {
  try {
    const { title, subtitle, author, chapters } = req.body;

    if (!title || !author) {
      return errorResponse(
        res,
        400,
        "Please provide both title and author to create a book"
      );
    }

    if (title.trim().length === 0) {
      return errorResponse(res, 400, "Book title cannot be empty");
    }

    if (author.trim().length === 0) {
      return errorResponse(res, 400, "Author name cannot be empty");
    }

    const book = await Book.create({
      UserId: req.user._id,
      title,
      subtitle,
      author,
      chapters,
    });

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      ...book.toObject(),
    });
  } catch (error) {
    console.error("Create book error:", error);
    return errorResponse(
      res,
      500,
      getErrorMessage(error, "Unable to create book. Please try again."),
      error
    );
  }
};

/** ✅ Get All Books of Logged-in User */
const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: books.length,
      books,
    });
  } catch (error) {
    console.error("Get books error:", error);
    return errorResponse(
      res,
      500,
      getErrorMessage(error, "Unable to fetch your books. Please try again."),
      error
    );
  }
};

/** ✅ Get Book by ID */
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return errorResponse(res, 404, "Book not found. It may have been deleted or doesn't exist.");
    }

    if (book.userId.toString() !== req.user._id.toString()) {
      return errorResponse(
        res,
        403,
        "You don't have permission to access this book."
      );
    }

    res.status(200).json({
      success: true,
      book,
    });
  } catch (error) {
    console.error("Get book by ID error:", error);
    if (error.name === "CastError") {
      return errorResponse(res, 400, "Invalid book ID format.");
    }
    return errorResponse(
      res,
      500,
      getErrorMessage(error, "Unable to fetch book. Please try again."),
      error
    );
  }
};

/** ✅ Update Book (text data only) */
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return errorResponse(res, 404, "Book not found. It may have been deleted.");
    }

    if (book.userId.toString() !== req.user._id.toString()) {
      return errorResponse(
        res,
        403,
        "You don't have permission to update this book."
      );
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Update book error:", error);
    if (error.name === "CastError") {
      return errorResponse(res, 400, "Invalid book ID format.");
    }
    return errorResponse(
      res,
      500,
      getErrorMessage(error, "Unable to update book. Please try again."),
      error
    );
  }
};

/** ✅ DELETE Book */
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return errorResponse(res, 404, "Book not found. It may have already been deleted.");
    }

    if (book.userId.toString() !== req.user._id.toString()) {
      return errorResponse(
        res,
        403,
        "You don't have permission to delete this book."
      );
    }

    await book.deleteOne();

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    console.error("Delete book error:", error);
    if (error.name === "CastError") {
      return errorResponse(res, 400, "Invalid book ID format.");
    }
    return errorResponse(
      res,
      500,
      getErrorMessage(error, "Unable to delete book. Please try again."),
      error
    );
  }
};

/** ✅ Update Book Cover */
const updateBookCover = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return errorResponse(res, 404, "Book not found.");
    }

    if (book.userId.toString() !== req.user._id.toString()) {
      return errorResponse(
        res,
        403,
        "You don't have permission to update this book's cover."
      );
    }

    if (!req.file) {
      return errorResponse(
        res,
        400,
        "No image file uploaded. Please select an image file."
      );
    }
    
    book.coverImage = `/${req.file.path}`;
    const updatedBook = await book.save();

    res.status(200).json({
      success: true,
      message: "Book cover updated successfully",
      book: updatedBook,
    });
  } catch (error) {
    console.error("Update book cover error:", error);
    return errorResponse(
      res,
      500,
      getErrorMessage(error, "Unable to update book cover. Please try again."),
      error
    );
  }
};

module.exports = {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  updateBookCover,
};
