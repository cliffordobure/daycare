// Error handling middleware
export const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error for debugging
  console.error("Error:", {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    user: req.user ? req.user._id : "unauthenticated",
    timestamp: new Date().toISOString(),
  });

  // Mongoose bad ObjectId
  if (err.name === "CastError") {
    const message = "Resource not found";
    error = {
      message,
      statusCode: 404,
    };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    const message = `Duplicate field value: ${field} = ${value}. Please use another value.`;
    error = {
      message,
      statusCode: 400,
    };
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
    error = {
      message,
      statusCode: 400,
    };
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = {
      message,
      statusCode: 401,
    };
  }

  if (err.name === "TokenExpiredError") {
    const message = "Token expired";
    error = {
      message,
      statusCode: 401,
    };
  }

  // Multer file upload errors
  if (err.code === "LIMIT_FILE_SIZE") {
    const message = "File too large";
    error = {
      message,
      statusCode: 400,
    };
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    const message = "Unexpected file field";
    error = {
      message,
      statusCode: 400,
    };
  }

  // Rate limiting errors
  if (err.status === 429) {
    const message = "Too many requests, please try again later";
    error = {
      message,
      statusCode: 429,
    };
  }

  // Cloudinary errors
  if (err.http_code) {
    const message = err.message || "File upload failed";
    error = {
      message,
      statusCode: err.http_code,
    };
  }

  // Custom error handling
  if (err.isOperational) {
    error = {
      message: err.message,
      statusCode: err.statusCode || 500,
    };
  }

  // Default error
  const statusCode = error.statusCode || 500;
  const message = error.message || "Internal Server Error";

  // Development vs Production error response
  const errorResponse = {
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && {
      stack: err.stack,
      error: err,
    }),
  };

  res.status(statusCode).json(errorResponse);
};

// Async error wrapper to catch async errors
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Custom error class
export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Validation error class
export class ValidationError extends AppError {
  constructor(message, field = null) {
    super(message, 400, true);
    this.field = field;
    this.type = "ValidationError";
  }
}

// Authentication error class
export class AuthenticationError extends AppError {
  constructor(message = "Authentication failed") {
    super(message, 401, true);
    this.type = "AuthenticationError";
  }
}

// Authorization error class
export class AuthorizationError extends AppError {
  constructor(message = "Access denied") {
    super(message, 403, true);
    this.type = "AuthorizationError";
  }
}

// Not found error class
export class NotFoundError extends AppError {
  constructor(resource = "Resource") {
    super(`${resource} not found`, 404, true);
    this.type = "NotFoundError";
  }
}

// Conflict error class
export class ConflictError extends AppError {
  constructor(message = "Resource conflict") {
    super(message, 409, true);
    this.type = "ConflictError";
  }
}

// Rate limit error class
export class RateLimitError extends AppError {
  constructor(message = "Too many requests") {
    super(message, 429, true);
    this.type = "RateLimitError";
  }
}

// Database error class
export class DatabaseError extends AppError {
  constructor(message = "Database operation failed") {
    super(message, 500, false);
    this.type = "DatabaseError";
  }
}

// File upload error class
export class FileUploadError extends AppError {
  constructor(message = "File upload failed") {
    super(message, 400, true);
    this.type = "FileUploadError";
  }
}

// Notify error monitoring service (e.g., Sentry)
export const notifyError = (error, req) => {
  // In production, you would send this to your error monitoring service
  if (process.env.NODE_ENV === "production") {
    // Example: Sentry.captureException(error);
    console.error("Error reported to monitoring service:", {
      error: error.message,
      stack: error.stack,
      url: req?.originalUrl,
      method: req?.method,
      user: req?.user?._id,
      timestamp: new Date().toISOString(),
    });
  }
};

// Handle unhandled promise rejections
export const handleUnhandledRejection = (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);

  // In production, you might want to exit the process
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
};

// Handle uncaught exceptions
export const handleUncaughtException = (error) => {
  console.error("Uncaught Exception:", error);

  // In production, you might want to exit the process
  if (process.env.NODE_ENV === "production") {
    process.exit(1);
  }
};

// Set up global error handlers
export const setupGlobalErrorHandlers = () => {
  process.on("unhandledRejection", handleUnhandledRejection);
  process.on("uncaughtException", handleUncaughtException);
};
