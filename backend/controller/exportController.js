const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  ImageRun,
} = require("docx");

const PDFDocument = require("pdfkit");
const Book = require("../models/Book");
const fs = require("fs");
const path = require("path");
const { getErrorMessage, errorResponse } = require("../utils/errorHandler");

function getImagePath(relativePath) {
  if (!relativePath) return null;

  const cleanPath = relativePath.startsWith("/")
    ? relativePath.slice(1)
    : relativePath;

  const fullPath = path.join(__dirname, "..", cleanPath);
  return fs.existsSync(fullPath) ? fullPath : null;
}

const exportAsDocument = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return errorResponse(res, 404, "Book not found.");
    if (book.UserId.toString() !== req.user._id.toString())
      return errorResponse(res, 403, "Unauthorized.");

    const sections = [];

    const coverPath = getImagePath(book.coverImage);

    if (coverPath) {
      sections.push({
        properties: {},
        children: [
          new Paragraph({
            children: [
              new ImageRun({
                data: fs.readFileSync(coverPath),
                transformation: {
                  width: 500,
                  height: 700,
                },
              }),
            ],
            alignment: AlignmentType.CENTER,
          }),
        ],
      });
    }

    sections.push({
      properties: {},
      children: [
        new Paragraph({
          children: [
            new TextRun({
              text: book.title,
              bold: true,
              size: 72,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),

        book.subtitle
          ? new Paragraph({
              children: [
                new TextRun({
                  text: book.subtitle,
                  italics: true,
                  size: 32,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            })
          : new Paragraph({}),

        new Paragraph({
          children: [
            new TextRun({
              text: `By ${book.author}`,
              bold: true,
              size: 30,
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
        }),
      ],
    });

    book.chapters.forEach((chapter) => {
      sections.push({
        properties: {},
        children: [
          // CHAPTER TITLE
          new Paragraph({
            children: [
              new TextRun({
                text: chapter.title,
                bold: true,
                size: 40,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 200 },
          }),

          ...chapter.content
            .replace(/[*#>`]/g, "")
            .split("\n")
            .map(
              (line) =>
                new Paragraph({
                  children: [
                    new TextRun({
                      text: line,
                      size: 26,
                    }),
                  ],
                  spacing: { after: 200 },
                })
            ),
        ],
      });
    });

    const doc = new Document({
      sections,
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
      getErrorMessage(error, "Unable to export as Word."),
      error
    );
  }
};

const exportAsPDF = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) return errorResponse(res, 404, "Book not found.");
    if (book.UserId.toString() !== req.user._id.toString())
      return errorResponse(res, 403, "Unauthorized.");

    const doc = new PDFDocument({
      margin: 60,
      size: "A4",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${book.title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf"`
    );

    doc.pipe(res);

    const coverPath = getImagePath(book.coverImage);

    if (coverPath) {
      doc.image(coverPath, {
        fit: [450, 650],
        align: "center",
        valign: "center",
      });
      doc.addPage();
    }

    doc
      .fontSize(48)
      .fillColor("#4C1D95")
      .font("Times-Bold")
      .text(book.title, { align: "center" });

    doc.moveDown(1);

    if (book.subtitle) {
      doc
        .fontSize(22)
        .fillColor("#6D28D9")
        .font("Times-Italic")
        .text(book.subtitle, { align: "center" });
      doc.moveDown(1);
    }

    doc
      .fontSize(20)
      .fillColor("#1E1E1E")
      .font("Times-Roman")
      .text(`By ${book.author}`, { align: "center" });

    doc.addPage();

    const renderChapterTitle = (title) => {
      doc.moveDown(1.5);
      doc
        .font("Times-Bold")
        .fontSize(28)
        .fillColor("#4C1D95")
        .text(title, { align: "center" });

      doc.moveDown(0.5);

      // Small divider line
      doc
        .moveTo(100, doc.y)
        .lineTo(495, doc.y)
        .strokeColor("#C4B5FD")
        .lineWidth(1.2)
        .stroke();

      doc.moveDown(1.5);
    };

    const renderParagraph = (text) => {
      const cleaned = text.trim();
      if (!cleaned) {
        doc.moveDown(0.7);
        return;
      }

      const first = cleaned.charAt(0);
      const rest = cleaned.slice(1);

      doc.fontSize(fontSize).font("Times-Roman").fillColor("#1F2937");

      doc
        .text(first, {
          continued: true,
          font: "Times-Bold",
          fontSize: 26,
        })
        .text(rest, {
          paragraphGap: 10,
          align: "justify",
          indent: 20,
        });

      doc.moveDown(0.6);
    };

    const fontSize = 14;

    book.chapters.forEach((chapter, index) => {
      renderChapterTitle(chapter.title);

      const paragraphs = chapter.content.split("\n");

      paragraphs.forEach((p) => renderParagraph(p));

      if (index < book.chapters.length - 1) doc.addPage();
    });

    doc.end();
  } catch (error) {
    console.error("PDF EXPORT ERROR:", error);
    return errorResponse(
      res,
      500,
      getErrorMessage(error, "Unable to export PDF."),
      error
    );
  }
};

module.exports = { exportAsDocument, exportAsPDF };
