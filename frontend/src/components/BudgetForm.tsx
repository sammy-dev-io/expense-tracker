import React, { useState } from "react";
import { Box, TextField, MenuItem, Button, Paper, Typography } from "@mui/material";

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

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}
      >
        <TextField
          label="Category"
          select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          size="small"
          sx={{ minWidth: 150 }}
        >
          {CATEGORIES.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Monthly Limit"
          type="number"
          value={limitAmount}
          onChange={(e) => setLimitAmount(e.target.value)}
          size="small"
        />

        <Button type="submit" variant="contained">
          Save Limit
        </Button>
      </Box>
    </Paper>
  );
};

export default BudgetForm;