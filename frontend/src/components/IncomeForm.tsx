import React, { useState } from "react";
import { Box, TextField, Button, Paper, Typography } from "@mui/material";
import type { NewIncome } from "../api/incomeApi";

interface IncomeFormProps {
  onAdd: (income: NewIncome) => void;
}

const IncomeForm: React.FC<IncomeFormProps> = ({ onAdd }) => {
  const [source, setSource] = useState("");
  const [amount, setAmount] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!source.trim() || !amount || Number(amount) <= 0) {
      alert("Please enter a valid source and amount");
      return;
    }

    onAdd({
      source: source.trim(),
      amount: Number(amount),
    });

    setSource("");
    setAmount("");
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Add Income
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: "flex", gap: 2, flexWrap: "wrap", alignItems: "center" }}
      >
        <TextField
          label="Source"
          placeholder="e.g. Salary, Freelance"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          size="small"
        />

        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          size="small"
        />

        <Button type="submit" variant="contained" color="success">
          Add Income
        </Button>
      </Box>
    </Paper>
  );
};

export default IncomeForm;