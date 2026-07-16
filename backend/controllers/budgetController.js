const Budget = require("../models/Budget");

// SET a budget limit for a category. This is an "upsert" - if a budget
// already exists for this owner+category, UPDATE it. If not, CREATE it.
// This means the frontend only ever needs one action: "set the limit for
// Food to X" - it doesn't need to know whether one already existed.
exports.setBudget = async (req, res) => {
  try {
    const { category, limitAmount } = req.body;

    if (!category || limitAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Category and limitAmount are required",
      });
    }

    const budget = await Budget.findOneAndUpdate(
      { owner: req.userId, category },
      { limitAmount },
      {
        new: true, // return the updated document
        upsert: true, // create it if it doesn't exist yet
        runValidators: true,
      }
    );

    res.status(200).json({
      success: true,
      message: "Budget saved",
      budget,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ owner: req.userId });

    res.status(200).json({
      success: true,
      budgets,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteBudget = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Budget.findOneAndDelete({
      _id: id,
      owner: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Budget not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Budget removed",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};