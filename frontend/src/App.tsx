// This is the "parent" component - it now does one more job besides
// managing expenses: deciding WHICH screen to show, based on whether
// someone is logged in or not.

import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  Button,
} from "@mui/material";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";
import {
  getExpenses,
  createExpense,
  deleteExpense,
  updateExpense,
  type Expense,
  type NewExpense,
} from "./api/expenseApi";

function App() {
  const { user, logout } = useAuth();

  // Tracks whether we're showing the Login screen or the Register screen,
  // for whenever "user" is null (nobody logged in yet).
  const [showRegister, setShowRegister] = useState(false);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [error, setError] = useState("");

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

  // IMPORTANT: this now depends on [user] instead of running only once.
  // Every time "user" changes (e.g. someone just logged in), this re-runs
  // and fetches THAT person's expenses fresh.
  useEffect(() => {
    if (user) {
      loadExpenses();
    } else {
      // If nobody's logged in (e.g. just logged out), clear the list -
      // otherwise the previous user's data would flash on screen briefly.
      setExpenses([]);
    }
  }, [user]);

  const handleAdd = async (newExpense: NewExpense) => {
    try {
      setError("");
      await createExpense(newExpense);
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

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  // ----- GATE: if nobody's logged in, show Login or Register instead -----
  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  // ----- Below here only ever renders once "user" exists -----
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Expense Tracker
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Welcome back, {user.name}
          </Typography>
        </Box>
        <Button variant="outlined" onClick={logout}>
          Log Out
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, mt: 2 }}>
          {error}
        </Alert>
      )}

      <Paper elevation={2} sx={{ p: 3, mb: 3, mt: 3, background: "#f5f5f5" }}>
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