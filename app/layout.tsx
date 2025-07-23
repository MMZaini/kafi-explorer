import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import SearchProvider from "../components/SearchProvider";
import DarkModeToggle from "../components/DarkModeToggle";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "al-Kafi Explorer",
  description: "al-Kafi Explorer by Mahdi Z",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SearchProvider>
          <div className="p-4 flex justify-end">
            <DarkModeToggle />
          </div>
          {children}
        </SearchProvider>
      </body>
    </html>
  );
}
