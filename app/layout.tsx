import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PLUMECAST | Tactical Chemical Dispersion Command",
  description: "Real-time chemical plume dispersion modeling and emergency response tactical command system. Live weather integration, AI-powered threat assessment, and voice alerts.",
  keywords: ["chemical dispersion", "emergency response", "hazmat", "plume modeling", "tactical command"],
  authors: [{ name: "PlumeCast Systems" }],
  themeColor: "#00ff41",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased scanlines tactical-grid">
        {children}
      </body>
    </html>
  );
}
