import express from "express";
import { body, validationResult } from "express-validator";
import multer from "multer";
import path from "path";
import Activity from "../models/Activity.js";
import Child from "../models/Child.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/activities/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
});

// Validation middleware
const validateActivityCreation = [
  body("title")
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title is required and must be less than 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),
  body("startTime")
    .isISO8601()
    .withMessage("Start time must be a valid date"),
  body("endTime")
    .isISO8601()
    .withMessage("End time must be a valid date"),
  body("type")
    .isIn(["academic", "play", "meal", "nap", "outdoor", "art", "music", "other"])
    .withMessage("Invalid activity type"),
  body("childrenInvolved")
    .optional()
    .isArray()
    .withMessage("Children involved must be an array"),
  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location must be less than 100 characters"),
  body("materials")
    .optional()
    .isArray()
    .withMessage("Materials must be an array"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must be less than 500 characters"),
];

const validateActivityUpdate = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage("Title must be less than 100 characters"),
  body("description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Description must be less than 500 characters"),
  body("startTime")
    .optional()
    .isISO8601()
    .withMessage("Start time must be a valid date"),
  body("endTime")
    .optional()
    .isISO8601()
    .withMessage("End time must be a valid date"),
  body("type")
    .optional()
    .isIn(["academic", "play", "meal", "nap", "outdoor", "art", "music", "other"])
    .withMessage("Invalid activity type"),
  body("status")
    .optional()
    .isIn(["scheduled", "in_progress", "completed", "cancelled"])
    .withMessage("Invalid activity status"),
  body("childrenInvolved")
    .optional()
    .isArray()
    .withMessage("Children involved must be an array"),
  body("location")
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage("Location must be less than 100 characters"),
  body("materials")
    .optional()
    .isArray()
    .withMessage("Materials must be an array"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes must be less than 500 characters"),
];

const validateActivityUpdateCreation = [
  body("message")
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage("Message is required and must be less than 500 characters"),
  body("childId")
    .optional()
    .isMongoId()
    .withMessage("Invalid child ID"),
  body("attachments")
    .optional()
    .isArray()
    .withMessage("Attachments must be an array"),
];

// @route   GET /api/activities
// @desc    Get all activities with filtering and pagination
// @access  Private
router.get(
  "/",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { 
      page = 1, 
      limit = 10, 
      search = "", 
      type = "", 
      status = "",
      teacherId = "",
      centerId = "",
      startDate = "",
      endDate = ""
    } = req.query;

    // Build query
    let query = { isActive: true };
    
    // Filter by center
    if (centerId) {
      query.centerId = centerId;
    } else if (req.user.center) {
      query.centerId = req.user.center;
    }

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Add type filter
    if (type && type !== "all") {
      query.type = type;
    }

    // Add status filter
    if (status && status !== "all") {
      query.status = status;
    }

    // Add teacher filter
    if (teacherId && teacherId !== "all") {
      query.teacherId = teacherId;
    }

    // Add date range filter
    if (startDate && endDate) {
      query.startTime = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const activities = await Activity.find(query)
      .populate("childrenInvolved", "firstName lastName profilePicture")
      .populate("teacherId", "firstName lastName profilePicture")
      .populate("updates.childId", "firstName lastName")
      .populate("updates.teacherId", "firstName lastName")
      .sort({ startTime: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalActivities = await Activity.countDocuments(query);
    const totalPages = Math.ceil(totalActivities / parseInt(limit));

    res.json({
      status: "success",
      message: "Activities retrieved successfully",
      data: {
        activities,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalActivities,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  })
);

// @route   GET /api/activities/:id
// @desc    Get activity by ID
// @access  Private
router.get(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const activity = await Activity.findById(req.params.id)
      .populate("childrenInvolved", "firstName lastName profilePicture")
      .populate("teacherId", "firstName lastName profilePicture")
      .populate("updates.childId", "firstName lastName")
      .populate("updates.teacherId", "firstName lastName");

    if (!activity) {
      return res.status(404).json({
        status: "error",
        message: "Activity not found",
      });
    }

    // Check if user has access to this activity
    if (req.user.role === "parent") {
      const children = await Child.find({ 
        parentId: req.user._id,
        isActive: true 
      }).select("_id");
      
      const childIds = children.map(child => child._id);
      if (!activity.childrenInvolved.some(child => childIds.includes(child._id))) {
        return res.status(403).json({
          status: "error",
          message: "Access denied to this activity",
        });
      }
    } else if (req.user.role === "teacher" && activity.teacherId._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Access denied to this activity",
      });
    }

    res.json({
      status: "success",
      message: "Activity retrieved successfully",
      data: {
        activity,
      },
    });
  })
);

// @route   POST /api/activities
// @desc    Create new activity
// @access  Private (Teacher/Admin)
router.post(
  "/",
  authenticateToken,
  validateActivityCreation,
  asyncHandler(async (req, res) => {
    // Check if user is teacher or admin
    if (!["teacher", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Teacher or admin privileges required.",
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const {
      title,
      description,
      startTime,
      endTime,
      type,
      childrenInvolved,
      location,
      materials,
      notes,
    } = req.body;

    // Validate that end time is after start time
    if (new Date(endTime) <= new Date(startTime)) {
      return res.status(400).json({
        status: "error",
        message: "End time must be after start time",
      });
    }

    // Check if children belong to the same center
    if (childrenInvolved && childrenInvolved.length > 0) {
      const children = await Child.find({ 
        _id: { $in: childrenInvolved },
        centerId: req.user.center 
      });
      
      if (children.length !== childrenInvolved.length) {
        return res.status(400).json({
          status: "error",
          message: "Some children do not belong to your center",
        });
      }
    }

    // Create new activity
    const activity = new Activity({
      title,
      description,
      startTime,
      endTime,
      type,
      childrenInvolved: childrenInvolved || [],
      teacherId: req.user._id,
      centerId: req.user.center,
      location,
      materials: materials || [],
      notes,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    await activity.save();

    // Populate the created activity for response
    const populatedActivity = await Activity.findById(activity._id)
      .populate("childrenInvolved", "firstName lastName profilePicture")
      .populate("teacherId", "firstName lastName profilePicture");

    res.status(201).json({
      status: "success",
      message: "Activity created successfully",
      data: {
        activity: populatedActivity,
      },
    });
  })
);

// @route   PUT /api/activities/:id
// @desc    Update activity
// @access  Private (Teacher/Admin)
router.put(
  "/:id",
  authenticateToken,
  validateActivityUpdate,
  asyncHandler(async (req, res) => {
    // Check if user is teacher or admin
    if (!["teacher", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Teacher or admin privileges required.",
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({
        status: "error",
        message: "Activity not found",
      });
    }

    // Check if user has access to this activity
    if (req.user.role === "teacher" && activity.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Access denied to this activity",
      });
    }

    // Validate that end time is after start time if both are provided
    if (req.body.startTime && req.body.endTime) {
      if (new Date(req.body.endTime) <= new Date(req.body.startTime)) {
        return res.status(400).json({
          status: "error",
          message: "End time must be after start time",
        });
      }
    }

    // Update activity
    const updatedActivity = await Activity.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id,
      },
      { new: true, runValidators: true }
    )
      .populate("childrenInvolved", "firstName lastName profilePicture")
      .populate("teacherId", "firstName lastName profilePicture");

    res.json({
      status: "success",
      message: "Activity updated successfully",
      data: {
        activity: updatedActivity,
      },
    });
  })
);

// @route   POST /api/activities/:activityId/updates
// @desc    Add activity update
// @access  Private (Teacher/Admin)
router.post(
  "/:activityId/updates",
  authenticateToken,
  validateActivityUpdateCreation,
  asyncHandler(async (req, res) => {
    // Check if user is teacher or admin
    if (!["teacher", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Teacher or admin privileges required.",
      });
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { activityId } = req.params;
    const { message, childId, attachments } = req.body;

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({
        status: "error",
        message: "Activity not found",
      });
    }

    // Check if user has access to this activity
    if (req.user.role === "teacher" && activity.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Access denied to this activity",
      });
    }

    // Create activity update
    const activityUpdate = {
      activityId: activity._id,
      message,
      childId: childId || null,
      teacherId: req.user._id,
      attachments: attachments || [],
      createdAt: new Date(),
    };

    // Add update to activity
    activity.updates.push(activityUpdate);
    await activity.save();

    // Populate the updated activity for response
    const populatedActivity = await Activity.findById(activity._id)
      .populate("childrenInvolved", "firstName lastName profilePicture")
      .populate("teacherId", "firstName lastName profilePicture")
      .populate("updates.childId", "firstName lastName")
      .populate("updates.teacherId", "firstName lastName");

    res.status(201).json({
      status: "success",
      message: "Activity update added successfully",
      data: {
        activity: populatedActivity,
        update: activityUpdate,
      },
    });
  })
);

// @route   POST /api/activities/photos
// @desc    Upload activity photo
// @access  Private (Teacher/Admin)
router.post(
  "/photos",
  authenticateToken,
  upload.single("photo"),
  asyncHandler(async (req, res) => {
    // Check if user is teacher or admin
    if (!["teacher", "admin"].includes(req.user.role)) {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Teacher or admin privileges required.",
      });
    }

    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "No photo file provided",
      });
    }

    const { activityId, childId, description } = req.body;

    if (!activityId) {
      return res.status(400).json({
        status: "error",
        message: "Activity ID is required",
      });
    }

    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({
        status: "error",
        message: "Activity not found",
      });
    }

    // Check if user has access to this activity
    if (req.user.role === "teacher" && activity.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Access denied to this activity",
      });
    }

    // Add photo to activity
    const photo = {
      url: `/uploads/activities/${req.file.filename}`,
      caption: description || "",
      childId: childId || null,
      uploadedBy: req.user._id,
      uploadedAt: new Date(),
    };

    activity.photos.push(photo);
    await activity.save();

    res.json({
      status: "success",
      message: "Activity photo uploaded successfully",
      data: {
        url: `/uploads/activities/${req.file.filename}`,
        photo,
      },
    });
  })
);

// @route   DELETE /api/activities/:id
// @desc    Delete activity (soft delete)
// @access  Private (Admin only)
router.delete(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Only administrators can delete activities",
      });
    }

    const activity = await Activity.findById(req.params.id);
    if (!activity) {
      return res.status(404).json({
        status: "error",
        message: "Activity not found",
      });
    }

    // Soft delete by setting isActive to false
    await Activity.findByIdAndUpdate(req.params.id, {
      isActive: false,
      updatedBy: req.user._id,
    });

    res.json({
      status: "success",
      message: "Activity deleted successfully",
    });
  })
);

export default router;