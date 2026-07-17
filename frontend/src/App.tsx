import { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Box,
  Paper,
  Alert,
  Button,
  Tabs,
  Tab,
  Grid,
  IconButton,
} from "@mui/material";
import ExpenseForm from "./components/ExpenseForm";
import ExpenseList from "./components/ExpenseList";
import IncomeForm from "./components/IncomeForm";
import IncomeList from "./components/IncomeList";
import BudgetForm from "./components/BudgetForm";
import BudgetList from "./components/BudgetList";
import SavingsGoalForm from "./components/SavingsGoalForm";
import SavingsGoalList from "./components/SavingsGoalList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./context/AuthContext";
import { useThemeMode } from "./context/ThemeContext";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { alpha, useTheme } from "@mui/material/styles";
import {
  getExpenses,
  createExpense,
  deleteExpense,
  updateExpense,
  type Expense,
  type NewExpense,
} from "./api/expenseApi";
import {
  getIncome,
  createIncome,
  deleteIncome,
  type Income,
  type NewIncome,
} from "./api/incomeApi";
import { getBudgets, setBudget, deleteBudget, type Budget } from "./api/budgetApi";
import {
  getGoals,
  createGoal,
  contributeToGoal,
  deleteGoal,
  type SavingsGoal,
} from "./api/savingsGoalApi";

function App() {
  const { user, logout } = useAuth();
  const { mode, toggleMode } = useThemeMode();
  const theme = useTheme();
  const [showRegister, setShowRegister] = useState(false);

  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [goals, setGoals] = useState<SavingsGoal[]>([]);
  const [error, setError] = useState("");

  // "tab" tracks which section is currently visible: 0 = Expenses, 1 = Income.
  // Using a number here matches how MUI's <Tabs> component works internally.
  const [tab, setTab] = useState(0);

  const loadExpenses = async () => {
    try {
      const data = await getExpenses();
      setExpenses(data);
    } catch (err) {
      console.error(err);
      setError("Could not load expenses. Is your backend running?");
    }
  };

  const loadIncome = async () => {
    try {
      const data = await getIncome();
      setIncome(data);
    } catch (err) {
      console.error(err);
      setError("Could not load income. Is your backend running?");
    }
  };

  const loadBudgets = async () => {
    try {
      const data = await getBudgets();
      setBudgets(data);
    } catch (err) {
      console.error(err);
      setError("Could not load budgets. Is your backend running?");
    }
  };

  const loadGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (err) {
      console.error(err);
      setError("Could not load savings goals. Is your backend running?");
    }
  };

  useEffect(() => {
    if (user) {
      loadExpenses();
      loadIncome();
      loadBudgets();
      loadGoals();
    } else {
      setExpenses([]);
      setIncome([]);
      setBudgets([]);
      setGoals([]);
    }
  }, [user]);

  const handleAddExpense = async (newExpense: NewExpense) => {
    // Prevent spending more than what's actually available. "balance" here
    // already accounts for income, existing expenses, AND money set aside
    // in savings goals - so this check reflects the REAL spendable amount,
    // not just raw income.
    if (newExpense.amount > balance) {
      setError(
        `You can't add this expense - it exceeds your available balance of ₦${balance.toLocaleString()}`
      );
      return;
    }

    try {
      setError("");
      await createExpense(newExpense);
      loadExpenses();
    } catch (err) {
      console.error(err);
      setError("Could not add expense.");
    }
  };

  const handleDeleteExpense = async (id: string) => {
    try {
      setError("");
      await deleteExpense(id);
      loadExpenses();
    } catch (err) {
      console.error(err);
      setError("Could not delete expense.");
    }
  };

  const handleUpdateExpense = async (id: string, updates: NewExpense) => {
    // Find the expense as it EXISTS RIGHT NOW, before this edit.
    const existing = expenses.find((e) => e._id === id);

    if (existing) {
      // Only the INCREASE matters here. If you're editing a ₦2,000 expense
      // down to ₦1,000, that's fine regardless of balance - you're freeing
      // up money, not spending more. We only block it if the new amount is
      // MORE than the old one, by more than what's currently available.
      const increase = updates.amount - existing.amount;
      if (increase > balance) {
        setError(
          `You can't increase this expense - it would exceed your available balance of ₦${balance.toLocaleString()}`
        );
        return;
      }
    }

    try {
      setError("");
      await updateExpense(id, updates);
      loadExpenses();
    } catch (err) {
      console.error(err);
      setError("Could not update expense.");
    }
  };

  const handleAddIncome = async (newIncome: NewIncome) => {
    try {
      setError("");
      await createIncome(newIncome);
      loadIncome();
    } catch (err) {
      console.error(err);
      setError("Could not add income.");
    }
  };

  const handleDeleteIncome = async (id: string) => {
    try {
      setError("");
      await deleteIncome(id);
      loadIncome();
    } catch (err) {
      console.error(err);
      setError("Could not delete income.");
    }
  };

  const handleSaveBudget = async (category: string, limitAmount: number) => {
    try {
      setError("");
      await setBudget(category, limitAmount);
      loadBudgets();
    } catch (err) {
      console.error(err);
      setError("Could not save budget.");
    }
  };

  const handleDeleteBudget = async (id: string) => {
    try {
      setError("");
      await deleteBudget(id);
      loadBudgets();
    } catch (err) {
      console.error(err);
      setError("Could not delete budget.");
    }
  };

  const handleAddGoal = async (title: string, targetAmount: number) => {
    try {
      setError("");
      await createGoal(title, targetAmount);
      loadGoals();
    } catch (err) {
      console.error(err);
      setError("Could not create savings goal.");
    }
  };

  const handleContributeToGoal = async (id: string, amount: number) => {
    try {
      setError("");
      await contributeToGoal(id, amount);
      loadGoals();
    } catch (err) {
      console.error(err);
      setError("Could not add contribution.");
    }
  };

  const handleDeleteGoal = async (id: string) => {
    try {
      setError("");
      await deleteGoal(id);
      loadGoals();
    } catch (err) {
      console.error(err);
      setError("Could not delete savings goal.");
    }
  };

  // Both totals are derived (calculated fresh) from state every render -
  // never stored separately, so they can never drift out of sync with
  // the actual list of expenses/income.
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  // Money already contributed toward savings goals is treated as "set aside" -
  // no longer freely spendable, even though it hasn't left your account.
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);
  const balance = totalIncome - totalExpenses - totalSaved;

  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, sm: 5 }, px: { xs: 2, sm: 3 } }}>
      <Box
        sx={{
          display: "flex",
          // Stay on ONE row even on mobile - we just shrink the elements
          // instead of stacking, so Logout/theme toggle stay visually
          // anchored top-right next to the welcome text, not pushed below it.
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 1,
          mb: 1,
          flexWrap: "nowrap",
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="h4"
            noWrap
            sx={{ fontWeight: 700, fontSize: { xs: "1.15rem", sm: "2.125rem" } }}
          >
            Expense Tracker
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            noWrap
            sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" } }}
          >
            Welcome back, {user.name}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1 }, flexShrink: 0 }}>
          <IconButton
            onClick={toggleMode}
            color="inherit"
            size="small"
          >
            {mode === "dark" ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </IconButton>
          <Button
            variant="outlined"
            onClick={logout}
            size="small"
            sx={{ fontSize: { xs: "0.7rem", sm: "0.875rem" }, px: { xs: 1, sm: 2 } }}
          >
            Log Out
          </Button>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, mt: 2 }}>
          {error}
        </Alert>
      )}

      {/* Summary row: four boxes, but responsive - 2 per row on phones (xs),
          4 per row from tablet size up (sm+). Without this, size={3} alone
          forces 4 cramped tiny boxes on a narrow phone screen. */}
      <Grid container spacing={2} sx={{ mb: 3, mt: 2 }}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.success.main, mode === "dark" ? 0.2 : 0.12),
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Total Income
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ₦{totalIncome.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.error.main, mode === "dark" ? 0.2 : 0.12),
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Total Expenses
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ₦{totalExpenses.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              bgcolor: alpha(theme.palette.secondary.main, mode === "dark" ? 0.2 : 0.12),
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Total Saved
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ₦{totalSaved.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Paper
            elevation={2}
            sx={{
              p: 2,
              bgcolor: alpha(
                balance >= 0 ? theme.palette.info.main : theme.palette.warning.main,
                mode === "dark" ? 0.2 : 0.12
              ),
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Available Balance
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ₦{balance.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs: scrollable + swipeable on small screens, since 4 tab labels
          don't comfortably fit on a narrow phone width otherwise. */}
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        sx={{ mb: 3 }}
        variant="scrollable"
        scrollButtons="auto"
        allowScrollButtonsMobile
      >
        <Tab label="Expenses" />
        <Tab label="Income" />
        <Tab label="Budgets" />
        <Tab label="Savings Goals" />
      </Tabs>

      {tab === 0 && (
        <>
          <ExpenseForm onAdd={handleAddExpense} />
          <Box sx={{ mt: 3 }}>
            <ExpenseList
              expenses={expenses}
              onDelete={handleDeleteExpense}
              onUpdate={handleUpdateExpense}
            />
          </Box>
        </>
      )}

      {tab === 1 && (
        <>
          <IncomeForm onAdd={handleAddIncome} />
          <Box sx={{ mt: 3 }}>
            <IncomeList income={income} onDelete={handleDeleteIncome} />
          </Box>
        </>
      )}

      {tab === 2 && (
        <>
          <BudgetForm onSave={handleSaveBudget} />
          <BudgetList
            budgets={budgets}
            expenses={expenses}
            onDelete={handleDeleteBudget}
          />
        </>
      )}

      {tab === 3 && (
        <>
          <SavingsGoalForm onAdd={handleAddGoal} />
          <SavingsGoalList
            goals={goals}
            onContribute={handleContributeToGoal}
            onDelete={handleDeleteGoal}
          />
        </>
      )}
    </Container>
  );
}

export default App;