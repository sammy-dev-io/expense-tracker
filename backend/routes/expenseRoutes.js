// This file just MAPS urls + HTTP methods to the functions in our controller.
// It doesn't contain any logic itself - it's like a receptionist that
// directs each request to the right department.

const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

// Adding "protect" as a second argument here means:
// "before running this route's real function, run protect() first."
// If protect() calls next(), we continue to the real function below.
// If protect() sends an error response instead, we never reach it.

router.post("/", protect, createExpense);
router.get("/", protect, getAllExpenses);
router.patch("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);

module.exports = router;