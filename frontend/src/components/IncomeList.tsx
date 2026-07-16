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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Income } from "../api/incomeApi";

interface IncomeListProps {
  income: Income[];
  onDelete: (id: string) => void;
}

const IncomeList: React.FC<IncomeListProps> = ({ income, onDelete }) => {
  if (income.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
        <Typography color="text.secondary">
          No income logged yet - add some above.
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Source</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Date</TableCell>
            <TableCell align="center">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {income.map((item) => (
            <TableRow key={item._id} hover>
              <TableCell>{item.source}</TableCell>
              <TableCell align="right">
                ₦{item.amount.toLocaleString()}
              </TableCell>
              <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
              <TableCell align="center">
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => onDelete(item._id)}
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

export default IncomeList;