// This file is the ONLY place that knows the backend's URL.
// Every component imports functions from here instead of writing
// "http://localhost:5000/..." repeatedly.

import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/expenses`;

export interface Expense {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: string;
  createdAt: string;
  isRecurring?: boolean;
  nextDueDate?: string;
}

export interface NewExpense {
  title: string;
  amount: number;
  category: string;
  isRecurring?: boolean;
}

// Every one of our protected backend routes now checks for a token in the
// Authorization header. This helper builds that header consistently,
// reading the token fresh from localStorage each time it's called -
// so it always uses whoever is CURRENTLY logged in.
const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getExpenses = async (): Promise<Expense[]> => {
  const response = await axios.get(API_BASE_URL, authHeader());
  return response.data.expenses;
};

export const createExpense = async (expense: NewExpense): Promise<Expense> => {
  const response = await axios.post(API_BASE_URL, expense, authHeader());
  return response.data.expense;
};

export const deleteExpense = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`, authHeader());
};

export const updateExpense = async (
  id: string,
  updates: NewExpense
): Promise<Expense> => {
  const response = await axios.patch(`${API_BASE_URL}/${id}`, updates, authHeader());
  return response.data.expense;
};