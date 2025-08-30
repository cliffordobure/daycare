import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    firstName: {
      type: String,
      required: [true, "First name is required"],
      trim: true,
      maxlength: [50, "First name cannot exceed 50 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Last name is required"],
      trim: true,
      maxlength: [50, "Last name cannot exceed 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },

    // Authentication
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
      select: false,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,

    // Role and Permissions
    role: {
      type: String,
      enum: ["admin", "teacher", "parent"],
      required: [true, "User role is required"],
      default: "parent",
    },
    permissions: [
      {
        type: String,
        enum: [
          "manage_users",
          "manage_children",
          "manage_classes",
          "manage_attendance",
          "manage_activities",
          "manage_payments",
          "view_reports",
          "manage_health",
          "send_communications",
          "manage_curriculum",
          "manage_billing",
        ],
      },
    ],

    // Profile Information
    profilePicture: {
      type: String,
      default: null,
    },
    dateOfBirth: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer-not-to-say"],
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: {
        type: String,
        default: "Kenya",
      },
      postalCode: String,
    },

    // Language Preferences
    preferredLanguage: {
      type: String,
      enum: ["en", "sw"],
      default: "en",
    },

    // Emergency Contact
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
      email: String,
    },

    // Status and Verification
    isActive: {
      type: Boolean,
      default: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationToken: String,
    emailVerificationExpires: Date,

    // Teacher-specific fields
    teacherInfo: {
      employeeId: String,
      hireDate: Date,
      qualifications: [String],
      specializations: [String],
      assignedClasses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Class",
        },
      ],
    },

    // Parent-specific fields
    parentInfo: {
      children: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Child",
        },
      ],
      relationship: {
        type: String,
        enum: ["mother", "father", "guardian", "other"],
      },
      occupation: String,
      employer: String,
    },

    // Center Information
    center: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Center",
      required: function () {
        // Allow admin users to be created without center initially
        // They will be assigned a center during center registration
        return this.role === "teacher" || this.role === "parent";
      },
    },

    // Admin-specific fields
    adminInfo: {
      centerAccess: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Center",
        },
      ],
      adminLevel: {
        type: String,
        enum: ["super_admin", "center_admin", "manager"],
      },
    },

    // Notification Preferences
    notificationPreferences: {
      email: {
        type: Boolean,
        default: true,
      },
      sms: {
        type: Boolean,
        default: true,
      },
      push: {
        type: Boolean,
        default: true,
      },
      dailyReports: {
        type: Boolean,
        default: true,
      },
      paymentReminders: {
        type: Boolean,
        default: true,
      },
      emergencyAlerts: {
        type: Boolean,
        default: true,
      },
    },

    // Last Activity
    lastLogin: Date,
    lastActivity: Date,

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

// Virtual for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for display name
userSchema.virtual("displayName").get(function () {
  if (this.role === "teacher") {
    return `Teacher ${this.lastName}`;
  } else if (this.role === "parent") {
    return `${this.firstName} ${this.lastName}`;
  }
  return this.fullName;
});

// Indexes for better query performance
userSchema.index({ email: 1, center: 1 }); // Compound index for email + center
userSchema.index({ phone: 1, center: 1 }); // Compound index for phone + center
userSchema.index({ role: 1, center: 1 }); // Compound index for role + center
userSchema.index({ isActive: 1 });
userSchema.index({ center: 1 }); // Center-based queries
userSchema.index({ "teacherInfo.assignedClasses": 1 });
userSchema.index({ "parentInfo.children": 1 });

// Pre-save middleware to hash password
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to update passwordChangedAt
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// Instance method to check password
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if password was changed after token was issued
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method to get user permissions
userSchema.methods.hasPermission = function (permission) {
  return this.permissions.includes(permission);
};

// Instance method to check if user is admin
userSchema.methods.isAdmin = function () {
  return this.role === "admin";
};

// Instance method to check if user is teacher
userSchema.methods.isTeacher = function () {
  return this.role === "teacher";
};

// Instance method to check if user is parent
userSchema.methods.isParent = function () {
  return this.role === "parent";
};

// Static method to find active users
userSchema.statics.findActive = function () {
  return this.find({ isActive: true });
};

// Static method to find users by role
userSchema.statics.findByRole = function (role) {
  return this.find({ role, isActive: true });
};

const User = mongoose.model("User", userSchema);

export default User;
