"use client";

import { useSyncExternalStore } from "react";
import { HiMoon, HiSun } from "react-icons/hi2";

const subscribe = (onStoreChange: () => void) => {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener("rentsy-theme-change", onStoreChange);

  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener("rentsy-theme-change", onStoreChange);
  };
};

const getSnapshot = () => {
  return localStorage.getItem("rentsy-theme") === "dark";
};

const getServerSnapshot = () => false;

export default function ThemeToggle() {
  const darkMode = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const toggleTheme = () => {
    const nextTheme = !darkMode;

    if (nextTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("rentsy-theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("rentsy-theme", "light");
    }

    window.dispatchEvent(new Event("rentsy-theme-change"));
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        darkMode
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      title={darkMode ? "Light mode" : "Dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition-all duration-200 hover:border-[#6e13f9] hover:text-[#6e13f9] dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-[#8b45ff] dark:hover:text-[#a66cff]"
    >
      {darkMode ? (
        <HiSun className="h-[17px] w-[17px]" />
      ) : (
        <HiMoon className="h-[17px] w-[17px]" />
      )}
    </button>
  );
}