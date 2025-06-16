import { create } from "zustand";

// Function to apply theme globally
const applyTheme = (theme) => {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("preferred-theme", theme);
};

// Initialize theme on load
const storedTheme = localStorage.getItem("preferred-theme");
const initialTheme = storedTheme || "forest";
applyTheme(initialTheme);

export const useThemeStore = create((set) => ({
  theme: initialTheme,
  setTheme: (theme) => {
    applyTheme(theme);
    set({ theme });
  },
}));
