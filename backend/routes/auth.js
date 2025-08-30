import express from "express";
import { body, validationResult } from "express-validator";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { authenticateToken } from "../middleware/auth.js";
import { sendEmail } from "../utils/emailService.js";
import { sendSMS } from "../utils/smsService.js";

const router = express.Router();

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "7d",
  });
};

// Generate Refresh Token
const generateRefreshToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_REFRESH_EXPIRE || "30d",
    }
  );
};

// Validation middleware
const validateRegistration = [
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),
  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("phone")
    .trim()
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage("Please provide a valid phone number"),
  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
  body("role")
    .isIn(["admin", "teacher", "parent"])
    .withMessage("Invalid role specified"),
  body("preferredLanguage")
    .optional()
    .isIn(["en", "sw"])
    .withMessage("Invalid language preference"),
];

const validateLogin = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

const validatePasswordReset = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
];

const validatePasswordUpdate = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
    .withMessage(
      "New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
];

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  validateRegistration,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const {
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      preferredLanguage = "en",
      address,
      emergencyContact,
    } = req.body;

    // Check if user already exists (only within the same center for multi-tenancy)
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
      center: req.body.center || null, // Allow center-based registration
    });

    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User with this email or phone number already exists",
      });
    }

    // Create user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password,
      role,
      preferredLanguage,
      address,
      emergencyContact,
      createdBy: req.user?._id, // If admin is creating the user
    });

    await user.save();

    // Generate tokens
    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    // Update user's last login
    user.lastLogin = new Date();
    await user.save();

    // Send welcome email
    try {
      await sendEmail({
        to: user.email,
        subject: "Welcome to Nurtura",
        template: "welcome",
        context: {
          name: user.firstName,
          role: user.role,
          language: user.preferredLanguage,
        },
      });
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }

    // Send welcome SMS if phone is provided
    if (user.phone) {
      try {
        await sendSMS({
          to: user.phone,
          message: `Welcome to Nurtura! Your account has been created successfully.`,
        });
      } catch (error) {
        console.error("Failed to send welcome SMS:", error);
      }
    }

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
        },
        token,
        refreshToken,
      },
    });
  })
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post(
  "/login",
  validateLogin,
  asyncHandler(async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: errors.array(),
        });
      }

      const { email, password } = req.body;
      console.log("Login attempt for email:", email);

      // Check if user exists and populate center field
      const user = await User.findOne({ email })
        .select("+password")
        .populate("center", "name address contactInfo");
      console.log("User found:", user ? "Yes" : "No");

      if (!user) {
        console.log("User not found for email:", email);
        return res.status(401).json({
          status: "error",
          message: "Invalid credentials",
        });
      }

      console.log("User role:", user.role);
      console.log("User isActive:", user.isActive);

      // Check if user is active
      if (!user.isActive) {
        console.log("User account is deactivated");
        return res.status(401).json({
          status: "error",
          message: "Account is deactivated. Please contact administrator.",
        });
      }

      // Check password
      console.log("Checking password...");
      const isMatch = await user.correctPassword(password, user.password);
      console.log("Password match:", isMatch);

      if (!isMatch) {
        console.log("Password verification failed");
        return res.status(401).json({
          status: "error",
          message: "Invalid credentials",
        });
      }

      console.log("Password verified successfully");

      // Generate tokens
      const token = generateToken(user._id);
      const refreshToken = generateRefreshToken(user._id);
      console.log("Tokens generated");

      // Update user's last login
      user.lastLogin = new Date();
      user.lastActivity = new Date();
      await user.save();
      console.log("User updated with last login");

      const responseData = {
        status: "success",
        message: "Login successful",
        data: {
          user: {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            preferredLanguage: user.preferredLanguage,
            profilePicture: user.profilePicture,
            center: user.center, // Include center information
          },
          token,
          refreshToken,
        },
      };

      console.log("User role from database:", user.role);
      console.log("User role type:", typeof user.role);
      console.log("Sending response:", JSON.stringify(responseData, null, 2));
      res.json(responseData);
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({
        status: "error",
        message: "Internal server error",
      });
    }
  })
);

// @route   POST /api/auth/refresh-token
// @desc    Refresh access token
// @access  Public
router.post(
  "/refresh-token",
  asyncHandler(async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({
        status: "error",
        message: "Refresh token is required",
      });
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
      );

      // Check if user exists and is active
      const user = await User.findById(decoded.id).select("-password");
      if (!user || !user.isActive) {
        return res.status(401).json({
          status: "error",
          message: "Invalid refresh token",
        });
      }

      // Generate new tokens
      const newToken = generateToken(user._id);
      const newRefreshToken = generateRefreshToken(user._id);

      res.json({
        status: "success",
        message: "Token refreshed successfully",
        data: {
          token: newToken,
          refreshToken: newRefreshToken,
        },
      });
    } catch (error) {
      return res.status(401).json({
        status: "error",
        message: "Invalid refresh token",
      });
    }
  })
);

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email/SMS
// @access  Public
router.post(
  "/forgot-password",
  validatePasswordReset,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save();

    // Send reset email
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Request",
        template: "password-reset",
        context: {
          name: user.firstName,
          resetToken,
          resetUrl: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`,
        },
      });
    } catch (error) {
      console.error("Failed to send password reset email:", error);
      return res.status(500).json({
        status: "error",
        message: "Failed to send password reset email",
      });
    }

    res.json({
      status: "success",
      message: "Password reset email sent successfully",
    });
  })
);

// @route   POST /api/auth/reset-password/:token
// @desc    Reset password with token
// @access  Public
router.post(
  "/reset-password/:token",
  asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 8) {
      return res.status(400).json({
        status: "error",
        message: "Password must be at least 8 characters long",
      });
    }

    // Hash token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Token is invalid or has expired",
      });
    }

    // Set new password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    user.passwordChangedAt = Date.now();

    await user.save();

    // Send confirmation email
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Reset Successful",
        template: "password-reset-success",
        context: {
          name: user.firstName,
        },
      });
    } catch (error) {
      console.error("Failed to send password reset confirmation email:", error);
    }

    res.json({
      status: "success",
      message: "Password reset successfully",
    });
  })
);

// @route   POST /api/auth/change-password
// @desc    Change password (authenticated user)
// @access  Private
router.post(
  "/change-password",
  authenticateToken,
  validatePasswordUpdate,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id).select("+password");

    // Check current password
    const isMatch = await user.correctPassword(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({
        status: "error",
        message: "Current password is incorrect",
      });
    }

    // Update password
    user.password = newPassword;
    user.passwordChangedAt = Date.now();
    await user.save();

    // Send confirmation email
    try {
      await sendEmail({
        to: user.email,
        subject: "Password Changed Successfully",
        template: "password-change-success",
        context: {
          name: user.firstName,
        },
      });
    } catch (error) {
      console.error(
        "Failed to send password change confirmation email:",
        error
      );
    }

    res.json({
      status: "success",
      message: "Password changed successfully",
    });
  })
);

// @route   POST /api/auth/verify-email
// @desc    Verify email address
// @access  Public
router.post(
  "/verify-email/:token",
  asyncHandler(async (req, res) => {
    const { token } = req.params;

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        status: "error",
        message: "Verification token is invalid or has expired",
      });
    }

    // Mark email as verified
    user.isVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;

    await user.save();

    res.json({
      status: "success",
      message: "Email verified successfully",
    });
  })
);

// @route   POST /api/auth/resend-verification
// @desc    Resend email verification
// @access  Public
router.post(
  "/resend-verification",
  validatePasswordReset,
  asyncHandler(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        status: "error",
        message: "Email is already verified",
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    await user.save();

    // Send verification email
    try {
      await sendEmail({
        to: user.email,
        subject: "Verify Your Email Address",
        template: "email-verification",
        context: {
          name: user.firstName,
          verificationToken,
          verificationUrl: `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`,
        },
      });
    } catch (error) {
      console.error("Failed to send verification email:", error);
      return res.status(500).json({
        status: "error",
        message: "Failed to send verification email",
      });
    }

    res.json({
      status: "success",
      message: "Verification email sent successfully",
    });
  })
);

// @route   POST /api/auth/logout
// @desc    Logout user (invalidate token)
// @access  Private
router.post(
  "/logout",
  authenticateToken,
  asyncHandler(async (req, res) => {
    // In a more sophisticated system, you might want to blacklist the token
    // For now, we'll just return a success response
    // The client should remove the token from storage

    res.json({
      status: "success",
      message: "Logged out successfully",
    });
  })
);

// @route   GET /api/auth/me
// @desc    Get current user profile
// @access  Private
router.get(
  "/me",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id)
      .select("-password")
      .populate("center", "name address contactInfo");

    res.json({
      status: "success",
      data: {
        user,
      },
    });
  })
);

// @route   POST /api/auth/create-test-user
// @desc    Create a test user for development (remove in production)
// @access  Public
router.post(
  "/create-test-user",
  asyncHandler(async (req, res) => {
    try {
      // Check if test user already exists
      const existingUser = await User.findOne({ email: "test@example.com" });
      if (existingUser) {
        return res.json({
          status: "success",
          message: "Test user already exists",
          data: {
            user: {
              id: existingUser._id,
              email: existingUser.email,
              role: existingUser.role,
            },
          },
        });
      }

      // Create test user
      const testUser = new User({
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "+1234567890",
        password: "TestPass123!",
        role: "admin",
        preferredLanguage: "en",
        isActive: true,
        isVerified: true,
      });

      await testUser.save();

      res.status(201).json({
        status: "success",
        message: "Test user created successfully",
        data: {
          user: {
            id: testUser._id,
            email: testUser.email,
            role: testUser.role,
          },
        },
      });
    } catch (error) {
      console.error("Error creating test user:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to create test user",
      });
    }
  })
);

// @route   POST /api/auth/fix-user-role
// @desc    Fix user role (development only - remove in production)
// @access  Public
router.post(
  "/fix-user-role",
  asyncHandler(async (req, res) => {
    try {
      const { email, newRole } = req.body;

      if (!email || !newRole) {
        return res.status(400).json({
          status: "error",
          message: "Email and newRole are required",
        });
      }

      if (!["admin", "teacher", "parent"].includes(newRole)) {
        return res.status(400).json({
          status: "error",
          message: "Invalid role. Must be admin, teacher, or parent",
        });
      }

      // Find and update user
      const user = await User.findOneAndUpdate(
        { email },
        { role: newRole },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          status: "error",
          message: "User not found",
        });
      }

      res.json({
        status: "success",
        message: `User role updated to ${newRole}`,
        data: {
          user: {
            id: user._id,
            email: user.email,
            role: user.role,
          },
        },
      });
    } catch (error) {
      console.error("Error fixing user role:", error);
      res.status(500).json({
        status: "error",
        message: "Failed to fix user role",
      });
    }
  })
);

export default router;
