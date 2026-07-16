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
  const balance = totalIncome - totalExpenses;

  if (!user) {
    return showRegister ? (
      <Register onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <Login onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

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

      {/* Summary row: three side-by-side boxes showing Income, Expenses, Balance */}
      <Grid container spacing={2} sx={{ mb: 3, mt: 2 }}>
        <Grid size={4}>
          <Paper elevation={2} sx={{ p: 2, background: "#e8f5e9" }}>
            <Typography variant="caption" color="text.secondary">
              Total Income
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ₦{totalIncome.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={4}>
          <Paper elevation={2} sx={{ p: 2, background: "#ffebee" }}>
            <Typography variant="caption" color="text.secondary">
              Total Expenses
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ₦{totalExpenses.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
        <Grid size={4}>
          <Paper
            elevation={2}
            sx={{ p: 2, background: balance >= 0 ? "#e3f2fd" : "#fff3e0" }}
          >
            <Typography variant="caption" color="text.secondary">
              Balance
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              ₦{balance.toLocaleString()}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Tabs let the user switch between managing Expenses and Income,
          without needing two separate pages/routes for something this simple. */}
      <Tabs
        value={tab}
        onChange={(_, newValue) => setTab(newValue)}
        sx={{ mb: 3 }}
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