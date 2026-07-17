// This component displays the list AND now handles inline editing.
// "Inline" means the row itself turns into editable fields, rather than
// opening a separate popup/modal - simpler to build, and a common pattern.

import React, { useState } from "react";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  IconButton,
  Typography,
  Chip,
  TextField,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Close";
import RepeatIcon from "@mui/icons-material/Repeat";
import type { Expense, NewExpense } from "../api/expenseApi";

const CATEGORIES = ["Food", "Transport", "Rent", "Entertainment", "Health", "Other"];

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
  onUpdate: (id: string, updates: NewExpense) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  onDelete,
  onUpdate,
}) => {
  // editingId tracks WHICH row is currently being edited (by _id).
  // null means "no row is being edited right now" - the normal state.
  const [editingId, setEditingId] = useState<string | null>(null);

  // These hold the temporary edited values WHILE editing,
  // separate from the real data, so we can Cancel without losing anything.
  const [editTitle, setEditTitle] = useState("");
  const [editAmount, setEditAmount] = useState("");
  const [editCategory, setEditCategory] = useState("");

  const startEditing = (expense: Expense) => {
    setEditingId(expense._id);
    setEditTitle(expense.title);
    setEditAmount(String(expense.amount));
    setEditCategory(expense.category);
  };

  const cancelEditing = () => {
    setEditingId(null);
  };

  const saveEditing = (id: string) => {
    if (!editTitle.trim() || !editAmount || Number(editAmount) <= 0) {
      alert("Please enter a valid title and amount");
      return;
    }

    onUpdate(id, {
      title: editTitle.trim(),
      amount: Number(editAmount),
      category: editCategory,
    });

    setEditingId(null);
  };

  if (expenses.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">
          No expenses yet - add one above to get started.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3}>
      {/* TableContainer adds horizontal scrolling when the table is wider
          than the screen - without it, a 5-column table simply gets cut off
          and clipped on a narrow phone, with no way to see the hidden columns. */}
      <TableContainer sx={{ overflowX: "auto" }}>
        <Table>
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Category</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {expenses.map((expense) => {
            const isEditing = editingId === expense._id;

            return (
              <TableRow key={expense._id} hover>
                {isEditing ? (
                  // ----- EDIT MODE for this row -----
                  <>
                    <TableCell>
                      <TextField
                        size="small"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                      />
                    </TableCell>
                    <TableCell>
                      <TextField
                        size="small"
                        select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        sx={{ minWidth: 130 }}
                      >
                        {CATEGORIES.map((cat) => (
                          <MenuItem key={cat} value={cat}>
                            {cat}
                          </MenuItem>
                        ))}
                      </TextField>
                    </TableCell>
                    <TableCell align="right">
                      <TextField
                        size="small"
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(e.target.value)}
                        sx={{ width: 100 }}
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(expense.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="success"
                        size="small"
                        onClick={() => saveEditing(expense._id)}
                      >
                        <SaveIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" onClick={cancelEditing}>
                        <CancelIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </>
                ) : (
                  // ----- NORMAL (read-only) MODE for this row -----
                  <>
                    <TableCell>
                      {expense.title}
                      {expense.isRecurring && (
                        <RepeatIcon
                          fontSize="inherit"
                          sx={{ ml: 0.5, verticalAlign: "middle", opacity: 0.6 }}
                          titleAccess="Recurring monthly template - deleting this stops future auto-adds"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Chip label={expense.category} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      ₦{expense.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(expense.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        size="small"
                        onClick={() => startEditing(expense)}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        color="error"
                        size="small"
                        onClick={() => onDelete(expense._id)}
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </>
                )}
              </TableRow>
            );
          })}
        </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
};

export default ExpenseList;