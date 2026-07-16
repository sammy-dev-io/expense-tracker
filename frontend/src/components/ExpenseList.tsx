// This component just DISPLAYS the list of expenses it's given, and
// shows a delete button on each row. It doesn't fetch data itself -
// the parent (App.tsx) fetches the data and passes it down as a prop.

import React from "react";
import {
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Typography,
  Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Expense } from "../api/expenseApi";

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onDelete }) => {
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
          {/* .map() loops over every expense and renders one row each.
              "key" is required by React so it can track each row individually -
              we use _id since MongoDB guarantees it's unique. */}
          {expenses.map((expense) => (
            <TableRow key={expense._id} hover>
              <TableCell>{expense.title}</TableCell>
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
                  color="error"
                  size="small"
                  onClick={() => onDelete(expense._id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default ExpenseList;