// This is the "parent" component - it's the one actually responsible for:
// 1. Fetching expenses from the backend when the page loads
// 2. Calling the API when the form submits a new expense, or a row is deleted
// 3. Passing data DOWN to ExpenseForm and ExpenseList as props
//
// This pattern (parent fetches/owns data, children just display it and
// report user actions back up) is one of the most common patterns in React.

import { useEffect, useState } from "react";
import { Container, Typography, Box, Paper, Alert } from "@mui/material";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import {
  getExpenses,
  createExpense,
  deleteExpense,
  updateExpense,
  type Expense,
  type NewExpense,
} from "./api/expenseApi";

function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState("");

  // Fetches the expense list from the backend and stores it in state.
  const loadExpenses = async () => {
    try {
      setError("");
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error(err);
      setError("Could not load expenses. Is your backend running?");
    }
  };

  // useEffect with an empty [] dependency array means:
  // "run this once, right when the component first appears on screen."
  useEffect(() => {
    loadExpenses();
  }, []);

  const handleAdd = async (newExpense: NewExpense) => {
    try {
      setError("");
      await createExpense(newExpense);
      // After successfully adding, re-fetch the full list so it's up to date.
      // (A more advanced approach would update state directly without
      // re-fetching - but re-fetching is simpler to reason about while learning.)
      loadExpenses();
    } catch (err) {
      console.error(err);
      setError("Could not add expense.");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setError("");
      await deleteExpense(id);
      loadExpenses();
    } catch (err) {
      console.error(err);
      setError("Could not delete expense.");
    }
  };

  const handleUpdate = async (id: string, updates: NewExpense) => {
    try {
      setError("");
      await updateExpense(id, updates);
      loadExpenses();
    } catch (err) {
      console.error(err);
      setError("Could not update expense.");
    }
  };

  // Calculate the running total from whatever expenses are currently in state.
  // This is NOT stored separately - it's recalculated every render from the
  // current expenses array, so it's always accurate automatically.
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Expense Tracker
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Track what you spend, one expense at a time.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3, mb: 3, background: "#f5f5f5" }}>
        <Typography variant="subtitle2" color="text.secondary">
          Total Spent
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          ₦{total.toLocaleString()}
        </Typography>
      </Paper>

      <ExpenseForm onAdd={handleAdd} />

      <Box sx={{ mt: 3 }}>
        <ExpenseList
          expenses={expenses}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      </Box>
    </Container>
  );
}

export default App;