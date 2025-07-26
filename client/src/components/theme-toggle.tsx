import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Check for saved theme preference or default to dark
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const preferredTheme = savedTheme || "dark";
    setTheme(preferredTheme);
    applyTheme(preferredTheme);
  }, []);

  const applyTheme = (newTheme: "light" | "dark") => {
    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(newTheme);
    
    // Update CSS custom properties for light theme
    if (newTheme === "light") {
      root.style.setProperty("--background", "0 0% 100%");
      root.style.setProperty("--foreground", "222.2 84% 4.9%");
      root.style.setProperty("--muted", "210 40% 96%");
      root.style.setProperty("--muted-foreground", "215.4 16.3% 46.9%");
      root.style.setProperty("--border", "214.3 31.8% 91.4%");
      root.style.setProperty("--input", "214.3 31.8% 91.4%");
      root.style.setProperty("--card", "0 0% 100%");
      root.style.setProperty("--card-foreground", "222.2 84% 4.9%");
      root.style.setProperty("--primary", "262.1 83.3% 57.8%");
      root.style.setProperty("--primary-foreground", "210 40% 98%");
      root.style.setProperty("--secondary", "210 40% 96%");
      root.style.setProperty("--secondary-foreground", "222.2 84% 4.9%");
      root.style.setProperty("--accent", "210 40% 96%");
      root.style.setProperty("--accent-foreground", "222.2 84% 4.9%");
      root.style.setProperty("--destructive", "0 84.2% 60.2%");
      root.style.setProperty("--destructive-foreground", "210 40% 98%");
      root.style.setProperty("--ring", "262.1 83.3% 57.8%");
    } else {
      // Dark theme (default)
      root.style.setProperty("--background", "222.2 84% 4.9%");
      root.style.setProperty("--foreground", "210 40% 98%");
      root.style.setProperty("--muted", "217.2 32.6% 17.5%");
      root.style.setProperty("--muted-foreground", "215 20.2% 65.1%");
      root.style.setProperty("--border", "217.2 32.6% 17.5%");
      root.style.setProperty("--input", "217.2 32.6% 17.5%");
      root.style.setProperty("--card", "222.2 84% 4.9%");
      root.style.setProperty("--card-foreground", "210 40% 98%");
      root.style.setProperty("--primary", "263.4 70% 50.4%");
      root.style.setProperty("--primary-foreground", "210 40% 98%");
      root.style.setProperty("--secondary", "217.2 32.6% 17.5%");
      root.style.setProperty("--secondary-foreground", "210 40% 98%");
      root.style.setProperty("--accent", "217.2 32.6% 17.5%");
      root.style.setProperty("--accent-foreground", "210 40% 98%");
      root.style.setProperty("--destructive", "0 62.8% 30.6%");
      root.style.setProperty("--destructive-foreground", "210 40% 98%");
      root.style.setProperty("--ring", "263.4 70% 50.4%");
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="border-white/20 hover:bg-primary/20 hover:neon-text-cyan transition-all"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}