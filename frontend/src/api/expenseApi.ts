// This file is the ONLY place that knows the backend's URL.
// Every component below will import functions from here instead of
// writing "http://localhost:5000/..." over and over - if the backend
// address ever changes, we only fix it in one place.

import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/expenses";

// This matches the shape of an expense coming back from MongoDB.
// TypeScript will now warn us if we ever try to use a field that doesn't exist.
export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
}

// The shape of data we send WHEN CREATING an expense.
// Notice: no _id, no createdAt - MongoDB generates those automatically.
export interface NewExpense {
  title: string;
  amount: number;
  category: string;
}

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await axios.get(API_BASE_URL);
  // Our backend wraps the array inside { success, count, expenses }
  // so we reach into .data.expenses to get just the array itself.
  return response.data.expenses;
};

export const createExpense = async (expense: NewExpense): Promise<Expense> => {
  const response = await axios.post(API_BASE_URL, expense);
  return response.data.expense;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`);
};

export const updateExpense = async (
  id: string,
  updates: NewExpense
): Promise<Expense> => {
  const response = await axios.patch(`${API_BASE_URL}/${id}`, updates);
  return response.data.expense;
};