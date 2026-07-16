// Notice the pattern throughout this file: every single database query now
// includes "owner: req.userId" somewhere. req.userId comes from our
// authMiddleware, which ran BEFORE these functions and confirmed who's asking.
// This is what makes expenses actually PRIVATE per user.

const Expense = require("../models/Expense");

exports.createExpense = async (req, res) => {
  try {
    // We combine the form data (req.body) with the owner id (req.userId) -
    // the frontend never sends the owner itself, we set it here ourselves,
    // so a user can never create an expense pretending to be someone else.
    const expense = await Expense.create({
      ...req.body,
      owner: req.userId,
    });

    res.status(201).json({
      success: true,
      message: "Expense added",
      expense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllExpenses = async (req, res) => {
  try {
    // ONLY find expenses belonging to the logged-in user - this is the
    // single most important line in this whole file.
    const expenses = await Expense.find({ owner: req.userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: expenses.length,
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;

    // findOneAndUpdate with BOTH _id AND owner in the filter means:
    // "only update this expense if it exists AND belongs to this user."
    // If someone tries to edit an expense that isn't theirs (by guessing an id),
    // this simply finds nothing and returns 404 - it won't touch it.
    const updatedExpense = await Expense.findOneAndUpdate(
      { _id: id, owner: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense updated",
      expense: updatedExpense,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExpense = await Expense.findOneAndDelete({
      _id: id,
      owner: req.userId,
    });

    if (!deletedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Expense deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};