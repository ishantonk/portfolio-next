import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ishan Tonk — Web Developer",
  description: "Portfolio of Ishan Tonk, full-stack web developer.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
