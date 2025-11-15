/**
 * Centralized Error Handler Utility
 * Provides user-friendly error messages for different error types
 */

const getErrorMessage = (error, defaultMessage = "Something went wrong. Please try again.") => {
  // Handle known error types
  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((err) => err.message);
    return errors.join(", ");
  }

  if (error.name === "CastError") {
    return "Invalid data format provided.";
  }

  if (error.code === 11000) {
    // MongoDB duplicate key error
    const field = Object.keys(error.keyPattern)[0];
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists. Please use a different ${field}.`;
  }

  if (error.name === "JsonWebTokenError") {
    return "Invalid authentication token. Please log in again.";
  }

  if (error.name === "TokenExpiredError") {
    return "Your session has expired. Please log in again.";
  }

  if (error.message) {
    return error.message;
  }

  return defaultMessage;
};

const errorResponse = (res, statusCode, message, error = null) => {
  const response = {
    success: false,
    message: message || "An error occurred",
  };

  // Only include error details in development
  if (process.env.NODE_ENV === "development" && error) {
    response.error = error.message;
    response.stack = error.stack;
  }

  return res.status(statusCode).json(response);
};

module.exports = {
  getErrorMessage,
  errorResponse,
};

