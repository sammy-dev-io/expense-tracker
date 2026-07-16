const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      // Same categories as Expense, kept in sync manually for now.
      type: String,
      required: true,
      enum: ["Food", "Transport", "Rent", "Entertainment", "Health", "Other"],
    },
    limitAmount: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

// This is a COMPOUND UNIQUE INDEX - it tells MongoDB: "the combination of
// owner + category must be unique." One user can't have two separate
// budget limits for "Food" - setting a new one should update the existing
// one instead. We enforce "update instead of duplicate" in the controller.
budgetSchema.index({ owner: 1, category: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);