"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { SocketContextProvider } from "@/lib/context/socket-context";
import { UserContextProvider } from "@/lib/context/user-context";
import { TooltipProvider } from "@/components/ui/tooltip";

export const Providers = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider {...props}>
      <TooltipProvider delayDuration={250}>
        <UserContextProvider>
          <SocketContextProvider>{children}</SocketContextProvider>
        </UserContextProvider>
      </TooltipProvider>
    </NextThemesProvider>
  );
};
