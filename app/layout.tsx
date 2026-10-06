import type { Metadata } from "next";
import { LanguageProvider } from "./components/LanguageProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Evelyn Li — UI/UX Designer",
  description: "Evelyn Li is a UI/UX designer creating clear workflows and thoughtful digital experiences for work and everyday life.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
};

export default function RootLayout({children}:Readonly<{children:React.ReactNode}>){return <html lang="en"><body><LanguageProvider>{children}</LanguageProvider></body></html>}
