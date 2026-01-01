import { RootProvider } from "fumadocs-ui/provider/next";
import "./global.css";
import { JetBrains_Mono, Inter } from "next/font/google";
import type { ReactNode } from "react";
import type { Metadata } from "next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "haukTUI - Terminal UI Components",
    template: "%s | haukTUI",
  },
  description:
    "A shadcn-like component registry for beautiful Terminal UIs built with React and Ink. 57+ accessible, keyboard-navigable components.",
  keywords: [
    "terminal",
    "TUI",
    "CLI",
    "React",
    "Ink",
    "components",
    "shadcn",
    "UI",
  ],
  authors: [{ name: "haukTUI" }],
  openGraph: {
    title: "haukTUI - Terminal UI Components",
    description: "Build beautiful Terminal UIs with 57+ React/Ink components",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "haukTUI - Terminal UI Components",
    description: "Build beautiful Terminal UIs with 57+ React/Ink components",
  },
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrains.variable}`}
      suppressHydrationWarning
    >
      <body className="flex flex-col min-h-screen font-sans antialiased">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
