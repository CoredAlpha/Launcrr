"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useEffect, useRef } from "react";

export function ConnectWalletButton() {
  const { publicKey, connected } = useWallet();
  const saved = useRef(false);

  useEffect(() => {
    if (connected && publicKey && !saved.current) {
      saved.current = true;
      fetch("/api/wallet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: publicKey.toBase58() }),
      }).catch(console.error);
    }
    if (!connected) saved.current = false;
  }, [connected, publicKey]);

  return <WalletMultiButton />;
}
