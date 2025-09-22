import express from "express";
import { body, validationResult } from "express-validator";
import { Message, Notification } from "../models/Communication.js";
import User from "../models/User.js";
import Child from "../models/Child.js";
import Activity from "../models/Activity.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// Validation middleware
const validateMessageCreation = [
  body("recipientId")
    .isMongoId()
    .withMessage("Invalid recipient ID"),
  body("content")
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage("Message content must be between 1 and 1000 characters"),
  body("type")
    .optional()
    .isIn(["text", "image", "file", "announcement"])
    .withMessage("Invalid message type"),
  body("attachments")
    .optional()
    .isArray()
    .withMessage("Attachments must be an array"),
  body("replyToId")
    .optional()
    .isMongoId()
    .withMessage("Invalid reply message ID"),
];

// @route   GET /api/communication/messages
// @desc    Get messages
// @access  Private
router.get(
  "/messages",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { recipientId, limit = 50, offset = 0 } = req.query;

    let messages;
    if (recipientId) {
      // Get conversation between two users
      messages = await Message.findConversation(
        req.user._id,
        recipientId,
        parseInt(limit),
        parseInt(offset)
      );
    } else {
      // Get all messages for the user
      messages = await Message.findByRecipient(
        req.user._id,
        parseInt(limit),
        parseInt(offset)
      );
    }

    res.json({
      status: "success",
      message: "Messages retrieved successfully",
      data: messages.map(msg => ({
        _id: msg._id,
        senderId: msg.senderId._id,
        senderName: `${msg.senderId.firstName} ${msg.senderId.lastName}`,
        recipientId: msg.recipientId._id,
        recipientName: `${msg.recipientId.firstName} ${msg.recipientId.lastName}`,
        content: msg.content,
        type: msg.type,
        status: msg.status,
        timestamp: msg.timestamp,
        attachments: msg.attachments,
        isRead: msg.isRead,
        replyToId: msg.replyToId?._id,
        metadata: {
          childId: msg.metadata?.childId?._id,
          activityId: msg.metadata?.activityId?._id,
        },
      })),
      pagination: {
        total: messages.length,
        page: Math.floor(parseInt(offset) / parseInt(limit)) + 1,
        limit: parseInt(limit),
        totalPages: Math.ceil(messages.length / parseInt(limit)),
      },
    });
  })
);

// @route   POST /api/communication/messages
// @desc    Send message
// @access  Private
router.post(
  "/messages",
  authenticateToken,
  validateMessageCreation,
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: "error",
        message: "Validation failed",
        errors: errors.array(),
      });
    }

    const { recipientId, content, type = "text", attachments, replyToId, metadata } = req.body;

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({
        status: "error",
        message: "Recipient not found",
      });
    }

    // Check if users are in the same center (for security)
    if (req.user.center && recipient.center && req.user.center.toString() !== recipient.center.toString()) {
      return res.status(403).json({
        status: "error",
        message: "Cannot send messages to users outside your center",
      });
    }

    // Create new message
    const message = new Message({
      senderId: req.user._id,
      recipientId,
      content,
      type,
      attachments: attachments || [],
      replyToId: replyToId || null,
      metadata: metadata || {},
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    await message.save();

    // Populate the created message for response
    const populatedMessage = await Message.findById(message._id)
      .populate("senderId", "firstName lastName profilePicture")
      .populate("recipientId", "firstName lastName profilePicture")
      .populate("replyToId", "content")
      .populate("metadata.childId", "firstName lastName")
      .populate("metadata.activityId", "title");

    res.status(201).json({
      status: "success",
      message: "Message sent successfully",
      data: {
        message: {
          _id: populatedMessage._id,
          senderId: populatedMessage.senderId._id,
          senderName: `${populatedMessage.senderId.firstName} ${populatedMessage.senderId.lastName}`,
          recipientId: populatedMessage.recipientId._id,
          recipientName: `${populatedMessage.recipientId.firstName} ${populatedMessage.recipientId.lastName}`,
          content: populatedMessage.content,
          type: populatedMessage.type,
          status: populatedMessage.status,
          timestamp: populatedMessage.timestamp,
          attachments: populatedMessage.attachments,
          isRead: populatedMessage.isRead,
          replyToId: populatedMessage.replyToId?._id,
          metadata: {
            childId: populatedMessage.metadata?.childId?._id,
            activityId: populatedMessage.metadata?.activityId?._id,
          },
        },
      },
    });
  })
);

// @route   PUT /api/communication/messages/:messageId/read
// @desc    Mark message as read
// @access  Private
router.put(
  "/messages/:messageId/read",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { messageId } = req.params;

    const message = await Message.markAsRead(messageId, req.user._id);
    if (!message) {
      return res.status(404).json({
        status: "error",
        message: "Message not found or access denied",
      });
    }

    res.json({
      status: "success",
      message: "Message marked as read",
    });
  })
);

// @route   GET /api/communication/conversations
// @desc    Get conversations
// @access  Private
router.get(
  "/conversations",
  authenticateToken,
  asyncHandler(async (req, res) => {
    // Get all unique users the current user has messaged with
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [
            { senderId: req.user._id },
            { recipientId: req.user._id },
          ],
          isActive: true,
        },
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ["$senderId", req.user._id] },
              "$recipientId",
              "$senderId",
            ],
          },
          lastMessage: { $last: "$$ROOT" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ["$recipientId", req.user._id] },
                    { $eq: ["$isRead", false] },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "participant",
        },
      },
      {
        $unwind: "$participant",
      },
      {
        $project: {
          _id: 1,
          participantId: "$participant._id",
          participantName: {
            $concat: ["$participant.firstName", " ", "$participant.lastName"],
          },
          participantAvatar: "$participant.profilePicture",
          lastMessage: {
            _id: "$lastMessage._id",
            content: "$lastMessage.content",
            timestamp: "$lastMessage.timestamp",
            senderId: "$lastMessage.senderId",
          },
          unreadCount: 1,
          lastActivity: "$lastMessage.timestamp",
          isActive: true,
        },
      },
      {
        $sort: { lastActivity: -1 },
      },
    ]);

    res.json({
      status: "success",
      message: "Conversations retrieved successfully",
      data: conversations,
    });
  })
);

// @route   GET /api/communication/notifications
// @desc    Get notifications
// @access  Private
router.get(
  "/notifications",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { type, isRead, limit = 50, offset = 0 } = req.query;

    let query = {
      recipientId: req.user._id,
      isActive: true,
    };

    if (type) {
      query.type = type;
    }

    if (isRead !== undefined) {
      query.isRead = isRead === "true";
    }

    const notifications = await Notification.find(query)
      .populate("senderId", "firstName lastName profilePicture")
      .populate("childId", "firstName lastName")
      .populate("activityId", "title")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(parseInt(offset));

    const totalNotifications = await Notification.countDocuments(query);

    res.json({
      status: "success",
      message: "Notifications retrieved successfully",
      data: notifications.map(notification => ({
        _id: notification._id,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        priority: notification.priority,
        isRead: notification.isRead,
        isSent: notification.isSent,
        recipientId: notification.recipientId,
        senderId: notification.senderId?._id,
        childId: notification.childId?._id,
        activityId: notification.activityId?._id,
        attachments: notification.attachments,
        metadata: notification.metadata,
        scheduledAt: notification.scheduledAt,
        sentAt: notification.sentAt,
        readAt: notification.readAt,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      })),
      pagination: {
        total: totalNotifications,
        page: Math.floor(parseInt(offset) / parseInt(limit)) + 1,
        limit: parseInt(limit),
        totalPages: Math.ceil(totalNotifications / parseInt(limit)),
      },
    });
  })
);

// @route   PUT /api/communication/notifications/:notificationId/read
// @desc    Mark notification as read
// @access  Private
router.put(
  "/notifications/:notificationId/read",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const { notificationId } = req.params;

    const notification = await Notification.markAsRead(notificationId, req.user._id);
    if (!notification) {
      return res.status(404).json({
        status: "error",
        message: "Notification not found or access denied",
      });
    }

    res.json({
      status: "success",
      message: "Notification marked as read",
    });
  })
);

// @route   PUT /api/communication/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put(
  "/notifications/read-all",
  authenticateToken,
  asyncHandler(async (req, res) => {
    const result = await Notification.markAllAsRead(req.user._id);

    res.json({
      status: "success",
      message: "All notifications marked as read",
      data: {
        modifiedCount: result.modifiedCount,
      },
    });
  })
);

export default router;