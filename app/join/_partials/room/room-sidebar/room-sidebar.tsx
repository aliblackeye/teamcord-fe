"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Participants } from "./participants";
import { ServerInfo } from "./server-info";
import { ServerList } from "./server-list";
import { Logo } from "./logo";

export const RoomSidebar = () => {
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
    <aside className="flex border-r-2 dark:bg-neutral-900 bg-neutral-100 ">
      <div className="flex flex-col !w-[60px]">
        <Logo />

        <ServerList />

        <div
          onClick={() => setTheme(dark ? "light" : "dark")}
          className="cursor-pointer min-h-[60px] text-primary flex items-center justify-center border-r "
        >
          {dark ? <Sun /> : <Moon />}
        </div>
      </div>
      <div className="flex flex-col dark:bg-neutral-900 bg-neutral-100">
        <ServerInfo />
        <Participants />
      </div>
    </aside>
  );
};
