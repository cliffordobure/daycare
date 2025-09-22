import mongoose from "mongoose";

const childSchema = new mongoose.Schema(
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
    dateOfBirth: {
      type: Date,
      required: [true, "Date of birth is required"],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "Gender is required"],
    },

    // Parent/Guardian Information
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    parents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    emergencyContacts: [
      {
        name: {
          type: String,
          required: true,
        },
        relationship: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
        email: String,
        isPrimary: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Center Information
    centerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Center",
      required: true,
    },

    // Enrollment Information
    enrollmentDate: {
      type: Date,
      default: Date.now,
    },
    enrollmentStatus: {
      type: String,
      enum: ["enrolled", "waitlisted", "withdrawn", "graduated"],
      default: "enrolled",
    },
    expectedGraduationDate: Date,

    // Class Assignment
    currentClass: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
    },
    previousClasses: [
      {
        class: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Class",
        },
        startDate: Date,
        endDate: Date,
        reason: String,
      },
    ],

    // Health Information
    health: {
      allergies: [
        {
          allergen: String,
          severity: {
            type: String,
            enum: ["mild", "moderate", "severe"],
          },
          symptoms: [String],
          treatment: String,
          emergencyAction: String,
        },
      ],
      medications: [
        {
          name: String,
          dosage: String,
          frequency: String,
          startDate: Date,
          endDate: Date,
          notes: String,
          requiresAdmin: {
            type: Boolean,
            default: false,
          },
        },
      ],
      medicalConditions: [
        {
          condition: String,
          diagnosis: String,
          diagnosedDate: Date,
          treatment: String,
          notes: String,
        },
      ],
      immunizations: [
        {
          vaccine: String,
          dateGiven: Date,
          nextDueDate: Date,
          notes: String,
        },
      ],
      bloodType: String,
      height: [
        {
          value: Number,
          unit: {
            type: String,
            enum: ["cm", "inches"],
            default: "cm",
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      weight: [
        {
          value: Number,
          unit: {
            type: String,
            enum: ["kg", "lbs"],
            default: "kg",
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
      headCircumference: [
        {
          value: Number,
          unit: {
            type: String,
            enum: ["cm", "inches"],
            default: "cm",
          },
          date: {
            type: Date,
            default: Date.now,
          },
        },
      ],
    },

    // Development Milestones
    milestones: [
      {
        domain: {
          type: String,
          enum: ["cognitive", "social", "physical", "language", "emotional"],
        },
        milestone: String,
        expectedAge: Number,
        achievedAge: Number,
        achievedDate: Date,
        notes: String,
        photos: [String],
        videos: [String],
      },
    ],

    // Dietary Information
    dietary: {
      restrictions: [String],
      preferences: [String],
      intolerances: [String],
      specialInstructions: String,
      mealPlan: {
        breakfast: [String],
        lunch: [String],
        snack: [String],
      },
    },

    // Sleep Information
    sleep: {
      napSchedule: [
        {
          time: String,
          duration: Number,
          notes: String,
        },
      ],
      sleepPreferences: [String],
      sleepIssues: [String],
    },

    // Behavioral Information
    behavior: {
      strengths: [String],
      challenges: [String],
      triggers: [String],
      calmingTechniques: [String],
      rewardSystem: String,
    },

    // Special Needs
    specialNeeds: {
      hasSpecialNeeds: {
        type: Boolean,
        default: false,
      },
      conditions: [String],
      accommodations: [String],
      supportRequired: [String],
      iepPlan: String,
    },

    // Profile Picture
    profilePicture: {
      type: String,
      default: null,
    },

    // Current Status
    isPresent: {
      type: Boolean,
      default: false,
    },
    lastActivity: {
      type: String,
      trim: true,
    },
    lastUpdate: {
      type: Date,
      default: Date.now,
    },

    // Photos and Media
    photos: [
      {
        url: String,
        caption: String,
        date: {
          type: Date,
          default: Date.now,
        },
        category: {
          type: String,
          enum: ["daily", "milestone", "activity", "portrait"],
        },
      },
    ],

    // Documents
    documents: [
      {
        name: String,
        type: {
          type: String,
          enum: [
            "birth_certificate",
            "medical_form",
            "enrollment_form",
            "other",
          ],
        },
        url: String,
        uploadDate: {
          type: Date,
          default: Date.now,
        },
        expiryDate: Date,
      },
    ],

    // Notes and Observations
    notes: [
      {
        content: String,
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        date: {
          type: Date,
          default: Date.now,
        },
        category: {
          type: String,
          enum: [
            "general",
            "behavioral",
            "academic",
            "health",
            "parent_communication",
          ],
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

// Virtual for full name
childSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Virtual for age
childSchema.virtual("age").get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
});

// Virtual for age in months
childSchema.virtual("ageInMonths").get(function () {
  if (!this.dateOfBirth) return null;
  const today = new Date();
  const birthDate = new Date(this.dateOfBirth);
  const yearDiff = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  return yearDiff * 12 + monthDiff;
});

// Virtual for current health status
childSchema.virtual("currentHealthStatus").get(function () {
  const today = new Date();
  const lastHeight = this.health.height[this.health.height.length - 1];
  const lastWeight = this.health.weight[this.health.weight.length - 1];

  return {
    lastHeight: lastHeight || null,
    lastWeight: lastWeight || null,
    lastHeightDate: lastHeight?.date || null,
    lastWeightDate: lastWeight?.date || null,
  };
});

// Indexes for better query performance
childSchema.index({ firstName: 1, lastName: 1 });
childSchema.index({ dateOfBirth: 1 });
childSchema.index({ currentClass: 1 });
childSchema.index({ enrollmentStatus: 1 });
childSchema.index({ parents: 1 });
childSchema.index({ isActive: 1 });

// Pre-save middleware to ensure only one primary emergency contact
childSchema.pre("save", function (next) {
  if (this.emergencyContacts && this.emergencyContacts.length > 0) {
    const primaryContacts = this.emergencyContacts.filter(
      (contact) => contact.isPrimary
    );
    if (primaryContacts.length > 1) {
      // Keep only the first one as primary
      this.emergencyContacts.forEach((contact, index) => {
        contact.isPrimary = index === 0;
      });
    }
  }
  next();
});

// Static method to find children by age range
childSchema.statics.findByAgeRange = function (minAge, maxAge) {
  const today = new Date();
  const minDate = new Date(
    today.getFullYear() - maxAge,
    today.getMonth(),
    today.getDate()
  );
  const maxDate = new Date(
    today.getFullYear() - minAge,
    today.getMonth(),
    today.getDate()
  );

  return this.find({
    dateOfBirth: { $gte: minDate, $lte: maxDate },
    isActive: true,
  });
};

// Static method to find children by class
childSchema.statics.findByClass = function (classId) {
  return this.find({ currentClass: classId, isActive: true });
};

// Static method to find children by parent
childSchema.statics.findByParent = function (parentId) {
  return this.find({ parents: parentId, isActive: true });
};

const Child = mongoose.model("Child", childSchema);

export default Child;
