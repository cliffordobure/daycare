import mongoose from "mongoose";

const healthRecordSchema = new mongoose.Schema(
  {
    // Child Information
    childId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Child",
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
      default: Date.now,
    },

    // Vital Signs
    temperature: {
      value: {
        type: Number,
        min: [30, "Temperature too low"],
        max: [45, "Temperature too high"],
      },
      unit: {
        type: String,
        enum: ["celsius", "fahrenheit"],
        default: "celsius",
      },
    },
    bloodPressure: {
      systolic: Number,
      diastolic: Number,
    },
    heartRate: {
      value: Number,
      unit: {
        type: String,
        enum: ["bpm"],
        default: "bpm",
      },
    },
    respiratoryRate: {
      value: Number,
      unit: {
        type: String,
        enum: ["breaths_per_minute"],
        default: "breaths_per_minute",
      },
    },

    // Symptoms and Observations
    symptoms: [String],
    observations: {
      type: String,
      trim: true,
      maxlength: [500, "Observations cannot exceed 500 characters"],
    },

    // Medications
    medications: [
      {
        name: {
          type: String,
          required: true,
          trim: true,
        },
        dosage: {
          type: String,
          required: true,
          trim: true,
        },
        frequency: {
          type: String,
          required: true,
          trim: true,
        },
        administeredAt: {
          type: Date,
          default: Date.now,
        },
        administeredBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        notes: {
          type: String,
          trim: true,
        },
      },
    ],

    // Meals and Nutrition
    meals: [
      {
        mealType: {
          type: String,
          enum: ["breakfast", "lunch", "snack", "dinner"],
          required: true,
        },
        items: [String],
        amount: {
          type: String,
          enum: ["none", "little", "some", "most", "all"],
          default: "some",
        },
        notes: {
          type: String,
          trim: true,
        },
        time: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // Sleep and Rest
    sleep: {
      napTimes: [
        {
          startTime: Date,
          endTime: Date,
          duration: Number, // in minutes
          quality: {
            type: String,
            enum: ["poor", "fair", "good", "excellent"],
            default: "good",
          },
          notes: String,
        },
      ],
      totalSleepTime: Number, // in minutes
      sleepQuality: {
        type: String,
        enum: ["poor", "fair", "good", "excellent"],
        default: "good",
      },
    },

    // Behavior and Mood
    behavior: {
      mood: {
        type: String,
        enum: ["very_sad", "sad", "neutral", "happy", "very_happy"],
        default: "neutral",
      },
      energyLevel: {
        type: String,
        enum: ["very_low", "low", "normal", "high", "very_high"],
        default: "normal",
      },
      socialInteraction: {
        type: String,
        enum: ["withdrawn", "minimal", "normal", "active", "very_active"],
        default: "normal",
      },
      notes: {
        type: String,
        trim: true,
      },
    },

    // Physical Activity
    physicalActivity: {
      outdoorTime: Number, // in minutes
      indoorActivity: [String],
      notes: {
        type: String,
        trim: true,
      },
    },

    // Accidents and Incidents
    incidents: [
      {
        type: {
          type: String,
          enum: ["fall", "bump", "scrape", "bite", "other"],
          required: true,
        },
        description: {
          type: String,
          required: true,
          trim: true,
        },
        severity: {
          type: String,
          enum: ["minor", "moderate", "serious"],
          default: "minor",
        },
        time: {
          type: Date,
          default: Date.now,
        },
        location: String,
        actionTaken: String,
        parentNotified: {
          type: Boolean,
          default: false,
        },
        parentNotifiedAt: Date,
      },
    ],

    // General Notes
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Notes cannot exceed 1000 characters"],
    },

    // Recorded By
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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

// Indexes for better query performance
healthRecordSchema.index({ childId: 1, date: -1 });
healthRecordSchema.index({ centerId: 1, date: -1 });
healthRecordSchema.index({ recordedBy: 1, date: -1 });
healthRecordSchema.index({ date: 1 });

// Virtual for temperature in different units
healthRecordSchema.virtual("temperatureFahrenheit").get(function () {
  if (this.temperature && this.temperature.unit === "celsius") {
    return Math.round((this.temperature.value * 9/5 + 32) * 100) / 100;
  }
  return this.temperature?.value || null;
});

healthRecordSchema.virtual("temperatureCelsius").get(function () {
  if (this.temperature && this.temperature.unit === "fahrenheit") {
    return Math.round(((this.temperature.value - 32) * 5/9) * 100) / 100;
  }
  return this.temperature?.value || null;
});

// Virtual for total nap time
healthRecordSchema.virtual("totalNapTime").get(function () {
  if (this.sleep && this.sleep.napTimes) {
    return this.sleep.napTimes.reduce((total, nap) => total + (nap.duration || 0), 0);
  }
  return 0;
});

// Virtual for incident count
healthRecordSchema.virtual("incidentCount").get(function () {
  return this.incidents ? this.incidents.length : 0;
});

// Static method to find health records by child
healthRecordSchema.statics.findByChild = function (childId, startDate, endDate) {
  const query = {
    childId: childId,
    isActive: true,
  };
  
  if (startDate && endDate) {
    query.date = { $gte: startDate, $lte: endDate };
  }
  
  return this.find(query)
    .populate("recordedBy", "firstName lastName")
    .sort({ date: -1 });
};

// Static method to find health records by date range
healthRecordSchema.statics.findByDateRange = function (startDate, endDate, centerId) {
  const query = {
    date: { $gte: startDate, $lte: endDate },
    isActive: true,
  };
  
  if (centerId) {
    query.centerId = centerId;
  }
  
  return this.find(query)
    .populate("childId", "firstName lastName")
    .populate("recordedBy", "firstName lastName")
    .sort({ date: -1 });
};

// Static method to get health statistics
healthRecordSchema.statics.getHealthStats = function (centerId, startDate, endDate) {
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
        _id: null,
        totalRecords: { $sum: 1 },
        childrenWithSymptoms: {
          $sum: {
            $cond: [{ $gt: [{ $size: "$symptoms" }, 0] }, 1, 0]
          }
        },
        childrenWithMedications: {
          $sum: {
            $cond: [{ $gt: [{ $size: "$medications" }, 0] }, 1, 0]
          }
        },
        totalIncidents: {
          $sum: {
            $cond: [{ $gt: [{ $size: "$incidents" }, 0] }, { $size: "$incidents" }, 0]
          }
        },
        averageTemperature: { $avg: "$temperature.value" },
      },
    },
  ]);
};

const HealthRecord = mongoose.model("HealthRecord", healthRecordSchema);

export default HealthRecord;
