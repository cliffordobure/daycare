import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Verify JWT token
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    console.log("Auth middleware - Auth header:", authHeader);
    console.log("Auth middleware - Token:", token ? "Present" : "Missing");

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "Access token is required",
      });
    }

    // Verify token
    const jwtSecret =
      process.env.JWT_SECRET ||
      "your-super-secret-jwt-key-change-this-in-production";
    console.log("Auth middleware - JWT Secret configured:", !!jwtSecret);

    const decoded = jwt.verify(token, jwtSecret);

    // Check if user still exists
    console.log("Auth middleware - Decoded token ID:", decoded.id);
    const user = await User.findById(decoded.id).select("-password");
    console.log("Auth middleware - User found:", user ? "Yes" : "No");

    if (!user) {
      return res.status(401).json({
        status: "error",
        message: "User no longer exists",
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({
        status: "error",
        message: "User account is deactivated",
      });
    }

    // Check if password was changed after token was issued
    if (user.changedPasswordAfter(decoded.iat)) {
      return res.status(401).json({
        status: "error",
        message: "User recently changed password! Please log in again",
      });
    }

    // Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        status: "error",
        message: "Invalid token",
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        status: "error",
        message: "Token expired",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Authentication failed",
    });
  }
};

// Role-based access control
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: `Role ${req.user.role} is not authorized to access this resource`,
      });
    }

    next();
  };
};

// Permission-based access control
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        status: "error",
        message: "Authentication required",
      });
    }

    if (!req.user.hasPermission(permission)) {
      return res.status(403).json({
        status: "error",
        message: `Permission '${permission}' is required to access this resource`,
      });
    }

    next();
  };
};

// Optional authentication (for public routes that can work with or without auth)
export const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select("-password");

      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Check if user owns the resource or has admin access
export const checkOwnership = (model, field = "userId") => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "Authentication required",
        });
      }

      // Admins can access all resources
      if (req.user.role === "admin") {
        return next();
      }

      const resourceId = req.params.id;
      const resource = await model.findById(resourceId);

      if (!resource) {
        return res.status(404).json({
          status: "error",
          message: "Resource not found",
        });
      }

      // Check if user owns the resource
      if (
        resource[field] &&
        resource[field].toString() === req.user._id.toString()
      ) {
        return next();
      }

      // For teachers, check if they have access to the class
      if (req.user.role === "teacher" && resource.currentClass) {
        const hasClassAccess = req.user.teacherInfo.assignedClasses.includes(
          resource.currentClass
        );
        if (hasClassAccess) {
          return next();
        }
      }

      // For parents, check if they have access to the child
      if (req.user.role === "parent" && resource.parents) {
        const hasChildAccess = resource.parents.includes(req.user._id);
        if (hasChildAccess) {
          return next();
        }
      }

      return res.status(403).json({
        status: "error",
        message:
          "Access denied: You do not have permission to access this resource",
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Error checking resource ownership",
      });
    }
  };
};

// Rate limiting for specific routes
export const createRateLimiter = (windowMs, max, message) => {
  return (req, res, next) => {
    const key = req.user ? req.user._id : req.ip;
    const now = Date.now();

    if (!req.rateLimit) {
      req.rateLimit = new Map();
    }

    const userLimits = req.rateLimit.get(key) || {
      count: 0,
      resetTime: now + windowMs,
    };

    if (now > userLimits.resetTime) {
      userLimits.count = 1;
      userLimits.resetTime = now + windowMs;
    } else {
      userLimits.count++;
    }

    req.rateLimit.set(key, userLimits);

    if (userLimits.count > max) {
      return res.status(429).json({
        status: "error",
        message: message || "Too many requests, please try again later",
      });
    }

    next();
  };
};

// Validate refresh token
export const validateRefreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: "error",
        message: "Refresh token is required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user || !user.isActive) {
      return res.status(401).json({
        status: "error",
        message: "Invalid refresh token",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "Invalid refresh token",
    });
  }
};
