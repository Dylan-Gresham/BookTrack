import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./styles/globals.css";
import Footer from "./components/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "BookTrack",
    description: "A personal library tracking application made by Dylan Gresham",
};

export default function RootLayout({
    children,
}: Readonly<{
        children: React.ReactNode;
    }>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {children}
                <Footer />
            </body>
        </html>
    );
}
