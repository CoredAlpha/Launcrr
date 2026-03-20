import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { walletAddress } = await req.json();
  if (!walletAddress || typeof walletAddress !== "string")
    return NextResponse.json({ error: "Invalid wallet" }, { status: 400 });

  const existing = await db.user.findUnique({ where: { walletAddress } });
  if (existing && existing.id !== session.user.id)
    return NextResponse.json({ error: "Wallet used by another account" }, { status: 409 });

  const user = await db.user.update({
    where: { id: session.user.id },
    data: { walletAddress, walletConnectedAt: new Date() },
  });

  return NextResponse.json({ success: true, walletAddress: user.walletAddress });
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await db.user.update({
    where: { id: session.user.id },
    data: { walletAddress: null, walletConnectedAt: null },
  });

  return NextResponse.json({ success: true });
}
