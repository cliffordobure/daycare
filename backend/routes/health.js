import express from "express";
import { body, validationResult } from "express-validator";
import HealthRecord from "../models/HealthRecord.js";
import Child from "../models/Child.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Validation middleware
const validateHealthRecordCreation = [
  body("childId")
    .isMongoId()
    .withMessage("Invalid child ID"),
  body("date")
    .optional()
    .isISO8601()
    .withMessage("Date must be a valid date"),
  body("temperature.value")
    .optional()
    .isNumeric()
    .withMessage("Temperature must be a number"),
  body("temperature.unit")
    .optional()
    .isIn(["celsius", "fahrenheit"])
    .withMessage("Temperature unit must be celsius or fahrenheit"),
  body("symptoms")
    .optional()
    .isArray()
    .withMessage("Symptoms must be an array"),
  body("observations")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Observations cannot exceed 500 characters"),
  body("medications")
    .optional()
    .isArray()
    .withMessage("Medications must be an array"),
  body("meals")
    .optional()
    .isArray()
    .withMessage("Meals must be an array"),
  body("sleep.napTimes")
    .optional()
    .isArray()
    .withMessage("Nap times must be an array"),
  body("behavior.mood")
    .optional()
    .isIn(["very_sad", "sad", "neutral", "happy", "very_happy"])
    .withMessage("Invalid mood value"),
  body("behavior.energyLevel")
    .optional()
    .isIn(["very_low", "low", "normal", "high", "very_high"])
    .withMessage("Invalid energy level value"),
  body("behavior.socialInteraction")
    .optional()
    .isIn(["withdrawn", "minimal", "normal", "active", "very_active"])
    .withMessage("Invalid social interaction value"),
  body("incidents")
    .optional()
    .isArray()
    .withMessage("Incidents must be an array"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage("Notes cannot exceed 1000 characters"),
];

// @route   GET /api/health/records
// @desc    Get health records
// @access  Private
router.get(
  "/records",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { childId, date, startDate, endDate } = req.query;

    let query = { isActive: true };

    // Filter by child
    if (childId) {
      query.childId = childId;
    } else if (req.user.role === "parent") {
      // Get children of the parent
      const children = await Child.find({ 
        parentId: req.user._id,
        isActive: true 
      }).select("_id");
      
      const childIds = children.map(child => child._id);
      query.childId = { $in: childIds };
    } else if (req.user.role === "teacher") {
      // Get children in teacher's center
      const children = await Child.find({ 
        centerId: req.user.center,
        isActive: true 
      }).select("_id");
      
      const childIds = children.map(child => child._id);
      query.childId = { $in: childIds };
    }

    // Filter by center for teachers/admins
    if (req.user.center) {
      query.centerId = req.user.center;
    }

    // Filter by date
    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setDate(endOfDay.getDate() + 1);
      query.date = { $gte: startOfDay, $lt: endOfDay };
    } else if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const healthRecords = await HealthRecord.find(query)
      .populate("childId", "firstName lastName profilePicture")
      .populate("recordedBy", "firstName lastName")
      .sort({ date: -1 });

    res.json({
      status: "success",
      message: "Health records retrieved successfully",
      data: healthRecords,
    });
  })
);

// @route   GET /api/health/records/:id
// @desc    Get health record by ID
// @access  Private
router.get(
  "/records/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const healthRecord = await HealthRecord.findById(req.params.id)
      .populate("childId", "firstName lastName profilePicture")
      .populate("recordedBy", "firstName lastName");

    if (!healthRecord) {
      return res.status(404).json({
        status: "error",
        message: "Health record not found",
      });
    }

    // Check if user has access to this health record
    if (req.user.role === "parent") {
      const children = await Child.find({ 
        parentId: req.user._id,
        isActive: true 
      }).select("_id");
      
      const childIds = children.map(child => child._id);
      if (!childIds.includes(healthRecord.childId._id)) {
        return res.status(403).json({
          status: "error",
          message: "Access denied to this health record",
        });
      }
    } else if (req.user.role === "teacher" && healthRecord.centerId.toString() !== req.user.center.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Access denied to this health record",
      });
    }

    res.json({
      status: "success",
      message: "Health record retrieved successfully",
      data: {
        healthRecord,
      },
    });
  })
);

// @route   POST /api/health/records
// @desc    Create health record
// @access  Private (Teacher/Admin)
router.post(
  "/records",
  authenticateToken,
  validateHealthRecordCreation,
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
      childId,
      date,
      temperature,
      bloodPressure,
      heartRate,
      respiratoryRate,
      symptoms,
      observations,
      medications,
      meals,
      sleep,
      behavior,
      physicalActivity,
      incidents,
      notes,
    } = req.body;

    // Check if child exists and belongs to the center
    const child = await Child.findById(childId);
    if (!child) {
      return res.status(404).json({
        status: "error",
        message: "Child not found",
      });
    }

    if (child.centerId.toString() !== req.user.center.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Child does not belong to your center",
      });
    }

    // Create new health record
    const healthRecord = new HealthRecord({
      childId,
      centerId: req.user.center,
      date: date || new Date(),
      temperature,
      bloodPressure,
      heartRate,
      respiratoryRate,
      symptoms: symptoms || [],
      observations,
      medications: medications || [],
      meals: meals || [],
      sleep: sleep || {},
      behavior: behavior || {},
      physicalActivity: physicalActivity || {},
      incidents: incidents || [],
      notes,
      recordedBy: req.user._id,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    await healthRecord.save();

    // Populate the created health record for response
    const populatedRecord = await HealthRecord.findById(healthRecord._id)
      .populate("childId", "firstName lastName profilePicture")
      .populate("recordedBy", "firstName lastName");

    res.status(201).json({
      status: "success",
      message: "Health record created successfully",
      data: {
        healthRecord: populatedRecord,
      },
    });
  })
);

// @route   PUT /api/health/records/:id
// @desc    Update health record
// @access  Private (Teacher/Admin)
router.put(
  "/records/:id",
  authenticateToken,
  validateHealthRecordCreation,
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

    const healthRecord = await HealthRecord.findById(req.params.id);
    if (!healthRecord) {
      return res.status(404).json({
        status: "error",
        message: "Health record not found",
      });
    }

    // Check if user has access to this health record
    if (healthRecord.centerId.toString() !== req.user.center.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Access denied to this health record",
      });
    }

    // Update health record
    const updatedRecord = await HealthRecord.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        updatedBy: req.user._id,
      },
      { new: true, runValidators: true }
    )
      .populate("childId", "firstName lastName profilePicture")
      .populate("recordedBy", "firstName lastName");

    res.json({
      status: "success",
      message: "Health record updated successfully",
      data: {
        healthRecord: updatedRecord,
      },
    });
  })
);

// @route   DELETE /api/health/records/:id
// @desc    Delete health record (soft delete)
// @access  Private (Admin only)
router.delete(
  "/records/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({
        status: "error",
        message: "Only administrators can delete health records",
      });
    }

    const healthRecord = await HealthRecord.findById(req.params.id);
    if (!healthRecord) {
      return res.status(404).json({
        status: "error",
        message: "Health record not found",
      });
    }

    // Soft delete by setting isActive to false
    await HealthRecord.findByIdAndUpdate(req.params.id, {
      isActive: false,
      updatedBy: req.user._id,
    });

    res.json({
      status: "success",
      message: "Health record deleted successfully",
    });
  })
);

// @route   GET /api/health/stats
// @desc    Get health statistics
// @access  Private
router.get(
  "/stats",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { startDate, endDate } = req.query;

    let query = { isActive: true };

    // Filter by center for teachers/admins
    if (req.user.center) {
      query.centerId = req.user.center;
    }

    // Filter by date range
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    // Get health statistics
    const stats = await HealthRecord.getHealthStats(
      req.user.center,
      new Date(startDate || new Date().getTime() - 30 * 24 * 60 * 60 * 1000),
      new Date(endDate || new Date())
    );

    res.json({
      status: "success",
      message: "Health statistics retrieved successfully",
      data: stats[0] || {
        totalRecords: 0,
        childrenWithSymptoms: 0,
        childrenWithMedications: 0,
        totalIncidents: 0,
        averageTemperature: 0,
      },
    });
  })
);

export default router;