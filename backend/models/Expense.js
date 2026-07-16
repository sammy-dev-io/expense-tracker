// This file defines the SHAPE of an Expense document in MongoDB.
// Mongoose calls this a "Schema" - it's basically a rulebook that says
// "every Expense saved to the database MUST look like this."

const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,       // must be text
      required: true,     // cannot be left empty
      trim: true,          // removes accidental extra spaces, e.g. "  Lunch  " -> "Lunch"
    },
    amount: {
      type: Number,
      required: true,
      min: 0,              // an expense can't be negative
    },
    category: {
      type: String,
      required: true,
      // enum = this field can ONLY be one of these exact values
      // this prevents typos like "Fod" or "food" (lowercase) sneaking in
      enum: ["Food", "Transport", "Rent", "Entertainment", "Health", "Other"],
      default: "Other",
    },
    date: {
      type: Date,
      default: Date.now,   // if you don't provide a date, use today automatically
    },
  },
  {
    // timestamps automatically adds "createdAt" and "updatedAt" fields
    // we don't have to manage these ourselves - Mongoose does it for us
    timestamps: true,
  }
);

// This turns our schema into an actual Model - a tool we can use
// in our controllers to create, find, update, and delete expenses.
// Mongoose will automatically create a MongoDB collection called "expenses"
// (lowercase + plural of "Expense") the first time we save one.
module.exports = mongoose.model("Expense", expenseSchema);