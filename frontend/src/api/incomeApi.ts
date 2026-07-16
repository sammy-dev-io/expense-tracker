import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/income";

export interface Income {
  _id: string;
  source: string;
  amount: number;
  date: string;
}

export interface NewIncome {
  source: string;
  amount: number;
}

const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getIncome = async (): Promise<Income[]> => {
  const response = await axios.get(API_BASE_URL, authHeader());
  return response.data.income;
};

export const createIncome = async (income: NewIncome): Promise<Income> => {
  const response = await axios.post(API_BASE_URL, income, authHeader());
  return response.data.income;
};

export const deleteIncome = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`, authHeader());
};