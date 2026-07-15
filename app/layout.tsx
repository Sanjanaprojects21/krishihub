import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Krishi Hub | Fresh Produce Marketplace",
  description: "A trusted farm-to-market platform connecting farmers and buyers for fresher produce and fairer trade.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
