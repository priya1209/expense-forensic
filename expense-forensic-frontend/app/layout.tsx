import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Expense Forensic | Financial Intelligence",
  description: "Detect leaks and audit transactions with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistMono.className} bg-slate-950 text-slate-200 antialiased`}>
        {children}
      </body>
    </html>
  );
}