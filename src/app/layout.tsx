import type { Metadata } from "next";
import { PrimeReactProvider } from "primereact/api";
import "./globals.css";

export const metadata: Metadata = {
  title: "Mission Creation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PrimeReactProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </PrimeReactProvider>
  );
}
