const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  setBudget,
  getAllBudgets,
  deleteBudget,
} = require("../controllers/budgetController");

router.post("/", protect, setBudget);   // create OR update a category's limit
router.get("/", protect, getAllBudgets);
router.delete("/:id", protect, deleteBudget);

module.exports = router;