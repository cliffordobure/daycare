import Center from "../models/Center.js";
import User from "../models/User.js";
import Child from "../models/Child.js";
import { catchAsync } from "../utils/catchAsync.js";
import { AppError } from "../middleware/errorHandler.js";

// Create a new center
export const createCenter = catchAsync(async (req, res, next) => {
  const centerData = {
    ...req.body,
    createdBy: req.user.id,
    admin: req.user.id,
  };

  const center = await Center.create(centerData);

  // Update the admin user to include center access
  await User.findByIdAndUpdate(req.user.id, {
    $push: { "adminInfo.centerAccess": center._id },
    center: center._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      center,
    },
  });
});

// Get all centers
export const getAllCenters = catchAsync(async (req, res, next) => {
  let filter = {};

  // If user is not super admin, only show centers they have access to
  if (req.user.role !== "super_admin") {
    if (req.user.center) {
      filter._id = req.user.center;
    } else if (req.user.adminInfo?.centerAccess) {
      filter._id = { $in: req.user.adminInfo.centerAccess };
    } else {
      filter._id = { $in: [] }; // No access
    }
  }

  const centers = await Center.find(filter)
    .populate("admin", "firstName lastName email")
    .populate("staff", "firstName lastName email role")
    .populate("students", "firstName lastName age");

  res.status(200).json({
    status: "success",
    results: centers.length,
    data: {
      centers,
    },
  });
});

// Get a specific center
export const getCenter = catchAsync(async (req, res, next) => {
  const center = await Center.findById(req.params.id)
    .populate("admin", "firstName lastName email phone")
    .populate("staff", "firstName lastName email role phone")
    .populate("students", "firstName lastName age gender");

  if (!center) {
    return next(new AppError("No center found with that ID", 404));
  }

  // Check if user has access to this center
  if (
    req.user.role !== "super_admin" &&
    req.user.center?.toString() !== req.params.id &&
    !req.user.adminInfo?.centerAccess?.includes(req.params.id)
  ) {
    return next(new AppError("You don't have access to this center", 403));
  }

  res.status(200).json({
    status: "success",
    data: {
      center,
    },
  });
});

// Update center
export const updateCenter = catchAsync(async (req, res, next) => {
  const center = await Center.findById(req.params.id);

  if (!center) {
    return next(new AppError("No center found with that ID", 404));
  }

  // Check if user is admin of this center or super admin
  if (
    req.user.role !== "super_admin" &&
    center.admin.toString() !== req.user.id
  ) {
    return next(
      new AppError("You can only update centers you administer", 403)
    );
  }

  const updatedCenter = await Center.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user.id },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    status: "success",
    data: {
      center: updatedCenter,
    },
  });
});

// Delete center
export const deleteCenter = catchAsync(async (req, res, next) => {
  const center = await Center.findById(req.params.id);

  if (!center) {
    return next(new AppError("No center found with that ID", 404));
  }

  // Check if user is admin of this center or super admin
  if (
    req.user.role !== "super_admin" &&
    center.admin.toString() !== req.user.id
  ) {
    return next(
      new AppError("You can only delete centers you administer", 403)
    );
  }

  // Check if center has students or staff
  if (center.students.length > 0 || center.staff.length > 0) {
    return next(
      new AppError("Cannot delete center with active students or staff", 400)
    );
  }

  await Center.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Upload center images
export const uploadCenterImages = catchAsync(async (req, res, next) => {
  const center = await Center.findById(req.params.id);

  if (!center) {
    return next(new AppError("No center found with that ID", 404));
  }

  // Check if user is admin of this center or super admin
  if (
    req.user.role !== "super_admin" &&
    center.admin.toString() !== req.user.id
  ) {
    return next(
      new AppError("You can only update centers you administer", 403)
    );
  }

  if (!req.files || req.files.length === 0) {
    return next(new AppError("Please upload at least one image", 400));
  }

  const imageUrls = req.files.map((file) => file.path);

  // Update center with new images
  const updatedCenter = await Center.findByIdAndUpdate(
    req.params.id,
    {
      $push: { "images.gallery": { $each: imageUrls } },
      updatedBy: req.user.id,
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    data: {
      center: updatedCenter,
    },
  });
});

// Get center statistics
export const getCenterStats = catchAsync(async (req, res, next) => {
  const center = await Center.findById(req.params.id);

  if (!center) {
    return next(new AppError("No center found with that ID", 404));
  }

  // Check if user has access to this center
  if (
    req.user.role !== "super_admin" &&
    req.user.center?.toString() !== req.params.id &&
    !req.user.adminInfo?.centerAccess?.includes(req.params.id)
  ) {
    return next(new AppError("You don't have access to this center", 403));
  }

  // Get staff count by role
  const staffStats = await User.aggregate([
    { $match: { center: center._id, isActive: true } },
    { $group: { _id: "$role", count: { $sum: 1 } } },
  ]);

  // Get student count by age group
  const studentStats = await Child.aggregate([
    { $match: { center: center._id, isActive: true } },
    {
      $group: {
        _id: {
          $cond: [
            { $lt: ["$age", 3] },
            "0-2 years",
            {
              $cond: [{ $lt: ["$age", 5] }, "3-4 years", "5+ years"],
            },
          ],
        },
        count: { $sum: 1 },
      },
    },
  ]);

  // Get attendance stats for the current month
  const currentMonth = new Date();
  currentMonth.setDate(1);
  currentMonth.setHours(0, 0, 0, 0);

  const stats = {
    center: {
      name: center.name,
      capacity: center.capacity,
      currentOccupancy: center.students.length,
      occupancyRate: center.occupancyRate,
    },
    staff: {
      total: center.staff.length,
      byRole: staffStats,
    },
    students: {
      total: center.students.length,
      byAgeGroup: studentStats,
    },
    financial: {
      currency: center.currency,
      paymentMethods: center.paymentMethods,
    },
  };

  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});

// Add staff to center
export const addStaffToCenter = catchAsync(async (req, res, next) => {
  const { userId, role } = req.body;

  if (!userId || !role) {
    return next(new AppError("User ID and role are required", 400));
  }

  const center = await Center.findById(req.params.id);
  if (!center) {
    return next(new AppError("No center found with that ID", 404));
  }

  // Check if user is admin of this center or super admin
  if (
    req.user.role !== "super_admin" &&
    center.admin.toString() !== req.user.id
  ) {
    return next(
      new AppError("You can only manage staff in centers you administer", 403)
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  // Update user role and center
  user.role = role;
  user.center = center._id;
  await user.save();

  // Add user to center staff
  await center.addStaff(userId);

  res.status(200).json({
    status: "success",
    message: "Staff member added successfully",
  });
});

// Remove staff from center
export const removeStaffFromCenter = catchAsync(async (req, res, next) => {
  const center = await Center.findById(req.params.id);
  if (!center) {
    return next(new AppError("No center found with that ID", 404));
  }

  // Check if user is admin of this center or super admin
  if (
    req.user.role !== "super_admin" &&
    center.admin.toString() !== req.user.id
  ) {
    return next(
      new AppError("You can only manage staff in centers you administer", 403)
    );
  }

  const user = await User.findById(req.params.userId);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }

  // Remove user from center staff
  await center.removeStaff(req.params.userId);

  // Update user to remove center association
  user.center = undefined;
  user.role = "parent"; // Default role
  await user.save();

  res.status(200).json({
    status: "success",
    message: "Staff member removed successfully",
  });
});

// Get center staff
export const getCenterStaff = catchAsync(async (req, res, next) => {
  const center = await Center.findById(req.params.id);

  if (!center) {
    return next(new AppError("No center found with that ID", 404));
  }

  // Check if user has access to this center
  if (
    req.user.role !== "super_admin" &&
    req.user.center?.toString() !== req.params.id &&
    !req.user.adminInfo?.centerAccess?.includes(req.params.id)
  ) {
    return next(new AppError("You don't have access to this center", 403));
  }

  const staff = await User.find({ center: center._id, isActive: true })
    .select("firstName lastName email role phone profilePicture")
    .populate("teacherInfo", "employeeId qualifications specializations");

  res.status(200).json({
    status: "success",
    results: staff.length,
    data: {
      staff,
    },
  });
});

// Get center students
export const getCenterStudents = catchAsync(async (req, res, next) => {
  const center = await Center.findById(req.params.id);

  if (!center) {
    return next(new AppError("No center found with that ID", 404));
  }

  // Check if user has access to this center
  if (
    req.user.role !== "super_admin" &&
    req.user.center?.toString() !== req.params.id &&
    !req.user.adminInfo?.centerAccess?.includes(req.params.id)
  ) {
    return next(new AppError("You don't have access to this center", 403));
  }

  const students = await Child.find({ center: center._id, isActive: true })
    .select("firstName lastName age gender className parent")
    .populate("parent", "firstName lastName email phone");

  res.status(200).json({
    status: "success",
    results: students.length,
    data: {
      students,
    },
  });
});
