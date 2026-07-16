const mongoose = require("mongoose");

const savingsGoalSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      // e.g. "New Laptop", "Emergency Fund"
      type: String,
      required: true,
      trim: true,
    },
    targetAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    currentAmount: {
      // How much has been saved toward this goal SO FAR.
      // Starts at 0, and grows each time the user "contributes" to it.
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SavingsGoal", savingsGoalSchema);