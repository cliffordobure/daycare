import mongoose from "mongoose";

const activityUpdateSchema = new mongoose.Schema({
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Activity",
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  childId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Child",
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  attachments: [String], // URLs to photos/files
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const activitySchema = new mongoose.Schema(
  {
    // Basic Information
    title: {
      type: String,
      required: [true, "Activity title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    startTime: {
      type: Date,
      required: [true, "Start time is required"],
    },
    endTime: {
      type: Date,
      required: [true, "End time is required"],
    },
    status: {
      type: String,
      enum: ["scheduled", "in_progress", "completed", "cancelled"],
      default: "scheduled",
    },
    type: {
      type: String,
      enum: [
        "academic",
        "art",
        "music",
        "physical",
        "social",
        "meal",
        "nap",
        "outdoor",
        "field_trip",
        "other",
      ],
      required: [true, "Activity type is required"],
    },

    // Participants
    childrenInvolved: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Child",
      },
    ],
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    centerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Center",
      required: true,
    },

    // Activity Details
    location: {
      type: String,
      trim: true,
    },
    materials: [String],
    notes: {
      type: String,
      trim: true,
    },

    // Updates and Progress
    updates: [activityUpdateSchema],

    // Photos and Media
    photos: [
      {
        url: String,
        caption: String,
        childId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Child",
        },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

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
activitySchema.virtual("duration").get(function () {
  if (this.startTime && this.endTime) {
    return this.endTime.getTime() - this.startTime.getTime();
  }
  return null;
});

// Virtual for duration in minutes
activitySchema.virtual("durationMinutes").get(function () {
  if (this.startTime && this.endTime) {
    return Math.round((this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60));
  }
  return null;
});

// Indexes for better query performance
activitySchema.index({ centerId: 1, startTime: 1 });
activitySchema.index({ teacherId: 1, startTime: 1 });
activitySchema.index({ childrenInvolved: 1 });
activitySchema.index({ status: 1 });
activitySchema.index({ type: 1 });
activitySchema.index({ startTime: 1, endTime: 1 });

// Pre-save middleware to validate time
activitySchema.pre("save", function (next) {
  if (this.startTime && this.endTime && this.startTime >= this.endTime) {
    return next(new Error("End time must be after start time"));
  }
  next();
});

// Static method to find activities by date range
activitySchema.statics.findByDateRange = function (startDate, endDate, centerId) {
  const query = {
    startTime: { $gte: startDate, $lte: endDate },
    isActive: true,
  };
  
  if (centerId) {
    query.centerId = centerId;
  }
  
  return this.find(query)
    .populate("childrenInvolved", "firstName lastName")
    .populate("teacherId", "firstName lastName")
    .sort({ startTime: 1 });
};

// Static method to find activities by child
activitySchema.statics.findByChild = function (childId, startDate, endDate) {
  const query = {
    childrenInvolved: childId,
    isActive: true,
  };
  
  if (startDate && endDate) {
    query.startTime = { $gte: startDate, $lte: endDate };
  }
  
  return this.find(query)
    .populate("teacherId", "firstName lastName")
    .sort({ startTime: 1 });
};

// Static method to find activities by teacher
activitySchema.statics.findByTeacher = function (teacherId, startDate, endDate) {
  const query = {
    teacherId: teacherId,
    isActive: true,
  };
  
  if (startDate && endDate) {
    query.startTime = { $gte: startDate, $lte: endDate };
  }
  
  return this.find(query)
    .populate("childrenInvolved", "firstName lastName")
    .sort({ startTime: 1 });
};

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
