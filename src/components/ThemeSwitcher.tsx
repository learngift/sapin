import React, { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ThemeMode = "light" | "dark" | "system";

const ThemeSwitcher: React.FC = () => {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const stored = localStorage.getItem("theme");
    return stored === "dark" || stored === "light" ? stored : "system";
  });

  useEffect(() => {
    // Initialise et réagit aux changements du thème système
    const applySystemTheme = (event: MediaQueryListEvent) => {
      if (!localStorage.getItem("theme")) {
        document.documentElement.classList.toggle("dark", event.matches);
      }
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", applySystemTheme);

    if (!localStorage.getItem("theme")) {
      document.documentElement.classList.toggle("dark", mediaQuery.matches);
    }

    return () => {
      mediaQuery.removeEventListener("change", applySystemTheme);
    };
  }, []);

  useEffect(() => {
    // Appliquer la classe .dark selon le thème sélectionné
    if (theme === "system") {
      localStorage.removeItem("theme");
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      document.documentElement.classList.toggle("dark", mediaQuery.matches);
    } else {
      localStorage.setItem("theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
  }, [theme]);

  // Inspiré de https://ui.shadcn.com/docs/dark-mode/vite
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeSwitcher;
