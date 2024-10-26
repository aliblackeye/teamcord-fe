"use client";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { SocketContextProvider } from "@/lib/context/socket-context";
import { UserContextProvider } from "@/lib/context/user-context";

export const Providers = ({ children, ...props }: ThemeProviderProps) => {
  return (
    <NextThemesProvider {...props}>
      <UserContextProvider>
        <SocketContextProvider>{children}</SocketContextProvider>
      </UserContextProvider>
    </NextThemesProvider>
  );
};
