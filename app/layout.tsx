import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Providers } from "./providers";

import "./globals.css";
import { Header } from "@/components/layout/header";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: {
    default: "Teamcord",
    template: "%s | Teamcord",
  },
  description:
    "This app created for who want to chat with their friends. You can talk 1-1 or in group chats, video call, share your screen and more. Let's join us!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${poppins.className} antialiased`}>
        <Providers
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
