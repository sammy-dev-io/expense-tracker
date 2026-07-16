// Similar pattern to AuthContext - a Context that holds ONE piece of shared
// state (whether we're in dark mode) plus a function to toggle it, available
// anywhere in the app via useThemeMode().

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

interface ThemeContextType {
  mode: "light" | "dark";
  toggleMode: () => void;
}

const ThemeModeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeModeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  // On first load, check localStorage for a saved preference.
  // If none exists yet, default to "light".
  const [mode, setMode] = useState<"light" | "dark">(() => {
    const saved = localStorage.getItem("themeMode");
    return saved === "dark" ? "dark" : "light";
  });

  // Whenever mode changes, save it - so refreshing the page (or coming back
  // tomorrow) remembers your last choice.
  useEffect(() => {
    localStorage.setItem("themeMode", mode);
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  // useMemo here means we only rebuild the MUI theme object when "mode"
  // actually changes, not on every single re-render of the app - a small
  // performance optimization, and a common pattern once you're building
  // themes like this.
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode, // MUI understands "light" and "dark" natively and re-colors
          // every single MUI component automatically based on this one value -
          // we don't have to manually restyle Paper, Table, Button, etc.
        },
      }),
    [mode]
  );

  return (
    <ThemeModeContext.Provider value={{ mode, toggleMode }}>
      <ThemeProvider theme={theme}>
        {/* CssBaseline resets some default browser styles AND applies the
            correct background color to <body> based on light/dark mode. */}
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};

export const useThemeMode = () => {
  const context = useContext(ThemeModeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within a ThemeModeProvider");
  }
  return context;
};