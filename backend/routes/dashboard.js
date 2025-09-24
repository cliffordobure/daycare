import express from "express";
import Child from "../models/Child.js";
import Attendance from "../models/Attendance.js";
import Activity from "../models/Activity.js";
import { Message, Notification } from "../models/Communication.js";
import { asyncHandler } from "../middleware/errorHandler.js";
import { authenticateToken } from "../middleware/auth.js";

const router = express.Router();

// @route   GET /api/parent/dashboard/stats
// @desc    Get parent dashboard statistics
// @access  Private
router.get(
  "/parent/dashboard/stats",
  authenticateToken,
  asyncHandler(async (req, res) => {
    // Check if user is parent
    if (req.user.role !== "parent") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Parent privileges required.",
      });
    }

    // Get children of the parent
    const children = await Child.find({ 
      parentId: req.user._id,
      isActive: true 
    }).select("_id");

    const childIds = children.map(child => child._id);

    // Get today's date
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Get today's attendance
    const todayAttendance = await Attendance.find({
      child: { $in: childIds },
      date: { $gte: startOfToday, $lt: endOfToday },
      isActive: true,
    });

    // Get weekly attendance (last 7 days)
    const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weeklyAttendance = await Attendance.find({
      child: { $in: childIds },
      date: { $gte: weekStart, $lt: endOfToday },
      isActive: true,
    });

    // Get today's activities
    const todayActivities = await Activity.find({
      childrenInvolved: { $in: childIds },
      startTime: { $gte: startOfToday, $lt: endOfToday },
      isActive: true,
    });

    // Get upcoming activities (next 7 days)
    const upcomingStart = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const upcomingEnd = new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000);
    const upcomingActivities = await Activity.find({
      childrenInvolved: { $in: childIds },
      startTime: { $gte: upcomingStart, $lt: upcomingEnd },
      isActive: true,
    });

    // Get unread messages
    const unreadMessages = await Message.countDocuments({
      recipientId: req.user._id,
      isRead: false,
      isActive: true,
    });

    // Get unread notifications
    const unreadNotifications = await Notification.countDocuments({
      recipientId: req.user._id,
      isRead: false,
      isActive: true,
    });

    // Calculate attendance rate
    const totalDays = Math.min(7, Math.ceil((endOfToday.getTime() - weekStart.getTime()) / (24 * 60 * 60 * 1000)));
    const presentDays = weeklyAttendance.filter(record => record.status === "present").length;
    const attendanceRate = totalDays > 0 ? presentDays / totalDays : 0;

    // Group weekly attendance by date
    const weeklyAttendanceByDate = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayAttendance = weeklyAttendance.filter(record => {
        const recordDate = record.date.toISOString().split('T')[0];
        return recordDate === dateStr;
      });

      const present = dayAttendance.filter(record => record.status === "present").length;
      const absent = dayAttendance.filter(record => record.status === "absent").length;
      const rate = dayAttendance.length > 0 ? present / dayAttendance.length : 0;

      weeklyAttendanceByDate.unshift({
        date: dateStr,
        present,
        absent,
        rate,
      });
    }

    // Get recent activities (last 5)
    const recentActivities = await Activity.find({
      childrenInvolved: { $in: childIds },
      isActive: true,
    })
      .populate("childrenInvolved", "firstName lastName")
      .populate("teacherId", "firstName lastName")
      .sort({ startTime: -1 })
      .limit(5);

    res.json({
      status: "success",
      message: "Dashboard stats retrieved successfully",
      data: {
        totalChildren: children.length,
        presentChildren: todayAttendance.filter(record => record.status === "present").length,
        absentChildren: todayAttendance.filter(record => record.status === "absent").length,
        todayActivities: todayActivities.length,
        upcomingActivities: upcomingActivities.length,
        unreadMessages,
        unreadNotifications,
        attendanceRate: Math.round(attendanceRate * 100) / 100,
        weeklyAttendance: weeklyAttendanceByDate,
        recentActivities: recentActivities.map(activity => ({
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
        upcomingEvents: upcomingActivities.map(activity => ({
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
      },
    });
  })
);

// @route   GET /api/teacher/dashboard/stats
// @desc    Get teacher dashboard statistics
// @access  Private
router.get(
  "/teacher/dashboard/stats",
  authenticateToken,
  asyncHandler(async (req, res) => {
    // Check if user is teacher
    if (req.user.role !== "teacher") {
      return res.status(403).json({
        status: "error",
        message: "Access denied. Teacher privileges required.",
      });
    }

    // Get children in teacher's center
    const children = await Child.find({ 
      centerId: req.user.center,
      isActive: true 
    }).select("_id currentClass");

    const childIds = children.map(child => child._id);

    // Get today's date
    const today = new Date();
    const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    // Get today's attendance
    const todayAttendance = await Attendance.find({
      child: { $in: childIds },
      date: { $gte: startOfToday, $lt: endOfToday },
      isActive: true,
    });

    // Get today's activities
    const todayActivities = await Activity.find({
      teacherId: req.user._id,
      startTime: { $gte: startOfToday, $lt: endOfToday },
      isActive: true,
    });

    // Get in-progress activities
    const inProgressActivities = await Activity.find({
      teacherId: req.user._id,
      status: "in_progress",
      isActive: true,
    });

    // Get scheduled activities (next 7 days)
    const upcomingStart = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const upcomingEnd = new Date(today.getTime() + 8 * 24 * 60 * 60 * 1000);
    const scheduledActivities = await Activity.find({
      teacherId: req.user._id,
      startTime: { $gte: upcomingStart, $lt: upcomingEnd },
      status: "scheduled",
      isActive: true,
    });

    // Get unread messages/notifications
    const unreadMessages = await Notification.countDocuments({
      recipientId: req.user._id,
      isRead: false,
      isActive: true,
    });

    // Calculate attendance rate
    const totalChildren = children.length;
    const presentToday = todayAttendance.filter(record => record.status === "present").length;
    const absentToday = todayAttendance.filter(record => record.status === "absent").length;
    const attendanceRate = totalChildren > 0 ? (presentToday / totalChildren) * 100 : 0;

    // Get weekly attendance (last 5 days)
    const weekStart = new Date(today.getTime() - 5 * 24 * 60 * 60 * 1000);
    const weeklyAttendance = await Attendance.find({
      child: { $in: childIds },
      date: { $gte: weekStart, $lt: endOfToday },
      isActive: true,
    });

    // Group weekly attendance by day
    const weeklyAttendanceByDay = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    for (let i = 0; i < 5; i++) {
      const date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
      const dayName = dayNames[date.getDay()];
      
      const dayAttendance = weeklyAttendance.filter(record => {
        const recordDate = record.date.toISOString().split('T')[0];
        const targetDate = date.toISOString().split('T')[0];
        return recordDate === targetDate;
      });

      const present = dayAttendance.filter(record => record.status === "present").length;
      const total = dayAttendance.length;
      const rate = total > 0 ? (present / total) * 100 : 0;

      weeklyAttendanceByDay.unshift({
        day: dayName,
        rate: Math.round(rate * 10) / 10
      });
    }

    // Calculate activity completion rate
    const completedActivities = await Activity.countDocuments({
      teacherId: req.user._id,
      status: "completed",
      isActive: true,
    });
    const totalActivities = await Activity.countDocuments({
      teacherId: req.user._id,
      isActive: true,
    });
    const activityCompletionRate = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;

    res.json({
      status: "success",
      message: "Dashboard statistics retrieved successfully",
      data: {
        totalChildren,
        presentToday,
        absentToday,
        attendanceRate: Math.round(attendanceRate * 10) / 10,
        activitiesCompleted: completedActivities,
        activitiesInProgress: inProgressActivities.length,
        activitiesScheduled: scheduledActivities.length,
        unreadMessages,
        weeklyAttendance: weeklyAttendanceByDay,
        activityCompletionRate: Math.round(activityCompletionRate * 10) / 10
      },
    });
  })
);

export default router;
