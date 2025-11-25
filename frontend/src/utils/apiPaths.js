export const BASE_URL = "http://localhost:8000"; // ⭐ REQUIRED

export const API_PATHS = {
  AUTH: {
    REGISTER: "/api/auth/register",
    LOGIN: "/api/auth/login",
    GET_PROFILE: "/api/auth/profile",
    UPDATE_PROFILE: "/api/auth/profile",
  },

  BOOKS: {
    // Backend mounts book routes at /api/book (singular)
    CREATE_BOOK: "/api/book",
    GET_BOOKS: "/api/book",
    GET_BOOK_BY_ID: "/api/book",      // use with /:id
    UPDATE_BOOK: "/api/book",         // use with /:id
    DELETE_BOOK: "/api/book",         // use with /:id
    UPDATE_COVER: "/api/book/cover",  // use with /:id
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

