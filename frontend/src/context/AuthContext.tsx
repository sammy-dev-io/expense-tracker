// This is a React Context - a way to make some piece of data (here: who's
// logged in, and the login/logout functions) available to ANY component
// in the app, without manually passing it down through every level as props.
//
// Think of it like a radio broadcast: any component can "tune in" using
// the useAuth() hook at the bottom of this file, instead of the data
// having to be passed parent -> child -> child -> child manually.

import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { loginUser, registerUser, type User } from "../api/authApi";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

// createContext needs a default value - we'll never actually see this default,
// because AuthProvider below always supplies the real value. It's mostly
// here to satisfy TypeScript.
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // On first load, check if we already have a saved token from a previous
  // session (localStorage persists even after closing the browser tab).
  // This is what makes "staying logged in" after a refresh possible.
  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginUser(email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const register = async (name: string, email: string, password: string) => {
    const data = await registerUser(name, email, password);
    setToken(data.token);
    setUser(data.user);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// A small custom hook - lets any component just write:
//   const { user, logout } = useAuth();
// instead of importing useContext and AuthContext separately every time.
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};