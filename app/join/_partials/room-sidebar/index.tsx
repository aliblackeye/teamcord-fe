"use client";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Participants } from "../participants";
import { ServerInfo } from "./server-info";
import { ServerList } from "./server-list";

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
    <aside className="flex border-r-2 dark:bg-neutral-900 bg-neutral-100">
      <div className="flex flex-col !w-[60px]">
        <div className="min-h-[63px] gap-2 flex-col border-r bg-neutral-900 h-16 flex items-center justify-end">
          <div className="min-w-10 min-h-10 text-2xl font-bold text-center flex justify-center items-center">
            tc
          </div>
          <hr className="w-8 h-1" />
        </div>

        <ServerList />

        <div
          onClick={() => setTheme(dark ? "light" : "dark")}
          className="cursor-pointer min-h-[60px] flex items-center justify-center border-r "
        >
          {dark ? <Sun /> : <Moon />}
        </div>
      </div>
      <div className="flex flex-col">
        <ServerInfo />
        <Participants />
      </div>
    </aside>
  );
};
