import mongoose from "mongoose";

const centerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Center name is required"],
      trim: true,
      maxlength: [100, "Center name cannot exceed 100 characters"],
    },
    type: {
      type: String,
      enum: ["daycare", "preschool", "kindergarten", "nursery"],
      default: "daycare",
    },
    status: {
      type: String,
      enum: ["active", "inactive", "pending"],
      default: "active",
    },
    address: {
      street: {
        type: String,
        required: [true, "Street address is required"],
        trim: true,
      },
      city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
      },
      state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
      },
      country: {
        type: String,
        default: "Kenya",
        trim: true,
      },
      postalCode: String,
    },
    contactInfo: {
      phone: {
        type: String,
        required: [true, "Phone number is required"],
        trim: true,
      },
      email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
      },
      website: String,
    },
    capacity: {
      type: Number,
      required: [true, "Center capacity is required"],
      min: [1, "Capacity must be at least 1"],
    },
    currentOccupancy: {
      type: Number,
      default: 0,
      min: [0, "Current occupancy cannot be negative"],
    },
    occupancyRate: {
      type: Number,
      default: 0,
      min: [0, "Occupancy rate cannot be negative"],
      max: [100, "Occupancy rate cannot exceed 100%"],
    },
    operatingHours: {
      open: {
        type: String,
        default: "07:00",
      },
      close: {
        type: String,
        default: "18:00",
      },
      days: {
        type: [String],
        enum: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"],
        default: ["monday", "tuesday", "wednesday", "thursday", "friday"],
      },
    },
    facilities: [String],
    programs: [String],
    description: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    logo: String,
    images: [String],
    isActive: {
      type: Boolean,
      default: true,
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
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

// Virtual for occupancy percentage
centerSchema.virtual("occupancyPercentage").get(function () {
  if (this.capacity > 0) {
    return Math.round((this.currentOccupancy / this.capacity) * 100);
  }
  return 0;
});

// Pre-save middleware to calculate occupancy rate
centerSchema.pre("save", function (next) {
  if (this.capacity > 0) {
    this.occupancyRate = Math.round((this.currentOccupancy / this.capacity) * 100);
  }
  next();
});

// Indexes for better query performance
centerSchema.index({ name: 1 });
centerSchema.index({ status: 1 });
centerSchema.index({ "address.city": 1 });
centerSchema.index({ "address.state": 1 });
centerSchema.index({ isActive: 1 });

const Center = mongoose.model("Center", centerSchema);

export default Center;

