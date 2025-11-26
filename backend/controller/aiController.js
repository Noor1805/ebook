const { GoogleGenerativeAI } = require("@google/generative-ai");
const { getErrorMessage, errorResponse } = require("../utils/errorHandler");

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateOutline = async (req, res) => {
  try {
    const { topic, style, numChapters, description } = req.body;

    if (!topic || topic.trim().length === 0) {
      return errorResponse(
        res,
        400,
        "Please provide a book topic to generate an outline"
      );
    }

    const prompt = `
You are an expert book outline generator. Create a comprehensive book outline based on the following requirements:

Topic: "${topic}"
${description ? `Description: ${description}` : ""}
Writing Style: ${style}
Number of Chapters: ${numChapters || 5}

Requirements:
1. Generate exactly ${numChapters || 5} chapters.
2. Each chapter title should be clear, engaging, and follow a logical progression.
3. Each chapter description should be 2–3 sentences explaining what the chapter covers.
4. Ensure chapters build upon each other coherently.
5. Match the "${style}" writing style in your titles and descriptions.

Output Format:
Return ONLY a valid JSON array with no additional text, markdown, or formatting.
Each object must have exactly two keys: "title" and "description".
`;

    const response = await ai
      .getGenerativeModel({ model: "gemini-2.5-flash-lite" })
      .generateContent(prompt);

    const text = await response.response.text();

    const startIndex = text.indexOf("[");
    const endIndex = text.lastIndexOf("]") + 1;

    if (startIndex === -1 || endIndex === -1) {
      return errorResponse(
        res,
        500,
        "Unable to generate book outline. The AI response format was unexpected. Please try again."
      );
    }

    const outline = JSON.parse(text.substring(startIndex, endIndex));

    res.status(200).json({ outline });
  } catch (error) {
    console.error("Error generating outline:", error);
    return errorResponse(
      res,
      500,
      getErrorMessage(error, "Unable to generate book outline. Please try again later."),
      error
    );
  }
};

const generateChapterContent = async (req, res) => {
  try {
    const { chapterTitle, chapterDescription, style } = req.body;

    if (!chapterTitle || chapterTitle.trim().length === 0) {
      return errorResponse(
        res,
        400,
        "Please provide a chapter title to generate content"
      );
    }

    const prompt = `
You are an expert writer specialization in ${style} content. Write a complete chapter for a book with the following specification:
Chapter Title: "${chapterTitle}"
${chapterDescription ? `Chapter Description: ${chapterDescription}` : ""}
Writing Style: ${style}
Target Length: Comprehensive and detailed (aim for 1500–2500 words)

Requirements:
1. Write in a ${style.toLowerCase()} tone throughout the chapter
2. Structure the content with clear sections and smooth transitions
3. Include relevant examples, explanations, or anecdotes as appropriate for the style
4. Ensure the content flows logically from introduction to conclusion
5. Make the content engaging and valuable to readers
${chapterDescription ? "6. Cover all points mentioned in the chapter description" : ""}

Format Guidelines:
- Start with a compelling opening paragraph
- Use clear paragraph breaks for readability
- Include subheadings if appropriate for the content length
- End with a strong conclusion or transition to the next chapter
- Write in plain text without markdown formatting

Begin writing the chapter content now:
`;

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash-lite" });
    const response = await model.generateContent(prompt);
    const text = await response.response.text();

    res.status(200).json({ content: text });
  } catch (error) {
    console.error("Error generating chapter:", error);
    return errorResponse(
      res,
      500,
      getErrorMessage(error, "Unable to generate chapter content. Please try again later."),
      error
    );
  }
};

module.exports = {
  generateOutline,
  generateChapterContent,
};
