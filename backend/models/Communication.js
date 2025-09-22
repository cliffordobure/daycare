import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // Message Content
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: [1000, "Message content cannot exceed 1000 characters"],
    },
    type: {
      type: String,
      enum: ["text", "image", "file", "announcement"],
      default: "text",
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read", "failed"],
      default: "sent",
    },

    // Attachments
    attachments: [String], // URLs to files/images

    // Message Threading
    replyToId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    // Metadata
    metadata: {
      childId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Child",
      },
      activityId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Activity",
      },
      customData: mongoose.Schema.Types.Mixed,
    },

    // Read Status
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },

    // Timestamps
    timestamp: {
      type: Date,
      default: Date.now,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Audit Fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const notificationSchema = new mongoose.Schema(
  {
    // Notification Content
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: [500, "Message cannot exceed 500 characters"],
    },
    type: {
      type: String,
      enum: [
        "activity",
        "meal",
        "health",
        "attendance",
        "report",
        "message",
        "reminder",
        "emergency",
        "general",
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },

    // Recipients
    recipientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Related Entities
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
    },
    activityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Activity",
    },

    // Attachments
    attachments: [String], // URLs to files/images

    // Metadata
    metadata: {
      customData: mongoose.Schema.Types.Mixed,
    },

    // Delivery Status
    isRead: {
      type: Boolean,
      default: false,
    },
    isSent: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    sentAt: {
      type: Date,
    },

    // Scheduling
    scheduledAt: {
      type: Date,
      default: Date.now,
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Audit Fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Message indexes
messageSchema.index({ senderId: 1, timestamp: -1 });
messageSchema.index({ recipientId: 1, timestamp: -1 });
messageSchema.index({ senderId: 1, recipientId: 1, timestamp: -1 });
messageSchema.index({ replyToId: 1 });
messageSchema.index({ "metadata.childId": 1 });
messageSchema.index({ "metadata.activityId": 1 });
messageSchema.index({ isRead: 1 });

// Notification indexes
notificationSchema.index({ recipientId: 1, createdAt: -1 });
notificationSchema.index({ senderId: 1, createdAt: -1 });
notificationSchema.index({ type: 1, createdAt: -1 });
notificationSchema.index({ priority: 1, createdAt: -1 });
notificationSchema.index({ isRead: 1, createdAt: -1 });
notificationSchema.index({ childId: 1, createdAt: -1 });
notificationSchema.index({ activityId: 1, createdAt: -1 });
notificationSchema.index({ scheduledAt: 1 });

// Message static methods
messageSchema.statics.findConversation = function (userId1, userId2, limit = 50, offset = 0) {
  return this.find({
    $or: [
      { senderId: userId1, recipientId: userId2 },
      { senderId: userId2, recipientId: userId1 },
    ],
    isActive: true,
  })
    .populate("senderId", "firstName lastName profilePicture")
    .populate("recipientId", "firstName lastName profilePicture")
    .populate("replyToId", "content")
    .populate("metadata.childId", "firstName lastName")
    .populate("metadata.activityId", "title")
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(offset);
};

messageSchema.statics.findByRecipient = function (recipientId, limit = 50, offset = 0) {
  return this.find({
    recipientId: recipientId,
    isActive: true,
  })
    .populate("senderId", "firstName lastName profilePicture")
    .populate("recipientId", "firstName lastName profilePicture")
    .populate("metadata.childId", "firstName lastName")
    .populate("metadata.activityId", "title")
    .sort({ timestamp: -1 })
    .limit(limit)
    .skip(offset);
};

messageSchema.statics.markAsRead = function (messageId, userId) {
  return this.findOneAndUpdate(
    {
      _id: messageId,
      recipientId: userId,
    },
    {
      isRead: true,
      readAt: new Date(),
    },
    { new: true }
  );
};

// Notification static methods
notificationSchema.statics.findByRecipient = function (recipientId, limit = 50, offset = 0) {
  return this.find({
    recipientId: recipientId,
    isActive: true,
  })
    .populate("senderId", "firstName lastName profilePicture")
    .populate("childId", "firstName lastName")
    .populate("activityId", "title")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(offset);
};

notificationSchema.statics.markAsRead = function (notificationId, userId) {
  return this.findOneAndUpdate(
    {
      _id: notificationId,
      recipientId: userId,
    },
    {
      isRead: true,
      readAt: new Date(),
    },
    { new: true }
  );
};

notificationSchema.statics.markAllAsRead = function (userId) {
  return this.updateMany(
    {
      recipientId: userId,
      isRead: false,
    },
    {
      isRead: true,
      readAt: new Date(),
    }
  );
};

notificationSchema.statics.getUnreadCount = function (userId) {
  return this.countDocuments({
    recipientId: userId,
    isRead: false,
    isActive: true,
  });
};

const Message = mongoose.model("Message", messageSchema);
const Notification = mongoose.model("Notification", notificationSchema);

export { Message, Notification };
