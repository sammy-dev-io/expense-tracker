// Notice the pattern throughout this file: every single database query now
// includes "owner: req.userId" somewhere. req.userId comes from our
// authMiddleware, which ran BEFORE these functions and confirmed who's asking.
// This is what makes expenses actually PRIVATE per user.

const Expense = require("../models/Expense");

// Small helper - given a date, return the SAME day next month.
// e.g. Jan 15 -> Feb 15. JavaScript's Date object handles the month
// rollover automatically (setMonth going past 11/December wraps to
// January of the next year on its own).
const addOneMonth = (date) => {
  const result = new Date(date);
  result.setMonth(result.getMonth() + 1);
  return result;
};

// This function is the heart of "recurring expenses." It runs every time
// a user asks for their expense list, and does this:
// 1. Find every recurring TEMPLATE (isRecurring: true) whose nextDueDate
//    has already passed.
// 2. For each one, create a brand new REAL expense entry (a one-off,
//    isRecurring: false) - this is the "auto-added" transaction the user
//    actually sees and that counts toward their totals.
// 3. Push the template's nextDueDate forward by a month (in a loop, in
//    case the user hasn't opened the app in 2+ months - we don't want to
//    silently skip a missed month).
//
// This approach means we DON'T need a constantly-running background
// server/cron job (a much more advanced setup) - the "catching up" simply
// happens the next time the user is actively using the app.
const processRecurringExpenses = async (ownerId) => {
  const now = new Date();

  const dueTemplates = await Expense.find({
    owner: ownerId,
    isRecurring: true,
    nextDueDate: { $lte: now },
  });

  for (const template of dueTemplates) {
    // Keep generating + advancing until this template's next due date
    // is safely in the future - handles catching up multiple missed months.
    while (template.nextDueDate <= now) {
      await Expense.create({
        owner: ownerId,
        title: template.title,
        amount: template.amount,
        category: template.category,
        date: template.nextDueDate,
        isRecurring: false, // the GENERATED entry is a normal one-off expense
      });

      template.nextDueDate = addOneMonth(template.nextDueDate);
    }

    await template.save();
  }
};

exports.createExpense = async (req, res) => {
  try {
    const expenseData = {
      ...req.body,
      owner: req.userId,
    };

    // If the user is creating this as a recurring template, calculate
    // when it should FIRST auto-generate: one month from today.
    if (expenseData.isRecurring) {
      expenseData.nextDueDate = addOneMonth(new Date());
    }

    const expense = await Expense.create(expenseData);

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
    // Catch up on any due recurring expenses BEFORE fetching the list,
    // so newly generated entries show up immediately in this same request.
    await processRecurringExpenses(req.userId);

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