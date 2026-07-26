import { NextRequest, NextResponse } from "next/server";
import { recordViewerHeartbeat } from "@/lib/live";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  let body: { viewerId?: string } = {};
  try {
    body = await req.json();
  } catch {
    /* allow empty body */
  }
  const viewerId = String(body.viewerId ?? "").trim();
  if (!viewerId || viewerId.length > 128) {
    return NextResponse.json({ ok: false, error: "Invalid viewer id." }, { status: 400 });
  }

  const userAgent = req.headers.get("user-agent") ?? undefined;
  await recordViewerHeartbeat(viewerId, userAgent);

  // Best-effort: also bump the totalViews counter if this is the first
  // heartbeat we've seen from this viewer in the last hour.
  const recent = await prisma.liveStreamViewer.findUnique({ where: { id: viewerId } });
  if (recent && Date.now() - new Date(recent.lastSeen).getTime() > 60 * 60 * 1000) {
    await prisma.liveStream.update({
      where: { id: "singleton" },
      data: { totalViews: { increment: 1 } },
    });
  }

  return NextResponse.json({ ok: true });
}
