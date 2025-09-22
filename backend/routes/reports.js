import express from "express";
import Attendance from "../models/Attendance.js";
import Activity from "../models/Activity.js";
import Payment from "../models/Payment.js";
import Child from "../models/Child.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/reports/attendance
// @desc    Get attendance report
// @access  Private
router.get(
  "/attendance",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { childId, startDate, endDate, format = "json" } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        status: "error",
        message: "Start date and end date are required",
      });
    }

    let query = {
      date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      isActive: true,
    };

    // Filter by child
    if (childId) {
      query.child = childId;
    } else if (req.user.role === "parent") {
      // Get children of the parent
      const children = await Child.find({ 
        parentId: req.user._id,
        isActive: true 
      }).select("_id");
      
      const childIds = children.map(child => child._id);
      query.child = { $in: childIds };
    } else if (req.user.role === "teacher") {
      // Get children in teacher's center
      const children = await Child.find({ 
        centerId: req.user.center,
        isActive: true 
      }).select("_id");
      
      const childIds = children.map(child => child._id);
      query.child = { $in: childIds };
    }

    // Filter by center for teachers/admins
    if (req.user.center) {
      query.centerId = req.user.center;
    }

    const attendanceRecords = await Attendance.find(query)
      .populate("child", "firstName lastName")
      .populate("classId", "name")
      .sort({ date: 1 });

    // Calculate summary statistics
    const totalDays = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
    const presentDays = attendanceRecords.filter(record => record.status === "present").length;
    const absentDays = attendanceRecords.filter(record => record.status === "absent").length;
    const attendanceRate = totalDays > 0 ? presentDays / totalDays : 0;

    // Group by date for daily records
    const dailyRecords = [];
    const dateMap = new Map();

    attendanceRecords.forEach(record => {
      const dateStr = record.date.toISOString().split('T')[0];
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, {
          date: dateStr,
          status: record.status,
          checkInTime: record.checkInTime ? record.checkInTime.toTimeString().split(' ')[0] : null,
          checkOutTime: record.checkOutTime ? record.checkOutTime.toTimeString().split(' ')[0] : null,
        });
      }
    });

    // Fill in missing dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      if (!dateMap.has(dateStr)) {
        dateMap.set(dateStr, {
          date: dateStr,
          status: "absent",
          checkInTime: null,
          checkOutTime: null,
        });
      }
    }

    dailyRecords.push(...Array.from(dateMap.values()).sort((a, b) => a.date.localeCompare(b.date)));

    const reportData = {
      summary: {
        totalDays,
        presentDays,
        absentDays,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
      },
      dailyRecords,
    };

    if (format === "pdf" || format === "csv") {
      // For now, return JSON. In production, you would generate PDF/CSV files
      res.json({
        status: "success",
        message: "Attendance report generated successfully",
        data: reportData,
        note: `${format.toUpperCase()} format not implemented yet. Returning JSON format.`,
      });
    } else {
      res.json({
        status: "success",
        message: "Attendance report generated successfully",
        data: reportData,
      });
    }
  })
);

// @route   GET /api/reports/activities
// @desc    Get activity report
// @access  Private
router.get(
  "/activities",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { childId, startDate, endDate, type } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        status: "error",
        message: "Start date and end date are required",
      });
    }

    let query = {
      startTime: { $gte: new Date(startDate), $lte: new Date(endDate) },
      isActive: true,
    };

    // Filter by child
    if (childId) {
      query.childrenInvolved = childId;
    } else if (req.user.role === "parent") {
      // Get children of the parent
      const children = await Child.find({ 
        parentId: req.user._id,
        isActive: true 
      }).select("_id");
      
      const childIds = children.map(child => child._id);
      query.childrenInvolved = { $in: childIds };
    } else if (req.user.role === "teacher") {
      // Get activities by teacher
      query.teacherId = req.user._id;
    }

    // Filter by center for teachers/admins
    if (req.user.center) {
      query.centerId = req.user.center;
    }

    // Filter by activity type
    if (type) {
      query.type = type;
    }

    const activities = await Activity.find(query)
      .populate("childrenInvolved", "firstName lastName")
      .populate("teacherId", "firstName lastName")
      .sort({ startTime: 1 });

    // Calculate summary statistics
    const totalActivities = activities.length;
    const completedActivities = activities.filter(activity => activity.status === "completed").length;
    const cancelledActivities = activities.filter(activity => activity.status === "cancelled").length;
    const participationRate = totalActivities > 0 ? completedActivities / totalActivities : 0;

    const reportData = {
      summary: {
        totalActivities,
        completedActivities,
        cancelledActivities,
        participationRate: Math.round(participationRate * 100) / 100,
      },
      activities: activities.map(activity => ({
        _id: activity._id,
        title: activity.title,
        description: activity.description,
        startTime: activity.startTime,
        endTime: activity.endTime,
        status: activity.status,
        type: activity.type,
        childrenInvolved: activity.childrenInvolved,
        teacherId: activity.teacherId,
        centerId: activity.centerId,
        location: activity.location,
        materials: activity.materials,
        notes: activity.notes,
        updates: activity.updates,
        createdAt: activity.createdAt,
        updatedAt: activity.updatedAt,
      })),
    };

    res.json({
      status: "success",
      message: "Activity report generated successfully",
      data: reportData,
    });
  })
);

// @route   GET /api/reports/payments
// @desc    Get payment report
// @access  Private
router.get(
  "/payments",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { childId, startDate, endDate } = req.query;

    if (!startDate || !endDate) {
      return res.status(400).json({
        status: "error",
        message: "Start date and end date are required",
      });
    }

    let query = {
      createdAt: { $gte: new Date(startDate), $lte: new Date(endDate) },
      isActive: true,
    };

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

    const payments = await Payment.find(query)
      .populate("childId", "firstName lastName")
      .populate("centerId", "name")
      .sort({ createdAt: -1 });

    // Calculate summary statistics
    const totalAmount = payments.reduce((sum, payment) => sum + payment.totalAmount, 0);
    const paidAmount = payments.reduce((sum, payment) => sum + (payment.paidAmount || 0), 0);
    const pendingAmount = payments.reduce((sum, payment) => {
      if (payment.status === "pending") {
        return sum + (payment.totalAmount - (payment.paidAmount || 0));
      }
      return sum;
    }, 0);
    const overdueAmount = payments.reduce((sum, payment) => {
      if (payment.status === "overdue") {
        return sum + (payment.totalAmount - (payment.paidAmount || 0));
      }
      return sum;
    }, 0);

    const reportData = {
      summary: {
        totalAmount: Math.round(totalAmount * 100) / 100,
        paidAmount: Math.round(paidAmount * 100) / 100,
        pendingAmount: Math.round(pendingAmount * 100) / 100,
        overdueAmount: Math.round(overdueAmount * 100) / 100,
      },
      payments: payments.map(payment => ({
        _id: payment._id,
        childId: payment.childId,
        centerId: payment.centerId,
        amount: payment.totalAmount,
        currency: payment.currency,
        dueDate: payment.dueDate,
        status: payment.status,
        paidDate: payment.paidDate,
        paidAmount: payment.paidAmount,
        description: payment.description,
        paymentMethod: payment.paymentMethod,
        paymentReference: payment.paymentReference,
        transactionId: payment.transactionId,
        billingPeriod: payment.billingPeriod,
        billingType: payment.billingType,
        baseAmount: payment.baseAmount,
        additionalFees: payment.additionalFees,
        discounts: payment.discounts,
        paymentHistory: payment.paymentHistory,
        reminders: payment.reminders,
        notes: payment.notes,
        internalNotes: payment.internalNotes,
        createdAt: payment.createdAt,
        updatedAt: payment.updatedAt,
      })),
    };

    res.json({
      status: "success",
      message: "Payment report generated successfully",
      data: reportData,
    });
  })
);

export default router;