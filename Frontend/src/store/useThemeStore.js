import { create } from "zustand";

export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("DarkPing-theme") || "coffee",
  setTheme: (theme) => {
    localStorage.setItem("DarkPing-theme", theme);
    set({ theme });
  },
}));