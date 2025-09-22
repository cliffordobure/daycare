import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
      maxlength: [100, "Class name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    ageGroup: {
      minAge: {
        type: Number,
        required: [true, "Minimum age is required"],
        min: [0, "Minimum age cannot be negative"],
      },
      maxAge: {
        type: Number,
        required: [true, "Maximum age is required"],
        min: [0, "Maximum age cannot be negative"],
      },
    },
    capacity: {
      type: Number,
      required: [true, "Class capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    currentEnrollment: {
      type: Number,
      default: 0,
      min: [0, "Current enrollment cannot be negative"],
    },
    enrollmentRate: {
      type: Number,
      default: 0,
      min: [0, "Enrollment rate cannot be negative"],
      max: [100, "Enrollment rate cannot exceed 100%"],
    },

    // Schedule Information
    schedule: {
      days: {
        type: [String],
        enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        required: [true, "At least one day must be selected"],
      },
      startTime: {
        type: String,
        required: [true, "Start time is required"],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please provide a valid time format (HH:MM)"],
      },
      endTime: {
        type: String,
        required: [true, "End time is required"],
        match: [/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Please provide a valid time format (HH:MM)"],
      },
      duration: {
        type: Number, // in minutes
        required: [true, "Duration is required"],
        min: [15, "Duration must be at least 15 minutes"],
      },
    },

    // Academic Information
    curriculum: {
      type: String,
      maxlength: [1000, "Curriculum description cannot exceed 1000 characters"],
    },
    learningObjectives: [String],
    activities: [String],
    materials: [String],

    // Staff Information
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    assistants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Room Information
    room: {
      name: String,
      number: String,
      capacity: Number,
      facilities: [String],
      notes: String,
    },

    // Status and Settings
    status: {
      type: String,
      enum: ["active", "inactive", "full", "waitlist"],
      default: "active",
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // Academic Year and Terms
    academicYear: {
      type: String,
      required: [true, "Academic year is required"],
    },
    term: {
      type: String,
      enum: ["fall", "spring", "summer", "full-year"],
      default: "full-year",
    },
    startDate: {
      type: Date,
      required: [true, "Start date is required"],
    },
    endDate: {
      type: Date,
      required: [true, "End date is required"],
    },

    // Pricing and Fees
    tuition: {
      monthly: {
        type: Number,
        required: [true, "Monthly tuition is required"],
        min: [0, "Tuition cannot be negative"],
      },
      registration: {
        type: Number,
        default: 0,
        min: [0, "Registration fee cannot be negative"],
      },
      materials: {
        type: Number,
        default: 0,
        min: [0, "Materials fee cannot be negative"],
      },
    },

    // Policies and Requirements
    policies: [String],
    requirements: [String],
    specialInstructions: String,

    // Audit Fields
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for enrollment percentage
classSchema.virtual("enrollmentPercentage").get(function () {
  if (this.capacity > 0) {
    return Math.round((this.currentEnrollment / this.capacity) * 100);
  }
  return 0;
});

// Virtual for available spots
classSchema.virtual("availableSpots").get(function () {
  return Math.max(0, this.capacity - this.currentEnrollment);
});

// Virtual for age range display
classSchema.virtual("ageRange").get(function () {
  return `${this.ageGroup.minAge}-${this.ageGroup.maxAge} years`;
});

// Virtual for schedule display
classSchema.virtual("scheduleDisplay").get(function () {
  if (!this.schedule || !this.schedule.days || !Array.isArray(this.schedule.days)) {
    return "Schedule not set";
  }
  const days = this.schedule.days.map(day => 
    day.charAt(0).toUpperCase() + day.slice(1)
  ).join(", ");
  return `${days} ${this.schedule.startTime}-${this.schedule.endTime}`;
});

// Pre-save middleware to calculate enrollment rate
classSchema.pre("save", function (next) {
  if (this.capacity > 0) {
    this.enrollmentRate = Math.round((this.currentEnrollment / this.capacity) * 100);
  }
  
  // Validate that end date is after start date
  if (this.startDate && this.endDate && this.startDate >= this.endDate) {
    return next(new Error("End date must be after start date"));
  }
  
  // Validate that max age is greater than min age
  if (this.ageGroup.maxAge <= this.ageGroup.minAge) {
    return next(new Error("Maximum age must be greater than minimum age"));
  }
  
  next();
});

// Indexes for better query performance
classSchema.index({ name: 1 });
classSchema.index({ status: 1 });
classSchema.index({ "ageGroup.minAge": 1, "ageGroup.maxAge": 1 });
classSchema.index({ "schedule.days": 1 });
classSchema.index({ academicYear: 1 });
classSchema.index({ term: 1 });
classSchema.index({ isActive: 1 });
classSchema.index({ teachers: 1 });

// Static method to find classes by age range
classSchema.statics.findByAgeRange = function (age) {
  return this.find({
    "ageGroup.minAge": { $lte: age },
    "ageGroup.maxAge": { $gte: age },
    isActive: true,
    status: "active",
  });
};

// Static method to find classes by teacher
classSchema.statics.findByTeacher = function (teacherId) {
  return this.find({
    $or: [
      { teachers: teacherId },
      { assistants: teacherId }
    ],
    isActive: true,
  });
};

// Static method to find available classes
classSchema.statics.findAvailable = function () {
  return this.find({
    isActive: true,
    status: "active",
    $expr: { $lt: ["$currentEnrollment", "$capacity"] }
  });
};

const Class = mongoose.model("Class", classSchema);

export default Class;

