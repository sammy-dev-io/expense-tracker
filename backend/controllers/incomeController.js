// This file is nearly identical in shape to expenseController.js -
// same pattern: every query scoped to "owner: req.userId".

const Income = require("../models/Income");

exports.createIncome = async (req, res) => {
  try {
    const income = await Income.create({
      ...req.body,
      owner: req.userId,
    });

    res.status(201).json({
      success: true,
      message: "Income added",
      income,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllIncome = async (req, res) => {
  try {
    const income = await Income.find({ owner: req.userId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: income.length,
      income,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateIncome = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedIncome = await Income.findOneAndUpdate(
      { _id: id, owner: req.userId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedIncome) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Income updated",
      income: updatedIncome,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteIncome = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedIncome = await Income.findOneAndDelete({
      _id: id,
      owner: req.userId,
    });

    if (!deletedIncome) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Income deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};