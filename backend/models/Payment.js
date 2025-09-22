import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
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

    // Payment Details
    amount: {
      type: Number,
      required: [true, "Payment amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    currency: {
      type: String,
      default: "USD",
      enum: ["USD", "EUR", "GBP", "KES"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
    description: {
      type: String,
      required: [true, "Payment description is required"],
      trim: true,
      maxlength: [200, "Description cannot exceed 200 characters"],
    },

    // Payment Status
    status: {
      type: String,
      enum: ["pending", "paid", "overdue", "cancelled", "refunded"],
      default: "pending",
    },
    paidDate: {
      type: Date,
    },
    paidAmount: {
      type: Number,
      default: 0,
    },

    // Payment Method
    paymentMethod: {
      type: String,
      enum: ["cash", "check", "bank_transfer", "credit_card", "mobile_money", "other"],
    },
    paymentReference: {
      type: String,
      trim: true,
    },
    transactionId: {
      type: String,
      trim: true,
    },

    // Billing Information
    billingPeriod: {
      startDate: Date,
      endDate: Date,
    },
    billingType: {
      type: String,
      enum: ["monthly", "weekly", "daily", "one_time", "custom"],
      default: "monthly",
    },

    // Fees and Charges
    baseAmount: {
      type: Number,
      required: true,
    },
    additionalFees: [
      {
        description: String,
        amount: Number,
        type: {
          type: String,
          enum: ["late_fee", "late_pickup", "extra_hours", "field_trip", "supplies", "other"],
        },
      },
    ],
    discounts: [
      {
        description: String,
        amount: Number,
        type: {
          type: String,
          enum: ["sibling_discount", "early_payment", "referral", "promotional", "other"],
        },
      },
    ],

    // Payment History
    paymentHistory: [
      {
        amount: Number,
        paymentDate: Date,
        paymentMethod: String,
        reference: String,
        notes: String,
        recordedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],

    // Reminders and Notifications
    reminders: [
      {
        sentDate: Date,
        reminderType: {
          type: String,
          enum: ["due_soon", "overdue", "final_notice"],
        },
        sentVia: {
          type: String,
          enum: ["email", "sms", "push"],
        },
        notes: String,
      },
    ],

    // Notes and Comments
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    internalNotes: {
      type: String,
      trim: true,
      maxlength: [500, "Internal notes cannot exceed 500 characters"],
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

// Virtual for total amount including fees and discounts
paymentSchema.virtual("totalAmount").get(function () {
  let total = this.baseAmount || 0;
  
  // Add additional fees
  if (this.additionalFees) {
    total += this.additionalFees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
  }
  
  // Subtract discounts
  if (this.discounts) {
    total -= this.discounts.reduce((sum, discount) => sum + (discount.amount || 0), 0);
  }
  
  return Math.max(0, total);
});

// Virtual for remaining amount
paymentSchema.virtual("remainingAmount").get(function () {
  return Math.max(0, this.totalAmount - (this.paidAmount || 0));
});

// Virtual for days overdue
paymentSchema.virtual("daysOverdue").get(function () {
  if (this.status === "overdue" && this.dueDate) {
    const today = new Date();
    const diffTime = today.getTime() - this.dueDate.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  return 0;
});

// Virtual for is overdue
paymentSchema.virtual("isOverdue").get(function () {
  return this.status === "overdue" || (this.dueDate && new Date() > this.dueDate && this.status === "pending");
});

// Indexes for better query performance
paymentSchema.index({ childId: 1, dueDate: -1 });
paymentSchema.index({ centerId: 1, dueDate: -1 });
paymentSchema.index({ status: 1, dueDate: -1 });
paymentSchema.index({ dueDate: 1 });
paymentSchema.index({ paidDate: 1 });
paymentSchema.index({ billingPeriod: 1 });

// Pre-save middleware to update status based on due date
paymentSchema.pre("save", function (next) {
  const today = new Date();
  
  // Update status based on due date and payment status
  if (this.status === "pending" && this.dueDate && today > this.dueDate) {
    this.status = "overdue";
  }
  
  // Update paid date when payment is made
  if (this.status === "paid" && this.paidAmount >= this.totalAmount && !this.paidDate) {
    this.paidDate = new Date();
  }
  
  next();
});

// Static method to find payments by child
paymentSchema.statics.findByChild = function (childId, status) {
  const query = {
    childId: childId,
    isActive: true,
  };
  
  if (status) {
    query.status = status;
  }
  
  return this.find(query)
    .populate("childId", "firstName lastName")
    .sort({ dueDate: -1 });
};

// Static method to find overdue payments
paymentSchema.statics.findOverdue = function (centerId) {
  const query = {
    status: { $in: ["pending", "overdue"] },
    dueDate: { $lt: new Date() },
    isActive: true,
  };
  
  if (centerId) {
    query.centerId = centerId;
  }
  
  return this.find(query)
    .populate("childId", "firstName lastName")
    .populate("centerId", "name")
    .sort({ dueDate: 1 });
};

// Static method to get payment statistics
paymentSchema.statics.getPaymentStats = function (centerId, startDate, endDate) {
  const query = {
    createdAt: { $gte: startDate, $lte: endDate },
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
        totalAmount: { $sum: "$totalAmount" },
        paidAmount: { $sum: "$paidAmount" },
        pendingAmount: {
          $sum: {
            $cond: [
              { $eq: ["$status", "pending"] },
              { $subtract: ["$totalAmount", "$paidAmount"] },
              0
            ]
          }
        },
        overdueAmount: {
          $sum: {
            $cond: [
              { $eq: ["$status", "overdue"] },
              { $subtract: ["$totalAmount", "$paidAmount"] },
              0
            ]
          }
        },
        totalPayments: { $sum: 1 },
        paidPayments: {
          $sum: { $cond: [{ $eq: ["$status", "paid"] }, 1, 0] }
        },
        pendingPayments: {
          $sum: { $cond: [{ $eq: ["$status", "pending"] }, 1, 0] }
        },
        overduePayments: {
          $sum: { $cond: [{ $eq: ["$status", "overdue"] }, 1, 0] }
        },
      },
    },
  ]);
};

const Payment = mongoose.model("Payment", paymentSchema);

export default Payment;
