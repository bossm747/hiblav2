import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Initialize dark theme by default
const initializeTheme = () => {
  const theme = localStorage.getItem("theme");
  if (!theme) {
    // Set dark as default theme
    localStorage.setItem("theme", "dark");
    document.documentElement.classList.add("dark");
  } else if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

// Initialize theme immediately
initializeTheme();

createRoot(document.getElementById("root")!).render(<App />);
