"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

const SECTIONS = [
  { id: "overview", label: "OVERVIEW" },
  { id: "launch-tokens", label: "LAUNCH TOKENS" },
  { id: "token-queries", label: "TOKEN QUERIES" },
  { id: "trading", label: "TRADING" },
  { id: "transfers", label: "TRANSFERS" },
  { id: "terminal", label: "TERMINAL" },
  { id: "dashboard", label: "DASHBOARD" },
  { id: "api", label: "AI-TO-AI API" },
  { id: "rate-limits", label: "RATE LIMITS" },
  { id: "faq", label: "FAQ" },
];

function CodeBlock({ label, code }: { label: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div style={s.codeBlock}>
      <div style={s.codeHeader}>
        <span style={s.codeLabel}>{label}</span>
        <button style={s.copyBtn} onClick={copy}>{copied ? "COPIED" : "COPY"}</button>
      </div>
      <pre style={s.codePre}>{code}</pre>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={s.detailRow}>
      <span style={s.detailLabel}>{label}</span>
      <span style={s.detailValue}>{value}</span>
    </div>
  );
}

function SectionCard({ children }: { children: React.ReactNode }) {
  return <div style={s.card}>{children}</div>;
}

function SectionTitle({ id, title, sub }: { id: string; title: string; sub: string }) {
  return (
    <div id={id} style={s.sectionTitle}>
      <h2 style={s.sectionH2}>{title}</h2>
      <p style={s.sectionSub}>{sub}</p>
    </div>
  );
}

export default function DocsPage() {
  const [active, setActive] = useState("overview");

  const scrollTo = (id: string) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div style={s.root}>
      {/* Noise/grid bg */}
      <div style={s.gridBg} />

      {/* Floating Nav */}
      <div style={s.navWrapper}>
        <nav style={s.nav}>
          <Link href="/" style={s.logo}>
            <Image src="/logo.png" alt="Launcrr" width={26} height={26} style={{ objectFit: "contain" }} />
            <span style={s.logoText}>Launcrr</span>
          </Link>
          <div style={s.navLinks}>
            <Link href="/#how" style={s.navLink}>How it works</Link>
            <Link href="/#features" style={s.navLink}>Features</Link>
            <Link href="/docs" style={{ ...s.navLink, color: "#10b981" }}>Docs</Link>
            <a href="https://x.com/launcrr" target="_blank" rel="noopener noreferrer" style={s.navLink}>@launcrr</a>
          </div>
        </nav>
      </div>

      {/* Hero */}
      <div style={s.hero}>
        <p style={s.heroEyebrow}>DOCUMENTATION</p>
        <h1 style={s.heroTitle}>Everything Launcrr does,<br />and how to use it.</h1>
        <p style={s.heroSub}>
          Launcrr is an autonomous bot that launches tokens, executes trades,{"\n"}
          transfers SOL, and answers questions -- all from an X mention.
        </p>
      </div>

      {/* Body */}
      <div style={s.body}>
        {/* Sidebar */}
        <aside style={s.sidebar}>
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              style={{ ...s.sideItem, ...(active === sec.id ? s.sideItemActive : {}) }}
              onClick={() => scrollTo(sec.id)}
            >
              {sec.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main style={s.content}>

          {/* ── Overview ── */}
          <SectionTitle id="overview" title="Overview" sub="What is Launcrr" />
          <SectionCard>
            <p style={s.para}>
              Launcrr is a Solana-native bot that listens for X mentions. When someone tags{" "}
              <strong>@launcrr</strong>, the system classifies the intent using AI, then routes it to the
              appropriate handler: token launch, trade, transfer, query, or conversation.
            </p>
            <p style={s.para}>
              Every token launched through Launcrr goes live on pump.fun. No wallet setup, no auth, no fees.
              The bot manages custodial wallets per X user, handles image generation, metadata upload, and
              on-chain deployment automatically.
            </p>
            <div style={s.listBox}>
              <p style={s.listBoxLabel}>PIPELINE</p>
              <ol style={s.ol}>
                <li>You tag @launcrr on X</li>
                <li>Bot fetches and classifies your mention using AI</li>
                <li>Routes to the correct handler (launch, trade, send, query, conversation)</li>
                <li>Executes the action on-chain or generates a response</li>
                <li>Replies on X with the result</li>
              </ol>
            </div>
          </SectionCard>

          {/* ── Launch Tokens ── */}
          <SectionTitle id="launch-tokens" title="Launch Tokens" sub="Create a memecoin from a tweet" />
          <SectionCard>
            <p style={s.para}>
              Tag <strong>@launcrr</strong> on X with a description of your token. The bot uses AI to generate
              metadata (name, ticker, description), creates artwork, uploads everything to IPFS, then deploys
              the token on pump.fun with an optional dev buy.
            </p>
            <p style={s.listBoxLabel}>EXAMPLE PROMPTS</p>
            <CodeBlock label="BASIC LAUNCH" code='@launcrr launch DOGE "Doge to the Moon"' />
            <CodeBlock label="NATURAL LANGUAGE" code="@launcrr make a token about cats taking over the internet" />
            <CodeBlock label="WITH IMAGE" code="@launcrr launch this [attach image to tweet]" />
            <CodeBlock label="REPLY TO A TWEET" code="@launcrr launch this [reply to any tweet with an image]" />
            <CodeBlock label="EXPLICIT TICKER + NAME" code='@launcrr create $PEPE "Pepe the Frog"' />

            <div style={s.listBox}>
              <p style={s.listBoxLabel}>WHAT HAPPENS AFTER YOU TAG</p>
              <ol style={s.ol}>
                <li>AI classifies your mention as a coin_launch</li>
                <li>AI generates ticker, name, description, and image prompt</li>
                <li>Image is generated and uploaded to storage</li>
                <li>Token metadata is uploaded to IPFS</li>
                <li>Token is deployed on pump.fun via Solana transaction</li>
                <li>Bot replies on X with the mint address, pump.fun link, and token image</li>
              </ol>
            </div>

            <p style={s.listBoxLabel}>REQUIREMENTS</p>
            <div style={s.detailTable}>
              <DetailRow label="MIN FOLLOWERS" value="5 (accounts with fewer are blocked)" />
              <DetailRow label="COST" value="Free (Launcrr pays the ~0.02 SOL launch fee)" />
              <DetailRow label="RATE LIMIT" value="1 launch per hour per author" />
              <DetailRow label="IMAGE" value="Attach to tweet or AI generates one" />
            </div>
          </SectionCard>

          {/* ── Token Queries ── */}
          <SectionTitle id="token-queries" title="Token Queries" sub="Ask about any Solana token" />
          <SectionCard>
            <p style={s.para}>
              Ask <strong>@launcrr</strong> about any Solana token by ticker, name, or contract address (CA).
              The bot fetches real-time data from DexScreener and Moralis and replies with price, market cap,
              volume, liquidity, and 24h change.
            </p>
            <p style={s.listBoxLabel}>EXAMPLE PROMPTS</p>
            <CodeBlock label="BY TICKER" code="@launcrr what's $LAUNCRR price" />
            <CodeBlock label="MARKET CAP" code="@launcrr $SOL mcap" />
            <CodeBlock label="BY CONTRACT ADDRESS" code="@launcrr 8kWzPm...q3vR price" />
            <CodeBlock label="TRENDING" code="@launcrr what tokens are trending right now" />
            <CodeBlock label="BALANCE CHECK" code="@launcrr what's my SOL balance" />
          </SectionCard>

          {/* ── Trading ── */}
          <SectionTitle id="trading" title="Trading" sub="Buy and sell tokens via X" />
          <SectionCard>
            <p style={s.para}>
              Tag <strong>@launcrr</strong> to buy or sell any Solana token. The bot executes trades through
              Jupiter aggregator with configurable slippage.
            </p>
            <p style={s.listBoxLabel}>EXAMPLE PROMPTS</p>
            <CodeBlock label="BUY WITH SOL AMOUNT" code="@launcrr buy 0.5 SOL of $LAUNCRR" />
            <CodeBlock label="BUY BY CA" code="@launcrr buy 1 SOL AX9D7Nqtu3enaeL4ELxoagsNV7AyEQEhK2ziwiyJpump" />
            <CodeBlock label="SELL PERCENTAGE" code="@launcrr sell 50% of $LAUNCRR" />
            <CodeBlock label="SELL ALL" code="@launcrr sell 100% $LAUNCRR" />

            <p style={s.listBoxLabel}>DETAILS</p>
            <div style={s.detailTable}>
              <DetailRow label="SLIPPAGE" value="Configurable in dashboard (default 3%)" />
              <DetailRow label="MAX BUY" value="Configurable per-trade SOL limit" />
              <DetailRow label="MAX SELL" value="Configurable max sell percentage" />
              <DetailRow label="RATE LIMIT" value="10 trades per hour" />
            </div>
          </SectionCard>

          {/* ── Transfers ── */}
          <SectionTitle id="transfers" title="Transfers" sub="Send SOL and tokens to other users" />
          <SectionCard>
            <p style={s.para}>
              Send SOL or tokens to another X user or a wallet address by mentioning <strong>@launcrr</strong>.
              The recipient automatically gets a custodial wallet created if they don't have one. This feature
              must be enabled in the dashboard.
            </p>
            <p style={s.listBoxLabel}>EXAMPLE PROMPTS</p>
            <CodeBlock label="SEND SOL TO X USER" code="@launcrr send 0.1 SOL to @friend" />
            <CodeBlock label="SEND TO WALLET" code="@launcrr send 0.5 SOL to 7xKXt...abc" />
            <CodeBlock label="SEND TOKENS" code="@launcrr send 1000 $LAUNCRR to @friend" />

            <p style={s.listBoxLabel}>DETAILS</p>
            <div style={s.detailTable}>
              <DetailRow label="GATE" value="Must be enabled in dashboard (disabled by default)" />
              <DetailRow label="RECIPIENT WALLET" value="Auto-created if recipient has none" />
              <DetailRow label="RATE LIMIT" value="5 sends per hour" />
              <DetailRow label="TRANSACTION FEE" value="0.0002 SOL (Helius priority tip)" />
            </div>
          </SectionCard>

          {/* ── Terminal ── */}
          <SectionTitle id="terminal" title="Terminal Launcher" sub="Launch tokens from the website" />
          <SectionCard>
            <p style={s.para}>
              The Terminal is a chat-based launcher built into the Launcrr website. Click "Launcher" in the
              navigation bar to open it. Describe your token concept in natural language, review the generated
              preview (name, ticker, description, artwork), then confirm to deploy on pump.fun.
            </p>
            <div style={s.listBox}>
              <p style={s.listBoxLabel}>HOW IT WORKS</p>
              <ol style={s.ol}>
                <li>Open the Launcher from the nav bar or the Token Feed page</li>
                <li>Describe the token you want to create</li>
                <li>AI generates metadata + artwork and shows a preview card</li>
                <li>Confirm to launch or request changes</li>
                <li>Token deploys on pump.fun, you get the mint address and links</li>
              </ol>
            </div>
            <p style={s.listBoxLabel}>DETAILS</p>
            <div style={s.detailTable}>
              <DetailRow label="SESSION" value="Persists for 24 hours in browser" />
              <DetailRow label="AUTH" value="None required" />
              <DetailRow label="SOURCE TAG" value="Tokens tagged as 'terminal' source" />
            </div>
          </SectionCard>

          {/* ── Dashboard ── */}
          <SectionTitle id="dashboard" title="Dashboard" sub="Manage your wallet and settings" />
          <SectionCard>
            <p style={s.para}>
              Log in with X to access your personal dashboard. It shows your profile, launched tokens, trade
              history, transfer history, and inquiry history. You can configure default settings for launches,
              trades, and transfers.
            </p>
            <p style={s.listBoxLabel}>LAUNCH SETTINGS</p>
            <div style={s.detailTable}>
              <DetailRow label="DEFAULT DEV BUY" value="0-5 SOL initial buy on your own launches" />
              <DetailRow label="AUTO-SELL" value="Toggle on/off, set delay (2.5s-60s) and sell percent (25-100%)" />
              <DetailRow label="CASHBACK" value="Toggle cashback on launches" />
              <DetailRow label="MAYHEM MODE" value="Toggle mayhem mode for launches" />
            </div>
            <p style={{ ...s.listBoxLabel, marginTop: 20 }}>TRADE SETTINGS</p>
            <div style={s.detailTable}>
              <DetailRow label="DEFAULT SLIPPAGE" value="0.5%-50% (applied to auto-sell and X trades)" />
              <DetailRow label="MAX BUY PER TRADE" value="SOL limit per trade (safety cap)" />
              <DetailRow label="MAX SELL PERCENT" value="Maximum percentage you can sell in one trade" />
            </div>
            <p style={{ ...s.listBoxLabel, marginTop: 20 }}>TRANSFER SETTINGS</p>
            <div style={s.detailTable}>
              <DetailRow label="ENABLE TRANSFERS" value="Toggle to allow sending SOL and tokens via X mentions" />
            </div>
            <p style={{ ...s.listBoxLabel, marginTop: 20 }}>OTHER FEATURES</p>
            <div style={s.detailTable}>
              <DetailRow label="WALLET EXPORT" value="Export your custodial wallet private key" />
              <DetailRow label="ACTIVITY FEED" value="View launches, trades, transfers, and inquiries" />
              <DetailRow label="PROFILE" value="Pulled from your X account (avatar, bio, stats)" />
            </div>
          </SectionCard>

          {/* ── AI-to-AI API ── */}
          <SectionTitle id="api" title="AI-to-AI API" sub="Machine-to-machine endpoints for agents" />
          <SectionCard>
            <p style={s.para}>
              Other AI agents can launch tokens and query analytics using permissionless HTTP endpoints.
              No authentication required. Same behavior as X mentions, built for automated workflows.
            </p>
            <p style={s.listBoxLabel}>LAUNCH TOKEN</p>
            <CodeBlock
              label="POST HTTPS://LAUNCRR.FUN/API/LAUNCH-TOKEN"
              code={`{\n  "ai_name": "my-agent",\n  "twitter_handle": "@myagent",\n  "description": "launch a coin called TEST that represents clean infra"\n}`}
            />
            <div style={s.detailTable}>
              <DetailRow label="REQUIRED" value="ai_name, description" />
              <DetailRow label="OPTIONAL" value="twitter_handle (for attribution)" />
              <DetailRow label="RETURNS" value="contract_address, pump_fun_url, solscan_url, launcrr_url" />
              <DetailRow label="RATE LIMIT" value="5 launches per hour per ai_name" />
            </div>

            <p style={{ ...s.listBoxLabel, marginTop: 24 }}>QUERY TOKEN</p>
            <CodeBlock
              label="POST HTTPS://LAUNCRR.FUN/API/QUERY-TOKEN"
              code={`{\n  "ai_name": "my-agent",\n  "query": "what's the price of $LAUNCRR right now"\n}`}
            />
            <div style={s.detailTable}>
              <DetailRow label="REQUIRED" value="ai_name, query" />
              <DetailRow label="ACCEPTS" value="Ticker ($LAUNCRR), name, or contract address" />
              <DetailRow label="RETURNS" value="Plain text, human-readable response" />
            </div>

            <div style={{ ...s.listBox, marginTop: 20 }}>
              <p style={s.listBoxLabel}>AGENT SKILL FILE</p>
              <p style={{ color: "#94a3b8", fontSize: 14, fontFamily: "'JetBrains Mono', monospace" }}>
                Point your AI agent to{" "}
                <span style={{ color: "#10b981" }}>launcrr.fun/skill.md</span>{" "}
                for the full machine-readable specification.
              </p>
            </div>
          </SectionCard>

          {/* ── Rate Limits ── */}
          <SectionTitle id="rate-limits" title="Rate Limits" sub="Per-author, per-type, per-hour" />
          <SectionCard>
            <p style={s.para}>
              Every action type has an independent rate limit per author per hour. If you exceed the limit,
              the mention is silently ignored and no downstream processing occurs.
            </p>
            <div style={s.table}>
              <div style={s.tableHeader}>
                <span>ACTION</span>
                <span>MAX / HOUR</span>
              </div>
              {[
                ["Token Launch", "1"],
                ["Trade (buy/sell)", "10"],
                ["Send SOL", "5"],
                ["Send Token", "5"],
                ["Token Query", "5"],
                ["Conversation", "5"],
                ["Balance Check", "5"],
                ["Trending Tokens", "5"],
              ].map(([action, max]) => (
                <div key={action} style={s.tableRow}>
                  <span style={{ color: "#e2e8f0" }}>{action}</span>
                  <span style={{ color: "#10b981", fontWeight: 700 }}>{max}</span>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* ── FAQ ── */}
          <SectionTitle id="faq" title="FAQ" sub="Common questions" />
          <SectionCard>
            {[
              {
                q: "Do I need to set up a wallet?",
                a: "No. Launcrr creates a custodial wallet for your X account automatically when you first interact. You can export the private key from your dashboard anytime.",
              },
              {
                q: "Who pays the SOL launch fee?",
                a: "Launcrr covers the ~0.02 SOL pump.fun deployment fee. Token launches are completely free for users.",
              },
              {
                q: "How long does a launch take?",
                a: "From tweet to live token is typically under 30 seconds. The bot replies on X with your mint address and pump.fun link once deployed.",
              },
              {
                q: "What happens if the bot doesn't reply?",
                a: "Your account may have fewer than 5 followers, you may have hit a rate limit, or the mention may have been filtered. Check that @launcrr is tagged correctly.",
              },
              {
                q: "Is the API permissionless?",
                a: "Yes. The AI-to-AI API requires no authentication — just include an ai_name in your request body. Rate limits still apply per ai_name.",
              },
              {
                q: "Can I use my own wallet instead of the custodial one?",
                a: "For X-based launches, Launcrr uses custodial wallets. For the website Terminal Launcher, you can connect your own Solana wallet (Phantom, Solflare, Backpack, etc.).",
              },
            ].map(({ q, a }) => (
              <div key={q} style={s.faqItem}>
                <p style={s.faqQ}>{q}</p>
                <p style={s.faqA}>{a}</p>
              </div>
            ))}
          </SectionCard>

        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        html { scroll-behavior: smooth; }
        body { background: #06080c; overflow-x: hidden; }
        a { text-decoration: none; }
        @media (max-width: 768px) {
          .docs-body { flex-direction: column !important; }
          .docs-sidebar { position: static !important; width: 100% !important; flex-direction: row !important; flex-wrap: wrap !important; gap: 8px !important; padding: 16px !important; }
        }
      ` }} />
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    fontFamily: "'Outfit', sans-serif",
    color: "#e2e8f0",
    minHeight: "100vh",
    background: "#06080c",
  },
  gridBg: {
    position: "fixed", inset: 0, zIndex: 0,
    backgroundImage: "linear-gradient(#1a2235 1px, transparent 1px), linear-gradient(90deg, #1a2235 1px, transparent 1px)",
    backgroundSize: "60px 60px",
    WebkitMaskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 20%, transparent 70%)",
    maskImage: "radial-gradient(ellipse 80% 60% at 50% 20%, black 20%, transparent 70%)",
    opacity: 0.3,
  },

  // Nav
  navWrapper: {
    position: "fixed", top: 16, left: 0, right: 0, zIndex: 100,
    display: "flex", justifyContent: "center",
    pointerEvents: "none",
  },
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    width: "100%", maxWidth: 900, padding: "12px 20px",
    background: "rgba(6,8,12,.75)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,.07)",
    borderRadius: 16,
    pointerEvents: "auto",
  },
  logo: { display: "flex", alignItems: "center", gap: 8 },
  logoText: { fontSize: 18, fontWeight: 700, letterSpacing: "-.03em", color: "#e2e8f0" },
  navLinks: { display: "flex", gap: 24, alignItems: "center" },
  navLink: { color: "#7a8ba8", fontSize: 14, fontWeight: 400, cursor: "pointer" },

  // Hero
  hero: {
    position: "relative", zIndex: 1,
    maxWidth: 800, margin: "0 auto",
    padding: "140px 32px 64px",
  },
  heroEyebrow: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11, letterSpacing: "0.15em",
    color: "#10b981", marginBottom: 16,
  },
  heroTitle: {
    fontSize: "clamp(36px, 6vw, 64px)",
    fontWeight: 800, lineHeight: 1.1,
    letterSpacing: "-.03em",
    color: "#f1f5f9",
    marginBottom: 24,
  },
  heroSub: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 14, lineHeight: 1.8,
    color: "#64748b",
    whiteSpace: "pre-line",
  },

  // Body layout
  body: {
    position: "relative", zIndex: 1,
    display: "flex", alignItems: "flex-start",
    maxWidth: 1100, margin: "0 auto",
    padding: "0 32px 120px",
    gap: 32,
  },

  // Sidebar
  sidebar: {
    position: "sticky", top: 80,
    width: 200, flexShrink: 0,
    display: "flex", flexDirection: "column",
    gap: 2,
  },
  sideItem: {
    background: "none", border: "none",
    textAlign: "left", cursor: "pointer",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11, fontWeight: 500,
    letterSpacing: "0.08em",
    color: "#475569",
    padding: "8px 12px",
    borderRadius: 6,
    transition: "color .15s, background .15s",
  },
  sideItemActive: {
    background: "#10b981",
    color: "#06080c",
  },

  // Content
  content: {
    flex: 1, display: "flex", flexDirection: "column", gap: 0,
    minWidth: 0,
  },

  // Section title block
  sectionTitle: {
    padding: "40px 0 0",
    borderTop: "1px solid rgba(255,255,255,.06)",
    marginTop: 8,
  },
  sectionH2: {
    fontSize: 26, fontWeight: 700, color: "#f1f5f9",
    letterSpacing: "-.02em", marginBottom: 4,
  },
  sectionSub: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12, color: "#475569",
    marginBottom: 20,
  },

  // Card
  card: {
    background: "rgba(15,20,30,.6)",
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 12,
    padding: "28px 28px",
    marginBottom: 8,
    backdropFilter: "blur(8px)",
  },
  para: {
    fontSize: 15, lineHeight: 1.75, color: "#94a3b8",
    marginBottom: 20,
  },

  // Code block
  codeBlock: {
    background: "#0d1117",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 8,
    marginBottom: 8,
    overflow: "hidden",
  },
  codeHeader: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "8px 14px",
    borderBottom: "1px solid rgba(255,255,255,.06)",
    background: "rgba(255,255,255,.02)",
  },
  codeLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, letterSpacing: "0.1em", color: "#475569",
  },
  copyBtn: {
    background: "none", border: "none", cursor: "pointer",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, letterSpacing: "0.1em", color: "#10b981",
  },
  codePre: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13, color: "#e2e8f0",
    padding: "14px 16px",
    whiteSpace: "pre-wrap",
    wordBreak: "break-all",
  },

  // List box
  listBox: {
    background: "#0d1117",
    border: "1px solid rgba(255,255,255,.08)",
    borderRadius: 8,
    padding: "16px 18px",
    marginBottom: 16,
  },
  listBoxLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, letterSpacing: "0.12em", color: "#475569",
    marginBottom: 10,
  },
  ol: {
    paddingLeft: 18,
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13, color: "#94a3b8",
    lineHeight: 2,
    listStyleType: "decimal",
  },

  // Detail table
  detailTable: {
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 8,
    overflow: "hidden",
    marginBottom: 16,
  },
  detailRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "12px 16px",
    borderBottom: "1px solid rgba(255,255,255,.04)",
  },
  detailLabel: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, letterSpacing: "0.1em", color: "#475569",
  },
  detailValue: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 12, color: "#94a3b8",
    textAlign: "right",
    maxWidth: "60%",
  },

  // Rate limits table
  table: {
    border: "1px solid rgba(255,255,255,.06)",
    borderRadius: 8, overflow: "hidden",
  },
  tableHeader: {
    display: "flex", justifyContent: "space-between",
    padding: "10px 16px",
    background: "rgba(255,255,255,.03)",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10, letterSpacing: "0.1em", color: "#475569",
    borderBottom: "1px solid rgba(255,255,255,.06)",
  },
  tableRow: {
    display: "flex", justifyContent: "space-between", alignItems: "center",
    padding: "14px 16px",
    borderBottom: "1px solid rgba(255,255,255,.04)",
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 13,
  },

  // FAQ
  faqItem: {
    borderBottom: "1px solid rgba(255,255,255,.05)",
    paddingBottom: 20, marginBottom: 20,
  },
  faqQ: {
    fontSize: 15, fontWeight: 600, color: "#e2e8f0",
    marginBottom: 8,
  },
  faqA: {
    fontSize: 14, lineHeight: 1.7, color: "#64748b",
  },
};
