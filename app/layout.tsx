import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Krishi Hub | Sign In",
  description: "Professional authentication page for Krishi Hub.",
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
