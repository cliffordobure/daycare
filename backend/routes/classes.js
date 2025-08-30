import express from "express";
import { body, validationResult } from "express-validator";
import Class from "../models/Class.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Validation middleware
const validateClassCreation = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Class name must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("ageGroup.minAge")
    .isInt({ min: 0 })
    .withMessage("Minimum age must be a non-negative integer"),
  body("ageGroup.maxAge")
    .isInt({ min: 0 })
    .withMessage("Maximum age must be a non-negative integer"),
  body("capacity")
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive integer"),
  body("schedule.days")
    .isArray({ min: 1 })
    .withMessage("At least one day must be selected"),
  body("schedule.days.*")
    .isIn(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"])
    .withMessage("Invalid day selected"),
  body("schedule.startTime")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("Start time must be in HH:MM format"),
  body("schedule.endTime")
    .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
    .withMessage("End time must be in HH:MM format"),
  body("schedule.duration")
    .isInt({ min: 15 })
    .withMessage("Duration must be at least 15 minutes"),
  body("teachers")
    .isArray({ min: 1 })
    .withMessage("At least one teacher is required"),
  body("teachers.*")
    .isMongoId()
    .withMessage("Invalid teacher ID format"),
  body("academicYear")
    .trim()
    .notEmpty()
    .withMessage("Academic year is required"),
  body("startDate")
    .isISO8601()
    .withMessage("Start date must be a valid date"),
  body("endDate")
    .isISO8601()
    .withMessage("End date must be a valid date"),
  body("tuition.monthly")
    .isFloat({ min: 0 })
    .withMessage("Monthly tuition must be a non-negative number"),
];

const validateClassUpdate = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Class name must be between 2 and 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),
  body("ageGroup.minAge")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Minimum age must be a non-negative integer"),
  body("ageGroup.maxAge")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Maximum age must be a non-negative integer"),
  body("capacity")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Capacity must be a positive integer"),
  body("status")
    .optional()
    .isIn(["active", "inactive", "full", "waitlist"])
    .withMessage("Invalid status"),
];

// @route   GET /api/classes
// @desc    Get all classes with filtering and pagination
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
      ageGroup = "",
      term = "",
      centerId = ""
    } = req.query;

    // Build query based on user's center
    let query = { isActive: true };
    
    // If centerId is provided, filter by center through teachers
    if (centerId) {
      const teachersInCenter = await User.find({ center: centerId, role: "teacher" }).select('_id');
      const teacherIds = teachersInCenter.map(t => t._id);
      query.$or = [
        { teachers: { $in: teacherIds } },
        { assistants: { $in: teacherIds } }
      ];
    } else if (req.user.center) {
      // If no centerId but user has a center, filter by user's center
      const teachersInCenter = await User.find({ center: req.user.center, role: "teacher" }).select('_id');
      const teacherIds = teachersInCenter.map(t => t._id);
      query.$or = [
        { teachers: { $in: teacherIds } },
        { assistants: { $in: teacherIds } }
      ];
    }

    // Add search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Add status filter
    if (status && status !== "all") {
      query.status = status;
    }

    // Add age group filter
    if (ageGroup && ageGroup !== "all") {
      const [minAge, maxAge] = ageGroup.split("-").map(Number);
      if (minAge && maxAge) {
        query.$and = [
          { "ageGroup.minAge": { $lte: maxAge } },
          { "ageGroup.maxAge": { $gte: minAge } }
        ];
      }
    }

    // Add term filter
    if (term && term !== "all") {
      query.term = term;
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const classes = await Class.find(query)
      .populate("teachers", "firstName lastName email phone")
      .populate("assistants", "firstName lastName email phone")
      .populate("createdBy", "firstName lastName")
      .populate("updatedBy", "firstName lastName")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalClasses = await Class.countDocuments(query);
    const totalPages = Math.ceil(totalClasses / parseInt(limit));

    res.json({
      status: "success",
      data: {
        classes,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalClasses,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  })
);

// @route   GET /api/classes/:id
// @desc    Get class by ID
// @access  Private
router.get(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const classData = await Class.findById(req.params.id)
      .populate("teachers", "firstName lastName email phone")
      .populate("assistants", "firstName lastName email phone")
      .populate("createdBy", "firstName lastName")
      .populate("updatedBy", "firstName lastName");

    if (!classData) {
      return res.status(404).json({
        status: "error",
        message: "Class not found",
      });
    }

    // Check if user has access to this class (either through center or direct relationship)
    if (req.user.center) {
      const teachersInCenter = await User.find({ center: req.user.center, role: "teacher" }).select('_id');
      const teacherIds = teachersInCenter.map(t => t._id);
      const hasAccess = classData.teachers.some(teacher => teacherIds.includes(teacher._id)) ||
                       classData.assistants.some(assistant => teacherIds.includes(assistant._id));
      
      if (!hasAccess) {
        return res.status(403).json({
          status: "error",
          message: "Access denied to this class",
        });
      }
    }

    res.json({
      status: "success",
      data: {
        class: classData,
      },
    });
  })
);

// @route   POST /api/classes
// @desc    Create new class
// @access  Private (Admin/Teacher)
router.post(
  "/",
  authenticateToken,
  validateClassCreation,
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
      name,
      description,
      ageGroup,
      capacity,
      schedule,
      curriculum,
      learningObjectives,
      activities,
      materials,
      teachers,
      assistants,
      room,
      academicYear,
      term,
      startDate,
      endDate,
      tuition,
      policies,
      requirements,
      specialInstructions,
    } = req.body;

    // Check if teachers exist and belong to the same center as the user
    if (req.user.center) {
      const teachersInCenter = await User.find({ 
        _id: { $in: teachers }, 
        center: req.user.center,
        role: "teacher"
      });
      
      if (teachersInCenter.length !== teachers.length) {
        return res.status(400).json({
          status: "error",
          message: "Some teachers do not belong to your center",
        });
      }

      // Check assistants if provided
      if (assistants && assistants.length > 0) {
        const assistantsInCenter = await User.find({ 
          _id: { $in: assistants }, 
          center: req.user.center,
          role: "teacher"
        });
        
        if (assistantsInCenter.length !== assistants.length) {
          return res.status(400).json({
            status: "error",
            message: "Some assistants do not belong to your center",
          });
        }
      }
    }

    // Create new class
    const newClass = new Class({
      name,
      description,
      ageGroup,
      capacity,
      schedule,
      curriculum,
      learningObjectives,
      activities,
      materials,
      teachers,
      assistants,
      room,
      academicYear,
      term,
      startDate,
      endDate,
      tuition,
      policies,
      requirements,
      specialInstructions,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    await newClass.save();

    // Populate the created class for response
    const populatedClass = await Class.findById(newClass._id)
      .populate("teachers", "firstName lastName email phone")
      .populate("assistants", "firstName lastName email phone");

    res.status(201).json({
      status: "success",
      message: "Class created successfully",
      data: {
        class: populatedClass,
      },
    });
  })
);

// @route   PUT /api/classes/:id
// @desc    Update class
// @access  Private (Admin/Teacher)
router.put(
  "/:id",
  authenticateToken,
  validateClassUpdate,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({
        status: "error",
        message: "Class not found",
      });
    }

    // Check if user has access to this class
    if (req.user.center) {
      const teachersInCenter = await User.find({ center: req.user.center, role: "teacher" }).select('_id');
      const teacherIds = teachersInCenter.map(t => t._id);
      const hasAccess = classData.teachers.some(teacher => teacherIds.includes(teacher)) ||
                       classData.assistants.some(assistant => teacherIds.includes(assistant));
      
      if (!hasAccess) {
        return res.status(403).json({
          status: "error",
          message: "Access denied to this class",
        });
      }
    }

    // Update class
    const updatedClass = await Class.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id,
      },
      { new: true, runValidators: true }
    ).populate("teachers", "firstName lastName email phone")
     .populate("assistants", "firstName lastName email phone");

    res.json({
      status: "success",
      message: "Class updated successfully",
      data: {
        class: updatedClass,
      },
    });
  })
);

// @route   DELETE /api/classes/:id
// @desc    Delete class (soft delete)
// @access  Private (Admin only)
router.delete(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Only administrators can delete classes",
      });
    }

    const classData = await Class.findById(req.params.id);
    if (!classData) {
      return res.status(404).json({
        status: "error",
        message: "Class not found",
      });
    }

    // Check if user has access to this class
    if (req.user.center) {
      const teachersInCenter = await User.find({ center: req.user.center, role: "teacher" }).select('_id');
      const teacherIds = teachersInCenter.map(t => t._id);
      const hasAccess = classData.teachers.some(teacher => teacherIds.includes(teacher)) ||
                       classData.assistants.some(assistant => teacherIds.includes(assistant));
      
      if (!hasAccess) {
        return res.status(403).json({
          status: "error",
          message: "Access denied to this class",
        });
      }
    }

    // Soft delete by setting isActive to false
    await Class.findByIdAndUpdate(req.params.id, {
      isActive: false,
      updatedBy: req.user._id,
    });

    res.json({
      status: "success",
      message: "Class deleted successfully",
    });
  })
);

// @route   GET /api/classes/stats/summary
// @desc    Get class statistics summary
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
      const teachersInCenter = await User.find({ center: targetCenter, role: "teacher" }).select('_id');
      const teacherIds = teachersInCenter.map(t => t._id);
      query.$or = [
        { teachers: { $in: teacherIds } },
        { assistants: { $in: teacherIds } }
      ];
    }

    const [
      totalClasses,
      activeClasses,
      fullClasses,
      waitlistClasses,
      totalEnrollment,
      averageEnrollmentRate,
    ] = await Promise.all([
      Class.countDocuments(query),
      Class.countDocuments({ ...query, status: "active" }),
      Class.countDocuments({ ...query, status: "full" }),
      Class.countDocuments({ ...query, status: "waitlist" }),
      Class.aggregate([
        { $match: query },
        { $group: { _id: null, total: { $sum: "$currentEnrollment" } } }
      ]),
      Class.aggregate([
        { $match: query },
        { $group: { _id: null, average: { $avg: "$enrollmentRate" } } }
      ]),
    ]);

    res.json({
      status: "success",
      data: {
        totalClasses,
        activeClasses,
        fullClasses,
        waitlistClasses,
        totalEnrollment: totalEnrollment[0]?.total || 0,
        averageEnrollmentRate: Math.round(averageEnrollmentRate[0]?.average || 0),
      },
    });
  })
);

export default router;
