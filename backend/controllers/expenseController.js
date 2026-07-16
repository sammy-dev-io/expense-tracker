// A "controller" holds the actual LOGIC for what happens on each route.
// The route file just says "when this URL is hit, run this function" -
// the function itself lives here.

const Expense = require("../models/Expense");

// CREATE - add a new expense
exports.createExpense = async (req, res) => {
  try {
    // req.body is the JSON data the frontend sent us,
    // e.g. { title: "Lunch", amount: 2000, category: "Food" }
    const expense = await Expense.create(req.body);

    res.status(201).json({
      success: true,
      message: "Expense added",
      expense,
    });
  } catch (error) {
    // this catches things like a missing required field, or an invalid category
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// READ - get all expenses
exports.getAllExpenses = async (req, res) => {
  try {
    // .sort({ date: -1 }) means newest expenses show up first
    const expenses = await Expense.find().sort({ date: -1 });

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

// UPDATE - edit an existing expense by its id
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params; // comes from the URL, e.g. /api/expenses/12345

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
      // new: true -> return the UPDATED document, not the old one
      // runValidators: true -> still enforce our schema rules (e.g. category enum) on update
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

// DELETE - remove an expense by its id
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedExpense = await Expense.findByIdAndDelete(id);

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