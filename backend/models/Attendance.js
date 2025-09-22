import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    // Child Information
    child: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
      required: true,
    },
    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    centerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Center",
      required: true,
    },

    // Date and Time
    date: {
      type: Date,
      required: true,
    },
    checkInTime: {
      type: Date,
    },
    checkOutTime: {
      type: Date,
    },

    // Status
    status: {
      type: String,
      enum: ["present", "absent", "late", "excused"],
      required: true,
    },

    // Additional Information
    notes: {
      type: String,
      trim: true,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Late arrival details
    lateReason: {
      type: String,
      trim: true,
    },
    lateMinutes: {
      type: Number,
      default: 0,
    },

    // Early departure details
    earlyDepartureReason: {
      type: String,
      trim: true,
    },
    earlyDepartureMinutes: {
      type: Number,
      default: 0,
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

// Virtual for duration
attendanceSchema.virtual("duration").get(function () {
  if (this.checkInTime && this.checkOutTime) {
    return this.checkOutTime.getTime() - this.checkInTime.getTime();
  }
  return null;
});

// Virtual for duration in hours
attendanceSchema.virtual("durationHours").get(function () {
  if (this.checkInTime && this.checkOutTime) {
    return Math.round((this.checkOutTime.getTime() - this.checkInTime.getTime()) / (1000 * 60 * 60) * 100) / 100;
  }
  return null;
});

// Virtual for is late
attendanceSchema.virtual("isLate").get(function () {
  return this.status === "late" || this.lateMinutes > 0;
});

// Virtual for is early departure
attendanceSchema.virtual("isEarlyDeparture").get(function () {
  return this.earlyDepartureMinutes > 0;
});

// Compound indexes for better query performance
attendanceSchema.index({ child: 1, date: 1 }, { unique: true });
attendanceSchema.index({ classId: 1, date: 1 });
attendanceSchema.index({ centerId: 1, date: 1 });
attendanceSchema.index({ status: 1, date: 1 });
attendanceSchema.index({ recordedBy: 1, date: 1 });
attendanceSchema.index({ date: 1 });

// Pre-save middleware to calculate late minutes
attendanceSchema.pre("save", function (next) {
  if (this.checkInTime && this.lateMinutes === 0) {
    // Assuming standard start time is 8:00 AM
    const standardStartTime = new Date(this.date);
    standardStartTime.setHours(8, 0, 0, 0);
    
    if (this.checkInTime > standardStartTime) {
      this.lateMinutes = Math.round((this.checkInTime.getTime() - standardStartTime.getTime()) / (1000 * 60));
      if (this.status === "present" && this.lateMinutes > 15) {
        this.status = "late";
      }
    }
  }
  
  if (this.checkOutTime && this.checkInTime && this.earlyDepartureMinutes === 0) {
    // Assuming standard end time is 4:00 PM
    const standardEndTime = new Date(this.date);
    standardEndTime.setHours(16, 0, 0, 0);
    
    if (this.checkOutTime < standardEndTime) {
      this.earlyDepartureMinutes = Math.round((standardEndTime.getTime() - this.checkOutTime.getTime()) / (1000 * 60));
    }
  }
  
  next();
});

// Static method to find attendance by date range
attendanceSchema.statics.findByDateRange = function (startDate, endDate, centerId) {
  const query = {
    date: { $gte: startDate, $lte: endDate },
    isActive: true,
  };
  
  if (centerId) {
    query.centerId = centerId;
  }
  
  return this.find(query)
    .populate("child", "firstName lastName")
    .populate("classId", "name")
    .populate("recordedBy", "firstName lastName")
    .sort({ date: -1, checkInTime: 1 });
};

// Static method to find attendance by child
attendanceSchema.statics.findByChild = function (childId, startDate, endDate) {
  const query = {
    child: childId,
    isActive: true,
  };
  
  if (startDate && endDate) {
    query.date = { $gte: startDate, $lte: endDate };
  }
  
  return this.find(query)
    .populate("classId", "name")
    .populate("recordedBy", "firstName lastName")
    .sort({ date: -1 });
};

// Static method to find attendance by class
attendanceSchema.statics.findByClass = function (classId, date) {
  const query = {
    classId: classId,
    isActive: true,
  };
  
  if (date) {
    query.date = date;
  }
  
  return this.find(query)
    .populate("child", "firstName lastName")
    .populate("recordedBy", "firstName lastName")
    .sort({ checkInTime: 1 });
};

// Static method to get attendance statistics
attendanceSchema.statics.getAttendanceStats = function (centerId, startDate, endDate) {
  const query = {
    date: { $gte: startDate, $lte: endDate },
    isActive: true,
  };
  
  if (centerId) {
    query.centerId = centerId;
  }
  
  return this.aggregate([
    { $match: query },
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);
};

const Attendance = mongoose.model("Attendance", attendanceSchema);

export default Attendance;
