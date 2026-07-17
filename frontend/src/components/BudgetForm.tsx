import React, { useState } from "react";
import { Box, TextField, MenuItem, Button, Paper, Typography, Grid } from "@mui/material";

const CATEGORIES = ["Food", "Transport", "Rent", "Entertainment", "Health", "Other"];

interface BudgetFormProps {
  onSave: (category: string, limitAmount: number) => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onSave }) => {
  const [category, setCategory] = useState("Food");
  const [limitAmount, setLimitAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!limitAmount || Number(limitAmount) <= 0) {
      alert("Please enter a valid limit amount");
      return;
    }

    onSave(category, Number(limitAmount));
    setLimitAmount("");
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Set a Budget Limit
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Category"
              select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              size="small"
              fullWidth
            >
              {CATEGORIES.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Monthly Limit"
              type="number"
              value={limitAmount}
              onChange={(e) => setLimitAmount(e.target.value)}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid size={12}>
            <Button type="submit" variant="contained">
              Save Limit
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default BudgetForm;