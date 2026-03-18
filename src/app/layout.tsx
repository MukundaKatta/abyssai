import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AbyssAI - Reasoning-Focused AI Interface",
  description: "Chain-of-thought visualization, benchmark aggregation, and training efficiency tools for AI researchers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-surface-0 text-white antialiased">
        {children}
      </body>
    </html>
  );
}
