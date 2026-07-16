const SavingsGoal = require("../models/SavingsGoal");

// CREATE a brand new goal, always starting at currentAmount: 0
exports.createGoal = async (req, res) => {
  try {
    const { title, targetAmount } = req.body;

    if (!title || !targetAmount) {
      return res.status(400).json({
        success: false,
        message: "Title and targetAmount are required",
      });
    }

    const goal = await SavingsGoal.create({
      owner: req.userId,
      title,
      targetAmount,
    });

    res.status(201).json({
      success: true,
      message: "Savings goal created",
      goal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getAllGoals = async (req, res) => {
  try {
    const goals = await SavingsGoal.find({ owner: req.userId }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      goals,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// CONTRIBUTE - add money toward an existing goal.
// This is a DEDICATED action rather than a generic "update" - it's safer
// and clearer: the frontend just says "add 5000 to this goal" instead of
// having to first fetch the current amount, do math itself, then send the
// new total back (which risks two people's contributions overwriting
// each other if done at the same moment).
exports.contributeToGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Contribution amount must be greater than 0",
      });
    }

    // $inc is a MongoDB operator that increments a field ATOMICALLY -
    // meaning MongoDB itself handles "add this amount to whatever the
    // current value is" in one safe step, rather than us reading the
    // value, adding in JavaScript, then writing it back separately.
    const goal = await SavingsGoal.findOneAndUpdate(
      { _id: id, owner: req.userId },
      { $inc: { currentAmount: amount } },
      { new: true, runValidators: true }
    );

    if (!goal) {
      return res.status(404).json({
        success: false,
        message: "Savings goal not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Contribution added",
      goal,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteGoal = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await SavingsGoal.findOneAndDelete({
      _id: id,
      owner: req.userId,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Savings goal not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Savings goal deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};