"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";

const STEPS = [
  {
    num: "01",
    title: "Connect",
    color: "#10b981",
    desc: "Link your X account with one click. Then connect your Solana wallet — Phantom, Solflare, Backpack, or any wallet you trust. Your keys stay yours. Always.",
  },
  {
    num: "02",
    title: "Tweet",
    color: "#06b6d4",
    desc: "Mention @launcrr with your token name and ticker. Our AI engine generates a unique description, tokenomics summary, and DALL-E artwork — all in seconds.",
    code: "@launcrr launch Cosmic Ape CAPE",
  },
  {
    num: "03",
    title: "Launch",
    color: "#3b82f6",
    desc: "Your token deploys to pump.fun within 30 seconds. The bot replies with a live link, mint address, and real-time analytics. No middleman. No dashboard. Just results.",
  },
];

const FEATURES = [
  {
    icon: "~30s",
    title: "Tweet-to-token in 30 seconds",
    desc: "No forms. No dashboards. No seed phrases to paste into sketchy UIs. Just a tweet — and your token is on-chain before your timeline refreshes.",
  },
  {
    icon: "AI",
    title: "AI-crafted token identity",
    desc: "Every launch gets a unique brand. Our engine writes viral-ready copy and generates a one-of-a-kind logo with DALL-E 3. Your token stands out from day one.",
  },
  {
    icon: "SOL",
    title: "Your wallet, your launch",
    desc: "You connect your own wallet on our site. Tokens deploy from your address. Launcrr never touches your private keys — we can't, and we wouldn't.",
  },
  {
    icon: "API",
    title: "Open protocol, zero gatekeeping",
    desc: "Every launch is tracked on-chain and visible on our public feed. Other bots, agents, and builders can plug into Launcrr's API. Permissionless by design.",
  },
];

const TERMINAL_LINES = [
  { type: "prompt", text: "@you  ", cmd: "@launcrr launch Cosmic Ape CAPE" },
  { type: "out", text: "verifying wallet connection..." },
  { type: "out", text: "generating token metadata with AI..." },
  { type: "out", text: "uploading artwork to IPFS..." },
  { type: "out", text: "deploying to pump.fun bonding curve..." },
  { type: "success", text: "$CAPE is LIVE!" },
  { type: "link", text: "https://pump.fun/8kWz...q3vR" },
  { type: "out", text: "mint: 8kWzPm...q3vR", typing: true },
];

const WALLETS = ["Phantom", "Solflare", "Backpack", "Coinbase Wallet", "Trust"];

function useReveal() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

const LAUNCRR_CA = "Ep2NTxPuhT3wNfT3E6wPVv2fQh7veETnPuXiY2M6pump";
const PUMP_URL = "https://pump.fun/coin/" + LAUNCRR_CA;

function TokenRow() {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(LAUNCRR_CA);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: 28, flexWrap: "wrap" as const }}>
      <a
        href={PUMP_URL}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "10px 24px", borderRadius: 10,
          background: "#10b981", color: "#06080c",
          fontWeight: 700, fontSize: 14, textDecoration: "none",
          transition: "opacity .2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.opacity = "0.85"; }}
        onMouseLeave={(e) => { e.currentTarget.style.opacity = "1"; }}
      >
        🚀 Buy $LAUNCRR
      </a>
      <button
        onClick={copy}
        style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          padding: "10px 20px", borderRadius: 10,
          background: "#0c1018", border: "1px solid #1a2235",
          color: copied ? "#10b981" : "#7a8ba8", fontWeight: 500, fontSize: 13,
          cursor: "pointer", transition: "all .2s",
        }}
        onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#10b981"; e.currentTarget.style.color = "#e2e8f0"; }}
        onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#1a2235"; e.currentTarget.style.color = copied ? "#10b981" : "#7a8ba8"; }}
      >
        {copied ? "✓ Copied!" : `CA: ${LAUNCRR_CA.slice(0, 8)}…${LAUNCRR_CA.slice(-6)}`}
      </button>
    </div>
  );
}

function TerminalPreview() {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (shown >= TERMINAL_LINES.length) return;
    const t = setTimeout(() => setShown((s) => s + 1), shown === 0 ? 900 : 500);
    return () => clearTimeout(t);
  }, [shown]);

  return (
    <div style={styles.terminal}>
      <div style={styles.termBar}>
        <div style={{ ...styles.termDot, background: "#ff5f57" }} />
        <div style={{ ...styles.termDot, background: "#ffbd2e" }} />
        <div style={{ ...styles.termDot, background: "#28c840" }} />
        <div style={styles.termTitle}>terminal</div>
      </div>
      <div style={styles.termBody}>
        {TERMINAL_LINES.map((line, i) => (
          <div
            key={i}
            style={{
              opacity: i < shown ? 1 : 0,
              transform: i < shown ? "translateY(0)" : "translateY(8px)",
              transition: "all .4s ease",
            }}
          >
            {line.type === "prompt" && (
              <>
                <span style={{ color: "#10b981" }}>{line.text}</span>
                <span>{line.cmd}</span>
              </>
            )}
            {line.type === "out" && (
              <span style={{ color: "#7a8ba8" }}>
                {line.text}
                {line.typing && <span style={styles.cursor} />}
              </span>
            )}
            {line.type === "success" && (
              <span style={{ color: "#10b981", fontWeight: 600 }}>{line.text}</span>
            )}
            {line.type === "link" && (
              <span style={{ color: "#06b6d4" }}>{line.text}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function StepCard({ step, index }: { step: { icon?: string; title: string; desc: string; color?: string; num?: string | number; code?: string }; index: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        ...styles.stepCard,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transitionDelay: `${index * 120}ms`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "#253352";
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.background = "#111827";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "#1a2235";
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.background = "#0c1018";
      }}
    >
      <div style={{ ...styles.stepNum, color: step.color }}>{step.num}</div>
      <h3 style={styles.stepTitle}>{step.title}</h3>
      <p style={styles.stepDesc}>{step.desc}</p>
      {step.code && <code style={styles.codeTag}>{step.code}</code>}
    </div>
  );
}

function FeatureCard({ feat, index }: { feat: { icon?: string; title: string; desc: string; color?: string; [key: string]: unknown }; index: number }) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      style={{
        ...styles.feat,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transitionDelay: `${index * 100}ms`,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#253352")}
      onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1a2235")}
    >
      <div style={styles.featIcon}>{feat.icon}</div>
      <div>
        <h4 style={styles.featTitle}>{feat.title}</h4>
        <p style={styles.featDesc}>{feat.desc}</p>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const { data: session } = useSession();
  const howRef = useReveal();
  const featRef = useReveal();
  const narrativeRef = useReveal();

  return (
    <div style={styles.root}>
      {/* Animated grid */}
      <div style={styles.gridBg} />
      <div style={{ ...styles.orb, width: 500, height: 500, top: "-10%", left: "20%", background: "rgba(16,185,129,.08)", animationDuration: "12s" }} />
      <div style={{ ...styles.orb, width: 400, height: 400, bottom: "10%", right: "10%", background: "rgba(6,182,212,.06)", animationDuration: "15s", animationDelay: "3s" }} />
      <div style={{ ...styles.orb, width: 300, height: 300, top: "40%", left: "-5%", background: "rgba(59,130,246,.05)", animationDuration: "10s", animationDelay: "6s" }} />

      <div style={styles.page}>
        {/* Nav */}
        <div style={styles.navWrapper}>
          <nav style={styles.nav}>
            <div style={styles.logo}>
              <Image src="/logo.png" alt="Launcrr" width={28} height={28} style={{ objectFit: "contain" }} />
              <span style={styles.logoText}>Launcrr</span>
            </div>
            <div style={styles.navLinks}>
              <a href="#how" style={styles.navLink}>How it works</a>
              <a href="#features" style={styles.navLink}>Features</a>
              <a href="#narrative" style={styles.navLink}>Why Launcrr</a>
              <Link href="/docs" style={{ ...styles.navLink, color: "#10b981" }}>Docs</Link>
              <a href="https://x.com/launcrr" target="_blank" rel="noopener noreferrer" style={styles.navLink}>
                @launcrr
              </a>
            </div>
          </nav>
        </div>

        {/* Hero */}
        <section style={styles.hero}>
          <div style={styles.badge}>
            <span style={styles.badgeDot} />
            live on solana &middot; powered by pump.fun
          </div>

          <h1 style={styles.h1}>
            One tweet.<br />
            <span style={styles.grad}>One token.</span>
          </h1>

          <p style={styles.heroPara}>
            Launcrr turns your tweets into live tokens on pump.fun.
            Connect your X and wallet — then tweet to launch.
            No code, no forms, no waiting. Just 30 seconds from idea to on-chain reality.
          </p>

          {session ? (
            <Link
              href="/dashboard"
              style={{ ...styles.cta, display: "inline-flex", alignItems: "center", gap: 10 }}
            >
              Go to Dashboard →
            </Link>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <button
              style={styles.cta}
              onClick={() => signIn("twitter", { callbackUrl: "/dashboard" })}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(16,185,129,.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Get started — connect with X
            </button>
            <Link href="/dashboard" style={{ fontSize: 13, color: "#4a5568", textDecoration: "none", borderBottom: "1px solid #2d3748" }}>
              View Dashboard →
            </Link>
            </div>
          )}

          {/* Token row */}
          <TokenRow />

          <TerminalPreview />
        </section>

        {/* How it works */}
        <section id="how" style={styles.section}>
          <div ref={howRef.ref} style={{ ...styles.sectionInner, opacity: howRef.visible ? 1 : 0, transform: howRef.visible ? "translateY(0)" : "translateY(32px)", transition: "all .7s cubic-bezier(.16,1,.3,1)" }}>
            <div style={styles.sectionLabel}>How it works</div>
            <h2 style={styles.h2}>Three steps. One tweet. Zero friction.</h2>
            <p style={styles.sectionSub}>
              We stripped token launches down to the absolute minimum.
              No walkthroughs. No 12-step wizards. If you can tweet, you can launch.
            </p>
            <div style={styles.stepsGrid}>
              {STEPS.map((s, i) => (
                <StepCard key={i} step={s} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Narrative / Why section */}
        <section id="narrative" style={{ ...styles.section, paddingTop: 40 }}>
          <div ref={narrativeRef.ref} style={{ ...styles.narrativeWrap, opacity: narrativeRef.visible ? 1 : 0, transform: narrativeRef.visible ? "translateY(0)" : "translateY(32px)", transition: "all .7s cubic-bezier(.16,1,.3,1)" }}>
            <div style={styles.sectionLabel}>The problem</div>
            <h2 style={styles.h2}>Launching a token shouldn&apos;t feel like filing taxes</h2>
            <div style={styles.narrativeGrid}>
              <div style={styles.narrativeCard}>
                <div style={{ ...styles.narrativeIcon, borderColor: "#ef4444", color: "#ef4444" }}>old way</div>
                <p style={styles.narrativeText}>
                  Open pump.fun. Fill out name, ticker, description. Upload an image you spent 30 minutes making in Canva.
                  Set parameters. Confirm wallet. Wait. Pray the transaction lands.
                  By the time you&apos;re done, the meta has moved on.
                </p>
              </div>
              <div style={styles.narrativeCard}>
                <div style={{ ...styles.narrativeIcon, borderColor: "#10b981", color: "#10b981" }}>launcrr</div>
                <p style={styles.narrativeText}>
                  Tweet <code style={styles.inlineCode}>@launcrr launch Cosmic Ape CAPE</code> — and walk away.
                  AI writes copy. AI makes the art. The bot deploys to pump.fun.
                  30 seconds later, your token is live and the bot replies with the link.
                  You never left your timeline.
                </p>
              </div>
            </div>
            <p style={styles.narrativeBottom}>
              We built Launcrr because the best ideas happen in the moment — in a reply thread, a late-night scroll, a group chat dare.
              The friction of switching tabs, filling forms, and uploading PNGs kills momentum.
              Launcrr removes every step between &ldquo;what if&rdquo; and &ldquo;it&apos;s live.&rdquo;
            </p>
          </div>
        </section>

        {/* Features */}
        <section id="features" style={styles.section}>
          <div ref={featRef.ref} style={{ ...styles.sectionInner, opacity: featRef.visible ? 1 : 0, transform: featRef.visible ? "translateY(0)" : "translateY(32px)", transition: "all .7s cubic-bezier(.16,1,.3,1)" }}>
            <div style={styles.sectionLabel}>Features</div>
            <h2 style={styles.h2}>Built for speed. Designed for degens.</h2>
            <p style={styles.sectionSub}>
              Every piece of Launcrr is optimized for one thing: getting your token on-chain as fast as physically possible, without ever compromising on security.
            </p>
            <div style={styles.featGrid}>
              {FEATURES.map((f, i) => (
                <FeatureCard key={i} feat={f} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section style={{ ...styles.section, paddingBottom: 40 }}>
          <div style={styles.bottomCta}>
            <h2 style={{ ...styles.h2, marginBottom: 16 }}>Ready to launch?</h2>
            <p style={{ ...styles.sectionSub, marginBottom: 36 }}>
              Connect your X account, link your wallet, and tweet your first token into existence.
            </p>
            <button
              style={styles.cta}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(16,185,129,.25)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Connect with X
            </button>
          </div>
        </section>

        {/* Supported wallets */}
        <div style={styles.wallets}>
          {WALLETS.map((w) => (
            <span key={w} style={styles.walletName}>{w}</span>
          ))}
        </div>

        {/* Footer */}
        <footer style={styles.footer}>
          <div>Launcrr &copy; 2026 — built for degens, by degens</div>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="https://x.com/launcrr" target="_blank" rel="noopener noreferrer" style={styles.footLink}>X</a>
            <Link href="/docs" style={styles.footLink}>Docs</Link>
            <a href="#" style={styles.footLink}>GitHub</a>
          </div>
        </footer>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Outfit:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { margin:0; padding:0; box-sizing:border-box; }
        html { scroll-behavior: smooth; }
        body { background: #06080c; overflow-x: hidden; }
        @keyframes gridPulse { 0%,100%{opacity:.25} 50%{opacity:.4} }
        @keyframes orbFloat { 0%,100%{transform:translate(0,0)} 33%{transform:translate(30px,-20px)} 66%{transform:translate(-15px,25px)} }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(.8)} }
        @keyframes blink { 50%{border-color:transparent} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeDown { from{opacity:0;transform:translateY(-16px)} to{opacity:1;transform:translateY(0)} }
        a { text-decoration: none; }
        @media(max-width:768px) {
          nav { flex-direction: column; gap: 16px; }
        }
      ` }} />
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    fontFamily: "'Outfit', sans-serif",
    color: "#e2e8f0",
    minHeight: "100vh",
    position: "relative",
  },
  gridBg: {
    position: "fixed", inset: 0, zIndex: 0,
    backgroundImage: "linear-gradient(#1a2235 1px, transparent 1px), linear-gradient(90deg, #1a2235 1px, transparent 1px)",
    backgroundSize: "60px 60px",
    WebkitMaskImage: "radial-gradient(ellipse 70% 50% at 50% 30%, black 20%, transparent 70%)",
    maskImage: "radial-gradient(ellipse 70% 50% at 50% 30%, black 20%, transparent 70%)",
    opacity: .35,
    animation: "gridPulse 8s ease-in-out infinite",
  },
  orb: {
    position: "fixed", borderRadius: "50%", filter: "blur(120px)", pointerEvents: "none" as const, zIndex: 0,
    animation: "orbFloat 12s ease-in-out infinite",
  },
  page: { position: "relative", zIndex: 1 },

  // Nav
  navWrapper: {
    position: "fixed" as const, top: 16, left: 0, right: 0, zIndex: 100,
    display: "flex", justifyContent: "center",
    animation: "fadeDown .8s ease both",
    pointerEvents: "none" as const,
  },
  nav: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    width: "100%", maxWidth: 900, padding: "12px 20px",
    background: "rgba(6,8,12,.75)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,.07)",
    borderRadius: 16,
    pointerEvents: "auto" as const,
  },
  logo: { display: "flex", alignItems: "center", gap: 8 },
  logoText: { fontSize: 18, fontWeight: 700, letterSpacing: "-.03em", color: "#e2e8f0" },
  navLinks: { display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" as const },
  navLink: { color: "#7a8ba8", fontSize: 14, fontWeight: 400, transition: "color .2s", cursor: "pointer" },

  // Hero
  hero: { maxWidth: 1100, margin: "0 auto", padding: "80px 32px 60px", textAlign: "center" as const },
  badge: {
    display: "inline-flex", alignItems: "center", gap: 8,
    padding: "6px 16px", borderRadius: 100,
    background: "#0c1018", border: "1px solid #1a2235",
    fontSize: 13, color: "#7a8ba8", fontFamily: "'JetBrains Mono', monospace",
    animation: "fadeUp .7s ease both", animationDelay: ".1s",
  },
  badgeDot: { width: 6, height: 6, borderRadius: "50%", background: "#10b981", animation: "pulse 2s ease-in-out infinite", display: "inline-block" },
  h1: {
    fontSize: "clamp(52px, 8vw, 88px)", fontWeight: 800,
    lineHeight: .95, letterSpacing: "-.04em",
    margin: "32px 0 24px",
    animation: "fadeUp .7s ease both", animationDelay: ".25s",
  },
  grad: {
    background: "linear-gradient(135deg, #10b981 0%, #06b6d4 50%, #3b82f6 100%)",
    WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent",
  },
  heroPara: {
    fontSize: "clamp(16px, 2.2vw, 20px)", color: "#7a8ba8",
    maxWidth: 560, margin: "0 auto 48px", lineHeight: 1.65, fontWeight: 300,
    animation: "fadeUp .7s ease both", animationDelay: ".4s",
  },
  cta: {
    display: "inline-flex", alignItems: "center", gap: 12,
    padding: "16px 40px", borderRadius: 14,
    background: "#e2e8f0", color: "#06080c",
    fontSize: 17, fontWeight: 600, fontFamily: "'Outfit', sans-serif",
    border: "none", cursor: "pointer", transition: "all .2s",
    animation: "fadeUp .7s ease both", animationDelay: ".55s",
  },

  // Terminal
  terminal: {
    maxWidth: 620, margin: "64px auto 0",
    borderRadius: 16, border: "1px solid #1a2235",
    background: "#0c1018", overflow: "hidden",
    animation: "fadeUp .8s ease both", animationDelay: ".7s",
    textAlign: "left" as const,
  },
  termBar: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "14px 18px", borderBottom: "1px solid #1a2235",
  },
  termDot: { width: 10, height: 10, borderRadius: "50%" },
  termTitle: { flex: 1, textAlign: "center" as const, fontSize: 12, color: "#3e4f6a", fontFamily: "'JetBrains Mono', monospace" },
  termBody: { padding: "20px 24px", fontFamily: "'JetBrains Mono', monospace", fontSize: 13, lineHeight: 2.1 },
  cursor: { display: "inline-block", borderRight: "2px solid #10b981", animation: "blink 1s step-end infinite", paddingRight: 2, marginLeft: 2 },

  // Sections
  section: { maxWidth: 1100, margin: "0 auto", padding: "100px 32px 80px" },
  sectionInner: { transition: "all .7s cubic-bezier(.16,1,.3,1)" },
  sectionLabel: {
    fontSize: 13, fontFamily: "'JetBrains Mono', monospace", color: "#10b981",
    textTransform: "uppercase" as const, letterSpacing: ".15em", marginBottom: 12, textAlign: "center" as const,
  },
  h2: {
    fontSize: "clamp(28px, 4.5vw, 44px)", fontWeight: 700, textAlign: "center" as const,
    letterSpacing: "-.03em", marginBottom: 16,
  },
  sectionSub: {
    fontSize: 16, color: "#7a8ba8", textAlign: "center" as const,
    maxWidth: 580, margin: "0 auto 56px", lineHeight: 1.7, fontWeight: 300,
  },

  // Steps
  stepsGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 },
  stepCard: {
    padding: "36px 28px", borderRadius: 16,
    border: "1px solid #1a2235", background: "#0c1018",
    transition: "all .3s cubic-bezier(.16,1,.3,1)",
  },
  stepNum: { fontSize: 56, fontWeight: 800, lineHeight: 1, letterSpacing: "-.04em", marginBottom: 20 },
  stepTitle: { fontSize: 18, fontWeight: 600, marginBottom: 10 },
  stepDesc: { fontSize: 14, color: "#7a8ba8", lineHeight: 1.75, fontWeight: 300 },
  codeTag: {
    display: "inline-block", marginTop: 14,
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
    background: "#06080c", padding: "6px 14px", borderRadius: 8,
    color: "#e2e8f0", border: "1px solid #1a2235",
  },

  // Narrative
  narrativeWrap: { transition: "all .7s cubic-bezier(.16,1,.3,1)" },
  narrativeGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24, marginBottom: 40 },
  narrativeCard: {
    padding: "28px 24px", borderRadius: 16,
    border: "1px solid #1a2235", background: "#0c1018",
  },
  narrativeIcon: {
    display: "inline-block", padding: "4px 14px", borderRadius: 8,
    border: "1px solid", fontSize: 12, fontWeight: 600,
    fontFamily: "'JetBrains Mono', monospace", marginBottom: 16,
    textTransform: "uppercase" as const, letterSpacing: ".08em",
  },
  narrativeText: { fontSize: 14, color: "#7a8ba8", lineHeight: 1.8, fontWeight: 300 },
  inlineCode: {
    fontFamily: "'JetBrains Mono', monospace", fontSize: 12,
    background: "#111827", padding: "2px 8px", borderRadius: 6,
    color: "#e2e8f0", border: "1px solid #1a2235",
  },
  narrativeBottom: {
    fontSize: 15, color: "#7a8ba8", lineHeight: 1.8, fontWeight: 300,
    textAlign: "center" as const, maxWidth: 680, margin: "0 auto",
  },

  // Features
  featGrid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 },
  feat: {
    display: "flex", gap: 16, alignItems: "flex-start",
    padding: 24, borderRadius: 14,
    border: "1px solid #1a2235", background: "#0c1018",
    transition: "border-color .3s",
  },
  featIcon: {
    flexShrink: 0, width: 44, height: 44, borderRadius: 10,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: 14, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace",
    background: "#06080c", border: "1px solid #1a2235", color: "#10b981",
  },
  featTitle: { fontSize: 15, fontWeight: 600, marginBottom: 4 },
  featDesc: { fontSize: 13, color: "#7a8ba8", lineHeight: 1.65, fontWeight: 300 },

  // Bottom CTA
  bottomCta: {
    textAlign: "center" as const,
    padding: "60px 32px",
    borderRadius: 24,
    border: "1px solid #1a2235",
    background: "linear-gradient(180deg, #0c1018 0%, #06080c 100%)",
  },

  // Wallets
  wallets: {
    display: "flex", gap: 32, justifyContent: "center", alignItems: "center",
    padding: "48px 32px", flexWrap: "wrap" as const,
  },
  walletName: { fontSize: 13, color: "#3e4f6a", fontFamily: "'JetBrains Mono', monospace" },

  // Footer
  footer: {
    maxWidth: 1100, margin: "0 auto", padding: "32px",
    borderTop: "1px solid #1a2235",
    display: "flex", justifyContent: "space-between", alignItems: "center",
    fontSize: 13, color: "#3e4f6a", flexWrap: "wrap" as const, gap: 16,
  },
  footLink: { color: "#7a8ba8", transition: "color .2s", cursor: "pointer" },
};
