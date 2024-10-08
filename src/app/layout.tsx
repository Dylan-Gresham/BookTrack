// NextJS imports
import type { Metadata } from "next";
import { Inter } from "next/font/google";

// Component imports
import Footer from "./components/footer";
import { Providers } from "./components/providers";

// CSS import
import "./styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

// Set project metadata
export const metadata: Metadata = {
  title: "BookTrack",
  description: "A personal library tracking application made by Dylan Gresham",
};

// Define root layout
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* This provider allows everything that gets rendered to access state variables from Jotai */}
        <Providers>{children}</Providers>
        <Footer />
      </body>
    </html>
  );
}
