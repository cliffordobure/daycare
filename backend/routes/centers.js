import express from "express";
import { body, validationResult } from "express-validator";
import Center from "../models/Center.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { authenticateToken } from "../middleware/auth.js";
import { sendEmail } from "../utils/emailService.js";
import { generatePassword } from "../utils/passwordGenerator.js";

const router = express.Router();

// Validation middleware for center registration
const validateCenterRegistration = [
  body("centerData.name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Center name must be between 2 and 100 characters"),
  body("centerData.type")
    .isIn(["daycare", "preschool", "kindergarten", "nursery", "mixed"])
    .withMessage("Invalid center type"),
  body("centerData.address.street")
    .trim()
    .notEmpty()
    .withMessage("Street address cannot be empty"),
  body("centerData.address.city")
    .trim()
    .notEmpty()
    .withMessage("City cannot be empty"),
  body("centerData.address.state")
    .trim()
    .notEmpty()
    .withMessage("State cannot be empty"),
  body("centerData.contactInfo.phone")
    .trim()
    .matches(/^[\+]?[0-9\s\-\(\)]{7,20}$/)
    .withMessage("Please provide a valid phone number"),
  body("centerData.contactInfo.email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("centerData.capacity")
    .custom((value) => {
      const num = parseInt(value);
      return !isNaN(num) && num >= 1;
    })
    .withMessage("Capacity must be a positive integer"),
  body("adminData.firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),
  body("adminData.lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),
  body("adminData.email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("adminData.phone")
    .trim()
    .matches(/^[\+]?[0-9\s\-\(\)]{7,20}$/)
    .withMessage("Please provide a valid phone number"),
  body("adminData.password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

// Validation middleware
const validateCenterUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Center name must be between 2 and 100 characters"),
  body("type")
    .optional()
    .isIn(["daycare", "preschool", "kindergarten", "nursery"])
    .withMessage("Invalid center type"),
  body("address.street")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Street address cannot be empty"),
  body("address.city")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("City cannot be empty"),
  body("address.state")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("State cannot be empty"),
  body("contactInfo.phone")
    .optional()
    .trim()
    .matches(/^[\+]?[0-9][\d]{0,15}$/)
    .withMessage("Please provide a valid phone number"),
  body("contactInfo.email")
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage("Please provide a valid email address"),
  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive integer"),
];

const validateUserCreation = [
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
    .matches(/^[\+]?[0-9][\d]{0,15}$/)
    .withMessage("Please provide a valid phone number"),
  body("role")
    .isIn(["admin", "teacher", "parent"])
    .withMessage("Invalid role specified"),
  body("preferredLanguage")
    .optional()
    .isIn(["en", "sw"])
    .withMessage("Invalid language preference"),
];

// @route   POST /api/centers/register
// @desc    Register a new center with admin user
// @access  Public
router.post(
  "/register",
  validateCenterRegistration,
  asyncHandler(async (req, res) => {
    console.log("Center registration request body:", JSON.stringify(req.body, null, 2));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { centerData, adminData } = req.body;

    // Convert capacity to integer if it's a string
    if (centerData.capacity) {
      centerData.capacity = parseInt(centerData.capacity);
    }

    // Check if center email already exists
    const existingCenter = await Center.findOne({
      "contactInfo.email": centerData.contactInfo.email,
    });
    if (existingCenter) {
      return res.status(400).json({
        status: "error",
        message: "A center with this email already exists",
      });
    }

    // Check if admin email already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      return res.status(400).json({
        status: "error",
        message: "A user with this email already exists",
      });
    }

    // Create the center first
    const center = new Center({
      ...centerData,
      status: "active",
      isActive: true,
    });

    await center.save();

    // Create the admin user
    const admin = new User({
      ...adminData,
      role: "admin",
      center: center._id,
      isActive: true,
      adminInfo: {
        centerAccess: [center._id],
        permissions: ["all"],
      },
    });

    await admin.save();

    // Update center with admin reference
    center.admin = admin._id;
    center.createdBy = admin._id;
    await center.save();

    // Send welcome email to admin
    try {
      await sendEmail({
        to: admin.email,
        subject: `Welcome to Nurtura - Your Center is Ready!`,
        template: "center-welcome",
        context: {
          adminName: admin.firstName,
          centerName: center.name,
          centerEmail: center.contactInfo.email,
          loginUrl: `${process.env.FRONTEND_URL}/auth/login`,
        },
      });
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }

    res.status(201).json({
      status: "success",
      message: "Center and admin user created successfully",
      data: {
        center: {
          id: center._id,
          name: center.name,
          type: center.type,
          status: center.status,
        },
        admin: {
          id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          role: admin.role,
        },
      },
    });
  })
);

// @route   GET /api/centers/:centerId
// @desc    Get center details
// @access  Private
router.get(
  "/:centerId",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const center = await Center.findById(req.params.centerId)
      .populate("createdBy", "firstName lastName email")
      .populate("updatedBy", "firstName lastName email");

    if (!center) {
      return res.status(404).json({
        status: "error",
        message: "Center not found",
      });
    }

    res.json({
      status: "success",
      data: {
        center,
      },
    });
  })
);

// @route   PUT /api/centers/:centerId
// @desc    Update center details
// @access  Private (Admin only)
router.put(
  "/:centerId",
  authenticateToken,
  validateCenterUpdate,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const center = await Center.findByIdAndUpdate(
      req.params.centerId,
      {
        ...req.body,
        updatedBy: req.user._id,
      },
      { new: true, runValidators: true }
    );

    if (!center) {
      return res.status(404).json({
        status: "error",
        message: "Center not found",
      });
    }

    res.json({
      status: "success",
      message: "Center updated successfully",
      data: {
        center,
      },
    });
  })
);

// @route   GET /api/centers/:centerId/users
// @desc    Get center users with pagination and filtering
// @access  Private
router.get(
  "/:centerId/users",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { centerId } = req.params;
    const { page = 1, limit = 10, search = "", role = "" } = req.query;

    // Build query
    const query = { center: centerId };
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }
    if (role) {
      query.role = role;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const users = await User.find(query)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(query);
    const totalPages = Math.ceil(totalUsers / parseInt(limit));

    res.json({
      status: "success",
      data: {
        users,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalUsers,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  })
);

// @route   POST /api/centers/:centerId/users
// @desc    Create a new user in the center
// @access  Private (Admin only)
router.post(
  "/:centerId/users",
  authenticateToken,
  validateUserCreation,
  asyncHandler(async (req, res) => {
    console.log("User creation request body:", JSON.stringify(req.body, null, 2));
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation errors:", errors.array());
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { centerId } = req.params;
    const {
      firstName,
      lastName,
      email,
      phone,
      role,
      preferredLanguage = "en",
      address,
      emergencyContact,
      teacherInfo,
      parentInfo,
    } = req.body;

    // Check if center exists
    const center = await Center.findById(centerId);
    if (!center) {
      return res.status(404).json({
        status: "error",
        message: "Center not found",
      });
    }

    // Check if user already exists with this email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        status: "error",
        message: "User with this email already exists",
      });
    }

    // Set password to be the same as email
    const userPassword = email;

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      phone,
      password: userPassword,
      role,
      preferredLanguage,
      address,
      emergencyContact,
      teacherInfo,
      parentInfo,
      center: centerId,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    await user.save();

    // Send welcome email with credentials
    try {
      await sendEmail({
        to: user.email,
        subject: `Welcome to ${center.name} - Your Account Details`,
        template: "user-welcome",
        context: {
          name: user.firstName,
          centerName: center.name,
          role: user.role,
          adminName: req.user.firstName,
          loginEmail: user.email,
          loginPassword: userPassword,
        },
      });
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }

    res.status(201).json({
      status: "success",
      message: "User created successfully. Login credentials: Email and Password are the same.",
      data: {
        user: {
          id: user._id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
        },
        loginInfo: {
          email: user.email,
          password: userPassword,
        },
      },
    });
  })
);

export default router;

