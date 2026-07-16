import axios from "axios";

const AUTH_BASE_URL = "http://localhost:5000/api/auth";

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
}

export const registerUser = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axios.post(`${AUTH_BASE_URL}/register`, {
    name,
    email,
    password,
  });
  return response.data;
};

export const loginUser = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const response = await axios.post(`${AUTH_BASE_URL}/login`, {
    email,
    password,
  });
  return response.data;
};