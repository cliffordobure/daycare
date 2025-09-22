import express from "express";
import { body, validationResult } from "express-validator";
import Payment from "../models/Payment.js";
import Child from "../models/Child.js";
import User from "../models/User.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/payments
// @desc    Get payment status
// @access  Private
router.get(
  "/",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { childId, status, startDate, endDate } = req.query;

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

    // Filter by status
    if (status && status !== "all") {
      query.status = status;
    }

    // Filter by date range
    if (startDate && endDate) {
      query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const payments = await Payment.find(query)
      .populate("childId", "firstName lastName profilePicture")
      .populate("centerId", "name")
      .sort({ dueDate: -1 });

    res.json({
      status: "success",
      message: "Payment status retrieved successfully",
      data: payments.map(payment => ({
        _id: payment._id,
        childId: payment.childId,
        amount: payment.totalAmount,
        dueDate: payment.dueDate,
        status: payment.status,
        description: payment.description,
        createdAt: payment.createdAt,
      })),
    });
  })
);

// @route   GET /api/payments/:id
// @desc    Get payment by ID
// @access  Private
router.get(
  "/:id",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const payment = await Payment.findById(req.params.id)
      .populate("childId", "firstName lastName profilePicture")
      .populate("centerId", "name");

    if (!payment) {
      return res.status(404).json({
        status: "error",
        message: "Payment not found",
      });
    }

    // Check if user has access to this payment
    if (req.user.role === "parent") {
      const children = await Child.find({ 
        parentId: req.user._id,
        isActive: true 
      }).select("_id");
      
      const childIds = children.map(child => child._id);
      if (!childIds.includes(payment.childId._id)) {
        return res.status(403).json({
          status: "error",
          message: "Access denied to this payment",
        });
      }
    } else if (req.user.role === "teacher" && payment.centerId.toString() !== req.user.center.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Access denied to this payment",
      });
    }

    res.json({
      status: "success",
      message: "Payment retrieved successfully",
      data: {
        payment: {
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
        },
      },
    });
  })
);

export default router;