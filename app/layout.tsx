import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ServerGate from "@/components/ui/ServerGate";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Venerdi",
  description: "Your Fashion Destination",
};

export default function RootLayout({ children
} : {
    children: React.ReactNode
}) {
    return(
        <html lang="en">
            <body>
                <ServerGate>
                    <main>{children}</main>
                </ServerGate>
            </body>
        </html>
    )
}