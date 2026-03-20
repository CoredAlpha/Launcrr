import NextAuth from "next-auth";
import Twitter from "next-auth/providers/twitter";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./db";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID!,
      clientSecret: process.env.AUTH_TWITTER_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        const dbUser = await db.user.findUnique({
          where: { id: user.id },
          select: {
            twitterUsername: true,
            walletAddress: true,
            totalLaunches: true,
          },
        });
        if (dbUser) {
          (session.user as any).twitterUsername = dbUser.twitterUsername;
          (session.user as any).walletAddress = dbUser.walletAddress;
          (session.user as any).totalLaunches = dbUser.totalLaunches;
        }
      }
      return session;
    },
    async signIn({ user, account, profile }) {
      if (account?.provider === "twitter" && profile) {
        const p = profile as any;
        await db.user.update({
          where: { id: user.id! },
          data: {
            twitterId: p.data?.id ?? account.providerAccountId,
            twitterUsername: p.data?.username ?? p.screen_name,
          },
        });
      }
      return true;
    },
  },
  pages: { signIn: "/" },
});
