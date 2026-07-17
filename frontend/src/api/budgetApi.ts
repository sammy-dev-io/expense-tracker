import axios from "axios";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/budgets`;

export interface Budget {
  _id: string;
  category: string;
  limitAmount: number;
}

const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getBudgets = async (): Promise<Budget[]> => {
  const response = await axios.get(API_BASE_URL, authHeader());
  return response.data.budgets;
};

export const setBudget = async (
  category: string,
  limitAmount: number
): Promise<Budget> => {
  const response = await axios.post(
    API_BASE_URL,
    { category, limitAmount },
    authHeader()
  );
  return response.data.budget;
};

export const deleteBudget = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`, authHeader());
};