import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api/savings-goals";

export interface SavingsGoal {
  _id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
}

const authHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getGoals = async (): Promise<SavingsGoal[]> => {
  const response = await axios.get(API_BASE_URL, authHeader());
  return response.data.goals;
};

export const createGoal = async (
  title: string,
  targetAmount: number
): Promise<SavingsGoal> => {
  const response = await axios.post(
    API_BASE_URL,
    { title, targetAmount },
    authHeader()
  );
  return response.data.goal;
};

export const contributeToGoal = async (
  id: string,
  amount: number
): Promise<SavingsGoal> => {
  const response = await axios.patch(
    `${API_BASE_URL}/${id}/contribute`,
    { amount },
    authHeader()
  );
  return response.data.goal;
};

export const deleteGoal = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/${id}`, authHeader());
};