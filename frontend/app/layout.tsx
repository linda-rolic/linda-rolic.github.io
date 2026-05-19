import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "DataCred — On-Chain Analytics Credentials",
  description:
    "Earn blockchain-verified proof of completion for niche data analytics courses. Built for ETHWomen 2026.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <footer className="border-t border-purple-900/30 py-8 text-center text-sm text-gray-500 mt-16">
            <p>
              DataCred · Built for{" "}
              <span className="text-purple-400 font-medium">ETHWomen 2026</span>
            </p>
            <p className="mt-1">Soulbound credentials on Ethereum Sepolia</p>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
