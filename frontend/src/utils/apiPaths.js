export const BASE_URL = "http://localhost:8000"; // ⭐ REQUIRED

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: "/api/auth/profile",
  },

  BOOKS: {
    // Backend mounts book routes at /api/books (plural)
    CREATE_BOOK: "/api/books",
    GET_BOOKS: "/api/books",
    GET_BOOK_BY_ID: "/api/books",      // use with /:id
    UPDATE_BOOK: "/api/books",         // use with /:id
    DELETE_BOOK: "/api/books",         // use with /:id
    UPDATE_COVER: "/api/books/cover",  // use with /:id
  },

  AI: {
    GENERATE_OUTLINE: "/api/ai/generate-outline",
    GENERATE_CHAPTER_CONTENT: "/api/ai/generate-chapter-content",
  },

  EXPORT: {
    PDF: "/api/export",
    DOC: "/api/export",
  },
};

