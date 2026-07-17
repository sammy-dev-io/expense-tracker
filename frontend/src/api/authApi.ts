import axios from "axios";

// import.meta.env.VITE_API_URL reads from the .env file - this is Vite's
// way of injecting environment-specific values at build time. Locally it
// points to your own machine; once deployed, we'll set this to your real
// backend's live URL instead - the CODE itself never needs to change.
const AUTH_BASE_URL = `${import.meta.env.VITE_API_URL}/auth`;

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