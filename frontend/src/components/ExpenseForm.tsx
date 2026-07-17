// This component is just a FORM. Its only job: collect title, amount,
// category from the user, and hand that data up to the parent (App.tsx)
// when the user clicks "Add Expense". It doesn't talk to the backend itself.

import React, { useState } from "react";
import {
  Box,
  TextField,
  MenuItem,
  Button,
  Paper,
  Typography,
  FormControlLabel,
  Checkbox,
  Grid,
} from "@mui/material";
import type { NewExpense } from "../api/expenseApi";

// These are the ONLY categories our backend schema allows (see Expense.js "enum").
// Keeping this list here too means the dropdown can never send an invalid value.
const CATEGORIES = ["Food", "Transport", "Rent", "Entertainment", "Health", "Other"];

interface ExpenseFormProps {
  // This is a FUNCTION passed down from the parent component.
  // When the form is submitted, we call this function and hand the new
  // expense data up to App.tsx, which is the one that actually calls the API.
  onAdd: (expense: NewExpense) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ onAdd }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food");
  const [isRecurring, setIsRecurring] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // stops the browser from doing a full page reload on submit

    // Basic validation - don't allow empty title or invalid amount
    if (!title.trim() || !amount || Number(amount) <= 0) {
      alert("Please enter a valid title and amount");
      return;
    }

    onAdd({
      title: title.trim(),
      amount: Number(amount), // the input gives us a string - convert to a number
      category,
      isRecurring,
    });

    // Reset the form back to empty after successful submit
    setTitle("");
    setAmount("");
    setCategory("Food");
    setIsRecurring(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Add Expense
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
          {/* Title + Amount paired on one row (from sm breakpoint up) */}
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              label="Amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              size="small"
              fullWidth
            />
          </Grid>

          {/* Category + recurring checkbox paired on the next row */}
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
            <FormControlLabel
              control={
                <Checkbox
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                />
              }
              label="Repeat monthly"
            />
          </Grid>

          {/* Button gets its own full-width row */}
          <Grid size={12}>
            <Button type="submit" variant="contained" fullWidth={false}>
              Add Expense
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default ExpenseForm;