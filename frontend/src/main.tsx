import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import { ThemeModeProvider } from "./context/ThemeContext.tsx";

// ThemeModeProvider wraps AuthProvider wraps App - order between these two
// doesn't actually matter much here, since they manage unrelated things,
// but AuthProvider is kept innermost-adjacent just to match how we built it.
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeModeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeModeProvider>
  </StrictMode>
);