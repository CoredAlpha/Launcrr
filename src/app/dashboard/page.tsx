"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import Image from "next/image";
import Link from "next/link";
import { ConnectWalletButton } from "@/components/ConnectWalletButton";

// ── Types ────────────────────────────────────────────────────────────────────

type LaunchStatus = "PENDING" | "GENERATING" | "LAUNCHING" | "SUCCESS" | "FAILED";

interface Token {
  id: string;
  name: string;
  ticker: string;
  description: string;
  imageUrl: string | null;
  mintAddress: string;
  signature: string | null;
  pumpFunUrl: string | null;
  initialBuySol: number;
  status: LaunchStatus;
  errorMessage: string | null;
  tweetId: string | null;
  tweetText: string | null;
  createdAt: string;
  updatedAt: string;
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function shorten(addr: string, head = 4, tail = 4) {
  if (addr.length <= head + tail + 3) return addr;
  return `${addr.slice(0, head)}...${addr.slice(-tail)}`;
}

function timeAgo(iso: string): string {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(iso).toLocaleDateString();
}

const STATUS_STYLE: Record<LaunchStatus, { bg: string; color: string; label: string }> = {
  PENDING:    { bg: "rgba(245,158,11,.12)",  color: "#f59e0b", label: "pending" },
  GENERATING: { bg: "rgba(245,158,11,.12)",  color: "#f59e0b", label: "generating" },
  LAUNCHING:  { bg: "rgba(59,130,246,.12)",  color: "#3b82f6", label: "launching" },
  SUCCESS:    { bg: "rgba(16,185,129,.12)",  color: "#10b981", label: "success" },
  FAILED:     { bg: "rgba(239,68,68,.12)",   color: "#ef4444", label: "failed" },
};

// ── Sub-components ────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <>
      <div style={{
        width: 28, height: 28,
        border: "2px solid rgba(16,185,129,.2)",
        borderTopColor: "#10b981",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
      }} />
      <style dangerouslySetInnerHTML={{ __html: `@keyframes spin{to{transform:rotate(360deg)}}` }} />
    </>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={copy} title="Copy" style={{
      background: "none", border: "none", cursor: "pointer",
      color: copied ? "#10b981" : "#3e4f6a",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 10, padding: "2px 6px",
      borderRadius: 4,
      transition: "color .15s",
    }}>
      {copied ? "✓" : "copy"}
    </button>
  );
}

function StatCard({ value, label, color = "#e2e8f0" }: { value: number; label: string; color?: string }) {
  return (
    <div style={{
      padding: "20px 24px",
      borderRadius: 14,
      border: "1px solid #1a2235",
      background: "#0c1018",
    }}>
      <p style={{ fontSize: 32, fontWeight: 800, color, lineHeight: 1, fontFamily: "'Outfit', sans-serif", letterSpacing: "-.03em" }}>
        {value}
      </p>
      <p style={{ fontSize: 12, color: "#3e4f6a", marginTop: 6, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.06em" }}>
        {label}
      </p>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { connection } = useConnection();
  const { publicKey } = useWallet();

  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokensLoading, setTokensLoading] = useState(true);
  const [solBalance, setSolBalance] = useState<number | null>(null);

  const user = session?.user as {
    id?: string;
    name?: string;
    image?: string;
    twitterUsername?: string;
    walletAddress?: string;
    totalLaunches?: number;
  } | undefined;

  // ── redirect if not authed (disabled temporarily) ──
  // useEffect(() => {
  //   if (status === "unauthenticated") router.push("/");
  // }, [status, router]);

  // ── fetch tokens ──
  const fetchTokens = useCallback(() => {
    if (!session?.user) return;
    setTokensLoading(true);
    fetch("/api/tokens")
      .then((r) => r.json())
      .then((d) => setTokens(d.tokens ?? []))
      .catch(console.error)
      .finally(() => setTokensLoading(false));
  }, [session?.user]);

  useEffect(() => { fetchTokens(); }, [fetchTokens]);

  // ── SOL balance ──
  useEffect(() => {
    if (!publicKey) { setSolBalance(null); return; }
    connection.getBalance(publicKey)
      .then((lamports) => setSolBalance(lamports / LAMPORTS_PER_SOL))
      .catch(() => setSolBalance(null));
  }, [publicKey, connection]);

  // ── loading screen ──
  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "#06080c", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner />
      </div>
    );
  }

  if (!session) return null;

  // ── derived stats ──
  const successCount = tokens.filter((t) => t.status === "SUCCESS").length;
  const failedCount  = tokens.filter((t) => t.status === "FAILED").length;
  const isFullyReady = !!user?.walletAddress;

  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent("@launcrr launch ")}`;

  return (
    <div style={{ minHeight: "100vh", background: "#06080c", fontFamily: "'Outfit', sans-serif", color: "#e2e8f0" }}>
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #06080c; }
        a { text-decoration: none; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .dash-row:hover { background: #0f1620 !important; }
        @media (max-width: 680px) {
          .status-grid { grid-template-columns: 1fr !important; }
          .stats-grid  { grid-template-columns: 1fr 1fr !important; }
        }
      ` }} />

      {/* ── Sticky Nav ──────────────────────────────────────── */}
      <header style={{
        position: "sticky", top: 0, zIndex: 50,
        background: "rgba(6,8,12,.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid #1a2235",
      }}>
        <div style={{
          maxWidth: 1000, margin: "0 auto",
          padding: "0 24px", height: 60,
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Image src="/logo.png" alt="Launcrr" width={24} height={24} style={{ objectFit: "contain" }} />
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-.03em", color: "#e2e8f0" }}>Launcrr</span>
          </Link>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <ConnectWalletButton />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              style={{
                padding: "7px 14px", fontSize: 13, fontWeight: 500,
                color: "#7a8ba8", border: "1px solid #1a2235",
                borderRadius: 8, background: "transparent", cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                transition: "color .15s, border-color .15s",
              }}
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* ── Page Body ────────────────────────────────────────── */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 24px 80px", animation: "fadeUp .5s ease both" }}>

        {/* ── Section: Status Cards ───────────────────────── */}
        <div
          className="status-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}
        >
          {/* X Account */}
          <div style={{ padding: "22px 24px", borderRadius: 14, border: "1px solid #1a2235", background: "#0c1018" }}>
            <p style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", color: "#3e4f6a", marginBottom: 14 }}>
              X ACCOUNT
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              {user?.image ? (
                <Image
                  src={user.image} alt="avatar"
                  width={42} height={42}
                  style={{ borderRadius: "50%", border: "2px solid #1a2235" }}
                />
              ) : (
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: "#1a2235", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "#3e4f6a" }}>
                  {user?.name?.[0] ?? "?"}
                </div>
              )}
              <div>
                <p style={{ fontWeight: 600, fontSize: 15 }}>{user?.name ?? "User"}</p>
                <a
                  href={`https://x.com/${user?.twitterUsername}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ fontSize: 13, color: "#7a8ba8" }}
                >
                  @{user?.twitterUsername ?? "..."}
                </a>
              </div>
            </div>
            <div style={{ marginTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                fontSize: 12, color: "#10b981",
                background: "rgba(16,185,129,.1)", padding: "4px 10px", borderRadius: 100,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                Connected
              </span>
              <a
                href={`https://x.com/${user?.twitterUsername}`}
                target="_blank" rel="noopener noreferrer"
                style={{ fontSize: 12, color: "#3e4f6a" }}
              >
                View profile →
              </a>
            </div>
          </div>

          {/* Solana Wallet */}
          <div style={{ padding: "22px 24px", borderRadius: 14, border: "1px solid #1a2235", background: "#0c1018" }}>
            <p style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.1em", color: "#3e4f6a", marginBottom: 14 }}>
              SOLANA WALLET
            </p>
            {user?.walletAddress ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#9945ff,#14f195)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                    ◎
                  </div>
                  <div>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 600, letterSpacing: "0.02em" }}>
                      {shorten(user.walletAddress, 6, 4)}
                    </p>
                    <p style={{ fontSize: 12, color: "#7a8ba8" }}>
                      {solBalance !== null ? `${solBalance.toFixed(4)} SOL` : "Loading balance…"}
                    </p>
                  </div>
                </div>
                <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 12, color: "#10b981",
                    background: "rgba(16,185,129,.1)", padding: "4px 10px", borderRadius: 100,
                  }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10b981" }} />
                    Connected
                  </span>
                  <a
                    href={`https://solscan.io/account/${user.walletAddress}`}
                    target="_blank" rel="noopener noreferrer"
                    style={{ fontSize: 12, color: "#3e4f6a" }}
                  >
                    Solscan →
                  </a>
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: "#1a2235", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: "#3e4f6a" }}>
                    ◎
                  </div>
                  <p style={{ fontSize: 14, color: "#7a8ba8" }}>No wallet connected</p>
                </div>
                <span style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  fontSize: 12, color: "#f59e0b",
                  background: "rgba(245,158,11,.1)", padding: "4px 10px", borderRadius: 100,
                }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#f59e0b" }} />
                  Not connected
                </span>
                <p style={{ fontSize: 12, color: "#3e4f6a", marginTop: 10 }}>Connect your wallet above to start launching</p>
              </>
            )}
          </div>
        </div>

        {/* ── Section: Quick Launch Guide ─────────────────── */}
        <div style={{
          padding: "22px 24px",
          borderRadius: 14,
          border: `1px solid ${isFullyReady ? "rgba(16,185,129,.25)" : "rgba(245,158,11,.2)"}`,
          background: isFullyReady ? "rgba(16,185,129,.03)" : "rgba(245,158,11,.03)",
          marginBottom: 24,
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, marginBottom: 18 }}>
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: isFullyReady ? "#10b981" : "#f59e0b", marginBottom: 4 }}>
                {isFullyReady ? "Ready to launch! 🚀" : "Almost there"}
              </h2>
              <p style={{ fontSize: 13, color: "#7a8ba8" }}>
                {isFullyReady
                  ? "Tweet @launcrr with one of these commands to launch your token."
                  : "Connect your Solana wallet to start launching tokens."}
              </p>
            </div>
            {isFullyReady && (
              <a
                href={tweetUrl}
                target="_blank" rel="noopener noreferrer"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "9px 18px", borderRadius: 10,
                  background: "#10b981", color: "#06080c",
                  fontSize: 13, fontWeight: 700,
                  whiteSpace: "nowrap",
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Tweet now
              </a>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[
              { label: "LAUNCH TOKEN",  cmd: "@launcrr launch TokenName TICKER" },
              { label: "PRICE QUERY",   cmd: "@launcrr price $TICKER" },
              { label: "HELP",          cmd: "@launcrr help" },
            ].map(({ label, cmd }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "#06080c", border: "1px solid #1a2235",
                borderRadius: 8, padding: "8px 14px",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.1em", color: "#3e4f6a", minWidth: 90 }}>
                    {label}
                  </span>
                  <code style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "#e2e8f0" }}>
                    {cmd}
                  </code>
                </div>
                <CopyButton text={cmd} />
              </div>
            ))}
          </div>
        </div>

        {/* ── Section: Stats ──────────────────────────────── */}
        <div
          className="stats-grid"
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 32 }}
        >
          <StatCard value={user?.totalLaunches ?? 0} label="TOTAL LAUNCHES" />
          <StatCard value={successCount}             label="SUCCESSFUL"     color="#10b981" />
          <StatCard value={failedCount}              label="FAILED"         color="#ef4444" />
        </div>

        {/* ── Section: Token History ──────────────────────── */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700 }}>Token launches</h2>
            <button
              onClick={fetchTokens}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#3e4f6a", fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}
            >
              ↻ refresh
            </button>
          </div>

          {tokensLoading ? (
            <div style={{ display: "flex", justifyContent: "center", padding: 48 }}>
              <Spinner />
            </div>
          ) : tokens.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "56px 24px",
              border: "1px dashed #1a2235", borderRadius: 14,
            }}>
              <p style={{ fontSize: 28, marginBottom: 12 }}>🚀</p>
              <p style={{ fontSize: 15, fontWeight: 600, color: "#7a8ba8", marginBottom: 6 }}>No launches yet</p>
              <p style={{ fontSize: 13, color: "#3e4f6a" }}>
                Tweet <code style={{ fontFamily: "'JetBrains Mono', monospace", color: "#10b981" }}>@launcrr launch YourToken TICKER</code> to create your first token.
              </p>
            </div>
          ) : (
            <div style={{ border: "1px solid #1a2235", borderRadius: 14, overflow: "hidden" }}>
              {/* Table header */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "2fr 1.6fr 1fr 1fr 100px",
                padding: "10px 18px",
                background: "#0c1018",
                borderBottom: "1px solid #1a2235",
              }}>
                {["TOKEN", "MINT ADDRESS", "STATUS", "LINKS", "TIME"].map((h) => (
                  <span key={h} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, letterSpacing: "0.12em", color: "#3e4f6a" }}>
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {tokens
                .slice()
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((t, i) => {
                  const st = STATUS_STYLE[t.status] ?? STATUS_STYLE.PENDING;
                  const isLast = i === tokens.length - 1;
                  return (
                    <div
                      key={t.id}
                      className="dash-row"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 1.6fr 1fr 1fr 100px",
                        padding: "14px 18px",
                        alignItems: "center",
                        borderBottom: isLast ? "none" : "1px solid #1a2235",
                        background: "#0c1018",
                        transition: "background .15s",
                      }}
                    >
                      {/* Token name */}
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        {t.imageUrl ? (
                          <Image
                            src={t.imageUrl} alt={t.name}
                            width={32} height={32}
                            style={{ borderRadius: 8, border: "1px solid #1a2235", objectFit: "cover" }}
                          />
                        ) : (
                          <div style={{ width: 32, height: 32, borderRadius: 8, background: "#1a2235", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>
                            🪙
                          </div>
                        )}
                        <div>
                          <p style={{ fontWeight: 600, fontSize: 14, lineHeight: 1.2 }}>{t.name}</p>
                          <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#10b981" }}>
                            ${t.ticker}
                          </p>
                        </div>
                      </div>

                      {/* Mint address */}
                      <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "#7a8ba8" }}>
                          {shorten(t.mintAddress, 6, 4)}
                        </span>
                        <CopyButton text={t.mintAddress} />
                      </div>

                      {/* Status */}
                      <div>
                        <span style={{
                          fontSize: 11, fontFamily: "'JetBrains Mono', monospace",
                          padding: "4px 10px", borderRadius: 100,
                          background: st.bg, color: st.color,
                          letterSpacing: "0.04em",
                        }}>
                          {st.label}
                        </span>
                      </div>

                      {/* Links */}
                      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        {t.pumpFunUrl && (
                          <a href={t.pumpFunUrl} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 12, color: "#06b6d4", fontFamily: "'JetBrains Mono', monospace" }}>
                            pump
                          </a>
                        )}
                        <a
                          href={`https://solscan.io/token/${t.mintAddress}`}
                          target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: 12, color: "#7a8ba8", fontFamily: "'JetBrains Mono', monospace" }}
                        >
                          scan
                        </a>
                        {t.tweetId && (
                          <a
                            href={`https://x.com/i/web/status/${t.tweetId}`}
                            target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 12, color: "#7a8ba8", fontFamily: "'JetBrains Mono', monospace" }}
                          >
                            tweet
                          </a>
                        )}
                      </div>

                      {/* Time */}
                      <div>
                        <span style={{ fontSize: 12, color: "#3e4f6a", fontFamily: "'JetBrains Mono', monospace" }}>
                          {timeAgo(t.createdAt)}
                        </span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* ── Footer ───────────────────────────────────────────── */}
      <footer style={{
        borderTop: "1px solid #1a2235",
        padding: "20px 24px",
        maxWidth: 1000, margin: "0 auto",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <p style={{ fontSize: 12, color: "#3e4f6a", fontFamily: "'JetBrains Mono', monospace" }}>
          Launcrr © 2026
        </p>
        <div style={{ display: "flex", gap: 20 }}>
          {[
            { label: "X",      href: "https://x.com/launcrr" },
            { label: "Docs",   href: "/docs" },
          ].map(({ label, href }) => (
            <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer"
              style={{ fontSize: 12, color: "#3e4f6a", fontFamily: "'JetBrains Mono', monospace" }}>
              {label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
}
