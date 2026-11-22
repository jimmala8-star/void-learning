import { useEffect, useState } from "react";
import { Outlet } from "react-router";
import Sidebar from "./Sidebar";
import Header from "./Header";

type Theme = "light" | "dark";

function getInitialTheme(): Theme {
  const savedTheme = localStorage.getItem("void-learning-theme");

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function Layout() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    // Enquanto o usuário não escolher manualmente, acompanha o tema do sistema.
    const savedTheme = localStorage.getItem("void-learning-theme");
    if (savedTheme === "light" || savedTheme === "dark") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => mediaQuery.removeEventListener("change", handleSystemThemeChange);
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "dark" ? "light" : "dark";
    localStorage.setItem("void-learning-theme", nextTheme);
    setTheme(nextTheme);
  }

  return (
    <div className="app-layout">
      <div className="void-topbar">
        <Sidebar />
        <Header theme={theme} onToggleTheme={toggleTheme} />
      </div>

      <main className="app-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
