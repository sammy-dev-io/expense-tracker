const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
  createIncome,
  getAllIncome,
  updateIncome,
  deleteIncome,
} = require("../controllers/incomeController");

router.post("/", protect, createIncome);
router.get("/", protect, getAllIncome);
router.patch("/:id", protect, updateIncome);
router.delete("/:id", protect, deleteIncome);

module.exports = router;