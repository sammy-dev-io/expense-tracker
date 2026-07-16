// This file just MAPS urls + HTTP methods to the functions in our controller.
// It doesn't contain any logic itself - it's like a receptionist that
// directs each request to the right department.

const express = require("express");
const router = express.Router();

const {
  createExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
} = require("../controllers/expenseController");

// Remember: these paths are relative to "/api/expenses"
// (that prefix was added in server.js: app.use("/api/expenses", expenseRoutes))

router.post("/", createExpense);        // POST   /api/expenses
router.get("/", getAllExpenses);        // GET    /api/expenses
router.patch("/:id", updateExpense);    // PATCH  /api/expenses/:id
router.delete("/:id", deleteExpense);   // DELETE /api/expenses/:id

module.exports = router;