import React, { useState } from "react";
import { Box, TextField, Button, Paper, Typography, Grid } from "@mui/material";

interface SavingsGoalFormProps {
  onAdd: (title: string, targetAmount: number) => void;
}

const SavingsGoalForm: React.FC<SavingsGoalFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !targetAmount || Number(targetAmount) <= 0) {
      alert("Please enter a valid goal name and target amount");
      return;
    }

    onAdd(title.trim(), Number(targetAmount));
    setTitle("");
    setTargetAmount("");
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Create a Savings Goal
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Goal Name"
              placeholder="e.g. New Laptop"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Target Amount"
              type="number"
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid size={12}>
            <Button type="submit" variant="contained">
              Create Goal
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default SavingsGoalForm;