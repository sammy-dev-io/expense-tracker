// Unlike BudgetList (where going HIGH is bad), here going high is the
// GOAL - the progress bar fills up as you get closer to your target,
// and turns green/complete once you hit or pass it.

import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  LinearProgress,
  IconButton,
  TextField,
  Button,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { SavingsGoal } from "../api/savingsGoalApi";

interface SavingsGoalListProps {
  goals: SavingsGoal[];
  onContribute: (id: string, amount: number) => void;
  onDelete: (id: string) => void;
}

const SavingsGoalList: React.FC<SavingsGoalListProps> = ({
  goals,
  onContribute,
  onDelete,
}) => {
  // Tracks what's typed into EACH goal's contribution input separately,
  // keyed by goal id - since multiple goals each need their own input value.
  const [contributions, setContributions] = useState<Record<string, string>>({});

  const handleContribute = (id: string) => {
    const amount = Number(contributions[id]);
    if (!amount || amount <= 0) {
      alert("Enter a valid contribution amount");
      return;
    }
    onContribute(id, amount);
    // Clear just this goal's input after contributing
    setContributions((prev) => ({ ...prev, [id]: "" }));
  };

  if (goals.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">
          No savings goals yet - create one above.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {goals.map((goal) => {
        const percent = Math.min(
          (goal.currentAmount / goal.targetAmount) * 100,
          100
        );
        const isComplete = goal.currentAmount >= goal.targetAmount;

        return (
          <Paper key={goal._id} elevation={3} sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 1,
              }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {goal.title} {isComplete && "🎉"}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  ₦{goal.currentAmount.toLocaleString()} / ₦
                  {goal.targetAmount.toLocaleString()}
                </Typography>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => onDelete(goal._id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>

            <LinearProgress
              variant="determinate"
              value={percent}
              color={isComplete ? "success" : "primary"}
              sx={{ height: 8, borderRadius: 4, mb: 1.5 }}
            />

            {!isComplete && (
              <Box sx={{ display: "flex", gap: 1 }}>
                <TextField
                  size="small"
                  type="number"
                  placeholder="Amount to add"
                  value={contributions[goal._id] || ""}
                  onChange={(e) =>
                    setContributions((prev) => ({
                      ...prev,
                      [goal._id]: e.target.value,
                    }))
                  }
                  sx={{ maxWidth: 160 }}
                />
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => handleContribute(goal._id)}
                >
                  Add Contribution
                </Button>
              </Box>
            )}
          </Paper>
        );
      })}
    </Box>
  );
};

export default SavingsGoalList;