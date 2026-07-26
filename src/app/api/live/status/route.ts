import { NextResponse } from "next/server";
import { getLiveViewerStats } from "@/lib/live";

export const dynamic = "force-dynamic";

export async function GET() {
  const stats = await getLiveViewerStats();
  return NextResponse.json(stats, {
    headers: {
      // The status is essentially realtime but is cheap to recompute;
      // a short cache keeps the page from hammering the DB on every poll.
      "Cache-Control": "no-store",
    },
  });
}
