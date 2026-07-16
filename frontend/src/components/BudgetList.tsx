// This component takes TWO separate data sources and combines them:
// 1. budgets - the limits the user has set (from the Budget model)
// 2. expenses - the actual spending (from the Expense model)
//
// It calculates "how much has been spent in THIS category" by filtering
// and summing the expenses array itself - the backend never calculates
// this for us, it's pure frontend math on data we already have.

import React from "react";
import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Budget } from "../api/budgetApi";
import type { Expense } from "../api/expenseApi";

interface BudgetListProps {
  budgets: Budget[];
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const BudgetList: React.FC<BudgetListProps> = ({
  budgets,
  expenses,
  onDelete,
}) => {
  if (budgets.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">
          No budget limits set yet - add one above.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {budgets.map((budget) => {
        // Sum every expense that matches THIS budget's category.
        const spent = expenses
          .filter((e) => e.category === budget.category)
          .reduce((sum, e) => sum + e.amount, 0);

        const percentUsed = Math.min(
          (spent / budget.limitAmount) * 100,
          100
        );

        // Color logic: green while safely under budget, orange when close,
        // red once at or over the limit. This is the "conditional styling"
        // that makes a progress bar actually useful, not just decorative.
        let color: "success" | "warning" | "error" = "success";
        if (spent >= budget.limitAmount) {
          color = "error";
        } else if (percentUsed >= 80) {
          color = "warning";
        }

        return (
          <Paper key={budget._id} elevation={3} sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {budget.category}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  ₦{spent.toLocaleString()} / ₦{budget.limitAmount.toLocaleString()}
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(budget._id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <LinearProgress
              variant="determinate"
              value={percentUsed}
              color={color}
              sx={{ height: 8, borderRadius: 4 }}
            />

            {spent >= budget.limitAmount && (
              <Typography
                variant="caption"
                color="error"
                sx={{ display: "block", mt: 0.5 }}
              >
                You've gone over this budget by ₦
                {(spent - budget.limitAmount).toLocaleString()}
              </Typography>
            )}
          </Paper>
        );
      })}
    </Box>
  );
};

export default BudgetList;