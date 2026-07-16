const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const {
  createGoal,
  getAllGoals,
  contributeToGoal,
  deleteGoal,
} = require("../controllers/savingsGoalController");

router.post("/", protect, createGoal);
router.get("/", protect, getAllGoals);
router.patch("/:id/contribute", protect, contributeToGoal);
router.delete("/:id", protect, deleteGoal);

module.exports = router;