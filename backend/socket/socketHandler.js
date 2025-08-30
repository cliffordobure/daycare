import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendSMS } from "../utils/smsService.js";

// Store connected users
const connectedUsers = new Map();
const userSockets = new Map();

// Initialize socket handlers
export const initializeSocket = (io) => {
  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token =
        socket.handshake.auth.token ||
        socket.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error: Token required"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET ||
          "your-super-secret-jwt-key-change-this-in-production"
      );
      const user = await User.findById(decoded.id).select("-password");

      if (!user || !user.isActive) {
        return next(new Error("Authentication error: Invalid user"));
      }

      socket.user = user;
      next();
    } catch (error) {
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.user.fullName} (${socket.user._id})`);

    // Store user connection
    connectedUsers.set(socket.user._id.toString(), {
      userId: socket.user._id,
      socketId: socket.id,
      user: socket.user,
      connectedAt: new Date(),
    });

    userSockets.set(socket.user._id.toString(), socket.id);

    // Join user to appropriate rooms
    joinUserToRooms(socket);

    // Handle attendance updates
    handleAttendanceUpdates(socket, io);

    // Handle real-time messaging
    handleRealTimeMessaging(socket, io);

    // Handle notifications
    handleNotifications(socket, io);

    // Handle emergency alerts
    handleEmergencyAlerts(socket, io);

    // Handle live activity updates
    handleLiveActivityUpdates(socket, io);

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(
        `User disconnected: ${socket.user.fullName} (${socket.user._id})`
      );

      // Remove user from connected users
      connectedUsers.delete(socket.user._id.toString());
      userSockets.delete(socket.user._id.toString());

      // Notify others about user going offline
      socket.broadcast.emit("user:offline", {
        userId: socket.user._id,
        userName: socket.user.fullName,
        timestamp: new Date(),
      });
    });

    // Handle typing indicators
    socket.on("typing:start", (data) => {
      socket.to(data.room).emit("typing:start", {
        userId: socket.user._id,
        userName: socket.user.fullName,
        room: data.room,
      });
    });

    socket.on("typing:stop", (data) => {
      socket.to(data.room).emit("typing:stop", {
        userId: socket.user._id,
        room: data.room,
      });
    });

    // Handle read receipts
    socket.on("message:read", (data) => {
      socket.to(data.room).emit("message:read", {
        messageId: data.messageId,
        userId: socket.user._id,
        userName: socket.user.fullName,
        timestamp: new Date(),
      });
    });

    // Handle user status updates
    socket.on("user:status", (data) => {
      const userData = connectedUsers.get(socket.user._id.toString());
      if (userData) {
        userData.status = data.status;
        userData.lastActivity = new Date();

        // Broadcast status update
        socket.broadcast.emit("user:status:update", {
          userId: socket.user._id,
          status: data.status,
          timestamp: new Date(),
        });
      }
    });

    // Handle location updates (for emergency purposes)
    socket.on("location:update", (data) => {
      const userData = connectedUsers.get(socket.user._id.toString());
      if (userData) {
        userData.location = data.location;
        userData.lastLocationUpdate = new Date();
      }
    });

    // Handle heartbeat
    socket.on("heartbeat", () => {
      const userData = connectedUsers.get(socket.user._id.toString());
      if (userData) {
        userData.lastHeartbeat = new Date();
      }
    });
  });

  // Set up periodic tasks
  setInterval(() => {
    cleanupInactiveUsers();
    sendHeartbeat();
  }, 30000); // Every 30 seconds

  return io;
};

// Join user to appropriate rooms based on role and permissions
const joinUserToRooms = (socket) => {
  const user = socket.user;

  // Join general room
  socket.join("general");

  // Join role-specific room
  socket.join(`role:${user.role}`);

  // Join admin room if admin
  if (user.role === "admin") {
    socket.join("admin");
  }

  // Join teacher room if teacher
  if (user.role === "teacher") {
    socket.join("teachers");

    // Join assigned class rooms
    if (user.teacherInfo?.assignedClasses) {
      user.teacherInfo.assignedClasses.forEach((classId) => {
        socket.join(`class:${classId}`);
      });
    }
  }

  // Join parent room if parent
  if (user.role === "parent") {
    socket.join("parents");

    // Join child-specific rooms
    if (user.parentInfo?.children) {
      user.parentInfo.children.forEach((childId) => {
        socket.join(`child:${childId}`);
      });
    }
  }

  // Join notification room
  socket.join(`notifications:${user._id}`);
};

// Handle attendance updates
const handleAttendanceUpdates = (socket, io) => {
  socket.on("attendance:update", async (data) => {
    try {
      const { childId, status, timestamp, location } = data;

      // Emit to relevant rooms
      io.to(`child:${childId}`).emit("attendance:updated", {
        childId,
        status,
        timestamp,
        location,
        updatedBy: {
          userId: socket.user._id,
          userName: socket.user.fullName,
        },
      });

      // Send SMS notification to parents if enabled
      if (socket.user.notificationPreferences?.sms) {
        // Get child and parent information
        // This would typically involve a database query
        // For now, we'll emit the event and handle it elsewhere
        io.emit("attendance:notification:needed", {
          childId,
          status,
          timestamp,
        });
      }

      // Log attendance update
      console.log(
        `Attendance updated: ${socket.user.fullName} marked ${status} for child ${childId}`
      );
    } catch (error) {
      console.error("Error handling attendance update:", error);
      socket.emit("error", { message: "Failed to update attendance" });
    }
  });
};

// Handle real-time messaging
const handleRealTimeMessaging = (socket, io) => {
  socket.on("message:send", (data) => {
    try {
      const { room, content, type = "text", attachments = [] } = data;

      const message = {
        id: Date.now().toString(), // In production, use proper message ID
        content,
        type,
        attachments,
        sender: {
          userId: socket.user._id,
          userName: socket.user.fullName,
          role: socket.user.role,
        },
        timestamp: new Date(),
        room,
      };

      // Emit to room
      io.to(room).emit("message:received", message);

      // Store message in database (this would be handled by a separate service)
      io.emit("message:store", message);
    } catch (error) {
      console.error("Error handling message:", error);
      socket.emit("error", { message: "Failed to send message" });
    }
  });
};

// Handle notifications
const handleNotifications = (socket, io) => {
  socket.on("notification:send", (data) => {
    try {
      const { recipients, type, title, message, data: notificationData } = data;

      const notification = {
        id: Date.now().toString(),
        type,
        title,
        message,
        data: notificationData,
        sender: {
          userId: socket.user._id,
          userName: socket.user.fullName,
          role: socket.user.role,
        },
        timestamp: new Date(),
        read: false,
      };

      // Send to specific recipients
      recipients.forEach((recipientId) => {
        const recipientSocketId = userSockets.get(recipientId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("notification:received", notification);
        }
      });

      // Broadcast to appropriate rooms if it's a general notification
      if (type === "general" || type === "emergency") {
        io.emit("notification:broadcast", notification);
      }
    } catch (error) {
      console.error("Error handling notification:", error);
      socket.emit("error", { message: "Failed to send notification" });
    }
  });
};

// Handle emergency alerts
const handleEmergencyAlerts = (socket, io) => {
  socket.on("emergency:alert", async (data) => {
    try {
      const { type, description, location, instructions, severity } = data;

      const emergency = {
        id: Date.now().toString(),
        type,
        description,
        location,
        instructions,
        severity,
        reportedBy: {
          userId: socket.user._id,
          userName: socket.user.fullName,
          role: socket.user.role,
        },
        timestamp: new Date(),
        status: "active",
      };

      // Broadcast emergency alert to all connected users
      io.emit("emergency:alert", emergency);

      // Send SMS alerts to all users if configured
      const allUsers = Array.from(connectedUsers.values());
      const phoneNumbers = allUsers
        .filter((user) => user.user.notificationPreferences?.sms)
        .map((user) => user.user.phone);

      if (phoneNumbers.length > 0) {
        try {
          await sendSMS({
            to: phoneNumbers,
            message: `EMERGENCY ALERT: ${type} at ${location}. ${description}. Please follow instructions: ${instructions}`,
          });
        } catch (error) {
          console.error("Failed to send emergency SMS:", error);
        }
      }

      // Log emergency alert
      console.log(
        `Emergency alert sent: ${type} at ${location} by ${socket.user.fullName}`
      );
    } catch (error) {
      console.error("Error handling emergency alert:", error);
      socket.emit("error", { message: "Failed to send emergency alert" });
    }
  });
};

// Handle live activity updates
const handleLiveActivityUpdates = (socket, io) => {
  socket.on("activity:update", (data) => {
    try {
      const { childId, activity, photos, videos, notes } = data;

      const activityUpdate = {
        id: Date.now().toString(),
        childId,
        activity,
        photos,
        videos,
        notes,
        updatedBy: {
          userId: socket.user._id,
          userName: socket.user.fullName,
          role: socket.user.role,
        },
        timestamp: new Date(),
      };

      // Emit to child's room
      io.to(`child:${childId}`).emit("activity:updated", activityUpdate);

      // Emit to class room if applicable
      // This would require additional logic to determine the class
    } catch (error) {
      console.error("Error handling activity update:", error);
      socket.emit("error", { message: "Failed to update activity" });
    }
  });
};

// Clean up inactive users
const cleanupInactiveUsers = () => {
  const now = new Date();
  const inactiveThreshold = 5 * 60 * 1000; // 5 minutes

  for (const [userId, userData] of connectedUsers.entries()) {
    const lastActivity = userData.lastHeartbeat || userData.connectedAt;
    if (now - lastActivity > inactiveThreshold) {
      console.log(`Removing inactive user: ${userData.user.fullName}`);
      connectedUsers.delete(userId);
      userSockets.delete(userId);
    }
  }
};

// Send heartbeat to all connected users
const sendHeartbeat = () => {
  // This could be used to detect disconnected clients
  // For now, we'll just log the number of connected users
  console.log(`Connected users: ${connectedUsers.size}`);
};

// Utility functions for external use
export const sendNotificationToUser = (userId, notification) => {
  const socketId = userSockets.get(userId);
  if (socketId) {
    // This would require access to the io instance
    // In a real implementation, you'd pass the io instance or use a different approach
    console.log(`Notification queued for user ${userId}:`, notification);
  }
};

export const broadcastToRole = (role, event, data) => {
  // This would require access to the io instance
  console.log(`Broadcasting to role ${role}:`, event, data);
};

export const getConnectedUsers = () => {
  return Array.from(connectedUsers.values());
};

export const isUserOnline = (userId) => {
  return connectedUsers.has(userId.toString());
};
