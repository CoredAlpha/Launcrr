import type { Metadata } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import { SolanaWalletProvider } from "@/components/SolanaWalletProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Launcrr — launch tokens with a tweet",
  description:
    "Connect your X account and Solana wallet. Tweet a command to @launcrr and your token launches on pump.fun in under 30 seconds — no code, no dashboard, no friction.",
  openGraph: {
    title: "Launcrr — launch tokens with a tweet",
    description:
      "Connect your X account and Solana wallet. Tweet a command to @launcrr and your token launches on pump.fun in under 30 seconds — no code, no dashboard, no friction.",
    url: "https://launcrr.fun",
    siteName: "Launcrr",
    images: [
      {
        url: "https://launcrr.fun/logo.png",
        width: 512,
        height: 512,
        alt: "Launcrr logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Launcrr — launch tokens with a tweet",
    description:
      "Connect your X account and Solana wallet. Tweet a command to @launcrr and your token launches on pump.fun in under 30 seconds — no code, no dashboard, no friction.",
    images: ["https://launcrr.fun/logo.png"],
  },
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
