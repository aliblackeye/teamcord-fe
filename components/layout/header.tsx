"use client";

import { Moon, Sun } from "lucide-react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const Header = () => {
  const [dark, setDark] = useState<boolean>(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme === "dark") {
      setDark(true);
    } else {
      setDark(false);
    }
  }, [theme]);

  return (
    <header className="dark:bg-neutral-800 bg-gray-100 flex items-center justify-between   fixed top-0 left-0 right-0 z-50 pr-4">
      <div className="flex items-center  justify-center gap-4  text-2xl border-r w-[60px] h-16 bg-neutral-900 dark:bg-neutral-900 text-white">
        tc
      </div>
      <div
        onClick={() => setTheme(dark ? "light" : "dark")}
        className="cursor-pointer"
      >
        {dark ? <Sun /> : <Moon />}
      </div>
    </header>
  );
};
