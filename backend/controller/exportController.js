const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require("docx");
const PDFDocument = require("pdfkit");
const MarkdownIt = require("markdown-it");
const Book = require("../models/Book");
const fs = require("fs");
const path = require("path");
const { getErrorMessage, errorResponse } = require("../utils/errorHandler");

const md = new MarkdownIt();

// ------------------------------------------------------
// EXPORT AS DOCX
// ------------------------------------------------------

const exportAsDocument = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return errorResponse(res, 404, "Book not found. Unable to export.");
    }

    if (book.userId.toString() !== req.user._id.toString()) {
      return errorResponse(
        res,
        403,
        "You don't have permission to export this book."
      );
    }

    const sections = [];

    // Title Page
    sections.push(
      new Paragraph({
        children: [
          new TextRun({
            text: book.title,
            bold: true,
            size: 48,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );

    // Chapters
    book.chapters.forEach((chapter) => {
      sections.push(
        new Paragraph({
          text: chapter.title,
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 300, after: 200 },
        })
      );

      sections.push(
        new Paragraph({
          text: chapter.content.replace(/[*#>`]/g, ""),
          spacing: { after: 200 },
        })
      );
    });

    const doc = new Document({
      sections: [{ children: sections }],
    });

    const buffer = await Packer.toBuffer(doc);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.docx"`
    );

    res.send(buffer);
  } catch (error) {
    console.error("DOCX EXPORT ERROR:", error);
    return errorResponse(
      res,
      500,
      getErrorMessage(error, "Unable to export book as Word document. Please try again."),
      error
    );
  }
};

// ------------------------------------------------------
// EXPORT AS PDF
// ------------------------------------------------------

const exportAsPDF = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return errorResponse(res, 404, "Book not found. Unable to export.");
    }

    if (book.userId.toString() !== req.user._id.toString()) {
      return errorResponse(
        res,
        403,
        "You don't have permission to export this book."
      );
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`
    );

    doc.pipe(res);

    doc.fontSize(26).text(book.title, { align: "center" });
    doc.moveDown(2);

    book.chapters.forEach((chapter) => {
      doc.fontSize(18).text(chapter.title);
      doc.moveDown();

      doc.fontSize(12).text(chapter.content.replace(/[*#>`]/g, ""));
      doc.moveDown(2);
    });

    doc.end();
  } catch (error) {
    console.error("PDF EXPORT ERROR:", error);
    return errorResponse(
      res,
      500,
      getErrorMessage(error, "Unable to export book as PDF. Please try again."),
      error
    );
  }
};

module.exports = { exportAsDocument, exportAsPDF };

