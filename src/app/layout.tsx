import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import { SolanaWalletProvider } from "@/components/SolanaWalletProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Launcrr — launch tokens with a tweet",
  description:
    "Connect your X account and Solana wallet. Tweet to launch tokens on pump.fun in 30 seconds.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <SolanaWalletProvider>{children}</SolanaWalletProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
