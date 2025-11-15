/**
 * Frontend Error Handler Utility
 * Provides user-friendly error messages for different error types
 */

export const getErrorMessage = (error, defaultMessage = "Something went wrong. Please try again.") => {
  // Handle network errors
  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return "Request timed out. Please check your internet connection and try again.";
    }
    if (error.message === "Network Error") {
      return "Unable to connect to the server. Please check your internet connection.";
    }
    return "Network error. Please check your connection and try again.";
  }

  const status = error.response?.status;
  const message = error.response?.data?.message || error.message;

  // Handle specific status codes
  switch (status) {
    case 400:
      return message || "Invalid request. Please check your input and try again.";
    case 401:
      return message || "You are not authorized. Please log in again.";
    case 403:
      return message || "You don't have permission to perform this action.";
    case 404:
      return message || "The requested resource was not found.";
    case 409:
      return message || "A conflict occurred. Please try again.";
    case 422:
      return message || "Validation error. Please check your input.";
    case 429:
      return "Too many requests. Please wait a moment and try again.";
    case 500:
      return message || "Server error. Please try again later.";
    case 502:
      return "Service temporarily unavailable. Please try again later.";
    case 503:
      return "Service unavailable. Please try again later.";
    default:
      return message || defaultMessage;
  }
};

export const handleApiError = (error) => {
  const message = getErrorMessage(error);
  console.error("API Error:", {
    message,
    error: error.response?.data || error.message,
    status: error.response?.status,
  });
  return message;
};

