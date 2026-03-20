# Launcrr

Launch tokens on pump.fun with a tweet.

## Quick Start (Run Locally)

```bash
# 1. Extract project & enter directory
cd launcrr

# 2. Install dependencies
npm install

# 3. Copy env file
cp .env.example .env.local

# 4. Generate Prisma client (works without DB for now)
npx prisma generate

# 5. Run dev server
npm run dev
```

Open **http://localhost:3000** — you should see the placeholder landing page.

## Paste Your Landing Page

Replace the content of `src/app/page.tsx` with the code from `launcrr-landing.jsx`.

## When You're Ready to Connect DB + Auth

```bash
# 1. Fill in DATABASE_URL in .env.local (get free DB from neon.tech)
# 2. Push schema to database
npx prisma db push

# 3. Fill in AUTH_TWITTER_ID and AUTH_TWITTER_SECRET in .env.local
# 4. Generate auth secret
npx auth secret

# 5. Restart dev server
npm run dev
```

## Project Structure

```
launcrr/
├── prisma/
│   └── schema.prisma          # Database schema (User, TokenLaunch, Auth)
├── public/                     # Static assets
├── src/
│   ├── app/
│   │   ├── globals.css         # Tailwind + fonts
│   │   ├── layout.tsx          # Root layout (Auth + Wallet providers)
│   │   ├── page.tsx            # Landing page ← PASTE YOUR CODE HERE
│   │   ├── dashboard/
│   │   │   └── page.tsx        # User dashboard (after login)
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts  # NextAuth handler
│   │       ├── wallet/route.ts              # Save wallet address
│   │       └── tokens/route.ts              # List user's tokens
│   ├── components/
│   │   ├── AuthProvider.tsx        # NextAuth session provider
│   │   ├── SolanaWalletProvider.tsx # Phantom/Solflare wallet
│   │   └── ConnectWalletButton.tsx  # Button that saves wallet to DB
│   └── lib/
│       ├── auth.ts             # Auth.js config (Twitter OAuth 2.0)
│       └── db.ts               # Prisma client singleton
├── .env.example                # All env vars you need
├── .gitignore
├── next.config.mjs
├── package.json
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## Tech Stack

- **Next.js 14** (App Router)
- **Auth.js v5** (Twitter OAuth 2.0)
- **Prisma** + PostgreSQL
- **Solana Wallet Adapter** (Phantom, Solflare)
- **Tailwind CSS**
- **TypeScript**
