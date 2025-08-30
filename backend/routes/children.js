import express from "express";
import { body, validationResult } from "express-validator";
import Child from "../models/Child.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Validation middleware
const validateChildCreation = [
  body("firstName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),
  body("lastName")
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),
  body("dateOfBirth")
    .isISO8601()
    .withMessage("Date of birth must be a valid date"),
  body("gender")
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),
  body("parents")
    .isArray({ min: 1 })
    .withMessage("At least one parent is required"),
  body("parents.*")
    .isMongoId()
    .withMessage("Invalid parent ID format"),
  body("emergencyContacts")
    .optional()
    .isArray()
    .withMessage("Emergency contacts must be an array"),
  body("emergencyContacts.*.name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Emergency contact name cannot be empty"),
  body("emergencyContacts.*.phone")
    .optional()
    .trim()
    .matches(/^[\+]?[0-9][\d]{0,15}$/)
    .withMessage("Please provide a valid phone number"),
  body("enrollmentStatus")
    .optional()
    .isIn(["enrolled", "waitlisted", "withdrawn", "graduated"])
    .withMessage("Invalid enrollment status"),
];

const validateChildUpdate = [
  body("firstName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("First name must be between 2 and 50 characters"),
  body("lastName")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Last name must be between 2 and 50 characters"),
  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Date of birth must be a valid date"),
  body("gender")
    .optional()
    .isIn(["male", "female", "other"])
    .withMessage("Gender must be male, female, or other"),
  body("enrollmentStatus")
    .optional()
    .isIn(["enrolled", "waitlisted", "withdrawn", "graduated"])
    .withMessage("Invalid enrollment status"),
];

// @route   GET /api/children
// @desc    Get all children with filtering and pagination
// @access  Private
router.get(
  "/",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { 
      page = 1, 
      limit = 10, 
      search = "", 
      status = "", 
      classId = "",
      parentId = "",
      centerId = ""
    } = req.query;

    // Build query based on user's center
    let query = { isActive: true };
    
    // If centerId is provided, filter by center through parents
    if (centerId) {
      const parentsInCenter = await User.find({ center: centerId }).select('_id');
      const parentIds = parentsInCenter.map(p => p._id);
      query.parents = { $in: parentIds };
    } else if (req.user.center) {
      // If no centerId but user has a center, filter by user's center
      const parentsInCenter = await User.find({ center: req.user.center }).select('_id');
      const parentIds = parentsInCenter.map(p => p._id);
      query.parents = { $in: parentIds };
    }

    // Add search filter
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }

    // Add status filter
    if (status && status !== "all") {
      query.enrollmentStatus = status;
    }

    // Add class filter
    if (classId && classId !== "all") {
      query.currentClass = classId;
    }

    // Add parent filter
    if (parentId && parentId !== "all") {
      query.parents = parentId;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const children = await Child.find(query)
      .populate("parents", "firstName lastName email phone")
      .populate("currentClass", "name")
      .populate("emergencyContacts")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalChildren = await Child.countDocuments(query);
    const totalPages = Math.ceil(totalChildren / parseInt(limit));

    res.json({
      status: "success",
      data: {
        children,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalChildren,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  })
);

// @route   GET /api/children/:id
// @desc    Get child by ID
// @access  Private
router.get(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const child = await Child.findById(req.params.id)
      .populate("parents", "firstName lastName email phone")
      .populate("currentClass", "name")
      .populate("emergencyContacts")
      .populate("createdBy", "firstName lastName")
      .populate("updatedBy", "firstName lastName");

    if (!child) {
      return res.status(404).json({
        status: "error",
        message: "Child not found",
      });
    }

    // Check if user has access to this child (either through center or direct relationship)
    if (req.user.center) {
      const parentsInCenter = await User.find({ center: req.user.center }).select('_id');
      const parentIds = parentsInCenter.map(p => p._id);
      if (!child.parents.some(parent => parentIds.includes(parent._id))) {
        return res.status(403).json({
          status: "error",
          message: "Access denied to this child",
        });
      }
    }

    res.json({
      status: "success",
      data: {
        child,
      },
    });
  })
);

// @route   POST /api/children
// @desc    Create new child
// @access  Private (Admin/Teacher)
router.post(
  "/",
  authenticateToken,
  validateChildCreation,
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
      dateOfBirth,
      gender,
      parents,
      emergencyContacts,
      enrollmentStatus,
      currentClass,
      health,
      dietary,
      sleep,
      behavior,
      specialNeeds,
      notes,
    } = req.body;

    // Clean up empty values
    const cleanData = {
      firstName,
      lastName,
      dateOfBirth,
      gender,
      parents,
      emergencyContacts: emergencyContacts || [],
      enrollmentStatus,
      currentClass: currentClass || undefined, // Convert empty string to undefined
      health: health || {},
      dietary: dietary || {},
      sleep: sleep || {},
      behavior: behavior || {},
      specialNeeds: specialNeeds || {},
      notes: notes ? [{ content: notes, author: req.user._id, date: new Date(), category: "general" }] : [],
    };

    // Check if parents exist and belong to the same center as the user
    if (req.user.center) {
      const parentsInCenter = await User.find({ 
        _id: { $in: parents }, 
        center: req.user.center 
      });
      
      if (parentsInCenter.length !== parents.length) {
        return res.status(400).json({
          status: "error",
          message: "Some parents do not belong to your center",
        });
      }
    }

    // Create new child
    const child = new Child({
      ...cleanData,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    await child.save();

    // Populate the created child for response
    const populatedChild = await Child.findById(child._id)
      .populate("parents", "firstName lastName email phone")
      .populate("currentClass", "name")
      .populate("emergencyContacts");

    res.status(201).json({
      status: "success",
      message: "Child created successfully",
      data: {
        child: populatedChild,
      },
    });
  })
);

// @route   PUT /api/children/:id
// @desc    Update child
// @access  Private (Admin/Teacher)
router.put(
  "/:id",
  authenticateToken,
  validateChildUpdate,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const child = await Child.findById(req.params.id);
    if (!child) {
      return res.status(404).json({
        status: "error",
        message: "Child not found",
      });
    }

    // Check if user has access to this child
    if (req.user.center) {
      const parentsInCenter = await User.find({ center: req.user.center }).select('_id');
      const parentIds = parentsInCenter.map(p => p._id);
      if (!child.parents.some(parent => parentIds.includes(parent))) {
        return res.status(403).json({
          status: "error",
          message: "Access denied to this child",
        });
      }
    }

    // Clean up empty values for update
    const updateData = { ...req.body };
    
    // Convert empty strings to undefined for ObjectId fields
    if (updateData.currentClass === "") {
      updateData.currentClass = undefined;
    }
    
    // Handle notes properly
    if (updateData.notes && typeof updateData.notes === "string") {
      updateData.notes = [{ 
        content: updateData.notes, 
        author: req.user._id, 
        date: new Date(), 
        category: "general" 
      }];
    }

    // Update child
    const updatedChild = await Child.findByIdAndUpdate(
      req.params.id,
      {
        ...updateData,
        updatedBy: req.user._id,
      },
      { new: true, runValidators: true }
    ).populate("parents", "firstName lastName email phone")
     .populate("currentClass", "name")
     .populate("emergencyContacts");

    res.json({
      status: "success",
      message: "Child updated successfully",
      data: {
        child: updatedChild,
      },
    });
  })
);

// @route   DELETE /api/children/:id
// @desc    Delete child (soft delete)
// @access  Private (Admin only)
router.delete(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Only administrators can delete children",
      });
    }

    const child = await Child.findById(req.params.id);
    if (!child) {
      return res.status(404).json({
        status: "error",
        message: "Child not found",
      });
    }

    // Check if user has access to this child
    if (req.user.center) {
      const parentsInCenter = await User.find({ center: req.user.center }).select('_id');
      const parentIds = parentsInCenter.map(p => p._id);
      if (!child.parents.some(parent => parentIds.includes(parent))) {
        return res.status(403).json({
          status: "error",
          message: "Access denied to this child",
        });
      }
    }

    // Soft delete by setting isActive to false
    await Child.findByIdAndUpdate(req.params.id, {
      isActive: false,
      updatedBy: req.user._id,
    });

    res.json({
      status: "success",
      message: "Child deleted successfully",
    });
  })
);

// @route   GET /api/children/stats/summary
// @desc    Get children statistics summary
// @access  Private
router.get(
  "/stats/summary",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { centerId } = req.query;
    
    // Build query based on center
    let query = { isActive: true };
    
    if (centerId || req.user.center) {
      const targetCenter = centerId || req.user.center;
      const parentsInCenter = await User.find({ center: targetCenter }).select('_id');
      const parentIds = parentsInCenter.map(p => p._id);
      query.parents = { $in: parentIds };
    }

    const [
      totalChildren,
      activeChildren,
      waitlistedChildren,
      withdrawnChildren,
      graduatedChildren,
      childrenWithAllergies,
    ] = await Promise.all([
      Child.countDocuments(query),
      Child.countDocuments({ ...query, enrollmentStatus: "enrolled" }),
      Child.countDocuments({ ...query, enrollmentStatus: "waitlisted" }),
      Child.countDocuments({ ...query, enrollmentStatus: "withdrawn" }),
      Child.countDocuments({ ...query, enrollmentStatus: "graduated" }),
      Child.countDocuments({
        ...query,
        "health.allergies": { $exists: true, $ne: [] },
      }),
    ]);

    res.json({
      status: "success",
      data: {
        totalChildren,
        activeChildren,
        waitlistedChildren,
        withdrawnChildren,
        graduatedChildren,
        childrenWithAllergies,
      },
    });
  })
);

export default router;
