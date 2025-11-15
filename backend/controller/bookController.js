const Book = require("../models/Book");

/** ✅ Create Book */
const createBook = async (req, res) => {
  try {
    const { title, subtitle, author, chapters } = req.body;

    if (!title || !author) {
      return res
        .status(400)
        .json({ message: "Please provide title and author" });
    }

    const book = await Book.create({
      userId: req.user._id, // ✅ userId not UserId
      title,
      subtitle,
      author,
      chapters,
    });

    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/** ✅ Get All Books of Logged-in User */
const getBooks = async (req, res) => {
  try {
    const books = await Book.find({ userId: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json(books);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/** ✅ Get Book by ID */
const getBookById = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book Not Found" });

    if (book.userId.toString() !== req.user._id.toString()) {
      return res
        .status(401)
        .json({ message: "Not authorized to view this book" });
    }

    res.status(200).json(book);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/** ✅ Update Book (text data only) */
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book Not Found" });

    if (book.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.status(200).json(updatedBook);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/** ✅ DELETE Book */
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book Not Found" });

    if (book.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await book.deleteOne();

    res.status(200).json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

/** ✅ Update Book Cover */
const updateBookCover = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) return res.status(404).json({ message: "Book Not Found" });

    if (book.userId.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    if (!req.file) {
      book.coverImage = `/${req.file.path}`;
    } else {
      return res.status(400).json({ message: "No image uploaded" });
    }
    
    const updateBook = await book.save();

    res.status(200).json(updateBook);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
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
