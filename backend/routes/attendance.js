import express from "express";
import { body, validationResult } from "express-validator";
import Attendance from "../models/Attendance.js";
import Child from "../models/Child.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Validation middleware
const validateAttendanceCreation = [
  body("childId")
    .isMongoId()
    .withMessage("Invalid child ID"),
  body("classId")
    .isMongoId()
    .withMessage("Invalid class ID"),
  body("date")
    .isISO8601()
    .withMessage("Date must be a valid date"),
  body("status")
    .isIn(["present", "absent", "late", "excused"])
    .withMessage("Invalid attendance status"),
  body("checkInTime")
    .optional()
    .isISO8601()
    .withMessage("Check-in time must be a valid date"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
];

const validateBulkAttendance = [
  body("classId")
    .isMongoId()
    .withMessage("Invalid class ID"),
  body("date")
    .isISO8601()
    .withMessage("Date must be a valid date"),
  body("attendance")
    .isArray({ min: 1 })
    .withMessage("Attendance array is required"),
  body("attendance.*.childId")
    .isMongoId()
    .withMessage("Invalid child ID"),
  body("attendance.*.status")
    .isIn(["present", "absent", "late", "excused"])
    .withMessage("Invalid attendance status"),
];

const validateCheckout = [
  body("checkOutTime")
    .isISO8601()
    .withMessage("Check-out time must be a valid date"),
  body("notes")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Notes cannot exceed 500 characters"),
];

// @route   GET /api/parent/attendance
// @desc    Get attendance records for parent
// @access  Private
router.get(
  "/parent/attendance",
  authenticateToken,
  asyncHandler(async (req, res) => {
    // Check if user is parent
    if (req.user.role !== "parent") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Parent privileges required.",
      });
    }

    const { childId, date, startDate, endDate } = req.query;
    
    // Get children of the parent
    const children = await Child.find({ 
      parentId: req.user._id,
      isActive: true 
    }).select("_id");
    
    const childIds = children.map(child => child._id);
    
    let query = {
      child: { $in: childIds },
      isActive: true,
    };

    if (childId) {
      query.child = childId;
    }

    if (date) {
      const startOfDay = new Date(date);
      const endOfDay = new Date(date);
      endOfDay.setDate(endOfDay.getDate() + 1);
      query.date = { $gte: startOfDay, $lt: endOfDay };
    } else if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const attendanceRecords = await Attendance.find(query)
      .populate("child", "firstName lastName profilePicture")
      .populate("classId", "name")
      .populate("recordedBy", "firstName lastName")
      .sort({ date: -1, checkInTime: 1 });

    res.json({
      status: "success",
      message: "Attendance records retrieved successfully",
      data: attendanceRecords,
    });
  })
);

// @route   GET /api/teacher/attendance
// @desc    Get attendance records for teacher
// @access  Private
router.get(
  "/teacher/attendance",
  authenticateToken,
  asyncHandler(async (req, res) => {
    // Check if user is teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Teacher privileges required.",
      });
    }

    const { date, page = 1, limit = 10 } = req.query;

    // Validate required parameters
    if (!date) {
      return res.status(400).json({
        status: "error",
        message: "date is required",
      });
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const startOfDay = new Date(date);
    const endOfDay = new Date(date);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const attendanceRecords = await Attendance.find({
      centerId: req.user.center,
      date: { $gte: startOfDay, $lt: endOfDay },
      isActive: true,
    })
      .populate("child", "firstName lastName profilePicture")
      .populate("classId", "name")
      .populate("recordedBy", "firstName lastName email role")
      .sort({ checkInTime: 1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalRecords = await Attendance.countDocuments({
      centerId: req.user.center,
      date: { $gte: startOfDay, $lt: endOfDay },
      isActive: true,
    });
    const totalPages = Math.ceil(totalRecords / parseInt(limit));

    res.json({
      status: "success",
      message: "Attendance retrieved successfully",
      data: {
        attendance: attendanceRecords.map(record => ({
          _id: record._id,
          child: {
            _id: record.child._id,
            firstName: record.child.firstName,
            lastName: record.child.lastName,
            age: record.child.age,
            parentId: record.child.parentId,
            centerId: record.child.centerId,
            profilePicture: record.child.profilePicture,
          },
          classId: record.classId,
          date: record.date,
          status: record.status,
          checkInTime: record.checkInTime,
          checkOutTime: record.checkOutTime,
          notes: record.notes,
          recordedBy: record.recordedBy,
          createdAt: record.createdAt,
          updatedAt: record.updatedAt,
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalRecords,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1,
        },
      },
    });
  })
);

// @route   POST /api/attendance
// @desc    Record attendance
// @access  Private (Teacher/Admin)
router.post(
  "/",
  authenticateToken,
  validateAttendanceCreation,
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

    const { childId, classId, date, status, checkInTime, notes } = req.body;

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

    // Check if attendance record already exists for this child on this date
    const existingRecord = await Attendance.findOne({
      child: childId,
      date: { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000) },
      isActive: true,
    });

    if (existingRecord) {
      return res.status(409).json({
        status: "error",
        message: "Attendance record already exists for this child on this date",
      });
    }

    // Create new attendance record
    const attendanceRecord = new Attendance({
      child: childId,
      classId,
      centerId: req.user.center,
      date,
      status,
      checkInTime: checkInTime || (status === "present" ? new Date() : null),
      notes,
      recordedBy: req.user._id,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    await attendanceRecord.save();

    // Populate the created attendance record for response
    const populatedRecord = await Attendance.findById(attendanceRecord._id)
      .populate("child", "firstName lastName profilePicture")
      .populate("classId", "name")
      .populate("recordedBy", "firstName lastName");

    res.status(201).json({
      status: "success",
      message: "Attendance recorded successfully",
      data: {
        _id: populatedRecord._id,
        childId: populatedRecord.child._id,
        classId: populatedRecord.classId,
        date: populatedRecord.date,
        status: populatedRecord.status,
        checkInTime: populatedRecord.checkInTime,
        checkOutTime: populatedRecord.checkOutTime,
        notes: populatedRecord.notes,
        recordedBy: populatedRecord.recordedBy._id,
        createdAt: populatedRecord.createdAt,
        updatedAt: populatedRecord.updatedAt,
      },
    });
  })
);

// @route   POST /api/attendance/bulk
// @desc    Bulk attendance update
// @access  Private (Teacher/Admin)
router.post(
  "/bulk",
  authenticateToken,
  validateBulkAttendance,
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

    const { classId, date, attendance } = req.body;

    // Get all children in the class
    const children = await Child.find({ 
      currentClass: classId,
      centerId: req.user.center,
      isActive: true 
    });

    const childIds = children.map(child => child._id);

    // Validate that all children in attendance belong to the class
    const attendanceChildIds = attendance.map(a => a.childId);
    const invalidChildren = attendanceChildIds.filter(id => !childIds.includes(id));
    
    if (invalidChildren.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "Some children do not belong to this class",
      });
    }

    // Process bulk attendance
    const attendanceRecords = [];
    const bulkErrors = [];

    for (const attendanceItem of attendance) {
      try {
        // Check if attendance record already exists
        const existingRecord = await Attendance.findOne({
          child: attendanceItem.childId,
          date: { $gte: new Date(date), $lt: new Date(new Date(date).getTime() + 24 * 60 * 60 * 1000) },
          isActive: true,
        });

        if (existingRecord) {
          // Update existing record
          const updatedRecord = await Attendance.findByIdAndUpdate(
            existingRecord._id,
            {
              status: attendanceItem.status,
              checkInTime: attendanceItem.checkInTime || (attendanceItem.status === "present" ? new Date() : existingRecord.checkInTime),
              notes: attendanceItem.notes || existingRecord.notes,
              updatedBy: req.user._id,
            },
            { new: true }
          );
          attendanceRecords.push(updatedRecord);
        } else {
          // Create new record
          const newRecord = new Attendance({
            child: attendanceItem.childId,
            classId,
            centerId: req.user.center,
            date,
            status: attendanceItem.status,
            checkInTime: attendanceItem.checkInTime || (attendanceItem.status === "present" ? new Date() : null),
            notes: attendanceItem.notes,
            recordedBy: req.user._id,
            createdBy: req.user._id,
            updatedBy: req.user._id,
          });
          await newRecord.save();
          attendanceRecords.push(newRecord);
        }
      } catch (error) {
        bulkErrors.push({
          childId: attendanceItem.childId,
          error: error.message,
        });
      }
    }

    // Populate attendance records for response
    const populatedRecords = await Attendance.find({
      _id: { $in: attendanceRecords.map(r => r._id) },
    })
      .populate("child", "firstName lastName profilePicture")
      .populate("classId", "name")
      .populate("recordedBy", "firstName lastName");

    res.status(201).json({
      status: "success",
      message: "Bulk attendance updated successfully",
      data: {
        attendanceRecords: populatedRecords,
        errors: bulkErrors.length > 0 ? bulkErrors : undefined,
      },
    });
  })
);

// @route   PUT /api/attendance/:attendanceId/checkout
// @desc    Check out child
// @access  Private (Teacher/Admin)
router.put(
  "/:attendanceId/checkout",
  authenticateToken,
  validateCheckout,
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

    const { attendanceId } = req.params;
    const { checkOutTime, notes } = req.body;

    const attendanceRecord = await Attendance.findById(attendanceId);
    if (!attendanceRecord) {
      return res.status(404).json({
        status: "error",
        message: "Attendance record not found",
      });
    }

    // Check if user has access to this attendance record
    if (attendanceRecord.centerId.toString() !== req.user.center.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Access denied to this attendance record",
      });
    }

    // Validate that check-out time is after check-in time
    if (attendanceRecord.checkInTime && new Date(checkOutTime) <= attendanceRecord.checkInTime) {
      return res.status(400).json({
        status: "error",
        message: "Check-out time must be after check-in time",
      });
    }

    // Update attendance record
    const updatedRecord = await Attendance.findByIdAndUpdate(
      attendanceId,
      {
        checkOutTime,
        notes: notes || attendanceRecord.notes,
        updatedBy: req.user._id,
      },
      { new: true, runValidators: true }
    )
      .populate("child", "firstName lastName profilePicture")
      .populate("classId", "name")
      .populate("recordedBy", "firstName lastName");

    res.json({
      status: "success",
      message: "Child checked out successfully",
      data: {
        attendanceRecord: updatedRecord,
      },
    });
  })
);

export default router;